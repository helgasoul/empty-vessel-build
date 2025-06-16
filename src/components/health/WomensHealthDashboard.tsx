
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Baby, 
  Activity, 
  Heart, 
  TrendingUp,
  Thermometer,
  Stethoscope,
  ClipboardList
} from 'lucide-react';
import MenstrualCycleTracker from './MenstrualCycleTracker';
import PregnancyPlanningTracker from './PregnancyPlanningTracker';
import HormonalHealthTracker from './HormonalHealthTracker';
import { useMenstrualCycle } from '@/hooks/useMenstrualCycle';
import { usePregnancyPlanning } from '@/hooks/usePregnancyPlanning';
import { useHormonalHealth } from '@/hooks/useHormonalHealth';
import { format, differenceInDays, addDays } from 'date-fns';
import { ru } from 'date-fns/locale';

const WomensHealthDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { cycles } = useMenstrualCycle();
  const { plans } = usePregnancyPlanning();
  const { records } = useHormonalHealth();

  // Аналитика и инсайты
  const getLastCycle = () => {
    return cycles.find(cycle => cycle.cycle_start_date) || null;
  };

  const getActivePlan = () => {
    return plans.find(plan => plan.is_active) || null;
  };

  const getRecentHormones = () => {
    return records.slice(0, 3);
  };

  const predictNextPeriod = () => {
    const lastCycle = getLastCycle();
    if (!lastCycle) return null;

    // Простой прогноз на основе среднего цикла (28 дней)
    const averageCycle = 28;
    const lastStart = new Date(lastCycle.cycle_start_date);
    const nextPredicted = addDays(lastStart, averageCycle);
    const daysUntil = differenceInDays(nextPredicted, new Date());

    return {
      date: nextPredicted,
      daysUntil: daysUntil > 0 ? daysUntil : 0
    };
  };

  const lastCycle = getLastCycle();
  const activePlan = getActivePlan();
  const recentHormones = getRecentHormones();
  const nextPeriod = predictNextPeriod();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Женское здоровье</h1>
          <p className="text-gray-600 mt-2">Комплексный мониторинг и планирование</p>
        </div>
        <Badge className="bg-pink-100 text-pink-800">
          YTime Health
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Обзор
          </TabsTrigger>
          <TabsTrigger value="menstrual" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Цикл
          </TabsTrigger>
          <TabsTrigger value="pregnancy" className="flex items-center gap-2">
            <Baby className="w-4 h-4" />
            Планирование
          </TabsTrigger>
          <TabsTrigger value="hormonal" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Гормоны
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Краткий обзор */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Менструальный цикл */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-pink-600">
                  <Calendar className="w-5 h-5" />
                  Менструальный цикл
                </CardTitle>
              </CardHeader>
              <CardContent>
                {lastCycle ? (
                  <div className="space-y-2">
                    <p className="text-sm">
                      Последний цикл: {format(new Date(lastCycle.cycle_start_date), 'dd MMM', { locale: ru })}
                    </p>
                    {nextPeriod && (
                      <p className="text-sm">
                        {nextPeriod.daysUntil > 0 ? (
                          <span className="text-blue-600">
                            Следующие месячные через {nextPeriod.daysUntil} дн.
                          </span>
                        ) : (
                          <span className="text-red-600">
                            Месячные ожидались
                          </span>
                        )}
                      </p>
                    )}
                    {lastCycle.flow_intensity && (
                      <Badge variant="outline" className="text-xs">
                        {lastCycle.flow_intensity === 'light' ? 'Слабые' :
                         lastCycle.flow_intensity === 'moderate' ? 'Умеренные' : 'Обильные'}
                      </Badge>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    Начните отслеживать ваш цикл
                  </p>
                )}
                <Button 
                  size="sm" 
                  className="w-full mt-3 bg-pink-600 hover:bg-pink-700"
                  onClick={() => setActiveTab('menstrual')}
                >
                  Подробнее
                </Button>
              </CardContent>
            </Card>

            {/* Планирование беременности */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <Baby className="w-5 h-5" />
                  Планирование беременности
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activePlan ? (
                  <div className="space-y-2">
                    <p className="text-sm">
                      Планирование с: {format(new Date(activePlan.planning_start_date), 'dd MMM yyyy', { locale: ru })}
                    </p>
                    {activePlan.target_conception_date && (
                      <p className="text-sm text-blue-600">
                        Цель: {format(new Date(activePlan.target_conception_date), 'dd MMM yyyy', { locale: ru })}
                      </p>
                    )}
                    <div className="flex gap-1">
                      {activePlan.prenatal_vitamins && (
                        <Badge variant="secondary" className="text-xs">Витамины</Badge>
                      )}
                      {activePlan.fertility_tracking && (
                        <Badge variant="secondary" className="text-xs">Трекинг</Badge>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    Создайте план планирования беременности
                  </p>
                )}
                <Button 
                  size="sm" 
                  className="w-full mt-3 bg-blue-600 hover:bg-blue-700"
                  onClick={() => setActiveTab('pregnancy')}
                >
                  Подробнее
                </Button>
              </CardContent>
            </Card>

            {/* Гормональное здоровье */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-purple-600">
                  <Activity className="w-5 h-5" />
                  Гормональное здоровье
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentHormones.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-sm">
                      Последний анализ: {format(new Date(recentHormones[0].tracking_date), 'dd MMM', { locale: ru })}
                    </p>
                    <div className="space-y-1">
                      {recentHormones.slice(0, 2).map(record => (
                        <div key={record.id} className="flex justify-between text-xs">
                          <span className="capitalize">
                            {record.hormone_type === 'estrogen' ? 'Эстроген' :
                             record.hormone_type === 'progesterone' ? 'Прогестерон' :
                             record.hormone_type === 'lh' ? 'ЛГ' :
                             record.hormone_type === 'fsh' ? 'ФСГ' : record.hormone_type}
                          </span>
                          {record.is_within_range !== undefined && (
                            <span className={record.is_within_range ? 'text-green-600' : 'text-red-600'}>
                              {record.is_within_range ? '✓' : '⚠'}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    Добавьте результаты анализов гормонов
                  </p>
                )}
                <Button 
                  size="sm" 
                  className="w-full mt-3 bg-purple-600 hover:bg-purple-700"
                  onClick={() => setActiveTab('hormonal')}
                >
                  Подробнее
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Быстрые действия */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5" />
                Быстрые действия
              </CardTitle>
              <CardDescription>
                Частые задачи для отслеживания женского здоровья
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col"
                  onClick={() => setActiveTab('menstrual')}
                >
                  <Calendar className="w-6 h-6 mb-2" />
                  <span className="text-xs">Отметить период</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col"
                  onClick={() => setActiveTab('hormonal')}
                >
                  <Thermometer className="w-6 h-6 mb-2" />
                  <span className="text-xs">Базальная температура</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col"
                  onClick={() => setActiveTab('hormonal')}
                >
                  <Stethoscope className="w-6 h-6 mb-2" />
                  <span className="text-xs">Результат анализа</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col"
                  onClick={() => setActiveTab('pregnancy')}
                >
                  <Heart className="w-6 h-6 mb-2" />
                  <span className="text-xs">Планирование</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Инсайты и рекомендации */}
          {(lastCycle || activePlan || recentHormones.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Инсайты и рекомендации
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {nextPeriod && nextPeriod.daysUntil <= 7 && nextPeriod.daysUntil > 0 && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        💡 Месячные ожидаются через {nextPeriod.daysUntil} дней. Подготовьте необходимые средства.
                      </p>
                    </div>
                  )}
                  
                  {activePlan && activePlan.fertility_tracking && (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-800">
                        💡 Не забывайте отслеживать базальную температуру и признаки овуляции для повышения шансов зачатия.
                      </p>
                    </div>
                  )}

                  {recentHormones.some(r => r.is_within_range === false) && (
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        ⚠ Некоторые гормональные показатели вне нормы. Обратитесь к врачу для консультации.
                      </p>
                    </div>
                  )}

                  {cycles.length >= 3 && (
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm text-purple-800">
                        📊 У вас достаточно данных для анализа паттернов цикла. Проверьте раздел аналитики.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="menstrual">
          <MenstrualCycleTracker />
        </TabsContent>

        <TabsContent value="pregnancy">
          <PregnancyPlanningTracker />
        </TabsContent>

        <TabsContent value="hormonal">
          <HormonalHealthTracker />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WomensHealthDashboard;
