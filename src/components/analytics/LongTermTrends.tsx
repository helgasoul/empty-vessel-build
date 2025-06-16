
import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, CalendarDays, Activity, Heart, Moon, Zap } from 'lucide-react';
import { useHealthData } from '@/hooks/useHealthData';
import { useMenstrualCycle } from '@/hooks/useMenstrualCycle';
import { useSymptomMoodLog } from '@/hooks/useSymptomMoodLog';
import { format, subMonths, subYears, startOfMonth, endOfMonth, eachMonthOfInterval } from 'date-fns';
import { ru } from 'date-fns/locale';

interface TrendData {
  period: string;
  avgSteps: number;
  avgHeartRate: number;
  avgSleep: number;
  avgMood: number;
  avgEnergy: number;
  cycleLengthAvg: number;
  symptomsCount: number;
}

const LongTermTrends: React.FC = () => {
  const { healthData } = useHealthData();
  const { cycles } = useMenstrualCycle();
  const { logs } = useSymptomMoodLog();
  const [timeframe, setTimeframe] = useState<'6months' | '1year' | '2years'>('1year');
  const [selectedMetric, setSelectedMetric] = useState<keyof TrendData>('avgSteps');

  const trendData = useMemo(() => {
    const now = new Date();
    let startDate: Date;
    
    switch (timeframe) {
      case '6months':
        startDate = subMonths(now, 6);
        break;
      case '1year':
        startDate = subYears(now, 1);
        break;
      case '2years':
        startDate = subYears(now, 2);
        break;
    }

    const months = eachMonthOfInterval({ start: startDate, end: now });
    
    return months.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      
      // Фильтруем данные для текущего месяца
      const monthHealthData = healthData.filter(item => {
        const date = new Date(item.recorded_at);
        return date >= monthStart && date <= monthEnd;
      });

      const monthLogs = logs.filter(log => {
        const date = new Date(log.log_date);
        return date >= monthStart && date <= monthEnd;
      });

      const monthCycles = cycles.filter(cycle => {
        const date = new Date(cycle.cycle_start_date);
        return date >= monthStart && date <= monthEnd;
      });

      // Вычисляем средние значения
      const stepsData = monthHealthData.filter(d => d.data_type === 'steps');
      const heartRateData = monthHealthData.filter(d => d.data_type === 'heart_rate');
      const sleepData = monthHealthData.filter(d => d.data_type === 'sleep');

      const avgSteps = stepsData.length > 0 
        ? stepsData.reduce((sum, d) => sum + (d.data_value || 0), 0) / stepsData.length 
        : 0;

      const avgHeartRate = heartRateData.length > 0 
        ? heartRateData.reduce((sum, d) => sum + (d.data_value || 0), 0) / heartRateData.length 
        : 0;

      const avgSleep = sleepData.length > 0 
        ? sleepData.reduce((sum, d) => sum + (d.data_value || 0), 0) / sleepData.length 
        : 0;

      const avgMood = monthLogs.length > 0 
        ? monthLogs.reduce((sum, log) => sum + (log.mood_rating || 0), 0) / monthLogs.length 
        : 0;

      const avgEnergy = monthLogs.length > 0 
        ? monthLogs.reduce((sum, log) => sum + (log.energy_level || 0), 0) / monthLogs.length 
        : 0;

      const cycleLengthAvg = monthCycles.length > 0 
        ? monthCycles.reduce((sum, cycle) => sum + (cycle.cycle_length || 28), 0) / monthCycles.length 
        : 28;

      const symptomsCount = monthLogs.reduce((sum, log) => sum + (log.symptoms?.length || 0), 0);

      return {
        period: format(month, 'MMM yyyy', { locale: ru }),
        avgSteps: Math.round(avgSteps),
        avgHeartRate: Math.round(avgHeartRate),
        avgSleep: Math.round(avgSleep * 10) / 10,
        avgMood: Math.round(avgMood * 10) / 10,
        avgEnergy: Math.round(avgEnergy * 10) / 10,
        cycleLengthAvg: Math.round(cycleLengthAvg),
        symptomsCount
      };
    });
  }, [healthData, logs, cycles, timeframe]);

  // Вычисляем тренды
  const calculateTrend = (data: number[]): { direction: 'up' | 'down' | 'stable'; percentage: number } => {
    if (data.length < 2) return { direction: 'stable', percentage: 0 };
    
    const firstHalf = data.slice(0, Math.floor(data.length / 2));
    const secondHalf = data.slice(Math.floor(data.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
    
    const percentage = ((secondAvg - firstAvg) / firstAvg) * 100;
    
    return {
      direction: percentage > 5 ? 'up' : percentage < -5 ? 'down' : 'stable',
      percentage: Math.abs(percentage)
    };
  };

  const trends = useMemo(() => {
    return {
      steps: calculateTrend(trendData.map(d => d.avgSteps)),
      heartRate: calculateTrend(trendData.map(d => d.avgHeartRate)),
      sleep: calculateTrend(trendData.map(d => d.avgSleep)),
      mood: calculateTrend(trendData.map(d => d.avgMood)),
      energy: calculateTrend(trendData.map(d => d.avgEnergy))
    };
  }, [trendData]);

  const chartConfig = {
    avgSteps: { label: "Шаги", color: "#3B82F6" },
    avgHeartRate: { label: "Пульс", color: "#EF4444" },
    avgSleep: { label: "Сон", color: "#8B5CF6" },
    avgMood: { label: "Настроение", color: "#10B981" },
    avgEnergy: { label: "Энергия", color: "#F59E0B" },
    cycleLengthAvg: { label: "Длина цикла", color: "#EC4899" },
    symptomsCount: { label: "Симптомы", color: "#6B7280" }
  };

  const getMetricIcon = (metric: keyof TrendData) => {
    const icons = {
      avgSteps: Activity,
      avgHeartRate: Heart,
      avgSleep: Moon,
      avgMood: Zap,
      avgEnergy: Zap,
      cycleLengthAvg: CalendarDays,
      symptomsCount: Activity
    };
    return icons[metric] || Activity;
  };

  const getTrendIcon = (trend: typeof trends.steps) => {
    if (trend.direction === 'up') return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend.direction === 'down') return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <div className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <CalendarDays className="w-6 h-6 text-blue-600" />
                <span>Долгосрочные тренды</span>
              </CardTitle>
              <CardDescription>
                Анализ изменений показателей здоровья за длительный период
              </CardDescription>
            </div>
            
            <div className="flex space-x-2">
              {(['6months', '1year', '2years'] as const).map((period) => (
                <Button
                  key={period}
                  variant={timeframe === period ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeframe(period)}
                >
                  {period === '6months' ? '6 мес' : period === '1year' ? '1 год' : '2 года'}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Обзор трендов */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {Object.entries(trends).map(([key, trend]) => {
          const Icon = getMetricIcon(key as keyof TrendData);
          const config = chartConfig[key as keyof TrendData];
          
          return (
            <Card key={key} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Icon className="w-5 h-5" style={{ color: config.color }} />
                  {getTrendIcon(trend)}
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">{config.label}</p>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={trend.direction === 'up' ? 'default' : trend.direction === 'down' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {trend.direction === 'up' && '+'}
                      {trend.direction === 'down' && '-'}
                      {trend.direction === 'stable' && '~'}
                      {trend.percentage.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Основной график */}
      <Tabs value={selectedMetric} onValueChange={(value) => setSelectedMetric(value as keyof TrendData)}>
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
          {Object.entries(chartConfig).map(([key, config]) => {
            const Icon = getMetricIcon(key as keyof TrendData);
            return (
              <TabsTrigger key={key} value={key} className="flex items-center space-x-1">
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline text-xs">{config.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {Object.entries(chartConfig).map(([key, config]) => (
          <TabsContent key={key} value={key}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {React.createElement(getMetricIcon(key as keyof TrendData), { className: "w-5 h-5" })}
                  <span>{config.label} - тренд за {timeframe === '6months' ? '6 месяцев' : timeframe === '1year' ? 'год' : '2 года'}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={config.color} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={config.color} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey={key}
                        stroke={config.color}
                        fillOpacity={1}
                        fill={`url(#gradient-${key})`}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Инсайты */}
      <Card>
        <CardHeader>
          <CardTitle>Долгосрочные инсайты</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trends.steps.direction === 'up' && trends.steps.percentage > 10 && (
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">📈 Рост активности</h4>
                <p className="text-green-800 text-sm">
                  Ваша физическая активность выросла на {trends.steps.percentage.toFixed(1)}% за выбранный период. Отличная динамика!
                </p>
              </div>
            )}

            {trends.mood.direction === 'up' && trends.mood.percentage > 15 && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">😊 Улучшение настроения</h4>
                <p className="text-blue-800 text-sm">
                  Ваше настроение значительно улучшилось на {trends.mood.percentage.toFixed(1)}% за этот период.
                </p>
              </div>
            )}

            {trends.sleep.direction === 'down' && trends.sleep.percentage > 10 && (
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Снижение качества сна</h4>
                <p className="text-yellow-800 text-sm">
                  Продолжительность сна снизилась на {trends.sleep.percentage.toFixed(1)}%. Рекомендуем обратить внимание на режим отдыха.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LongTermTrends;
