
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Calendar, Droplets, Heart, Zap, Plus } from 'lucide-react';
import { useMenstrualCycle } from '@/hooks/useMenstrualCycle';
import { format, differenceInDays, addDays } from 'date-fns';
import { ru } from 'date-fns/locale';

const CurrentCycleDashboard = () => {
  const { cycles, loading } = useMenstrualCycle();
  
  // Получаем текущий цикл (последний начатый)
  const currentCycle = cycles.find(cycle => !cycle.cycle_end_date) || cycles[0];
  
  if (loading) {
    return <div className="text-center p-8">Загрузка данных...</div>;
  }

  // Расчет фазы цикла и прогнозов
  const getCyclePhase = () => {
    if (!currentCycle) return { phase: 'Нет данных', day: 0, progress: 0 };
    
    const startDate = new Date(currentCycle.cycle_start_date);
    const today = new Date();
    const dayOfCycle = differenceInDays(today, startDate) + 1;
    const cycleLength = currentCycle.cycle_length || 28;
    const progress = Math.min((dayOfCycle / cycleLength) * 100, 100);
    
    let phase = '';
    if (dayOfCycle <= (currentCycle.period_length || 5)) {
      phase = 'Менструация';
    } else if (dayOfCycle <= 13) {
      phase = 'Фолликулярная фаза';
    } else if (dayOfCycle <= 15) {
      phase = 'Овуляция';
    } else {
      phase = 'Лютеиновая фаза';
    }
    
    return { phase, day: dayOfCycle, progress };
  };

  const { phase, day, progress } = getCyclePhase();

  const getNextPredictions = () => {
    if (!currentCycle) return { nextPeriod: null, nextOvulation: null };
    
    const startDate = new Date(currentCycle.cycle_start_date);
    const cycleLength = currentCycle.cycle_length || 28;
    const nextPeriod = addDays(startDate, cycleLength);
    const nextOvulation = addDays(startDate, Math.floor(cycleLength / 2));
    
    return { nextPeriod, nextOvulation };
  };

  const { nextPeriod, nextOvulation } = getNextPredictions();

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'Менструация': return 'bg-red-500';
      case 'Фолликулярная фаза': return 'bg-blue-500';
      case 'Овуляция': return 'bg-green-500';
      case 'Лютеиновая фаза': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Текущий цикл */}
      <Card className="border-2 border-pink-200 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-gray-800">Текущий цикл</CardTitle>
              <CardDescription className="text-gray-600">
                {currentCycle ? 
                  `Начался ${format(new Date(currentCycle.cycle_start_date), 'dd MMMM yyyy', { locale: ru })}` :
                  'Начните отслеживание цикла'
                }
              </CardDescription>
            </div>
            <Badge className={`${getPhaseColor(phase)} text-white text-sm px-3 py-1`}>
              {phase}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600 mb-2">{day}</div>
              <div className="text-sm text-gray-600">День цикла</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {currentCycle?.cycle_length || 28}
              </div>
              <div className="text-sm text-gray-600">Длина цикла</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {currentCycle?.period_length || 5}
              </div>
              <div className="text-sm text-gray-600">Дней менструации</div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Прогресс цикла</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3 bg-gray-200">
              <div 
                className={`h-full ${getPhaseColor(phase)} rounded-full transition-all duration-300`}
                style={{ width: `${progress}%` }}
              />
            </Progress>
          </div>
        </CardContent>
      </Card>

      {/* Прогнозы */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border border-pink-100">
          <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50">
            <CardTitle className="flex items-center gap-2 text-red-700">
              <Droplets className="w-5 h-5" />
              Следующая менструация
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {nextPeriod ? (
              <div>
                <div className="text-2xl font-bold text-red-600 mb-2">
                  {format(nextPeriod, 'dd MMMM', { locale: ru })}
                </div>
                <div className="text-sm text-gray-600">
                  Через {differenceInDays(nextPeriod, new Date())} дней
                </div>
              </div>
            ) : (
              <div className="text-gray-500">Нет данных для прогноза</div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border border-green-100">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Zap className="w-5 h-5" />
              Следующая овуляция
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {nextOvulation ? (
              <div>
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {format(nextOvulation, 'dd MMMM', { locale: ru })}
                </div>
                <div className="text-sm text-gray-600">
                  Через {Math.max(0, differenceInDays(nextOvulation, new Date()))} дней
                </div>
              </div>
            ) : (
              <div className="text-gray-500">Нет данных для прогноза</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Быстрые действия */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Быстрые действия</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Button className="bg-pink-600 hover:bg-pink-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Отметить начало цикла
            </Button>
            <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
              <Heart className="w-4 h-4 mr-2" />
              Добавить симптомы
            </Button>
            <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
              <Calendar className="w-4 h-4 mr-2" />
              Просмотреть историю
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CurrentCycleDashboard;
