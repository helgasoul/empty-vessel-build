
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Target, Award, Calendar, Activity } from "lucide-react";

interface ProgressItem {
  id: string;
  title: string;
  description: string;
  current: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  trendPercentage?: number;
  color: string;
  icon: React.ComponentType<any>;
}

const ProgressIndicators = () => {
  const progressItems: ProgressItem[] = [
    {
      id: 'daily-steps',
      title: 'Дневные шаги',
      description: 'Цель: 10,000 шагов',
      current: 7850,
      target: 10000,
      unit: 'шагов',
      trend: 'up',
      trendPercentage: 12,
      color: 'bg-blue-500',
      icon: Activity,
    },
    {
      id: 'weekly-workouts',
      title: 'Тренировки в неделю',
      description: 'Цель: 4 тренировки',
      current: 3,
      target: 4,
      unit: 'тренировок',
      trend: 'stable',
      color: 'bg-green-500',
      icon: Target,
    },
    {
      id: 'health-habits',
      title: 'Здоровые привычки',
      description: 'Выполнено сегодня',
      current: 5,
      target: 7,
      unit: 'привычек',
      trend: 'up',
      trendPercentage: 8,
      color: 'bg-purple-500',
      icon: Award,
    },
    {
      id: 'medical-checkups',
      title: 'Медосмотры',
      description: 'Пройдено в этом году',
      current: 2,
      target: 4,
      unit: 'осмотра',
      trend: 'down',
      trendPercentage: 5,
      color: 'bg-pink-500',
      icon: Calendar,
    },
  ];

  const calculatePercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    if (percentage >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-3 h-3 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-3 h-3 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <Card className="prevent-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 font-montserrat">
          <Target className="w-5 h-5 text-primary" />
          <span>Прогресс по целям</span>
        </CardTitle>
        <CardDescription className="font-roboto">
          Ваши достижения за сегодня и эту неделю
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {progressItems.map((item) => {
            const percentage = calculatePercentage(item.current, item.target);
            const Icon = item.icon;
            
            return (
              <div key={item.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.color.replace('bg-', 'bg-').replace('-500', '-100')}`}>
                      <Icon className={`w-5 h-5 ${item.color.replace('bg-', 'text-')}`} />
                    </div>
                    <div>
                      <h4 className="font-medium font-montserrat text-gray-900">{item.title}</h4>
                      <p className="text-sm text-gray-600 font-roboto">{item.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold font-montserrat text-gray-900">
                        {item.current.toLocaleString('ru-RU')}
                      </span>
                      <span className="text-sm text-gray-500">/ {item.target.toLocaleString('ru-RU')}</span>
                      {item.trendPercentage && (
                        <div className="flex items-center space-x-1">
                          {getTrendIcon(item.trend)}
                          <span className={`text-xs font-medium ${
                            item.trend === 'up' ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {item.trendPercentage}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{Math.round(percentage)}% выполнено</span>
                    <Badge 
                      variant={percentage >= 80 ? "default" : percentage >= 50 ? "secondary" : "destructive"}
                      className="text-xs"
                    >
                      {percentage >= 100 ? 'Выполнено' : 
                       percentage >= 80 ? 'Почти готово' :
                       percentage >= 50 ? 'В процессе' : 'Требует внимания'}
                    </Badge>
                  </div>
                  <div className="relative">
                    <Progress 
                      value={percentage} 
                      className="h-2"
                    />
                    <div 
                      className={`absolute top-0 left-0 h-2 rounded-full transition-all duration-300 ${getProgressColor(percentage)}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Award className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium font-montserrat text-gray-900">Мотивация дня</h4>
              <p className="text-sm text-gray-600 font-roboto">
                Отличная работа! Вы на правильном пути к достижению ваших целей здоровья.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressIndicators;
