import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Badge } from "@/components/ui/badge";
import { Users, Target, TrendingUp, TrendingDown } from 'lucide-react';

interface AgeGroupData {
  ageGroup: string;
  avgSteps: number;
  avgSleep: number;
  avgHeartRate: number;
  avgActiveMinutes: number;
}

interface UserMetrics {
  avgSteps: number;
  avgSleepHours: number; // Changed from avgSleep to avgSleepHours
  avgHeartRate: number;
  avgActiveMinutes: number;
}

interface AgeGroupComparisonProps {
  userMetrics: UserMetrics;
  userAge: number;
}

const AgeGroupComparison: React.FC<AgeGroupComparisonProps> = ({ userMetrics, userAge }) => {
  // Референсные данные по возрастным группам (на основе исследований)
  const ageGroupNorms: AgeGroupData[] = [
    { ageGroup: '18-24', avgSteps: 10500, avgSleep: 7.8, avgHeartRate: 68, avgActiveMinutes: 45 },
    { ageGroup: '25-34', avgSteps: 9800, avgSleep: 7.5, avgHeartRate: 70, avgActiveMinutes: 42 },
    { ageGroup: '35-44', avgSteps: 9200, avgSleep: 7.2, avgHeartRate: 72, avgActiveMinutes: 38 },
    { ageGroup: '45-54', avgSteps: 8600, avgSleep: 7.0, avgHeartRate: 74, avgActiveMinutes: 35 },
    { ageGroup: '55-64', avgSteps: 7900, avgSleep: 6.8, avgHeartRate: 76, avgActiveMinutes: 32 },
    { ageGroup: '65+', avgSteps: 7200, avgSleep: 6.5, avgHeartRate: 78, avgActiveMinutes: 28 }
  ];

  const userAgeGroup = useMemo(() => {
    if (userAge >= 18 && userAge <= 24) return '18-24';
    if (userAge >= 25 && userAge <= 34) return '25-34';
    if (userAge >= 35 && userAge <= 44) return '35-44';
    if (userAge >= 45 && userAge <= 54) return '45-54';
    if (userAge >= 55 && userAge <= 64) return '55-64';
    return '65+';
  }, [userAge]);

  const currentAgeGroupNorm = useMemo(() => {
    return ageGroupNorms.find(group => group.ageGroup === userAgeGroup) || ageGroupNorms[1];
  }, [userAgeGroup]);

  // Данные для радарного графика
  const radarData = useMemo(() => {
    const normalizeValue = (userValue: number, normValue: number, maxValue: number) => {
      return (userValue / maxValue) * 100;
    };

    return [
      {
        metric: 'Шаги',
        user: normalizeValue(userMetrics.avgSteps, currentAgeGroupNorm.avgSteps, 15000),
        norm: normalizeValue(currentAgeGroupNorm.avgSteps, currentAgeGroupNorm.avgSteps, 15000),
        fullMark: 100
      },
      {
        metric: 'Сон',
        user: normalizeValue(userMetrics.avgSleepHours, currentAgeGroupNorm.avgSleep, 10), // Use avgSleepHours here
        norm: normalizeValue(currentAgeGroupNorm.avgSleep, currentAgeGroupNorm.avgSleep, 10),
        fullMark: 100
      },
      {
        metric: 'Пульс',
        user: normalizeValue(100 - userMetrics.avgHeartRate, 100 - currentAgeGroupNorm.avgHeartRate, 50),
        norm: normalizeValue(100 - currentAgeGroupNorm.avgHeartRate, 100 - currentAgeGroupNorm.avgHeartRate, 50),
        fullMark: 100
      },
      {
        metric: 'Активность',
        user: normalizeValue(userMetrics.avgActiveMinutes, currentAgeGroupNorm.avgActiveMinutes, 60),
        norm: normalizeValue(currentAgeGroupNorm.avgActiveMinutes, currentAgeGroupNorm.avgActiveMinutes, 60),
        fullMark: 100
      }
    ];
  }, [userMetrics, currentAgeGroupNorm]);

  // Сравнение с нормами
  const comparisons = useMemo(() => {
    return [
      {
        metric: 'Шаги',
        userValue: userMetrics.avgSteps,
        normValue: currentAgeGroupNorm.avgSteps,
        unit: '',
        icon: Target
      },
      {
        metric: 'Сон',
        userValue: userMetrics.avgSleepHours, // Use avgSleepHours here
        normValue: currentAgeGroupNorm.avgSleep,
        unit: 'ч',
        icon: Target
      },
      {
        metric: 'Пульс',
        userValue: userMetrics.avgHeartRate,
        normValue: currentAgeGroupNorm.avgHeartRate,
        unit: 'bpm',
        icon: Target
      },
      {
        metric: 'Активность',
        userValue: userMetrics.avgActiveMinutes,
        normValue: currentAgeGroupNorm.avgActiveMinutes,
        unit: 'мин',
        icon: Target
      }
    ];
  }, [userMetrics, currentAgeGroupNorm]);

  const chartConfig = {
    user: {
      label: "Ваши показатели",
      color: "#4A90E2",
    },
    norm: {
      label: "Норма для возраста",
      color: "#E74C3C",
    }
  };

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-primary" />
            <span>Сравнение с возрастной группой {userAgeGroup}</span>
          </CardTitle>
          <CardDescription>
            Сравнение ваших показателей с нормами для женщин вашего возраста
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Радарный график */}
      <Card>
        <CardHeader>
          <CardTitle>Общий профиль показателей</CardTitle>
          <CardDescription>
            Визуальное сравнение всех метрик здоровья
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis 
                  angle={60} 
                  domain={[0, 100]} 
                  tick={false}
                />
                <Radar
                  name="Ваши показатели"
                  dataKey="user"
                  stroke={chartConfig.user.color}
                  fill={chartConfig.user.color}
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Radar
                  name="Норма для возраста"
                  dataKey="norm"
                  stroke={chartConfig.norm.color}
                  fill={chartConfig.norm.color}
                  fillOpacity={0.1}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
                <ChartTooltip content={<ChartTooltipContent />} />
              </RadarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Детальное сравнение */}
      <Card>
        <CardHeader>
          <CardTitle>Детальное сравнение показателей</CardTitle>
          <CardDescription>
            Подробный анализ каждого показателя
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {comparisons.map((comparison, index) => {
              const difference = comparison.userValue - comparison.normValue;
              const percentageDiff = ((difference / comparison.normValue) * 100);
              const isAboveNorm = difference > 0;
              const isSignificantDiff = Math.abs(percentageDiff) > 10;

              return (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <comparison.icon className="w-4 h-4 text-gray-600" />
                      <span className="font-medium">{comparison.metric}</span>
                    </div>
                    <Badge 
                      variant={isSignificantDiff ? (isAboveNorm ? "default" : "destructive") : "secondary"}
                      className="flex items-center space-x-1"
                    >
                      {isAboveNorm ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      <span>{Math.abs(percentageDiff).toFixed(1)}%</span>
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Ваш результат:</span>
                      <span className="font-medium">
                        {comparison.userValue.toLocaleString()} {comparison.unit}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Норма для возраста:</span>
                      <span className="font-medium">
                        {comparison.normValue.toLocaleString()} {comparison.unit}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Разница:</span>
                      <span className={`font-medium ${isAboveNorm ? 'text-green-600' : 'text-red-600'}`}>
                        {isAboveNorm ? '+' : ''}{difference.toFixed(1)} {comparison.unit}
                      </span>
                    </div>
                  </div>

                  {/* Визуальная шкала */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Ниже нормы</span>
                      <span>Норма</span>
                      <span>Выше нормы</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          isAboveNorm ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        style={{ 
                          width: `${Math.min(100, Math.max(10, 50 + (percentageDiff / 2)))}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Сравнение по всем возрастным группам */}
      <Card>
        <CardHeader>
          <CardTitle>Нормы по всем возрастным группам</CardTitle>
          <CardDescription>
            Как показатели меняются с возрастом
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageGroupNorms}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ageGroup" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey="avgSteps" 
                  fill="#4A90E2" 
                  name="Средние шаги"
                  opacity={0.8}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgeGroupComparison;
