/**
 * components/gail-calculator/GailCalculator.tsx
 * 
 * Основной компонент калькулятора Gail
 * 🩺 Многошаговый процесс оценки риска рака молочной железы
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  User, 
  Heart, 
  Users, 
  FileText,
  Loader2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

// Импорты компонентов шагов
import PersonalInfoStep from './steps/PersonalInfoStep';
import MedicalHistoryStep from './steps/MedicalHistoryStep';
import FamilyHistoryStep from './steps/FamilyHistoryStep';
import GailResultsDisplay from './results/GailResultsDisplay';

// Импорт хука и типов
import { 
  useGailCalculator,
  type PersonalInfo,
  type MedicalHistory,
  type FamilyHistory,
  type GailCalculatorInput,
  type GailCalculatorResult,
  type ValidationError,
  type CalculationProgress
} from '../../hooks/useGailCalculator';

// ========================================
// Типы и интерфейсы
// ========================================

type Step = 'personal' | 'medical' | 'family' | 'results';

interface StepConfig {
  key: Step;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
}

interface GailCalculatorData {
  personalInfo: Partial<PersonalInfo>;
  medicalHistory: Partial<MedicalHistory>;
  familyHistory: Partial<FamilyHistory>;
}

interface GailCalculatorProps {
  onComplete?: (result: GailCalculatorResult) => void;
  onScheduleConsultation?: () => void;
  onDownloadReport?: (result: GailCalculatorResult) => void;
  onShareResults?: (result: GailCalculatorResult) => void;
}

// ========================================
// Конфигурация шагов
// ========================================

const stepConfigs: StepConfig[] = [
  {
    key: 'personal',
    title: 'Персональная информация',
    description: 'Базовые данные о вас',
    icon: User,
    color: 'blue'
  },
  {
    key: 'medical',
    title: 'Медицинская история',
    description: 'Репродуктивное здоровье и процедуры',
    icon: Heart,
    color: 'purple'
  },
  {
    key: 'family',
    title: 'Семейная история',
    description: 'Онкологические заболевания в семье',
    icon: Users,
    color: 'pink'
  },
  {
    key: 'results',
    title: 'Результаты',
    description: 'Персональная оценка риска',
    icon: FileText,
    color: 'green'
  }
];

// ========================================
// Компоненты UI
// ========================================

interface StepIndicatorProps {
  steps: StepConfig[];
  currentStep: Step;
  completedSteps: Set<Step>;
  onStepClick: (step: Step) => void;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
  completedSteps,
  onStepClick
}) => {
  const getCurrentStepIndex = () => steps.findIndex(step => step.key === currentStep);
  
  return (
    <div className="flex items-center justify-between w-full max-w-3xl mx-auto mb-8">
      {steps.map((step, index) => {
        const isActive = step.key === currentStep;
        const isCompleted = completedSteps.has(step.key);
        const isClickable = index <= getCurrentStepIndex() || isCompleted;
        const IconComponent = step.icon;
        
        return (
          <React.Fragment key={step.key}>
            <motion.button
              onClick={() => isClickable && onStepClick(step.key)}
              disabled={!isClickable}
              className={`
                relative flex flex-col items-center p-4 rounded-xl transition-all duration-300
                ${isClickable ? 'cursor-pointer hover:shadow-lg' : 'cursor-not-allowed opacity-50'}
                ${isActive ? 'bg-blue-100 border-2 border-blue-400 shadow-lg' : 
                   isCompleted ? 'bg-green-50 border-2 border-green-400' : 
                   'bg-gray-50 border-2 border-gray-200'}
              `}
              whileHover={isClickable ? { scale: 1.05 } : {}}
              whileTap={isClickable ? { scale: 0.95 } : {}}
            >
              {/* Номер шага */}
              <div 
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center mb-2 font-bold text-lg
                  ${isActive ? 'bg-blue-500 text-white' :
                    isCompleted ? 'bg-green-500 text-white' :
                    'bg-gray-300 text-gray-600'}
                `}
              >
                {isCompleted ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <IconComponent className="w-6 h-6" />
                )}
              </div>
              
              {/* Название шага */}
              <div className="text-center">
                <h3 className={`
                  text-sm font-medium mb-1
                  ${isActive ? 'text-blue-700' :
                    isCompleted ? 'text-green-700' :
                    'text-gray-600'}
                `}>
                  {step.title}
                </h3>
                <p className={`
                  text-xs
                  ${isActive ? 'text-blue-600' :
                    isCompleted ? 'text-green-600' :
                    'text-gray-500'}
                `}>
                  {step.description}
                </p>
              </div>
            </motion.button>
            
            {/* Соединительная линия */}
            {index < steps.length - 1 && (
              <div 
                className={`
                  flex-1 h-1 mx-4 rounded-full transition-colors duration-300
                  ${completedSteps.has(step.key) ? 'bg-green-400' : 'bg-gray-200'}
                `} 
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

interface ProgressBarProps {
  progress: CalculationProgress | null;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  if (!progress) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg border-b"
    >
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center space-x-3 mb-2">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          <span className="text-sm font-medium text-gray-700">
            {progress.message}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div 
            className="bg-blue-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress.percentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

interface ErrorDisplayProps {
  errors: ValidationError[];
  onClear: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ errors, onClear }) => {
  if (errors.length === 0) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6"
    >
      <div className="flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-medium text-red-800 mb-2">
            Пожалуйста, исправьте следующие ошибки:
          </h4>
          <ul className="space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="text-sm text-red-700">
                • {error.message}
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={onClear}
          className="text-red-600 hover:text-red-800 transition-colors"
        >
          ✕
        </button>
      </div>
    </motion.div>
  );
};

// ========================================
// Основной компонент
// ========================================

export const GailCalculator: React.FC<GailCalculatorProps> = ({
  onComplete,
  onScheduleConsultation,
  onDownloadReport,
  onShareResults
}) => {
  // Состояние
  const [currentStep, setCurrentStep] = useState<Step>('personal');
  const [completedSteps, setCompletedSteps] = useState<Set<Step>>(new Set());
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [calculationResult, setCalculationResult] = useState<GailCalculatorResult | null>(null);
  
  // Данные форм
  const [data, setData] = useState<GailCalculatorData>({
    personalInfo: {},
    medicalHistory: {},
    familyHistory: {}
  });

  // Хук калькулятора
  const { 
    calculate, 
    validateInput, 
    isCalculating, 
    progress, 
    formatRisk, 
    getRiskLevel 
  } = useGailCalculator();

  // ========================================
  // Обработчики данных
  // ========================================

  const updatePersonalInfo = useCallback((personalInfo: Partial<PersonalInfo>) => {
    setData(prev => ({ ...prev, personalInfo }));
    setValidationErrors([]);
  }, []);

  const updateMedicalHistory = useCallback((medicalHistory: Partial<MedicalHistory>) => {
    setData(prev => ({ ...prev, medicalHistory }));
    setValidationErrors([]);
  }, []);

  const updateFamilyHistory = useCallback((familyHistory: Partial<FamilyHistory>) => {
    setData(prev => ({ ...prev, familyHistory }));
    setValidationErrors([]);
  }, []);

  // ========================================
  // Навигация по шагам
  // ========================================

  const validateCurrentStep = useCallback(() => {
    const stepData = {
      personal: data.personalInfo,
      medical: data.medicalHistory,
      family: data.familyHistory
    };

    const currentStepData = stepData[currentStep as keyof typeof stepData];
    if (!currentStepData) return true;

    const fullInput = {
      personalInfo: data.personalInfo as PersonalInfo,
      medicalHistory: data.medicalHistory as MedicalHistory,
      familyHistory: data.familyHistory as FamilyHistory
    };

    const errors = validateInput(fullInput);
    const currentStepErrors = errors.filter(error => 
      error.field.startsWith(currentStep === 'personal' ? 'personalInfo' : 
                           currentStep === 'medical' ? 'medicalHistory' : 'familyHistory')
    );

    setValidationErrors(currentStepErrors);
    return currentStepErrors.length === 0;
  }, [currentStep, data, validateInput]);

  const goToStep = useCallback((step: Step) => {
    if (step === 'results') {
      // Перед переходом к результатам, выполняем расчет
      handleCalculateRisk();
      return;
    }
    
    setCurrentStep(step);
    setValidationErrors([]);
  }, []);

  const goToNextStep = useCallback(() => {
    if (!validateCurrentStep()) return;

    // Отмечаем текущий шаг как завершенный
    setCompletedSteps(prev => new Set(prev).add(currentStep));

    const currentIndex = stepConfigs.findIndex(step => step.key === currentStep);
    if (currentIndex < stepConfigs.length - 1) {
      const nextStep = stepConfigs[currentIndex + 1].key;
      if (nextStep === 'results') {
        handleCalculateRisk();
      } else {
        setCurrentStep(nextStep);
      }
    }
  }, [currentStep, validateCurrentStep]);

  const goToPreviousStep = useCallback(() => {
    const currentIndex = stepConfigs.findIndex(step => step.key === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepConfigs[currentIndex - 1].key);
      setValidationErrors([]);
    }
  }, [currentStep]);

  // ========================================
  // Расчет риска
  // ========================================

  const handleCalculateRisk = useCallback(async () => {
    const fullInput: GailCalculatorInput = {
      personalInfo: data.personalInfo as PersonalInfo,
      medicalHistory: data.medicalHistory as MedicalHistory,
      familyHistory: data.familyHistory as FamilyHistory
    };

    const errors = validateInput(fullInput);
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      const result = await calculate(fullInput);
      setCalculationResult(result);
      setCurrentStep('results');
      setCompletedSteps(prev => new Set(prev).add('family'));
      
      if (onComplete) {
        onComplete(result);
      }
    } catch (error) {
      console.error('Ошибка расчета:', error);
      setValidationErrors([{
        field: 'calculation',
        message: 'Произошла ошибка при расчете риска. Пожалуйста, проверьте введенные данные и попробуйте снова.'
      }]);
    }
  }, [data, calculate, validateInput, onComplete]);

  // ========================================
  // Рендер шагов
  // ========================================

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'personal':
        return (
          <PersonalInfoStep
            data={data.personalInfo}
            onChange={updatePersonalInfo}
            errors={validationErrors}
          />
        );
      case 'medical':
        return (
          <MedicalHistoryStep
            data={data.medicalHistory}
            onChange={updateMedicalHistory}
            errors={validationErrors}
          />
        );
      case 'family':
        return (
          <FamilyHistoryStep
            data={data.familyHistory}
            onChange={updateFamilyHistory}
            errors={validationErrors}
          />
        );
      case 'results':
        return calculationResult ? (
          <GailResultsDisplay
            result={calculationResult}
            onScheduleConsultation={onScheduleConsultation}
            onDownloadReport={() => onDownloadReport?.(calculationResult)}
            onShareResults={() => onShareResults?.(calculationResult)}
          />
        ) : null;
      default:
        return null;
    }
  };

  const getCurrentStepConfig = () => stepConfigs.find(step => step.key === currentStep);
  const currentStepConfig = getCurrentStepConfig();
  const isFirstStep = currentStep === 'personal';
  const isLastStep = currentStep === 'results';

  // ========================================
  // Рендер
  // ========================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Прогресс загрузки */}
      <AnimatePresence>
        {progress && <ProgressBar progress={progress} />}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-8">
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            💖 Калькулятор риска Gail
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Персональная оценка риска развития рака молочной железы на основе 
            научно обоснованной модели Gail
          </p>
        </motion.div>

        {/* Индикатор шагов */}
        {currentStep !== 'results' && (
          <StepIndicator
            steps={stepConfigs}
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepClick={goToStep}
          />
        )}

        {/* Ошибки валидации */}
        <ErrorDisplay
          errors={validationErrors}
          onClear={() => setValidationErrors([])}
        />

        {/* Заголовок текущего шага */}
        {currentStepConfig && currentStep !== 'results' && (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              {currentStepConfig.title}
            </h2>
            <p className="text-gray-600">
              {currentStepConfig.description}
            </p>
          </motion.div>
        )}

        {/* Контент шага */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          {renderCurrentStep()}
        </motion.div>

        {/* Навигация */}
        {currentStep !== 'results' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center max-w-4xl mx-auto mt-8"
          >
            <button
              onClick={goToPreviousStep}
              disabled={isFirstStep}
              className={`
                flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all
                ${isFirstStep 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:shadow-lg hover:border-gray-400'
                }
              `}
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Назад</span>
            </button>

            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">
                Шаг {stepConfigs.findIndex(s => s.key === currentStep) + 1} из {stepConfigs.length}
              </span>
            </div>

            <button
              onClick={currentStep === 'family' ? handleCalculateRisk : goToNextStep}
              disabled={isCalculating}
              className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCalculating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Расчет...</span>
                </>
              ) : currentStep === 'family' ? (
                <>
                  <span>Рассчитать риск</span>
                  <FileText className="w-5 h-5" />
                </>
              ) : (
                <>
                  <span>Далее</span>
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default GailCalculator;