
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle, User, Heart, Activity, Brain, Utensils, Users } from "lucide-react";
import { HealthQuestionnaireData } from '../../types/health';
import PersonalInfoStep from './steps/PersonalInfoStep';
import GynecologicalStep from './steps/GynecologicalStep';
import BreastHealthStep from './steps/BreastHealthStep';
import CardiovascularStep from './steps/CardiovascularStep';
import EndocrineStep from './steps/EndocrineStep';
import NeurologyStep from './steps/NeurologyStep';
import LifestyleStep from './steps/LifestyleStep';
import FamilyHistoryStep from './steps/FamilyHistoryStep';

const STEPS = [
  {
    id: 'personal',
    title: 'Персональные данные',
    description: 'Основная информация о вас',
    icon: User,
    component: PersonalInfoStep
  },
  {
    id: 'gynecological',
    title: 'Гинекологическое здоровье',
    description: 'Менструальный цикл и репродуктивное здоровье',
    icon: Heart,
    component: GynecologicalStep
  },
  {
    id: 'breast',
    title: 'Молочные железы',
    description: 'Скрининг и семейная история',
    icon: Heart,
    component: BreastHealthStep
  },
  {
    id: 'cardiovascular',
    title: 'Сердечно-сосудистая система',
    description: 'Давление, холестерин, физическая активность',
    icon: Activity,
    component: CardiovascularStep
  },
  {
    id: 'endocrine',
    title: 'Эндокринная система',
    description: 'Диабет, щитовидная железа, гормоны',
    icon: Activity,
    component: EndocrineStep
  },
  {
    id: 'neurology',
    title: 'Неврология и психология',
    description: 'Сон, настроение, когнитивные функции',
    icon: Brain,
    component: NeurologyStep
  },
  {
    id: 'lifestyle',
    title: 'Образ жизни',
    description: 'Питание, вредные привычки, физическая активность',
    icon: Utensils,
    component: LifestyleStep
  },
  {
    id: 'family',
    title: 'Семейный анамнез',
    description: 'Заболевания у родственников',
    icon: Users,
    component: FamilyHistoryStep
  }
];

const HealthQuestionnaire: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<HealthQuestionnaireData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const currentStepData = STEPS[currentStep];
  const StepComponent = currentStepData.component;
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const handleStepComplete = (stepData: any) => {
    const stepKey = currentStepData.id;
    setFormData(prev => ({
      ...prev,
      [stepKey]: stepData
    }));
    setCompletedSteps(prev => new Set([...prev, currentStep]));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const completedQuestionnaire: HealthQuestionnaireData = {
        ...formData as HealthQuestionnaireData,
        completedAt: new Date(),
        userId: 'current-user-id' // Replace with actual user ID
      };
      
      console.log('Questionnaire completed:', completedQuestionnaire);
      
      // Redirect to dashboard or risk assessment
      window.location.href = '/patient/dashboard';
    } catch (error) {
      console.error('Error submitting questionnaire:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCurrentStepCompleted = completedSteps.has(currentStep);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Анкета здоровья PREVENT
          </h1>
          <p className="text-gray-600">
            Помогите нам создать персонализированный профиль вашего здоровья
          </p>
        </div>

        {/* Progress */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Шаг {currentStep + 1} из {STEPS.length}</span>
                <span>{Math.round(progress)}% завершено</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex justify-center">
                <div className="flex space-x-2">
                  {STEPS.map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full ${
                        index < currentStep 
                          ? 'bg-green-500' 
                          : index === currentStep 
                          ? 'bg-purple-500' 
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Step */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <currentStepData.icon className="w-6 h-6 text-purple-600" />
              <span>{currentStepData.title}</span>
              {isCurrentStepCompleted && (
                <CheckCircle className="w-5 h-5 text-green-600" />
              )}
            </CardTitle>
            <CardDescription>
              {currentStepData.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StepComponent
              data={formData[currentStepData.id as keyof HealthQuestionnaireData]}
              onComplete={handleStepComplete}
            />
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Назад</span>
          </Button>

          <Button
            onClick={handleNext}
            disabled={isSubmitting}
            className="flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                <span>Сохранение...</span>
              </>
            ) : currentStep === STEPS.length - 1 ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Завершить</span>
              </>
            ) : (
              <>
                <span>Далее</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HealthQuestionnaire;
