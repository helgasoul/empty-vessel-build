
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Brain, Target, Sparkles, Zap, CalendarDays, FileText } from "lucide-react";
import HealthTrends from './HealthTrends';
import PersonalizedInsights from './PersonalizedInsights';
import InteractiveDashboard from './InteractiveDashboard';
import PredictiveTrends from './PredictiveTrends';
import AgeGroupComparison from './AgeGroupComparison';
import CorrelationAnalysis from './CorrelationAnalysis';
import LongTermTrends from './LongTermTrends';
import MedicalDataExport from './MedicalDataExport';
import { useHealthData } from '@/hooks/useHealthData';
import { useAuth } from '@/contexts/AuthContext';

const AdvancedHealthAnalytics = () => {
  const { user } = useAuth();
  const { healthData, loading } = useHealthData();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Получаем возраст пользователя (в реальном приложении это должно быть из профиля)
  const userAge = 30; // Здесь должны быть данные из профиля пользователя

  // Создаем профиль пользователя для ИИ-анализа
  const userProfile = useMemo(() => ({
    age: userAge,
    goals: {
      dailySteps: 10000,
      sleepHours: 8,
      activeMinutes: 30
    },
    preferences: {
      fitnessLevel: 'moderate',
      healthFocus: ['cardiovascular', 'sleep', 'weight_management']
    }
  }), [userAge]);

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
      {/* Header with AI features highlight */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="w-6 h-6 text-purple-600" />
                <span>Расширенная аналитика с ИИ</span>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  Персонализированно
                </Badge>
              </CardTitle>
              <CardDescription>
                ИИ-анализ, прогнозирование трендов, корреляционный анализ, долгосрочные тренды и медицинский экспорт
              </CardDescription>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{analyticsData.length}</div>
                <div className="text-xs text-gray-600">дней данных</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{healthMetrics.consistencyScore}%</div>
                <div className="text-xs text-gray-600">постоянство</div>
              </div>
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
                Подключите устройства и начните отслеживать активность для получения детальной аналитики и ИИ-рекомендаций
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="dashboard" className="flex items-center space-x-1">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Дашборд</span>
            </TabsTrigger>
            <TabsTrigger value="correlations" className="flex items-center space-x-1">
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline">Корреляции</span>
              <Badge variant="secondary" className="ml-1 bg-green-100 text-green-800 hidden lg:inline">Новое</Badge>
            </TabsTrigger>
            <TabsTrigger value="long-term" className="flex items-center space-x-1">
              <CalendarDays className="w-4 h-4" />
              <span className="hidden sm:inline">Тренды</span>
              <Badge variant="secondary" className="ml-1 bg-blue-100 text-blue-800 hidden lg:inline">Новое</Badge>
            </TabsTrigger>
            <TabsTrigger value="ai-analysis" className="flex items-center space-x-1">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">ИИ-Анализ</span>
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex items-center space-x-1">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Сравнение</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center space-x-1">
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Инсайты</span>
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center space-x-1">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Экспорт</span>
              <Badge variant="secondary" className="ml-1 bg-red-100 text-red-800 hidden lg:inline">Новое</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <InteractiveDashboard 
              healthData={analyticsData}
              userAge={userAge}
            />
          </TabsContent>

          <TabsContent value="correlations">
            <CorrelationAnalysis />
          </TabsContent>

          <TabsContent value="long-term">
            <LongTermTrends />
          </TabsContent>

          <TabsContent value="ai-analysis">
            <PredictiveTrends 
              historicalData={analyticsData} 
              userProfile={userProfile}
            />
          </TabsContent>

          <TabsContent value="comparison">
            <AgeGroupComparison 
              userMetrics={healthMetrics} 
              userAge={userAge} 
            />
          </TabsContent>

          <TabsContent value="insights">
            <PersonalizedInsights 
              metrics={healthMetrics} 
              userGoals={userGoals}
              historicalData={analyticsData}
              userProfile={userProfile}
            />
          </TabsContent>

          <TabsContent value="export">
            <MedicalDataExport />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default AdvancedHealthAnalytics;
