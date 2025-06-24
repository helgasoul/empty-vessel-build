
import { useState, useCallback, useRef } from 'react';
import { enhancedGailService } from '../services/enhanced-gail-calculator.service';
import { useCalculationProgress } from './internal/useCalculationProgress';
import { useCalculationCache } from './internal/useCalculationCache';
import { useCalculationHistory } from './internal/useCalculationHistory';
import { useCalculationValidation } from './internal/useCalculationValidation';
import type {
  GailCalculatorInput,
  GailCalculatorResult,
  EnhancedRiskAssessment,
  GeneticRiskFactors,
  EnvironmentalFactors,
  ApiResponse,
} from '../types/gail-calculator';

interface UseGailCalculatorOptions {
  autoSaveHistory?: boolean;
  enableCache?: boolean;
  enableEnhancedAnalysis?: boolean;
  onProgress?: (progress: { current: number; total: number; message?: string }) => void;
  onCalculationComplete?: (result: GailCalculatorResult) => void;
  onEnhancedComplete?: (result: EnhancedRiskAssessment) => void;
  onError?: (error: string) => void;
}

interface UseGailCalculatorReturn {
  // Core calculation methods
  calculateRisk: (input: GailCalculatorInput) => Promise<GailCalculatorResult | null>;
  calculateEnhancedRisk: (
    input: GailCalculatorInput,
    geneticData?: GeneticRiskFactors,
    environmentalData?: EnvironmentalFactors
  ) => Promise<EnhancedRiskAssessment | null>;
  
  // State
  currentResult: GailCalculatorResult | null;
  enhancedResult: EnhancedRiskAssessment | null;
  isCalculating: boolean;
  error: string | null;
  progress: { current: number; total: number; message?: string } | null;
  validationErrors: Array<{ field: string; message: string }>;
  
  // History and cache
  calculationHistory: Array<GailCalculatorResult | EnhancedRiskAssessment>;
  clearHistory: () => void;
  clearCache: () => void;
  
  // Utilities
  utils: {
    formatRiskPercentage: (risk: number) => string;
    getRiskLevelText: (level: string) => string;
    getRiskLevelColor: (level: string) => string;
    exportResults: (format: 'pdf' | 'json' | 'csv') => Promise<void>;
  };
}

export const useGailCalculator = (options: UseGailCalculatorOptions = {}): UseGailCalculatorReturn => {
  const {
    autoSaveHistory = true,
    enableCache = true,
    enableEnhancedAnalysis = true,
    onProgress,
    onCalculationComplete,
    onEnhancedComplete,
    onError,
  } = options;

  // State management
  const [currentResult, setCurrentResult] = useState<GailCalculatorResult | null>(null);
  const [enhancedResult, setEnhancedResult] = useState<EnhancedRiskAssessment | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Internal hooks
  const { isCalculating, progress, setProgress, startCalculation, finishCalculation } = useCalculationProgress(onProgress);
  const { getCachedResult, setCachedResult, clearCache } = useCalculationCache(enableCache);
  const { calculationHistory, addToHistory, clearHistory } = useCalculationHistory(autoSaveHistory);
  const { validateInput, validationErrors, clearValidationErrors } = useCalculationValidation();

  // Refs for cleanup
  const abortControllerRef = useRef<AbortController | null>(null);

  // Main calculation method
  const calculateRisk = useCallback(async (input: GailCalculatorInput): Promise<GailCalculatorResult | null> => {
    try {
      setError(null);
      clearValidationErrors();

      // Validate input
      const isValid = await validateInput(input);
      if (!isValid) {
        onError?.('Пожалуйста, исправьте ошибки в форме');
        return null;
      }

      // Check cache first
      const cachedResult = getCachedResult(input);
      if (cachedResult) {
        setCurrentResult(cachedResult);
        onCalculationComplete?.(cachedResult);
        return cachedResult;
      }

      // Start calculation
      startCalculation();
      setProgress(1, 3, 'Валидация данных...');

      // Create abort controller for cancellation
      abortControllerRef.current = new AbortController();

      setProgress(2, 3, 'Расчет рисков...');

      // Call service
      const response: ApiResponse<GailCalculatorResult> = await enhancedGailService.calculateRisk(input);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Не удалось рассчитать риски');
      }

      setProgress(3, 3, 'Завершение...');

      const result = response.data;

      // Cache and save result
      setCachedResult(input, result);
      setCurrentResult(result);
      
      if (autoSaveHistory) {
        addToHistory(result);
      }

      onCalculationComplete?.(result);
      return result;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла неизвестная ошибка';
      setError(errorMessage);
      onError?.(errorMessage);
      return null;
    } finally {
      finishCalculation();
      abortControllerRef.current = null;
    }
  }, [
    validateInput,
    clearValidationErrors,
    getCachedResult,
    setCachedResult,
    startCalculation,
    setProgress,
    finishCalculation,
    autoSaveHistory,
    addToHistory,
    onCalculationComplete,
    onError,
  ]);

  // Enhanced calculation method
  const calculateEnhancedRisk = useCallback(async (
    input: GailCalculatorInput,
    geneticData?: GeneticRiskFactors,
    environmentalData?: EnvironmentalFactors
  ): Promise<EnhancedRiskAssessment | null> => {
    if (!enableEnhancedAnalysis) {
      throw new Error('Расширенный анализ отключен');
    }

    try {
      setError(null);
      clearValidationErrors();

      // Validate input
      const isValid = await validateInput(input);
      if (!isValid) {
        onError?.('Пожалуйста, исправьте ошибки в форме');
        return null;
      }

      startCalculation();
      setProgress(1, 5, 'Валидация данных...');

      // Create abort controller
      abortControllerRef.current = new AbortController();

      setProgress(2, 5, 'Базовый расчет рисков...');
      setProgress(3, 5, 'Анализ генетических данных...');
      setProgress(4, 5, 'Анализ экологических факторов...');

      // Call enhanced service
      const response: ApiResponse<EnhancedRiskAssessment> = await enhancedGailService.calculateEnhancedRisk(
        input,
        geneticData,
        environmentalData
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Не удалось выполнить расширенный анализ');
      }

      setProgress(5, 5, 'Завершение...');

      const result = response.data;
      setEnhancedResult(result);
      
      if (autoSaveHistory) {
        addToHistory(result);
      }

      onEnhancedComplete?.(result);
      return result;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла неизвестная ошибка';
      setError(errorMessage);
      onError?.(errorMessage);
      return null;
    } finally {
      finishCalculation();
      abortControllerRef.current = null;
    }
  }, [
    enableEnhancedAnalysis,
    validateInput,
    clearValidationErrors,
    startCalculation,
    setProgress,
    finishCalculation,
    autoSaveHistory,
    addToHistory,
    onEnhancedComplete,
    onError,
  ]);

  // Utility functions
  const utils = {
    formatRiskPercentage: (risk: number): string => {
      return `${(risk * 100).toFixed(1)}%`;
    },

    getRiskLevelText: (level: string): string => {
      const levelTexts = {
        low: 'Низкий риск',
        average: 'Средний риск',
        high: 'Высокий риск',
        very_high: 'Очень высокий риск',
      };
      return levelTexts[level as keyof typeof levelTexts] || 'Неизвестный уровень';
    },

    getRiskLevelColor: (level: string): string => {
      const levelColors = {
        low: '#27AE60',
        average: '#FFB347',
        high: '#E74C3C',
        very_high: '#8B0000',
      };
      return levelColors[level as keyof typeof levelColors] || '#6B7280';
    },

    exportResults: async (format: 'pdf' | 'json' | 'csv'): Promise<void> => {
      const results = currentResult || enhancedResult;
      if (!results) {
        throw new Error('Нет результатов для экспорта');
      }

      // Implementation would depend on your export service
      console.log(`Экспорт в формате ${format}:`, results);
    },
  };

  return {
    // Core methods
    calculateRisk,
    calculateEnhancedRisk,
    
    // State
    currentResult,
    enhancedResult,
    isCalculating,
    error,
    progress,
    validationErrors,
    
    // History and cache
    calculationHistory,
    clearHistory,
    clearCache,
    
    // Utilities
    utils,
  };
};
