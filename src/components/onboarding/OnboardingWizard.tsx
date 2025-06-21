
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, CheckCircle, User, Heart, Activity, Brain, Utensils, Users } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { OnboardingStep, OnboardingData, OnboardingProgress } from '@/types/onboarding';
import PersonalInfoStep from './steps/PersonalInfoStep';
import GynecologyHealthStep from './steps/GynecologyHealthStep';
import BreastHealthStep from './steps/BreastHealthStep';
import CardiovascularHealthStep from './steps/CardiovascularHealthStep';
import EndocrineHealthStep from './steps/EndocrineHealthStep';
import NeuroHealthStep from './steps/NeuroHealthStep';
import LifestyleStep from './steps/LifestyleStep';
import FamilyHistoryStep from './steps/FamilyHistoryStep';

const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: "Персональная информация",
    description: "Расскажите нам о себе",
    component: PersonalInfoStep
  },
  {
    id: 2,
    title: "Гинекологическое здоровье",
    description: "Информация о женском здоровье",
    component: GynecologyHealthStep
  },
  {
    id: 3,
    title: "Здоровье молочных желез",
    description: "Скрининг и профилактика",
    component: BreastHealthStep
  },
  {
    id: 4,
    title: "Сердечно-сосудистая система",
    description: "Состояние сердца и сосудов",
    component: CardiovascularHealthStep
  },
  {
    id: 5,
    title: "Эндокринная система",
    description: "Гормоны и обмен веществ",
    component: EndocrineHealthStep
  },
  {
    id: 6,
    title: "Неврология и психическое здоровье",
    description: "Состояние нервной системы",
    component: NeuroHealthStep
  },
  {
    id: 7,
    title: "Образ жизни",
    description: "Привычки и окружающая среда",
    component: LifestyleStep
  },
  {
    id: 8,
    title: "Семейная история",
    description: "Наследственные факторы риска",
    component: FamilyHistoryStep
  }
];

const getStepIcon = (stepId: number) => {
  const iconProps = { className: "w-5 h-5" };
  switch (stepId) {
    case 1: return <User {...iconProps} />;
    case 2: return <Heart {...iconProps} />;
    case 3: return <Heart {...iconProps} />;
    case 4: return <Activity {...iconProps} />;
    case 5: return <Activity {...iconProps} />;
    case 6: return <Brain {...iconProps} />;
    case 7: return <Utensils {...iconProps} />;
    case 8: return <Users {...iconProps} />;
    default: return <User {...iconProps} />;
  }
};

const OnboardingWizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<Partial<OnboardingData>>({
    personalInfo: {
      firstName: '',
      lastName: '',
      dateOfBirth: null,
      height: null,
      weight: null,
      maritalStatus: '',
      phone: '',
      country: '',
      city: '',
      timezone: ''
    },
    gynecologyHealth: {
      menstrualCycleLength: null,
      menstrualCycleRegular: null,
      lastMenstrualPeriod: null,
      pregnanciesCount: 0,
      liveBirthsCount: 0,
      miscarriagesCount: 0,
      ageFirstPregnancy: null,
      breastfeedingDuration: 0,
      currentContraception: '',
      hormoneTherapy: false,
      hormoneTherapyType: ''
    },
    breastHealth: {
      breastSelfExamFrequency: '',
      lastMammography: null,
      lastUltrasound: null,
      breastDensity: '',
      breastSurgery: false,
      breastSurgeryType: ''
    },
    cardiovascularHealth: {
      systolicBP: null,
      diastolicBP: null,
      restingHeartRate: null,
      cholesterolTotal: null,
      cholesterolHDL: null,
      cholesterolLDL: null,
      hypertension: false,
      heartDisease: false,
      strokeHistory: false
    },
    endocrineHealth: {
      diabetesType: '',
      diabetesDiagnósedAge: null,
      lastHbA1c: null,
      thyroidDisease: false,
      thyroidDiseaseType: '',
      pcos: false,
      insulinResistance: false
    },
    neuroHealth: {
      depressionHistory: false,
      anxietyDisorder: false,
      sleepQuality: 5,
      sleepDuration: null,
      stressLevel: 5,
      memoryConcerns: false,
      headacheFrequency: ''
    },
    lifestyle: {
      smokingStatus: '',
      smokingPackYears: null,
      alcoholFrequency: '',
      alcoholDrinksPerWeek: 0,
      exerciseFrequency: '',
      exerciseIntensity: '',
      dietType: '',
      occupation: '',
      workStressLevel: 5,
      chemicalExposure: false,
      radiationExposure: false
    },
    familyHistory: []
  });

  const progress = Math.round((currentStep / onboardingSteps.length) * 100);
  const currentStepData = onboardingSteps.find(step => step.id === currentStep);
  const CurrentStepComponent = currentStepData?.component;

  const saveProgress = async () => {
    // В реальном приложении здесь будет API вызов
    localStorage.setItem('onboardingProgress', JSON.stringify({
      currentStep,
      completedSteps,
      formData
    }));
  };

  const loadProgress = () => {
    const saved = localStorage.getItem('onboardingProgress');
    if (saved) {
      const progress: OnboardingProgress = JSON.parse(saved);
      setCurrentStep(progress.currentStep);
      setCompletedSteps(progress.completedSteps);
      setFormData(progress.stepData);
    }
  };

  useEffect(() => {
    loadProgress();
  }, []);

  const handleNext = async () => {
    setIsLoading(true);
    
    // Сохраняем прогресс
    await saveProgress();
    
    // Добавляем текущий шаг в завершенные
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }

    if (currentStep < onboardingSteps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Завершение онбординга
      await handleComplete();
    }
    
    setIsLoading(false);
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    try {
      setIsLoading(true);
      
      // В реальном приложении здесь будет API вызов для сохранения всех данных
      console.log('Completing onboarding with data:', formData);
      
      // Очищаем сохраненный прогресс
      localStorage.removeItem('onboardingProgress');
      
      toast.success('Анкета успешно заполнена! Переходим к анализу рисков...');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error('Произошла ошибка при сохранении данных');
    } finally {
      setIsLoading(false);
    }
  };

  const updateStepData = (stepKey: keyof OnboardingData, data: any) => {
    setFormData(prev => ({
      ...prev,
      [stepKey]: { ...prev[stepKey], ...data }
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Персональная анкета здоровья
          </h1>
          <p className="text-lg text-gray-600">
            Шаг {currentStep} из {onboardingSteps.length} — {currentStepData?.description}
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <Progress value={progress} className="mb-4" />
          <div className="flex justify-between text-sm text-gray-600">
            <span>{currentStepData?.title}</span>
            <span>{progress}% завершено</span>
          </div>
        </div>

        {/* Steps navigation */}
        <div className="mb-8 hidden md:block">
          <div className="flex justify-between items-center">
            {onboardingSteps.map((step) => (
              <div
                key={step.id}
                className={`flex flex-col items-center space-y-2 ${
                  step.id === currentStep
                    ? 'text-purple-600'
                    : completedSteps.includes(step.id)
                    ? 'text-green-600'
                    : 'text-gray-400'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    step.id === currentStep
                      ? 'border-purple-600 bg-purple-50'
                      : completedSteps.includes(step.id)
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  {completedSteps.includes(step.id) ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    getStepIcon(step.id)
                  )}
                </div>
                <span className="text-xs text-center max-w-20 leading-tight">
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Main content */}
        <Card className="shadow-xl border-0 mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center space-x-3">
              {getStepIcon(currentStep)}
              <span>{currentStepData?.title}</span>
            </CardTitle>
            <CardDescription className="text-lg">
              {currentStepData?.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8">
            {CurrentStepComponent && (
              <CurrentStepComponent
                data={formData}
                onUpdate={updateStepData}
              />
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between mt-8 pt-8 border-t">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1 || isLoading}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Назад</span>
              </Button>

              <Button
                onClick={handleNext}
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex items-center space-x-2"
              >
                <span>
                  {currentStep === onboardingSteps.length ? 'Завершить анкету' : 'Далее'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingWizard;
