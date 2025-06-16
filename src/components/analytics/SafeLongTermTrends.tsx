
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Calendar,
  Download,
  Filter,
  BarChart3
} from "lucide-react";
import { format, subDays, subMonths, subYears, startOfWeek, startOfMonth, startOfYear } from 'date-fns';
import { ru } from 'date-fns/locale';

const SafeLongTermTrends = () => {
  const [timeRange, setTimeRange] = useState<'3m' | '6m' | '1y' | '2y'>('6m');
  const [metric, setMetric] = useState<'all' | 'steps' | 'heartRate' | 'sleep' | 'weight'>('all');
  const [viewType, setViewType] = useState<'trend' | 'comparison' | 'seasonal'>('trend');
  const [aggregation, setAggregation] = useState<'week' | 'month' | 'quarter'>('month');

  // Генерируем демо-данные для долгосрочных трендов
  const longTermData = useMemo(() => {
    const data = [];
    const now = new Date();
    const months = timeRange === '3m' ? 3 : timeRange === '6m' ? 6 : timeRange === '1y' ? 12 : 24;
    
    for (let i = months; i >= 0; i--) {
      const date = subMonths(now, i);
      const baseSteps = 7000 + Math.sin(i * 0.5) * 1000 + Math.random() * 500;
      const baseHeartRate = 68 + Math.sin(i * 0.3) * 3 + Math.random() * 2;
      const baseSleep = 7.2 + Math.sin(i * 0.4) * 0.5 + Math.random() * 0.3;
      const baseWeight = 65 + Math.sin(i * 0.1) * 2 + Math.random() * 0.5;
      
      data.push({
        date: format(date, 'MMM yyyy', { locale: ru }),
        fullDate: date,
        steps: Math.round(baseSteps),
        heartRate: Math.round(baseHeartRate * 10) / 10,
        sleep: Math.round(baseSleep * 10) / 10,
        weight: Math.round(baseWeight * 10) / 10,
        activeMinutes: Math.round(baseSteps / 200),
        caloriesBurned: Math.round(baseSteps * 0.04)
      });
    }
    
    return data;
  }, [timeRange]);

  // Расчет трендов с проверками на существование данных
  const trends = useMemo(() => {
    if (!longTermData || longTermData.length < 2) {
      return {
        steps: { direction: 'stable' as const, change: 0, percentage: 0 },
        heartRate: { direction: 'stable' as const, change: 0, percentage: 0 },
        sleep: { direction: 'stable' as const, change: 0, percentage: 0 },
        weight: { direction: 'stable' as const, change: 0, percentage: 0 }
      };
    }

    const recent = longTermData.slice(-3);
    const earlier = longTermData.slice(0, 3);
    
    const calculateTrend = (metricName: keyof typeof longTermData[0]) => {
      if (recent.length === 0 || earlier.length === 0) {
        return { direction: 'stable' as const, change: 0, percentage: 0 };
      }

      const recentAvg = recent.reduce((sum, item) => {
        const value = typeof item[metricName] === 'number' ? item[metricName] as number : 0;
        return sum + value;
      }, 0) / recent.length;
      
      const earlierAvg = earlier.reduce((sum, item) => {
        const value = typeof item[metricName] === 'number' ? item[metricName] as number : 0;
        return sum + value;
      }, 0) / earlier.length;
      
      const change = recentAvg - earlierAvg;
      const percentage = earlierAvg > 0 ? (change / earlierAvg) * 100 : 0;
      
      return {
        direction: Math.abs(percentage) < 2 ? 'stable' as const : 
                  percentage > 0 ? 'up' as const : 'down' as const,
        change: Math.round(change * 10) / 10,
        percentage: Math.round(percentage * 10) / 10
      };
    };

    return {
      steps: calculateTrend('steps'),
      heartRate: calculateTrend('heartRate'),
      sleep: calculateTrend('sleep'),
      weight: calculateTrend('weight')
    };
  }, [longTermData]);

  // Конфигурация метрик с проверками
  const metricsConfig = [
    {
      key: 'steps',
      name: 'Шаги',
      color: '#3B82F6',
      unit: '',
      formatter: (value: number) => value?.toLocaleString() || '0'
    },
    {
      key: 'heartRate',
      name: 'Пульс покоя',
      color: '#EF4444',
      unit: 'уд/мин',
      formatter: (value: number) => value?.toString() || '0'
    },
    {
      key: 'sleep',
      name: 'Сон',
      color: '#8B5CF6',
      unit: 'ч',
      formatter: (value: number) => value?.toFixed(1) || '0.0'
    },
    {
      key: 'weight',
      name: 'Вес',
      color: '#10B981',
      unit: 'кг',
      formatter: (value: number) => value?.toFixed(1) || '0.0'
    }
  ];

  const TrendIcon = ({ direction }: { direction: 'up' | 'down' | 'stable' }) => {
    switch (direction) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendColor = (direction: 'up' | 'down' | 'stable', metricKey: string) => {
    if (direction === 'stable') return 'text-gray-600';
    
    // Для пульса покоя и веса - снижение хорошо
    if (metricKey === 'heartRate' || metricKey === 'weight') {
      return direction === 'down' ? 'text-green-600' : 'text-red-600';
    }
    
    // Для шагов и сна - увеличение хорошо
    return direction === 'up' ? 'text-green-600' : 'text-red-600';
  };

  const getVisibleMetrics = () => {
    if (metric === 'all') return metricsConfig;
    return metricsConfig.filter(config => config && config.key === metric);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
        <p className="font-medium text-gray-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => {
          const config = metricsConfig.find(c => c && c.key === entry.dataKey);
          if (!config) return null;
          
          return (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color || config.color }}
              />
              <span className="text-sm text-gray-700">
                {config.name}: {config.formatter(entry.value)} {config.unit}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Заголовок и фильтры */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                <span>Долгосрочные тренды</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Расширенная аналитика
                </Badge>
              </CardTitle>
              <CardDescription>
                Анализ изменений показателей здоровья за длительные периоды
              </CardDescription>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3m">3 месяца</SelectItem>
                  <SelectItem value="6m">6 месяцев</SelectItem>
                  <SelectItem value="1y">1 год</SelectItem>
                  <SelectItem value="2y">2 года</SelectItem>
                </SelectContent>
              </Select>

              <Select value={metric} onValueChange={(value: any) => setMetric(value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все метрики</SelectItem>
                  <SelectItem value="steps">Шаги</SelectItem>
                  <SelectItem value="heartRate">Пульс</SelectItem>
                  <SelectItem value="sleep">Сон</SelectItem>
                  <SelectItem value="weight">Вес</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Экспорт
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Сводка трендов */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricsConfig.map((config) => {
          if (!config) return null;
          
          const trend = trends[config.key as keyof typeof trends];
          if (!trend) return null;
          
          return (
            <Card key={config.key}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{config.name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <TrendIcon direction={trend.direction} />
                      <span className={`text-lg font-bold ${getTrendColor(trend.direction, config.key)}`}>
                        {trend.direction === 'stable' ? 'Стабильно' :
                         `${trend.percentage > 0 ? '+' : ''}${trend.percentage}%`}
                      </span>
                    </div>
                  </div>
                  <div 
                    className="w-3 h-8 rounded-full opacity-20"
                    style={{ backgroundColor: config.color }}
                  />
                </div>
                {trend.direction !== 'stable' && (
                  <p className="text-xs text-gray-500 mt-2">
                    {trend.direction === 'up' ? 'Увеличение' : 'Снижение'} на {Math.abs(trend.change)} {config.unit}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Основной график */}
      <Card>
        <CardHeader>
          <CardTitle>Динамика показателей</CardTitle>
          <CardDescription>
            График изменения выбранных метрик за период {timeRange}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={longTermData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                
                {getVisibleMetrics().map((config) => {
                  if (!config) return null;
                  
                  return (
                    <Line
                      key={config.key}
                      type="monotone"
                      dataKey={config.key}
                      stroke={config.color}
                      strokeWidth={2}
                      dot={{ fill: config.color, strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: config.color, strokeWidth: 2 }}
                      name={config.name}
                    />
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Дополнительная аналитика */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Сезонный анализ</CardTitle>
            <CardDescription>
              Выявление закономерностей по месяцам
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">📊 Лучшие показатели</h4>
                <p className="text-blue-800 text-sm">
                  Наивысшая активность наблюдалась в последние 3 месяца с ростом на 12%
                </p>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-900 mb-2">🔄 Цикличность</h4>
                <p className="text-purple-800 text-sm">
                  Стабильное улучшение качества сна с периодичностью в 2-3 месяца
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2">⭐ Достижения</h4>
                <p className="text-green-800 text-sm">
                  Стабилизация пульса покоя на оптимальном уровне за последние 4 месяца
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Корреляционный анализ</CardTitle>
            <CardDescription>
              Взаимосвязи между показателями
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Шаги ↔ Качество сна</span>
                <Badge className="bg-green-100 text-green-800">Высокая +0.78</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Активность ↔ Пульс покоя</span>
                <Badge className="bg-blue-100 text-blue-800">Средняя -0.52</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Сон ↔ Восстановление</span>
                <Badge className="bg-purple-100 text-purple-800">Высокая +0.84</Badge>
              </div>

              <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-yellow-900 mb-2">💡 Рекомендация</h4>
                <p className="text-yellow-800 text-sm">
                  Увеличение активности положительно влияет на качество сна. 
                  Рекомендуем поддерживать текущий уровень активности.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SafeLongTermTrends;
