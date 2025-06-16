
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Apple, 
  Target, 
  TrendingUp,
  Clock,
  User,
  Heart,
  Zap,
  Shield
} from "lucide-react";
import { useHealthData } from "@/hooks/useHealthData";
import { useSymptomMoodLog } from "@/hooks/useSymptomMoodLog";
import { useMenstrualCycle } from "@/hooks/useMenstrualCycle";

interface NutritionPlan {
  id: string;
  name: string;
  description: string;
  personalizedFor: string[];
  calories_per_day: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
    fiber: number;
  };
  specialFocus: string[];
  mealTiming: string[];
  restrictions: string[];
  benefits: string[];
  cycleAdaptation?: boolean;
  thumbnail: string;
  matchScore: number;
  aiRecommendations: string[];
}

interface UserNutritionProfile {
  age: number;
  activityLevel: string;
  healthGoals: string[];
  currentCyclePhase: string;
  recentSymptoms: string[];
  averageSteps: number;
  sleepQuality: number;
  stressLevel: number;
  bmi: number;
  metabolicHealth: string;
}

const PersonalizedNutritionPlans = () => {
  const [activeTab, setActiveTab] = useState<'recommended' | 'custom' | 'analytics'>('recommended');
  const [userProfile, setUserProfile] = useState<UserNutritionProfile | null>(null);
  const [personalizedPlans, setPersonalizedPlans] = useState<NutritionPlan[]>([]);
  
  const { healthData, getHealthMetrics } = useHealthData();
  const { logs } = useSymptomMoodLog();
  const { cycles } = useMenstrualCycle();

  // Анализ пользовательского профиля
  useEffect(() => {
    if (healthData.length > 0 && logs.length > 0) {
      const metrics = getHealthMetrics();
      const recentLogs = logs.slice(0, 7);
      
      // Определение текущей фазы цикла
      let currentPhase = 'unknown';
      if (cycles.length > 0) {
        const latestCycle = cycles[0];
        const cycleStart = new Date(latestCycle.cycle_start_date);
        const dayInCycle = Math.floor((Date.now() - cycleStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        
        if (dayInCycle <= 5) currentPhase = 'menstrual';
        else if (dayInCycle <= 13) currentPhase = 'follicular';
        else if (dayInCycle <= 16) currentPhase = 'ovulatory';
        else currentPhase = 'luteal';
      }

      const profile: UserNutritionProfile = {
        age: 30, // Получить из профиля пользователя
        activityLevel: metrics.steps > 8000 ? 'high' : metrics.steps > 5000 ? 'moderate' : 'low',
        healthGoals: ['hormone_balance', 'energy_boost', 'cycle_support'],
        currentCyclePhase: currentPhase,
        recentSymptoms: recentLogs.flatMap(log => log.symptoms || []),
        averageSteps: metrics.steps,
        sleepQuality: recentLogs.reduce((sum, log) => sum + (log.sleep_quality || 0), 0) / recentLogs.length,
        stressLevel: recentLogs.reduce((sum, log) => sum + (log.stress_level || 0), 0) / recentLogs.length,
        bmi: 22.5, // Рассчитать из данных профиля
        metabolicHealth: 'good'
      };

      setUserProfile(profile);
      generatePersonalizedPlans(profile);
    }
  }, [healthData, logs, cycles]);

  const generatePersonalizedPlans = (profile: UserNutritionProfile) => {
    const basePlans: Omit<NutritionPlan, 'matchScore' | 'aiRecommendations' | 'personalizedFor'>[] = [
      {
        id: '1',
        name: 'Гормональный баланс+',
        description: 'Специально разработанный план для поддержания женского гормонального здоровья',
        calories_per_day: 1800 + (profile.activityLevel === 'high' ? 300 : profile.activityLevel === 'moderate' ? 150 : 0),
        macros: { protein: 25, carbs: 45, fats: 30, fiber: 35 },
        specialFocus: ['Омега-3', 'Фитоэстрогены', 'Антиоксиданты', 'Магний'],
        mealTiming: ['7:00', '10:00', '13:00', '16:00', '19:00'],
        restrictions: ['Минимум сахара', 'Органические продукты'],
        benefits: ['Стабилизация цикла', 'Улучшение настроения', 'Энергия'],
        cycleAdaptation: true,
        thumbnail: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
      },
      {
        id: '2',
        name: 'Энергия и восстановление',
        description: 'Питание для активных женщин с фокусом на восстановление и энергию',
        calories_per_day: 2000 + (profile.activityLevel === 'high' ? 400 : 200),
        macros: { protein: 30, carbs: 40, fats: 30, fiber: 30 },
        specialFocus: ['Белок', 'Комплексные углеводы', 'Железо', 'Витамин B12'],
        mealTiming: ['6:30', '9:30', '12:30', '15:30', '18:30', '21:00'],
        restrictions: ['Высокий белок', 'Быстрые углеводы после тренировок'],
        benefits: ['Быстрое восстановление', 'Стабильная энергия', 'Мышечная поддержка'],
        cycleAdaptation: false,
        thumbnail: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
      },
      {
        id: '3',
        name: 'Антистресс и сон',
        description: 'Питание для снижения стресса и улучшения качества сна',
        calories_per_day: 1700 + (profile.activityLevel === 'high' ? 250 : 100),
        macros: { protein: 20, carbs: 50, fats: 30, fiber: 40 },
        specialFocus: ['Магний', 'Триптофан', 'Мелатонин', 'Витамин D'],
        mealTiming: ['7:30', '11:00', '14:00', '17:00', '20:00'],
        restrictions: ['Без кофеина после 14:00', 'Низкий ГИ'],
        benefits: ['Лучший сон', 'Снижение стресса', 'Спокойствие'],
        cycleAdaptation: true,
        thumbnail: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
      }
    ];

    // Генерация персонализированных планов с оценкой соответствия
    const plans = basePlans.map(plan => {
      let matchScore = 50;
      const personalizedFor: string[] = [];
      const aiRecommendations: string[] = [];

      // Анализ активности
      if (profile.activityLevel === 'high' && plan.name.includes('Энергия')) {
        matchScore += 25;
        personalizedFor.push('Высокая активность');
        aiRecommendations.push('Увеличены калории для поддержания энергии');
      }

      // Анализ стресса
      if (profile.stressLevel > 6 && plan.name.includes('Антистресс')) {
        matchScore += 30;
        personalizedFor.push('Повышенный стресс');
        aiRecommendations.push('Добавлены адаптогены и магний');
      }

      // Анализ симптомов
      if (profile.recentSymptoms.includes('головная боль') && plan.name.includes('Гормональный')) {
        matchScore += 20;
        personalizedFor.push('Гормональные симптомы');
        aiRecommendations.push('Фокус на витамины группы B');
      }

      // Анализ фазы цикла
      if (profile.currentCyclePhase === 'luteal' && plan.cycleAdaptation) {
        matchScore += 15;
        personalizedFor.push('Лютеиновая фаза');
        aiRecommendations.push('Адаптация под текущую фазу цикла');
      }

      // Анализ сна
      if (profile.sleepQuality < 6 && plan.name.includes('сон')) {
        matchScore += 25;
        personalizedFor.push('Проблемы со сном');
        aiRecommendations.push('Продукты, способствующие засыпанию');
      }

      return {
        ...plan,
        matchScore: Math.min(matchScore, 98),
        personalizedFor,
        aiRecommendations
      };
    }).sort((a, b) => b.matchScore - a.matchScore);

    setPersonalizedPlans(plans);
  };

  const PlanCard = ({ plan }: { plan: NutritionPlan }) => (
    <Card className="relative overflow-hidden">
      <div className="absolute top-4 right-4 z-10">
        <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          {plan.matchScore}% совпадение
        </Badge>
      </div>
      
      <CardHeader className="pb-3">
        <div className="relative">
          <img 
            src={plan.thumbnail} 
            alt={plan.name}
            className="w-full h-32 object-cover rounded-lg mb-3"
          />
        </div>
        
        <CardTitle className="flex items-center space-x-2">
          <Apple className="w-5 h-5 text-green-600" />
          <span>{plan.name}</span>
        </CardTitle>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Персонализация */}
        {plan.personalizedFor.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2 flex items-center">
              <User className="w-4 h-4 mr-1" />
              Персонализировано для:
            </p>
            <div className="flex flex-wrap gap-1">
              {plan.personalizedFor.map((item, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Макронутриенты */}
        <div>
          <p className="text-sm font-medium mb-2">Макронутриенты:</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span>Белки:</span>
              <span className="font-medium">{plan.macros.protein}%</span>
            </div>
            <div className="flex justify-between">
              <span>Углеводы:</span>
              <span className="font-medium">{plan.macros.carbs}%</span>
            </div>
            <div className="flex justify-between">
              <span>Жиры:</span>
              <span className="font-medium">{plan.macros.fats}%</span>
            </div>
            <div className="flex justify-between">
              <span>Клетчатка:</span>
              <span className="font-medium">{plan.macros.fiber}г</span>
            </div>
          </div>
        </div>

        {/* ИИ рекомендации */}
        {plan.aiRecommendations.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2 flex items-center text-purple-600">
              <Zap className="w-4 h-4 mr-1" />
              ИИ-рекомендации:
            </p>
            <ul className="text-xs space-y-1">
              {plan.aiRecommendations.map((rec, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-purple-500 mr-1">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Особый фокус */}
        <div>
          <p className="text-sm font-medium mb-2">Особый фокус:</p>
          <div className="flex flex-wrap gap-1">
            {plan.specialFocus.map((focus, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {focus}
              </Badge>
            ))}
          </div>
        </div>

        {/* Преимущества */}
        <div>
          <p className="text-sm font-medium mb-2">Преимущества:</p>
          <div className="flex flex-wrap gap-1">
            {plan.benefits.map((benefit, index) => (
              <Badge key={index} className="text-xs bg-green-100 text-green-800">
                {benefit}
              </Badge>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <Button className="w-full">
            <Target className="w-4 h-4 mr-2" />
            Выбрать план ({plan.calories_per_day} ккал/день)
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const ProfileAnalytics = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Анализ вашего профиля</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {userProfile && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Уровень активности:</span>
                    <Badge variant={userProfile.activityLevel === 'high' ? 'default' : 'secondary'}>
                      {userProfile.activityLevel === 'high' ? 'Высокий' : 
                       userProfile.activityLevel === 'moderate' ? 'Средний' : 'Низкий'}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Средние шаги:</span>
                    <span className="font-medium">{userProfile.averageSteps.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Фаза цикла:</span>
                    <Badge variant="outline">{userProfile.currentCyclePhase}</Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Качество сна:</span>
                      <span>{userProfile.sleepQuality.toFixed(1)}/10</span>
                    </div>
                    <Progress value={userProfile.sleepQuality * 10} className="h-2" />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Уровень стресса:</span>
                      <span>{userProfile.stressLevel.toFixed(1)}/10</span>
                    </div>
                    <Progress value={userProfile.stressLevel * 10} className="h-2" />
                  </div>
                </div>
              </div>

              {userProfile.recentSymptoms.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Недавние симптомы:</p>
                  <div className="flex flex-wrap gap-1">
                    {[...new Set(userProfile.recentSymptoms)].map((symptom, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {symptom}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Apple className="w-6 h-6 text-green-600" />
            <span>Персонализированные планы питания</span>
          </CardTitle>
          <CardDescription>
            ИИ-планы, адаптированные под ваши здоровье, цикл и образ жизни
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="recommended">
                <Heart className="w-4 h-4 mr-2" />
                Рекомендованные
              </TabsTrigger>
              <TabsTrigger value="custom">
                <Target className="w-4 h-4 mr-2" />
                Кастомизация
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <TrendingUp className="w-4 h-4 mr-2" />
                Аналитика
              </TabsTrigger>
            </TabsList>

            <TabsContent value="recommended" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {personalizedPlans.map(plan => (
                  <PlanCard key={plan.id} plan={plan} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="custom" className="mt-6">
              <div className="text-center p-8">
                <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Кастомизация планов</h3>
                <p className="text-gray-600">
                  Настройте параметры питания под свои индивидуальные потребности
                </p>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              <ProfileAnalytics />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalizedNutritionPlans;
