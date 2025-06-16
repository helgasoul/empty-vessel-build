
import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, Activity, Heart, Moon, Footprints } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { format, subDays, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

interface HealthDataPoint {
  date: string;
  steps: number;
  heartRate: number;
  sleepHours: number;
  activeMinutes: number;
  caloriesBurned?: number;
  stressLevel?: number;
}

interface HealthTrendsProps {
  data: HealthDataPoint[];
  timeRange: '7d' | '30d' | '90d';
}

const HealthTrends: React.FC<HealthTrendsProps> = ({ data, timeRange }) => {
  const chartConfig = {
    steps: {
      label: "Шаги",
      color: "#4A90E2",
    },
    heartRate: {
      label: "Пульс",
      color: "#E74C3C",
    },
    sleepHours: {
      label: "Сон (часы)",
      color: "#9B59B6",
    },
    activeMinutes: {
      label: "Активность (мин)",
      color: "#27AE60",
    },
    caloriesBurned: {
      label: "Калории",
      color: "#F39C12",
    },
    stressLevel: {
      label: "Стресс",
      color: "#E67E22",
    }
  };

  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      formattedDate: format(parseISO(item.date), 'dd MMM', { locale: ru }),
      fullDate: format(parseISO(item.date), 'dd MMMM yyyy', { locale: ru })
    }));
  }, [data]);

  const calculateTrend = (values: number[]) => {
    if (values.length < 2) return { direction: 'stable', percentage: 0 };
    
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    
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
      steps: calculateTrend(data.map(d => d.steps)),
      heartRate: calculateTrend(data.map(d => d.heartRate)),
      sleepHours: calculateTrend(data.map(d => d.sleepHours)),
      activeMinutes: calculateTrend(data.map(d => d.activeMinutes))
    };
  }, [data]);

  const TrendIndicator = ({ trend, label, icon: Icon, color }: any) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-2">
        <Icon className={`w-5 h-5 text-${color}`} />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-center space-x-1">
        {trend.direction === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
        {trend.direction === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
        {trend.direction === 'stable' && <span className="w-4 h-4 text-gray-400">→</span>}
        <Badge variant={trend.direction === 'up' ? 'default' : trend.direction === 'down' ? 'destructive' : 'secondary'}>
          {trend.percentage.toFixed(1)}%
        </Badge>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Trends Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Тренды за {timeRange === '7d' ? '7 дней' : timeRange === '30d' ? '30 дней' : '90 дней'}</CardTitle>
          <CardDescription>
            Изменения ключевых показателей здоровья
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <TrendIndicator 
              trend={trends.steps} 
              label="Шаги" 
              icon={Footprints} 
              color="blue-500" 
            />
            <TrendIndicator 
              trend={trends.heartRate} 
              label="Пульс" 
              icon={Heart} 
              color="red-500" 
            />
            <TrendIndicator 
              trend={trends.sleepHours} 
              label="Сон" 
              icon={Moon} 
              color="purple-500" 
            />
            <TrendIndicator 
              trend={trends.activeMinutes} 
              label="Активность" 
              icon={Activity} 
              color="green-500" 
            />
          </div>
        </CardContent>
      </Card>

      {/* Steps Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Динамика шагов</CardTitle>
          <CardDescription>Ежедневная активность и тренды</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={processedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="formattedDate" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area 
                  type="monotone" 
                  dataKey="steps" 
                  stroke={chartConfig.steps.color}
                  fill={chartConfig.steps.color}
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Heart Rate Monitoring */}
      <Card>
        <CardHeader>
          <CardTitle>Мониторинг пульса</CardTitle>
          <CardDescription>Изменения частоты сердечных сокращений</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={processedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="formattedDate" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="heartRate" 
                  stroke={chartConfig.heartRate.color}
                  strokeWidth={2}
                  dot={{ fill: chartConfig.heartRate.color, strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Sleep and Activity Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Сон и активность</CardTitle>
          <CardDescription>Корреляция между сном и уровнем активности</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={processedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="formattedDate" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="sleepHours" fill={chartConfig.sleepHours.color} />
                <Bar dataKey="activeMinutes" fill={chartConfig.activeMinutes.color} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthTrends;
