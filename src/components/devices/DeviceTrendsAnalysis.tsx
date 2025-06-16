
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, Area, AreaChart } from 'recharts';
import { 
  Moon, 
  Footprints, 
  Heart, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Zap,
  Calendar,
  Target,
  Award
} from 'lucide-react';
import { useHealthData } from '@/hooks/useHealthData';
import { useAdvancedDevices } from '@/hooks/useAdvancedDevices';
import { format, parseISO, startOfWeek, endOfWeek, subDays } from 'date-fns';
import { ru } from 'date-fns/locale';

interface MetricStats {
  avg: number;
  trend: number;
  improvement: number;
}

interface Statistics {
  steps: MetricStats;
  sleep: MetricStats;
  heart_rate: MetricStats;
  activity: MetricStats;
  totalDays: number;
  activeDays: number;
}

const DeviceTrendsAnalysis = () => {
  const { healthData, loading } = useHealthData();
  const { devices } = useAdvancedDevices();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | '3months'>('week');
  const [selectedMetric, setSelectedMetric] = useState<'steps' | 'sleep' | 'heart_rate' | 'activity'>('steps');

  // Обработка данных для анализа трендов
  const trendsData = useMemo(() => {
    if (!healthData || healthData.length === 0) return [];

    const now = new Date();
    let startDate;
    
    switch (selectedPeriod) {
      case 'week':
        startDate = startOfWeek(now, { locale: ru });
        break;
      case 'month':
        startDate = subDays(now, 30);
        break;
      case '3months':
        startDate = subDays(now, 90);
        break;
    }

    const filteredData = healthData.filter(item => 
      new Date(item.recorded_at) >= startDate
    );

    // Группируем данные по дням
    const groupedData = filteredData.reduce((acc, item) => {
      const date = format(parseISO(item.recorded_at), 'yyyy-MM-dd');
      
      if (!acc[date]) {
        acc[date] = {
          date,
          formattedDate: format(parseISO(item.recorded_at), 'dd MMM', { locale: ru }),
          steps: 0,
          sleep: 0,
          heart_rate: 0,
          heart_rate_count: 0,
          activity: 0,
          calories: 0,
          readiness: 0,
          strain: 0,
          recovery: 0
        };
      }

      switch (item.data_type) {
        case 'steps':
          acc[date].steps += item.data_value || 0;
          break;
        case 'sleep':
          acc[date].sleep += item.data_value || 0;
          break;
        case 'heart_rate':
          acc[date].heart_rate += item.data_value || 0;
          acc[date].heart_rate_count++;
          break;
        case 'active_minutes':
        case 'activity':
          acc[date].activity += item.data_value || 0;
          break;
        case 'calories':
          acc[date].calories += item.data_value || 0;
          break;
        case 'readiness':
          acc[date].readiness = item.data_value || 0;
          break;
        case 'strain':
          acc[date].strain = item.data_value || 0;
          break;
        case 'recovery':
          acc[date].recovery = item.data_value || 0;
          break;
      }

      return acc;
    }, {} as Record<string, any>);

    // Вычисляем средние значения и сортируем
    return Object.values(groupedData).map((day: any) => ({
      ...day,
      heart_rate: day.heart_rate_count > 0 ? Math.round(day.heart_rate / day.heart_rate_count) : 0
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [healthData, selectedPeriod]);

  // Вычисляем статистику и инсайты
  const statistics: Statistics | null = useMemo(() => {
    if (trendsData.length === 0) return null;

    const calculateStats = (values: number[]): MetricStats => {
      const validValues = values.filter(v => v > 0);
      if (validValues.length === 0) return { avg: 0, trend: 0, improvement: 0 };
      
      const avg = validValues.reduce((sum, val) => sum + val, 0) / validValues.length;
      const firstHalf = validValues.slice(0, Math.floor(validValues.length / 2));
      const secondHalf = validValues.slice(Math.floor(validValues.length / 2));
      
      const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
      
      const trend = secondAvg - firstAvg;
      const improvement = (trend / firstAvg) * 100;
      
      return { avg: Math.round(avg), trend: Math.round(trend), improvement: Math.round(improvement) };
    };

    return {
      steps: calculateStats(trendsData.map(d => d.steps)),
      sleep: calculateStats(trendsData.map(d => d.sleep)),
      heart_rate: calculateStats(trendsData.map(d => d.heart_rate)),
      activity: calculateStats(trendsData.map(d => d.activity)),
      totalDays: trendsData.length,
      activeDays: trendsData.filter(d => d.steps > 1000 || d.activity > 10).length
    };
  }, [trendsData]);

  const chartConfig = {
    steps: { label: "Шаги", color: "#3B82F6" },
    sleep: { label: "Сон (часы)", color: "#8B5CF6" },
    heart_rate: { label: "Пульс", color: "#EF4444" },
    activity: { label: "Активность (мин)", color: "#10B981" }
  };

  const getMetricIcon = (metric: string) => {
    const icons = {
      steps: Footprints,
      sleep: Moon,
      heart_rate: Heart,
      activity: Activity
    };
    return icons[metric] || Activity;
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <div className="w-4 h-4" />; // Пустой блок для нейтрального тренда
  };

  const connectedDevices = devices.filter(d => d.is_connected);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Загрузка анализа трендов...</span>
        </CardContent>
      </Card>
    );
  }

  if (trendsData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <span>Анализ трендов</span>
          </CardTitle>
          <CardDescription>
            Анализ активности и сна на основе данных с подключенных устройств
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Activity className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Недостаточно данных для анализа
            </h3>
            <p className="text-gray-600">
              Подключите устройства и начните отслеживать активность для получения анализа трендов
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <span>Анализ трендов</span>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  {connectedDevices.length} устройств
                </Badge>
              </CardTitle>
              <CardDescription>
                Анализ активности и сна на основе данных с подключенных устройств
              </CardDescription>
            </div>
            
            <div className="flex space-x-2">
              {(['week', 'month', '3months'] as const).map((period) => (
                <Button
                  key={period}
                  variant={selectedPeriod === period ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPeriod(period)}
                >
                  {period === 'week' ? 'Неделя' : period === 'month' ? 'Месяц' : '3 месяца'}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Статистические карточки */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(chartConfig).map(([key, config]) => {
            const metricKey = key as keyof typeof chartConfig;
            const stats = statistics[metricKey] as MetricStats;
            const Icon = getMetricIcon(key);
            
            return (
              <Card key={key} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="w-5 h-5" style={{ color: config.color }} />
                    {getTrendIcon(stats.trend)}
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-2xl font-bold" style={{ color: config.color }}>
                      {stats.avg.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">{config.label}</p>
                    
                    {stats.improvement !== 0 && (
                      <div className="flex items-center space-x-1 text-xs">
                        <span className={stats.improvement > 0 ? 'text-green-600' : 'text-red-600'}>
                          {stats.improvement > 0 ? '+' : ''}{stats.improvement}%
                        </span>
                        <span className="text-gray-500">за период</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Графики */}
      <Tabs value={selectedMetric} onValueChange={(value) => setSelectedMetric(value as typeof selectedMetric)}>
        <TabsList className="grid w-full grid-cols-4">
          {Object.entries(chartConfig).map(([key, config]) => {
            const Icon = getMetricIcon(key);
            return (
              <TabsTrigger key={key} value={key} className="flex items-center space-x-2">
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{config.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {Object.entries(chartConfig).map(([key, config]) => (
          <TabsContent key={key} value={key}>
            <Card>
              <CardHeader>
                <CardTitle>{config.label} - тренд за {selectedPeriod === 'week' ? 'неделю' : selectedPeriod === 'month' ? 'месяц' : '3 месяца'}</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendsData}>
                      <defs>
                        <linearGradient id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={config.color} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={config.color} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="formattedDate" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey={key === 'sleep' ? 'sleep' : key === 'heart_rate' ? 'heart_rate' : key}
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

      {/* Инсайты и рекомендации */}
      {statistics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-yellow-600" />
              <span>Инсайты и достижения</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-900">Активность</span>
                </div>
                <p className="text-sm text-blue-800">
                  Активных дней: {statistics.activeDays} из {statistics.totalDays}
                  {statistics.activeDays / statistics.totalDays > 0.8 && ' 🎉 Отличная регулярность!'}
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-900">Улучшения</span>
                </div>
                <p className="text-sm text-green-800">
                  {statistics.steps.improvement > 10 && 'Шаги: отличный прогресс! '}
                  {statistics.sleep.improvement > 5 && 'Сон: качество улучшается! '}
                  {statistics.activity.improvement > 15 && 'Активность: растет!'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DeviceTrendsAnalysis;
