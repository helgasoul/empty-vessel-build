
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dumbbell, 
  Heart, 
  Zap, 
  Target,
  Calendar,
  TrendingUp,
  Activity,
  Moon,
  Thermometer
} from "lucide-react";
import { useHealthData } from "@/hooks/useHealthData";
import { useSymptomMoodLog } from "@/hooks/useSymptomMoodLog";
import { useMenstrualCycle } from "@/hooks/useMenstrualCycle";

interface FitnessProgram {
  id: string;
  name: string;
  description: string;
  personalizedFor: string[];
  duration_weeks: number;
  intensity: 'low' | 'moderate' | 'high' | 'variable';
  workouts_per_week: number;
  focus_areas: string[];
  equipment_needed: string[];
  cycle_adapted: boolean;
  energy_requirement: number; // 1-10 scale
  recovery_focus: number; // 1-10 scale
  stress_relief: number; // 1-10 scale
  instructor: string;
  thumbnail: string;
  matchScore: number;
  aiAdaptations: string[];
  weeklySchedule: {
    [key: string]: {
      type: string;
      intensity: string;
      duration: number;
      focus: string[];
    };
  };
}

interface UserFitnessProfile {
  currentCycleDay: number;
  cyclePhase: string;
  averageSteps: number;
  averageHeartRate: number;
  sleepQuality: number;
  energyLevel: number;
  stressLevel: number;
  recentSymptoms: string[];
  fitnessGoals: string[];
  availableTime: number; // minutes per day
  experienceLevel: string;
  preferredIntensity: string;
  equipmentAvailable: string[];
}

const EnhancedFitnessPrograms = () => {
  const [activeTab, setActiveTab] = useState<'personalized' | 'cycle' | 'analytics'>('personalized');
  const [userProfile, setUserProfile] = useState<UserFitnessProfile | null>(null);
  const [programs, setPrograms] = useState<FitnessProgram[]>([]);
  
  const { healthData, getHealthMetrics } = useHealthData();
  const { logs } = useSymptomMoodLog();
  const { cycles } = useMenstrualCycle();

  // Анализ пользовательского профиля для фитнеса
  useEffect(() => {
    if (healthData.length > 0 && logs.length > 0) {
      const metrics = getHealthMetrics();
      const recentLogs = logs.slice(0, 7);
      
      // Определение фазы цикла и дня
      let currentCycleDay = 0;
      let cyclePhase = 'unknown';
      
      if (cycles.length > 0) {
        const latestCycle = cycles[0];
        const cycleStart = new Date(latestCycle.cycle_start_date);
        currentCycleDay = Math.floor((Date.now() - cycleStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        
        if (currentCycleDay <= 5) cyclePhase = 'menstrual';
        else if (currentCycleDay <= 13) cyclePhase = 'follicular';
        else if (currentCycleDay <= 16) cyclePhase = 'ovulatory';
        else cyclePhase = 'luteal';
      }

      const profile: UserFitnessProfile = {
        currentCycleDay,
        cyclePhase,
        averageSteps: metrics.steps,
        averageHeartRate: metrics.avgHeartRate,
        sleepQuality: recentLogs.reduce((sum, log) => sum + (log.sleep_quality || 0), 0) / recentLogs.length,
        energyLevel: recentLogs.reduce((sum, log) => sum + (log.energy_level || 0), 0) / recentLogs.length,
        stressLevel: recentLogs.reduce((sum, log) => sum + (log.stress_level || 0), 0) / recentLogs.length,
        recentSymptoms: recentLogs.flatMap(log => log.symptoms || []),
        fitnessGoals: ['strength', 'flexibility', 'hormonal_balance'],
        availableTime: 45, // можно получить из настроек пользователя
        experienceLevel: 'intermediate',
        preferredIntensity: 'moderate',
        equipmentAvailable: ['resistance_bands', 'yoga_mat', 'dumbbells']
      };

      setUserProfile(profile);
      generatePersonalizedPrograms(profile);
    }
  }, [healthData, logs, cycles]);

  const generatePersonalizedPrograms = (profile: UserFitnessProfile) => {
    const basePrograms: Omit<FitnessProgram, 'matchScore' | 'aiAdaptations' | 'personalizedFor'>[] = [
      {
        id: '1',
        name: 'Циклический фитнес',
        description: 'Тренировки, адаптированные под фазы менструального цикла',
        duration_weeks: 4,
        intensity: 'variable',
        workouts_per_week: 5,
        focus_areas: ['Гормональный баланс', 'Адаптивность', 'Восстановление'],
        equipment_needed: ['yoga_mat', 'resistance_bands'],
        cycle_adapted: true,
        energy_requirement: 6,
        recovery_focus: 8,
        stress_relief: 9,
        instructor: 'Анна Циклова',
        thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        weeklySchedule: {
          'Пн': { type: 'yoga', intensity: 'low', duration: 30, focus: ['flexibility', 'breathing'] },
          'Вт': { type: 'strength', intensity: 'moderate', duration: 40, focus: ['core', 'legs'] },
          'Ср': { type: 'cardio', intensity: 'low', duration: 25, focus: ['recovery', 'circulation'] },
          'Чт': { type: 'pilates', intensity: 'moderate', duration: 35, focus: ['core', 'posture'] },
          'Пт': { type: 'mobility', intensity: 'low', duration: 20, focus: ['flexibility', 'relaxation'] }
        }
      },
      {
        id: '2',
        name: 'Энергия и сила',
        description: 'Силовые тренировки для увеличения энергии и мышечной массы',
        duration_weeks: 8,
        intensity: 'high',
        workouts_per_week: 4,
        focus_areas: ['Сила', 'Выносливость', 'Метаболизм'],
        equipment_needed: ['dumbbells', 'resistance_bands'],
        cycle_adapted: false,
        energy_requirement: 8,
        recovery_focus: 6,
        stress_relief: 5,
        instructor: 'Мария Силина',
        thumbnail: 'https://images.unsplash.com/photo-1571388208497-71bedc76b3de?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        weeklySchedule: {
          'Пн': { type: 'strength_upper', intensity: 'high', duration: 45, focus: ['arms', 'shoulders'] },
          'Ср': { type: 'strength_lower', intensity: 'high', duration: 45, focus: ['legs', 'glutes'] },
          'Пт': { type: 'full_body', intensity: 'moderate', duration: 40, focus: ['functional'] },
          'Вс': { type: 'recovery', intensity: 'low', duration: 30, focus: ['stretching'] }
        }
      },
      {
        id: '3',
        name: 'Стресс-релиф',
        description: 'Программа для снижения стресса и улучшения ментального здоровья',
        duration_weeks: 6,
        intensity: 'low',
        workouts_per_week: 6,
        focus_areas: ['Стресс-менеджмент', 'Медитация', 'Гибкость'],
        equipment_needed: ['yoga_mat'],
        cycle_adapted: true,
        energy_requirement: 3,
        recovery_focus: 10,
        stress_relief: 10,
        instructor: 'Ольга Дзен',
        thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        weeklySchedule: {
          'Пн': { type: 'meditation', intensity: 'low', duration: 20, focus: ['mindfulness'] },
          'Вт': { type: 'gentle_yoga', intensity: 'low', duration: 30, focus: ['flexibility'] },
          'Ср': { type: 'breathing', intensity: 'low', duration: 15, focus: ['relaxation'] },
          'Чт': { type: 'restorative_yoga', intensity: 'low', duration: 40, focus: ['recovery'] },
          'Пт': { type: 'tai_chi', intensity: 'low', duration: 25, focus: ['balance'] },
          'Сб': { type: 'nature_walk', intensity: 'low', duration: 30, focus: ['outdoor'] }
        }
      },
      {
        id: '4',
        name: 'HIIT для женщин',
        description: 'Высокоинтенсивные интервальные тренировки с учетом женской физиологии',
        duration_weeks: 6,
        intensity: 'high',
        workouts_per_week: 3,
        focus_areas: ['Жиросжигание', 'Кардио', 'Взрывная сила'],
        equipment_needed: ['resistance_bands'],
        cycle_adapted: true,
        energy_requirement: 9,
        recovery_focus: 5,
        stress_relief: 3,
        instructor: 'Елена Огонь',
        thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        weeklySchedule: {
          'Пн': { type: 'hiit_cardio', intensity: 'high', duration: 25, focus: ['cardio', 'fat_burn'] },
          'Ср': { type: 'hiit_strength', intensity: 'high', duration: 30, focus: ['strength', 'power'] },
          'Пт': { type: 'hiit_full_body', intensity: 'high', duration: 20, focus: ['endurance'] }
        }
      }
    ];

    // Генерация персонализированных программ с оценкой
    const personalizedPrograms = basePrograms.map(program => {
      let matchScore = 40;
      const personalizedFor: string[] = [];
      const aiAdaptations: string[] = [];

      // Анализ фазы цикла
      if (program.cycle_adapted) {
        matchScore += 15;
        personalizedFor.push('Адаптация под цикл');
        
        if (profile.cyclePhase === 'menstrual' && program.intensity === 'low') {
          matchScore += 20;
          aiAdaptations.push('Интенсивность снижена для менструальной фазы');
        } else if (profile.cyclePhase === 'follicular' && program.intensity === 'high') {
          matchScore += 15;
          aiAdaptations.push('Увеличена интенсивность для фолликулярной фазы');
        }
      }

      // Анализ уровня энергии
      if (profile.energyLevel < 5 && program.energy_requirement <= 5) {
        matchScore += 20;
        personalizedFor.push('Низкая энергия');
        aiAdaptations.push('Программа адаптирована под низкий уровень энергии');
      } else if (profile.energyLevel > 7 && program.energy_requirement > 6) {
        matchScore += 15;
        personalizedFor.push('Высокая энергия');
        aiAdaptations.push('Интенсивность повышена благодаря высокому уровню энергии');
      }

      // Анализ стресса
      if (profile.stressLevel > 6 && program.stress_relief > 7) {
        matchScore += 25;
        personalizedFor.push('Снижение стресса');
        aiAdaptations.push('Фокус на техники снижения стресса');
      }

      // Анализ качества сна
      if (profile.sleepQuality < 6 && program.recovery_focus > 7) {
        matchScore += 20;
        personalizedFor.push('Восстановление сна');
        aiAdaptations.push('Добавлены упражнения для улучшения сна');
      }

      // Анализ симптомов
      if (profile.recentSymptoms.includes('боль в спине') && program.focus_areas.includes('Гибкость')) {
        matchScore += 15;
        personalizedFor.push('Проблемы со спиной');
        aiAdaptations.push('Специальные упражнения для спины');
      }

      // Анализ активности
      if (profile.averageSteps < 5000 && program.intensity === 'low') {
        matchScore += 10;
        personalizedFor.push('Низкая активность');
        aiAdaptations.push('Постепенное увеличение нагрузки');
      }

      // Анализ доступного оборудования
      const hasRequiredEquipment = program.equipment_needed.every(eq => 
        profile.equipmentAvailable.includes(eq)
      );
      if (hasRequiredEquipment) {
        matchScore += 10;
        personalizedFor.push('Доступное оборудование');
      } else {
        matchScore -= 15;
        aiAdaptations.push('Адаптация под доступное оборудование');
      }

      return {
        ...program,
        matchScore: Math.min(matchScore, 95),
        personalizedFor,
        aiAdaptations
      };
    }).sort((a, b) => b.matchScore - a.matchScore);

    setPrograms(personalizedPrograms);
  };

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      case 'variable': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const ProgramCard = ({ program }: { program: FitnessProgram }) => (
    <Card className="relative overflow-hidden">
      <div className="absolute top-4 right-4 z-10">
        <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          {program.matchScore}% подходит
        </Badge>
      </div>
      
      <CardHeader className="pb-3">
        <div className="relative">
          <img 
            src={program.thumbnail} 
            alt={program.name}
            className="w-full h-32 object-cover rounded-lg mb-3"
          />
          <Badge className={`absolute bottom-2 left-2 ${getIntensityColor(program.intensity)}`}>
            {program.intensity === 'low' ? 'Низкая' :
             program.intensity === 'moderate' ? 'Средняя' :
             program.intensity === 'high' ? 'Высокая' : 'Переменная'}
          </Badge>
        </div>
        
        <CardTitle className="flex items-center space-x-2">
          <Dumbbell className="w-5 h-5 text-blue-600" />
          <span>{program.name}</span>
        </CardTitle>
        <CardDescription>{program.description}</CardDescription>
        <p className="text-sm text-gray-600">с {program.instructor}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Персонализация */}
        {program.personalizedFor.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2 flex items-center">
              <Target className="w-4 h-4 mr-1" />
              Персонализировано:
            </p>
            <div className="flex flex-wrap gap-1">
              {program.personalizedFor.map((item, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Параметры программы */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="font-medium">{program.duration_weeks}</div>
            <div className="text-gray-600">недель</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="font-medium">{program.workouts_per_week}</div>
            <div className="text-gray-600">раз/нед</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="font-medium">{program.energy_requirement}/10</div>
            <div className="text-gray-600">энергия</div>
          </div>
        </div>

        {/* Шкалы эффективности */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center">
              <Heart className="w-3 h-3 mr-1" />
              Восстановление
            </span>
            <div className="flex-1 mx-2">
              <Progress value={program.recovery_focus * 10} className="h-1" />
            </div>
            <span>{program.recovery_focus}/10</span>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center">
              <Moon className="w-3 h-3 mr-1" />
              Антистресс
            </span>
            <div className="flex-1 mx-2">
              <Progress value={program.stress_relief * 10} className="h-1" />
            </div>
            <span>{program.stress_relief}/10</span>
          </div>
        </div>

        {/* ИИ адаптации */}
        {program.aiAdaptations.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2 flex items-center text-purple-600">
              <Zap className="w-4 h-4 mr-1" />
              ИИ-адаптации:
            </p>
            <ul className="text-xs space-y-1">
              {program.aiAdaptations.map((adaptation, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-purple-500 mr-1">•</span>
                  <span>{adaptation}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Фокус областей */}
        <div>
          <p className="text-sm font-medium mb-2">Фокус:</p>
          <div className="flex flex-wrap gap-1">
            {program.focus_areas.map((area, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {area}
              </Badge>
            ))}
          </div>
        </div>

        {program.cycle_adapted && (
          <Badge className="w-full justify-center bg-pink-100 text-pink-800">
            <Activity className="w-3 h-3 mr-1" />
            Адаптировано под менструальный цикл
          </Badge>
        )}

        <Button className="w-full">
          <Calendar className="w-4 h-4 mr-2" />
          Начать программу
        </Button>
      </CardContent>
    </Card>
  );

  const CycleAdaptedView = () => (
    <div className="space-y-6">
      {userProfile && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-pink-600" />
              <span>Тренировки под ваш цикл</span>
            </CardTitle>
            <CardDescription>
              День {userProfile.currentCycleDay} • {userProfile.cyclePhase} фаза
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
                <h4 className="font-medium mb-2">Рекомендации на сегодня:</h4>
                {userProfile.cyclePhase === 'menstrual' && (
                  <div className="text-sm">
                    <p>• Мягкие растяжки и йога</p>
                    <p>• Избегайте высоких нагрузок</p>
                    <p>• Фокус на дыхательных практиках</p>
                  </div>
                )}
                {userProfile.cyclePhase === 'follicular' && (
                  <div className="text-sm">
                    <p>• Время для новых тренировок</p>
                    <p>• Высокая энергия для силовых</p>
                    <p>• Отличный период для HIIT</p>
                  </div>
                )}
                {userProfile.cyclePhase === 'ovulatory' && (
                  <div className="text-sm">
                    <p>• Пиковые возможности</p>
                    <p>• Максимальная интенсивность</p>
                    <p>• Групповые тренировки</p>
                  </div>
                )}
                {userProfile.cyclePhase === 'luteal' && (
                  <div className="text-sm">
                    <p>• Умеренные нагрузки</p>
                    <p>• Больше внимания восстановлению</p>
                    <p>• Пилатес и стабилизация</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {programs
                  .filter(p => p.cycle_adapted)
                  .slice(0, 2)
                  .map(program => (
                    <ProgramCard key={program.id} program={program} />
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const AnalyticsView = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Фитнес-аналитика</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {userProfile && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Текущие показатели</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Средние шаги/день:</span>
                    <span className="font-medium">{userProfile.averageSteps.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Средний пульс:</span>
                    <span className="font-medium">{userProfile.averageHeartRate} уд/мин</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Уровень энергии:</span>
                      <span>{userProfile.energyLevel}/10</span>
                    </div>
                    <Progress value={userProfile.energyLevel * 10} className="h-2" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Качество сна:</span>
                      <span>{userProfile.sleepQuality.toFixed(1)}/10</span>
                    </div>
                    <Progress value={userProfile.sleepQuality * 10} className="h-2" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Рекомендации</h4>
                <div className="space-y-2">
                  {userProfile.stressLevel > 6 && (
                    <div className="p-3 bg-blue-50 rounded-lg text-sm">
                      <strong>Стресс-менеджмент:</strong> Высокий уровень стресса. Рекомендуем йогу и медитацию.
                    </div>
                  )}
                  {userProfile.energyLevel < 5 && (
                    <div className="p-3 bg-yellow-50 rounded-lg text-sm">
                      <strong>Низкая энергия:</strong> Начните с легких тренировок и постепенно увеличивайте нагрузку.
                    </div>
                  )}
                  {userProfile.averageSteps < 5000 && (
                    <div className="p-3 bg-green-50 rounded-lg text-sm">
                      <strong>Активность:</strong> Увеличьте ежедневную ходьбу до 8000 шагов.
                    </div>
                  )}
                </div>
              </div>
            </div>
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
            <Dumbbell className="w-6 h-6 text-blue-600" />
            <span>Умные фитнес-программы</span>
          </CardTitle>
          <CardDescription>
            Персонализированные тренировки с учетом вашего цикла, энергии и здоровья
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personalized">
                <Target className="w-4 h-4 mr-2" />
                Персональные
              </TabsTrigger>
              <TabsTrigger value="cycle">
                <Activity className="w-4 h-4 mr-2" />
                По циклу
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <TrendingUp className="w-4 h-4 mr-2" />
                Аналитика
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personalized" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {programs.map(program => (
                  <ProgramCard key={program.id} program={program} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="cycle" className="mt-6">
              <CycleAdaptedView />
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              <AnalyticsView />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedFitnessPrograms;
