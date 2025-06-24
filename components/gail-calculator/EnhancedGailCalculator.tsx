/**
 * components/gail-calculator/EnhancedGailCalculator.tsx
 * 
 * Главный компонент Enhanced Gail Calculator
 * 💖 Заботливый дизайн для женщин
 * 🧮 Полный расчет рисков с многофакторным анализом
 * 🧬 Интеграция с генетическими данными
 * 🤖 ИИ-анализ и персональные рекомендации
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator,
  Heart,
  Shield,
  Dna,
  Activity,
  FileText,
  Users,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Info,
  ArrowLeft,
  ArrowRight,
  Download,
  Share2,
} from 'lucide-react';

// Импортируем наши хуки
import { useGailCalculator } from '../../hooks/useGailCalculator';
import { useGeneticData } from '../../hooks/useGeneticData';
import { useWearableSync } from '../../hooks/useWearableSync';
import { useNotifications } from '../../hooks/useNotifications';
import { useFormValidation } from '../../hooks/useFormValidation';

// Импортируем типы
import type {
  GailCalculatorInput,
  PersonalInfo,
  MedicalHistory,
  FamilyHistory,
  LifestyleFactors,
} from '../../types/gail-calculator';

// Подкомпоненты
import { PersonalInfoStep } from './steps/PersonalInfoStep';
import { MedicalHistoryStep } from './steps/MedicalHistoryStep';
import { FamilyHistoryStep } from './steps/FamilyHistoryStep';
import { LifestyleStep } from './steps/LifestyleStep';
import { ResultsStep } from './steps/ResultsStep';
import { ProgressIndicator } from './components/ProgressIndicator';
import { ValidationSummary } from './components/ValidationSummary';
import { RiskVisualization } from './components/RiskVisualization';

// ========================================
// Интерфейсы компонента
// ========================================

interface EnhancedGailCalculatorProps {
  userId?: string;
  onComplete?: (result: any) => void;
  onError?: (error: string) => void;
  className?: string;
  theme?: 'light' | 'dark' | 'auto';
  enableGeneticAnalysis?: boolean;
  enableEnvironmentalAnalysis?: boolean;
  showAdvancedOptions?: boolean;
}

interface FormStep {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ComponentType<any>;
  color: string;
  required: boolean;
}

// ========================================
// Основной компонент
// ========================================

export const EnhancedGailCalculator: React.FC<EnhancedGailCalculatorProps> = ({
  userId = 'default-user',
  onComplete,
  onError,
  className = '',
  theme = 'light',
  enableGeneticAnalysis = true,
  enableEnvironmentalAnalysis = true,
  showAdvancedOptions = false,
}) => {
  // ========================================
  // Состояние компонента
  // ========================================

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<GailCalculatorInput>>({
    personalInfo: {} as PersonalInfo,
    medicalHistory: {} as MedicalHistory,
    familyHistory: {} as FamilyHistory,
    lifestyle: {} as LifestyleFactors,
  });

  // ========================================
  // Хуки
  // ========================================

  const {
    calculateRisk,
    calculateEnhancedRisk,
    currentResult,
    enhancedResult,
    isCalculating,
    progress,
    validationErrors,
    hasValidationErrors,
    utils,
    clearResults,
    exportResults,
  } = useGailCalculator({
    autoSaveHistory: true,
    enableEnhancedAnalysis: enableGeneticAnalysis || enableEnvironmentalAnalysis,
    onProgress: (progress) => {
      console.log(`💖 ${progress.stage}: ${progress.current}/${progress.total}`);
    },
    onCalculationComplete: (result) => {
      showSuccessNotification(
        'Анализ завершен! ✨',
        'Ваши персональные результаты готовы'
      );
      onComplete?.(result);
    },
    onError: (error) => {
      showErrorNotification('Ошибка расчета', error);
      onError?.(error);
    },
  });

  const { uploadGeneticFile, geneticData, isUploading } = useGeneticData();
  const { connectedDevices, syncDevice } = useWearableSync(userId);
  
  const {
    showSuccessNotification,
    showErrorNotification,
    showHealthReminder,
  } = useNotifications();

  const {
    validateForm,
    getFieldStatus,
    hasErrors,
    clearErrors,
  } = useFormValidation({
    // Схема валидации будет определена для каждого шага
  });

  // ========================================
  // Конфигурация шагов
  // ========================================

  const steps: FormStep[] = [
    {
      id: 1,
      title: 'О вас',
      subtitle: 'Расскажите немного о себе',
      icon: Heart,
      color: 'from-pink-400 to-rose-400',
      required: true,
    },
    {
      id: 2,
      title: 'Медицинская история',
      subtitle: 'Ваша репродуктивная история',
      icon: FileText,
      color: 'from-purple-400 to-indigo-400',
      required: true,
    },
    {
      id: 3,
      title: 'Семейная история',
      subtitle: 'История онкологии в семье',
      icon: Users,
      color: 'from-blue-400 to-cyan-400',
      required: true,
    },
    {
      id: 4,
      title: 'Образ жизни',
      subtitle: 'Ваши привычки и активность',
      icon: Activity,
      color: 'from-green-400 to-emerald-400',
      required: false,
    },
    {
      id: 5,
      title: 'Результаты',
      subtitle: 'Ваш персональный анализ рисков',
      icon: TrendingUp,
      color: 'from-orange-400 to-red-400',
      required: false,
    },
  ];

  // ========================================
  // Обработчики событий
  // ========================================

  const updateFormData = useCallback((section: keyof GailCalculatorInput, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...data,
      },
    }));
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, steps.length]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const handleCalculate = useCallback(async () => {
    try {
      clearErrors();
      
      // Валидация формы
      const isValid = validateForm(formData);
      if (!isValid) {
        showErrorNotification(
          'Проверьте данные',
          'Пожалуйста, исправьте ошибки в форме'
        );
        return;
      }

      // Подготовка данных для расчета
      const calculationInput: GailCalculatorInput = {
        personalInfo: formData.personalInfo!,
        medicalHistory: formData.medicalHistory!,
        familyHistory: formData.familyHistory!,
        lifestyle: formData.lifestyle!,
        calculationDate: new Date(),
        userId,
      };

      let result;

      // Выбираем тип анализа
      if (enableGeneticAnalysis && geneticData) {
        // Расширенный анализ с генетическими данными
        result = await calculateEnhancedRisk(
          calculationInput,
          geneticData,
          // environmentalData можно добавить позже
        );
      } else {
        // Базовый расчет по модели Gail
        result = await calculateRisk(calculationInput);
      }

      if (result) {
        // Автоматически переходим к результатам
        setCurrentStep(5);
      }
    } catch (error) {
      console.error('Ошибка расчета:', error);
    }
  }, [
    formData,
    geneticData,
    userId,
    enableGeneticAnalysis,
    calculateRisk,
    calculateEnhancedRisk,
    validateForm,
    clearErrors,
    showErrorNotification,
  ]);

  const handleShare = useCallback(() => {
    if (currentResult || enhancedResult) {
      const shareData = {
        title: 'Результаты анализа рисков',
        text: `Мой 5-летний риск: ${utils.formatRiskPercentage(
          currentResult?.fiveYearRisk || enhancedResult?.combinedRisk.fiveYear || 0
        )}`,
        url: window.location.href,
      };

      if (navigator.share) {
        navigator.share(shareData);
      } else {
        // Fallback для браузеров без Web Share API
        navigator.clipboard.writeText(shareData.text);
        showSuccessNotification('Скопировано!', 'Результаты скопированы в буфер обмена');
      }
    }
  }, [currentResult, enhancedResult, utils, showSuccessNotification]);

  const handleExport = useCallback(() => {
    try {
      const exportData = exportResults('json');
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gail-calculator-results-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showSuccessNotification('Экспорт завершен!', 'Файл загружен на ваше устройство');
    } catch (error) {
      showErrorNotification('Ошибка экспорта', 'Не удалось экспортировать результаты');
    }
  }, [exportResults, showSuccessNotification, showErrorNotification]);

  // ========================================
  // Определение текущего шага
  // ========================================

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep
            data={formData.personalInfo || {}}
            onChange={(data) => updateFormData('personalInfo', data)}
            errors={validationErrors.filter(e => e.field.startsWith('personalInfo'))}
          />
        );
      case 2:
        return (
          <MedicalHistoryStep
            data={formData.medicalHistory || {}}
            onChange={(data) => updateFormData('medicalHistory', data)}
            errors={validationErrors.filter(e => e.field.startsWith('medicalHistory'))}
          />
        );
      case 3:
        return (
          <FamilyHistoryStep
            data={formData.familyHistory || {}}
            onChange={(data) => updateFormData('familyHistory', data)}
            errors={validationErrors.filter(e => e.field.startsWith('familyHistory'))}
          />
        );
      case 4:
        return (
          <LifestyleStep
            data={formData.lifestyle || {}}
            onChange={(data) => updateFormData('lifestyle', data)}
            errors={validationErrors.filter(e => e.field.startsWith('lifestyle'))}
            enableGeneticUpload={enableGeneticAnalysis}
            onGeneticUpload={uploadGeneticFile}
            geneticData={geneticData}
            isUploading={isUploading}
            connectedDevices={connectedDevices}
            onDeviceSync={syncDevice}
          />
        );
      case 5:
        return (
          <ResultsStep
            basicResult={currentResult}
            enhancedResult={enhancedResult}
            onShare={handleShare}
            onExport={handleExport}
            onRecalculate={() => setCurrentStep(1)}
            utils={utils}
          />
        );
      default:
        return null;
    }
  };

  // ========================================
  // Рендер компонента
  // ========================================

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* Заголовок */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mb-4">
          <Calculator className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🌸 Enhanced Gail Calculator
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Персонализированная оценка рисков развития рака молочной железы 
          с использованием современных методов анализа и заботливого подхода
        </p>
      </motion.div>

      {/* Прогресс-индикатор */}
      <ProgressIndicator
        steps={steps}
        currentStep={currentStep}
        onStepClick={setCurrentStep}
        isCalculating={isCalculating}
        progress={progress}
      />

      {/* Сводка ошибок валидации */}
      <AnimatePresence>
        {hasValidationErrors && (
          <ValidationSummary
            errors={validationErrors}
            onDismiss={clearErrors}
          />
        )}
      </AnimatePresence>

      {/* Основной контент */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-lg p-8 mb-8"
      >
        {/* Заголовок шага */}
        <div className="flex items-center space-x-4 mb-6">
          <div className={`p-3 rounded-xl bg-gradient-to-r ${steps[currentStep - 1]?.color}`}>
            {React.createElement(steps[currentStep - 1]?.icon, {
              className: "w-6 h-6 text-white"
            })}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {steps[currentStep - 1]?.title}
            </h2>
            <p className="text-gray-600 text-sm">
              {steps[currentStep - 1]?.subtitle}
            </p>
          </div>
        </div>

        {/* Контент шага */}
        <div className="min-h-[400px]">
          {renderCurrentStep()}
        </div>
      </motion.div>

      {/* Навигация */}
      <div className="flex justify-between items-center">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Назад</span>
        </button>

        <div className="flex items-center space-x-3">
          {currentStep === 4 && (
            <button
              onClick={handleCalculate}
              disabled={isCalculating || hasErrors}
              className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:from-pink-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              {isCalculating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  <span>Анализируем...</span>
                </>
              ) : (
                <>
                  <Calculator className="w-4 h-4" />
                  <span>Рассчитать риски</span>
                </>
              )}
            </button>
          )}

          {currentStep < 4 && (
            <button
              onClick={nextStep}
              disabled={currentStep === steps.length}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:from-pink-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <span>Далее</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {currentStep === 5 && (currentResult || enhancedResult) && (
            <div className="flex space-x-3">
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Поделиться</span>
              </button>
              
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Экспорт</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Дополнительная информация */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-4 bg-pink-50 rounded-xl border border-pink-200"
      >
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-pink-800">
            <p className="font-medium mb-1">💖 Важная информация</p>
            <p>
              Этот калькулятор предоставляет оценку рисков на основе научных данных, 
              но не заменяет консультацию с врачом. Результаты следует обсудить с 
              вашим лечащим врачом для принятия решений о профилактике и скрининге.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EnhancedGailCalculator;