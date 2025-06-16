
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Brain, Target, Calendar, Download, Sparkles } from "lucide-react";
import HealthTrends from './HealthTrends';
import PersonalizedInsights from './PersonalizedInsights';
import InteractiveDashboard from './InteractiveDashboard';
import PredictiveTrends from './PredictiveTrends';
import AgeGroupComparison from './AgeGroupComparison';
import { useHealthData } from '@/hooks/useHealthData';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const AdvancedHealthAnalytics = () => {
  const { user } = useAuth();
  const { healthData, dailySummary, loading } = useHealthData();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Получаем возраст пользователя (в реальном приложении это должно быть из профиля)
  const userAge = 30; // Здесь должны быть данные из профиля пользователя

  // Process health data for analytics
  const analyticsData = useMemo(() => {
    if (!healthData || healthData.length === 0) return [];

    // Group data by date
    const groupedData = healthData.reduce((acc, point) => {
      const date = point.recorded_at.split('T')[0];
      if (!acc[date]) {
        acc[date] = {
          date,
          steps: 0,
          heartRate: 0,
          sleepHours: 0,
          activeMinutes: 0,
          caloriesBurned: 0,
          heartRateCount: 0
        };
      }

      switch (point.data_type) {
        case 'steps':
          acc[date].steps += point.data_value || 0;
          break;
        case 'heart_rate':
          acc[date].heartRate += point.data_value || 0;
          acc[date].heartRateCount++;
          break;
        case 'sleep':
          acc[date].sleepHours += point.data_value || 0;
          break;
        case 'active_minutes':
          acc[date].activeMinutes += point.data_value || 0;
          break;
        case 'calories':
          acc[date].caloriesBurned += point.data_value || 0;
          break;
      }

      return acc;
    }, {} as Record<string, any>);

    // Convert to array and calculate averages
    return Object.values(groupedData).map((day: any) => ({
      ...day,
      heartRate: day.heartRateCount > 0 ? Math.round(day.heartRate / day.heartRateCount) : 0
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [healthData]);

  // Calculate health metrics
  const healthMetrics = useMemo(() => {
    if (analyticsData.length === 0) {
      return {
        avgSteps: 0,
        avgHeartRate: 0,
        avgSleepHours: 0,
        avgActiveMinutes: 0,
        consistencyScore: 0
      };
    }

    const totalDays = analyticsData.length;
    const avgSteps = analyticsData.reduce((sum, day) => sum + day.steps, 0) / totalDays;
    const avgHeartRate = analyticsData.reduce((sum, day) => sum + day.heartRate, 0) / totalDays;
    const avgSleepHours = analyticsData.reduce((sum, day) => sum + day.sleepHours, 0) / totalDays;
    const avgActiveMinutes = analyticsData.reduce((sum, day) => sum + day.activeMinutes, 0) / totalDays;

    // Calculate consistency score (percentage of days with activity > 0)
    const activeDays = analyticsData.filter(day => day.steps > 1000 || day.activeMinutes > 10).length;
    const consistencyScore = (activeDays / totalDays) * 100;

    return {
      avgSteps: Math.round(avgSteps),
      avgHeartRate: Math.round(avgHeartRate),
      avgSleepHours: Math.round(avgSleepHours * 10) / 10,
      avgActiveMinutes: Math.round(avgActiveMinutes),
      consistencyScore: Math.round(consistencyScore)
    };
  }, [analyticsData]);

  // User goals (these would typically come from user preferences)
  const userGoals = {
    dailySteps: 10000,
    sleepHours: 8,
    activeMinutes: 30
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Загрузка аналитики...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with new features highlight */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="w-6 h-6 text-purple-600" />
                <span>Новая расширенная аналитика</span>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  ИИ-прогнозы
                </Badge>
              </CardTitle>
              <CardDescription>
                Интерактивные дашборды, прогнозирование трендов, сравнение с возрастными нормами и экспорт отчетов
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Analytics Content */}
      {analyticsData.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Недостаточно данных для аналитики
              </h3>
              <p className="text-gray-600">
                Подключите устройства и начните отслеживать активность для получения детальной аналитики
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Дашборд</span>
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Тренды</span>
            </TabsTrigger>
            <TabsTrigger value="predictions" className="flex items-center space-x-2">
              <Brain className="w-4 h-4" />
              <span>ИИ-прогнозы</span>
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Сравнение</span>
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Цели</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <InteractiveDashboard 
              healthData={analyticsData}
              userAge={userAge}
            />
          </TabsContent>

          <TabsContent value="trends">
            <HealthTrends 
              data={analyticsData} 
              timeRange="30d"
            />
          </TabsContent>

          <TabsContent value="predictions">
            <PredictiveTrends historicalData={analyticsData} />
          </TabsContent>

          <TabsContent value="comparison">
            <AgeGroupComparison 
              userMetrics={healthMetrics} 
              userAge={userAge} 
            />
          </TabsContent>

          <TabsContent value="goals">
            <div className="space-y-6">
              {/* Goals Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>Прогресс по целям</CardTitle>
                  <CardDescription>
                    Ваши достижения за последний месяц
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Steps Goal */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Ежедневные шаги</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">
                            {healthMetrics.avgSteps.toLocaleString()} / {userGoals.dailySteps.toLocaleString()}
                          </span>
                          <Badge variant={healthMetrics.avgSteps >= userGoals.dailySteps ? "default" : "secondary"}>
                            {Math.round((healthMetrics.avgSteps / userGoals.dailySteps) * 100)}%
                          </Badge>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${Math.min((healthMetrics.avgSteps / userGoals.dailySteps) * 100, 100)}%`
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Sleep Goal */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Сон</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">
                            {healthMetrics.avgSleepHours}ч / {userGoals.sleepHours}ч
                          </span>
                          <Badge variant={healthMetrics.avgSleepHours >= userGoals.sleepHours ? "default" : "secondary"}>
                            {Math.round((healthMetrics.avgSleepHours / userGoals.sleepHours) * 100)}%
                          </Badge>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${Math.min((healthMetrics.avgSleepHours / userGoals.sleepHours) * 100, 100)}%`
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Active Minutes Goal */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Активные минуты</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">
                            {healthMetrics.avgActiveMinutes}мин / {userGoals.activeMinutes}мин
                          </span>
                          <Badge variant={healthMetrics.avgActiveMinutes >= userGoals.activeMinutes ? "default" : "secondary"}>
                            {Math.round((healthMetrics.avgActiveMinutes / userGoals.activeMinutes) * 100)}%
                          </Badge>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${Math.min((healthMetrics.avgActiveMinutes / userGoals.activeMinutes) * 100, 100)}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Personalized Insights */}
              <PersonalizedInsights 
                metrics={healthMetrics} 
                userGoals={userGoals}
              />
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default AdvancedHealthAnalytics;
