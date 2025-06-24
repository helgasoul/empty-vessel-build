
import { useState, useCallback, useEffect } from 'react';
import type { GailCalculatorResult, EnhancedRiskAssessment } from '../../types/gail-calculator';

type CalculationHistoryItem = GailCalculatorResult | EnhancedRiskAssessment;

export const useCalculationHistory = (autoSave: boolean) => {
  const [calculationHistory, setCalculationHistory] = useState<CalculationHistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const loadHistory = useCallback(async () => {
    setIsLoadingHistory(true);
    try {
      const savedHistory = localStorage.getItem('gail-calculator-history');
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        setCalculationHistory(parsed);
      }
    } catch (error) {
      console.error('Error loading calculation history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  const addToHistory = useCallback((result: CalculationHistoryItem) => {
    setCalculationHistory(prev => {
      const updated = [result, ...prev].slice(0, 50); // Keep last 50 calculations
      
      if (autoSave) {
        try {
          localStorage.setItem('gail-calculator-history', JSON.stringify(updated));
        } catch (error) {
          console.error('Error saving calculation history:', error);
        }
      }
      
      return updated;
    });
  }, [autoSave]);

  const clearHistory = useCallback(() => {
    setCalculationHistory([]);
    if (autoSave) {
      localStorage.removeItem('gail-calculator-history');
    }
  }, [autoSave]);

  useEffect(() => {
    if (autoSave) {
      loadHistory();
    }
  }, [autoSave, loadHistory]);

  return {
    calculationHistory,
    addToHistory,
    clearHistory,
    loadHistory,
    isLoadingHistory,
  };
};
