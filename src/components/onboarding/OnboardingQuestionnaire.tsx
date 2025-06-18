
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, Heart, Brain, Activity } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

interface OnboardingData {
  // Демографические данные
  age: string;
  weight: string;
  height: string;
  
  // Основные триггеры
  primaryConcern: string;
  lifeStage: string;
  healthAnxiety: string;
  familyHistory: string[];
  
  // Образ жизни
  physicalActivity: string;
  sleepHours: string;
  stressLevel: string;
  nutrition: string;
  
  // Медицинская история
  currentConditions: string[];
  medications: string;
  lastCheckup: string;
  
  // Цели и мотивация
  healthGoals: string[];
  motivationLevel: string;
  preferredCommunication: string;
}

const OnboardingQuestionnaire = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>({
    age: '',
    weight: '',
    height: '',
    primaryConcern: '',
    lifeStage: '',
    healthAnxiety: '',
    familyHistory: [],
    physicalActivity: '',
    sleepHours: '',
    stressLevel: '',
    nutrition: '',
    currentConditions: [],
    medications: '',
    lastCheckup: '',
    healthGoals: [],
    motivationLevel: '',
    preferredCommunication: ''
  });

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Здесь будет логика сохранения данных
    toast.success('Анкета успешно заполнена! Переходим к анализу рисков...');
    navigate('/dashboard');
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateArrayField = (field: string, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...(prev[field as keyof OnboardingData] as string[]), value]
        : (prev[field as keyof OnboardingData] as string[]).filter(item => item !== value)
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Heart className="w-12 h-12 mx-auto mb-4 text-pink-600" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Расскажите о себе</h2>
              <p className="text-gray-600">Основная информация для персонализации рекомендаций</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="age">Возраст</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="30"
                  value={formData.age}
                  onChange={(e) => updateFormData('age', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weight">Вес (кг)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="65"
                  value={formData.weight}
                  onChange={(e) => updateFormData('weight', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="height">Рост (см)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="165"
                  value={formData.height}
                  onChange={(e) => updateFormData('height', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Этап жизни</Label>
                <RadioGroup value={formData.lifeStage} onValueChange={(value) => updateFormData('lifeStage', value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="reproductive" id="reproductive" />
                    <Label htmlFor="reproductive">Репродуктивный возраст</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pregnancy_planning" id="pregnancy_planning" />
                    <Label htmlFor="pregnancy_planning">Планирование беременности</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="menopause" id="menopause" />
                    <Label htmlFor="menopause">Менопауза/Предменопауза</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="postmenopause" id="postmenopause" />
                    <Label htmlFor="postmenopause">Постменопауза</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Brain className="w-12 h-12 mx-auto mb-4 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Что вас беспокоит?</h2>
              <p className="text-gray-600">Выберите основные причины обращения к превентивной медицине</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Основная причина беспокойства</Label>
                <RadioGroup value={formData.primaryConcern} onValueChange={(value) => updateFormData('primaryConcern', value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="family_history" id="family_history" />
                    <Label htmlFor="family_history">Семейная история заболеваний</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="age_transition" id="age_transition" />
                    <Label htmlFor="age_transition">Возрастные изменения</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="lifestyle_concerns" id="lifestyle_concerns" />
                    <Label htmlFor="lifestyle_concerns">Образ жизни и привычки</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="general_prevention" id="general_prevention" />
                    <Label htmlFor="general_prevention">Общая профилактика</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Уровень тревожности по поводу здоровья</Label>
                <RadioGroup value={formData.healthAnxiety} onValueChange={(value) => updateFormData('healthAnxiety', value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="low" />
                    <Label htmlFor="low">Низкий - просто хочу быть здоровой</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="moderate" id="moderate" />
                    <Label htmlFor="moderate">Умеренный - иногда переживаю</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="high" />
                    <Label htmlFor="high">Высокий - часто думаю о болезнях</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Семейная история заболеваний (выберите все подходящие)</Label>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    'Онкологические заболевания',
                    'Сердечно-сосудистые заболевания',
                    'Диабет',
                    'Болезнь Альцгеймера/деменция',
                    'Остеопороз',
                    'Аутоиммунные заболевания'
                  ].map((condition) => (
                    <div key={condition} className="flex items-center space-x-2">
                      <Checkbox
                        id={condition}
                        checked={formData.familyHistory.includes(condition)}
                        onCheckedChange={(checked) => updateArrayField('familyHistory', condition, checked as boolean)}
                      />
                      <Label htmlFor={condition} className="text-sm">{condition}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Activity className="w-12 h-12 mx-auto mb-4 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Образ жизни</h2>
              <p className="text-gray-600">Расскажите о ваших привычках и режиме</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Физическая активность</Label>
                <RadioGroup value={formData.physicalActivity} onValueChange={(value) => updateFormData('physicalActivity', value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sedentary" id="sedentary" />
                    <Label htmlFor="sedentary">Малоподвижный образ жизни</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="light" />
                    <Label htmlFor="light">Легкая активность 1-2 раза в неделю</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="moderate" id="moderate" />
                    <Label htmlFor="moderate">Умеренная активность 3-4 раза в неделю</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="high" />
                    <Label htmlFor="high">Интенсивная активность 5+ раз в неделю</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Сон (часов в сутки)</Label>
                <RadioGroup value={formData.sleepHours} onValueChange={(value) => updateFormData('sleepHours', value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="less_6" id="less_6" />
                    <Label htmlFor="less_6">Менее 6 часов</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="6_7" id="6_7" />
                    <Label htmlFor="6_7">6-7 часов</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="7_8" id="7_8" />
                    <Label htmlFor="7_8">7-8 часов</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="more_8" id="more_8" />
                    <Label htmlFor="more_8">Более 8 часов</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Уровень стресса</Label>
                <RadioGroup value={formData.stressLevel} onValueChange={(value) => updateFormData('stressLevel', value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="stress_low" />
                    <Label htmlFor="stress_low">Низкий</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="moderate" id="stress_moderate" />
                    <Label htmlFor="stress_moderate">Умеренный</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="stress_high" />
                    <Label htmlFor="stress_high">Высокий</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Питание</Label>
                <RadioGroup value={formData.nutrition} onValueChange={(value) => updateFormData('nutrition', value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="poor" id="poor" />
                    <Label htmlFor="poor">Нерегулярное, много обработанной пищи</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="average" id="average" />
                    <Label htmlFor="average">Стараюсь питаться здорово</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="good" id="good" />
                    <Label htmlFor="good">Сбалансированное, много овощей и фруктов</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Медицинская история</h2>
              <p className="text-gray-600">Информация о текущем состоянии здоровья</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Текущие заболевания (выберите все подходящие)</Label>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    'Гипертония',
                    'Диабет',
                    'Щитовидная железа',
                    'СПКЯ',
                    'Эндометриоз',
                    'Мигрень',
                    'Депрессия/тревожность',
                    'Нет хронических заболеваний'
                  ].map((condition) => (
                    <div key={condition} className="flex items-center space-x-2">
                      <Checkbox
                        id={condition}
                        checked={formData.currentConditions.includes(condition)}
                        onCheckedChange={(checked) => updateArrayField('currentConditions', condition, checked as boolean)}
                      />
                      <Label htmlFor={condition} className="text-sm">{condition}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="medications">Принимаемые лекарства</Label>
                <Textarea
                  id="medications"
                  placeholder="Опишите лекарства, которые вы принимаете постоянно..."
                  value={formData.medications}
                  onChange={(e) => updateFormData('medications', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Когда был последний комплексный чекап?</Label>
                <RadioGroup value={formData.lastCheckup} onValueChange={(value) => updateFormData('lastCheckup', value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="less_6_months" id="less_6_months" />
                    <Label htmlFor="less_6_months">Менее 6 месяцев назад</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="6_12_months" id="6_12_months" />
                    <Label htmlFor="6_12_months">6-12 месяцев назад</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1_2_years" id="1_2_years" />
                    <Label htmlFor="1_2_years">1-2 года назад</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="more_2_years" id="more_2_years" />
                    <Label htmlFor="more_2_years">Более 2 лет назад</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="never" id="never" />
                    <Label htmlFor="never">Никогда не проходила</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Ваши цели</h2>
              <p className="text-gray-600">Что вы хотите получить от платформы PREVENT?</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Цели в отношении здоровья (выберите все подходящие)</Label>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    'Снизить риски заболеваний',
                    'Улучшить общее самочувствие',
                    'Подготовиться к беременности',
                    'Справиться с менопаузой',
                    'Похудеть и поддержать вес',
                    'Улучшить сон',
                    'Снизить стресс',
                    'Контролировать хронические заболевания'
                  ].map((goal) => (
                    <div key={goal} className="flex items-center space-x-2">
                      <Checkbox
                        id={goal}
                        checked={formData.healthGoals.includes(goal)}
                        onCheckedChange={(checked) => updateArrayField('healthGoals', goal, checked as boolean)}
                      />
                      <Label htmlFor={goal} className="text-sm">{goal}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Насколько вы мотивированы изменить образ жизни?</Label>
                <RadioGroup value={formData.motivationLevel} onValueChange={(value) => updateFormData('motivationLevel', value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="motivation_low" />
                    <Label htmlFor="motivation_low">Низкая - хочу только знать риски</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="moderate" id="motivation_moderate" />
                    <Label htmlFor="motivation_moderate">Умеренная - готова к небольшим изменениям</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="motivation_high" />
                    <Label htmlFor="motivation_high">Высокая - готова кардинально измениться</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Как вы предпочитаете получать рекомендации?</Label>
                <RadioGroup value={formData.preferredCommunication} onValueChange={(value) => updateFormData('preferredCommunication', value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="app_notifications" id="app_notifications" />
                    <Label htmlFor="app_notifications">Уведомления в приложении</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="email" id="email" />
                    <Label htmlFor="email">Email-рассылки</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sms" id="sms" />
                    <Label htmlFor="sms">SMS-напоминания</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="minimal" id="minimal" />
                    <Label htmlFor="minimal">Минимум уведомлений</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
              Персональная анкета здоровья
            </CardTitle>
            <CardDescription className="text-lg">
              Шаг {currentStep} из {totalSteps} — это поможет нам создать ваш индивидуальный профиль рисков
            </CardDescription>
            <Progress value={progress} className="mt-4" />
          </CardHeader>

          <CardContent className="p-8">
            {renderStep()}

            <div className="flex justify-between mt-8 pt-8 border-t">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Назад</span>
              </Button>

              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex items-center space-x-2"
              >
                <span>{currentStep === totalSteps ? 'Завершить анкету' : 'Далее'}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingQuestionnaire;
