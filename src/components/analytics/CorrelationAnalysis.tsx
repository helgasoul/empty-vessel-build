
import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, Brain, Moon, Heart, Activity } from 'lucide-react';
import { useHealthData } from '@/hooks/useHealthData';
import { useMenstrualCycle } from '@/hooks/useMenstrualCycle';
import { useSymptomMoodLog } from '@/hooks/useSymptomMoodLog';
import { format, parseISO, differenceInDays } from 'date-fns';
import { ru } from 'date-fns/locale';

interface CorrelationData {
  date: string;
  mood: number;
  sleep: number;
  steps: number;
  heartRate: number;
  cycleDay: number | null;
  stressLevel: number;
  energyLevel: number;
}

const CorrelationAnalysis: React.FC = () => {
  const { healthData } = useHealthData();
  const { cycles } = useMenstrualCycle();
  const { logs } = useSymptomMoodLog();
  const [selectedCorrelation, setSelectedCorrelation] = useState<'mood-cycle' | 'sleep-mood' | 'activity-mood' | 'stress-sleep'>('mood-cycle');

  // Объединяем все данные для корреляционного анализа
  const correlationData = useMemo(() => {
    const dataMap = new Map<string, Partial<CorrelationData>>();

    // Добавляем данные о здоровье
    healthData.forEach(item => {
      const date = item.recorded_at.split('T')[0];
      if (!dataMap.has(date)) {
        dataMap.set(date, { date });
      }
      const dayData = dataMap.get(date)!;

      switch (item.data_type) {
        case 'steps':
          dayData.steps = item.data_value || 0;
          break;
        case 'heart_rate':
          dayData.heartRate = item.data_value || 0;
          break;
        case 'sleep':
          dayData.sleep = item.data_value || 0;
          break;
      }
    });

    // Добавляем данные о настроении и симптомах
    logs.forEach(log => {
      if (!dataMap.has(log.log_date)) {
        dataMap.set(log.log_date, { date: log.log_date });
      }
      const dayData = dataMap.get(log.log_date)!;
      
      dayData.mood = log.mood_rating || 0;
      dayData.stressLevel = log.stress_level || 0;
      dayData.energyLevel = log.energy_level || 0;
    });

    // Добавляем данные о менструальном цикле
    cycles.forEach(cycle => {
      const startDate = new Date(cycle.cycle_start_date);
      const endDate = cycle.cycle_end_date ? new Date(cycle.cycle_end_date) : new Date();
      
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = format(d, 'yyyy-MM-dd');
        if (!dataMap.has(dateStr)) {
          dataMap.set(dateStr, { date: dateStr });
        }
        const dayData = dataMap.get(dateStr)!;
        dayData.cycleDay = differenceInDays(d, startDate) + 1;
      }
    });

    return Array.from(dataMap.values())
      .filter(item => item.mood !== undefined || item.sleep !== undefined)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) as CorrelationData[];
  }, [healthData, logs, cycles]);

  // Вычисляем корреляции
  const calculateCorrelation = (x: number[], y: number[]): number => {
    const n = x.length;
    if (n === 0) return 0;

    const meanX = x.reduce((sum, val) => sum + val, 0) / n;
    const meanY = y.reduce((sum, val) => sum + val, 0) / n;

    const numerator = x.reduce((sum, val, i) => sum + (val - meanX) * (y[i] - meanY), 0);
    const denominatorX = Math.sqrt(x.reduce((sum, val) => sum + Math.pow(val - meanX, 2), 0));
    const denominatorY = Math.sqrt(y.reduce((sum, val) => sum + Math.pow(val - meanY, 2), 0));

    return denominatorX * denominatorY === 0 ? 0 : numerator / (denominatorX * denominatorY);
  };

  const correlations = useMemo(() => {
    const validData = correlationData.filter(d => 
      d.mood !== undefined && d.sleep !== undefined && d.steps !== undefined
    );

    return {
      moodSleep: calculateCorrelation(
        validData.map(d => d.mood),
        validData.map(d => d.sleep)
      ),
      moodSteps: calculateCorrelation(
        validData.map(d => d.mood),
        validData.map(d => d.steps)
      ),
      sleepSteps: calculateCorrelation(
        validData.map(d => d.sleep),
        validData.map(d => d.steps)
      ),
      stressSleep: calculateCorrelation(
        validData.filter(d => d.stressLevel !== undefined).map(d => d.stressLevel),
        validData.filter(d => d.stressLevel !== undefined).map(d => d.sleep)
      )
    };
  }, [correlationData]);

  const getCorrelationData = () => {
    switch (selectedCorrelation) {
      case 'mood-cycle':
        return correlationData
          .filter(d => d.mood !== undefined && d.cycleDay !== null)
          .map(d => ({ x: d.cycleDay!, y: d.mood, date: d.date }));
      case 'sleep-mood':
        return correlationData
          .filter(d => d.sleep !== undefined && d.mood !== undefined)
          .map(d => ({ x: d.sleep, y: d.mood, date: d.date }));
      case 'activity-mood':
        return correlationData
          .filter(d => d.steps !== undefined && d.mood !== undefined)
          .map(d => ({ x: d.steps, y: d.mood, date: d.date }));
      case 'stress-sleep':
        return correlationData
          .filter(d => d.stressLevel !== undefined && d.sleep !== undefined)
          .map(d => ({ x: d.stressLevel, y: d.sleep, date: d.date }));
      default:
        return [];
    }
  };

  const getCorrelationStrength = (correlation: number): { text: string; color: string } => {
    const abs = Math.abs(correlation);
    if (abs >= 0.7) return { text: 'Сильная', color: 'text-green-600' };
    if (abs >= 0.5) return { text: 'Умеренная', color: 'text-yellow-600' };
    if (abs >= 0.3) return { text: 'Слабая', color: 'text-orange-600' };
    return { text: 'Очень слабая', color: 'text-gray-600' };
  };

  const chartConfig = {
    mood: { label: "Настроение", color: "#8B5CF6" },
    sleep: { label: "Сон", color: "#3B82F6" },
    steps: { label: "Активность", color: "#10B981" },
    stress: { label: "Стресс", color: "#EF4444" }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-6 h-6 text-purple-600" />
            <span>Корреляционный анализ</span>
          </CardTitle>
          <CardDescription>
            Анализ взаимосвязей между различными показателями здоровья
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Обзор корреляций */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-purple-500" />
                <Moon className="w-4 h-4 text-blue-500" />
              </div>
              {correlations.moodSleep > 0 ? 
                <TrendingUp className="w-4 h-4 text-green-500" /> : 
                <TrendingDown className="w-4 h-4 text-red-500" />
              }
            </div>
            <p className="text-sm text-gray-600">Настроение ↔ Сон</p>
            <p className="text-lg font-bold">{correlations.moodSleep.toFixed(2)}</p>
            <Badge variant="secondary" className={getCorrelationStrength(correlations.moodSleep).color}>
              {getCorrelationStrength(correlations.moodSleep).text}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-purple-500" />
                <Activity className="w-4 h-4 text-green-500" />
              </div>
              {correlations.moodSteps > 0 ? 
                <TrendingUp className="w-4 h-4 text-green-500" /> : 
                <TrendingDown className="w-4 h-4 text-red-500" />
              }
            </div>
            <p className="text-sm text-gray-600">Настроение ↔ Активность</p>
            <p className="text-lg font-bold">{correlations.moodSteps.toFixed(2)}</p>
            <Badge variant="secondary" className={getCorrelationStrength(correlations.moodSteps).color}>
              {getCorrelationStrength(correlations.moodSteps).text}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Moon className="w-4 h-4 text-blue-500" />
                <Activity className="w-4 h-4 text-green-500" />
              </div>
              {correlations.sleepSteps > 0 ? 
                <TrendingUp className="w-4 h-4 text-green-500" /> : 
                <TrendingDown className="w-4 h-4 text-red-500" />
              }
            </div>
            <p className="text-sm text-gray-600">Сон ↔ Активность</p>
            <p className="text-lg font-bold">{correlations.sleepSteps.toFixed(2)}</p>
            <Badge variant="secondary" className={getCorrelationStrength(correlations.sleepSteps).color}>
              {getCorrelationStrength(correlations.sleepSteps).text}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-red-500" />
                <Moon className="w-4 h-4 text-blue-500" />
              </div>
              {correlations.stressSleep > 0 ? 
                <TrendingUp className="w-4 h-4 text-green-500" /> : 
                <TrendingDown className="w-4 h-4 text-red-500" />
              }
            </div>
            <p className="text-sm text-gray-600">Стресс ↔ Сон</p>
            <p className="text-lg font-bold">{correlations.stressSleep.toFixed(2)}</p>
            <Badge variant="secondary" className={getCorrelationStrength(correlations.stressSleep).color}>
              {getCorrelationStrength(correlations.stressSleep).text}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Детальный анализ */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Детальный анализ корреляций</CardTitle>
            <Select value={selectedCorrelation} onValueChange={(value: any) => setSelectedCorrelation(value)}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mood-cycle">Настроение vs Цикл</SelectItem>
                <SelectItem value="sleep-mood">Сон vs Настроение</SelectItem>
                <SelectItem value="activity-mood">Активность vs Настроение</SelectItem>
                <SelectItem value="stress-sleep">Стресс vs Сон</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart data={getCorrelationData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="x" 
                  name={selectedCorrelation.split('-')[1]}
                  type="number"
                />
                <YAxis 
                  dataKey="y" 
                  name={selectedCorrelation.split('-')[0]}
                  type="number"
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  cursor={{ strokeDasharray: '3 3' }}
                />
                <Scatter 
                  dataKey="y" 
                  fill="#8B5CF6" 
                  stroke="#8B5CF6"
                  strokeWidth={2}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Инсайты */}
      <Card>
        <CardHeader>
          <CardTitle>Ключевые инсайты</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {correlations.moodSleep > 0.3 && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">💤 Сон влияет на настроение</h4>
                <p className="text-blue-800 text-sm">
                  Обнаружена {getCorrelationStrength(correlations.moodSleep).text.toLowerCase()} связь между качеством сна и настроением. 
                  Улучшение режима сна может положительно повлиять на ваше эмоциональное состояние.
                </p>
              </div>
            )}
            
            {correlations.moodSteps > 0.3 && (
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">🏃‍♀️ Активность поднимает настроение</h4>
                <p className="text-green-800 text-sm">
                  Физическая активность показывает {getCorrelationStrength(correlations.moodSteps).text.toLowerCase()} связь с настроением. 
                  Регулярные тренировки могут помочь поддерживать позитивный настрой.
                </p>
              </div>
            )}

            {correlations.stressSleep < -0.3 && (
              <div className="p-4 bg-red-50 rounded-lg">
                <h4 className="font-semibold text-red-900 mb-2">😰 Стресс нарушает сон</h4>
                <p className="text-red-800 text-sm">
                  Высокий уровень стресса негативно влияет на качество сна. 
                  Рассмотрите методы снижения стресса для улучшения отдыха.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CorrelationAnalysis;
