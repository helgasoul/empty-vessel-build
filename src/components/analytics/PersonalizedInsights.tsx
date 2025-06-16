
import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Lightbulb, 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Activity,
  Heart,
  Moon,
  Footprints,
  Brain,
  Star,
  Zap,
  Sparkles
} from 'lucide-react';
import { useAIPredictions } from '@/hooks/useAIPredictions';

interface HealthMetrics {
  avgSteps: number;
  avgHeartRate: number;
  avgSleepHours: number;
  avgActiveMinutes: number;
  consistencyScore: number;
}

interface PersonalizedInsightsProps {
  metrics: HealthMetrics;
  userGoals: {
    dailySteps?: number;
    sleepHours?: number;
    activeMinutes?: number;
  };
  historicalData?: any[];
  userProfile?: any;
}

const PersonalizedInsights: React.FC<PersonalizedInsightsProps> = ({ 
  metrics, 
  userGoals,
  historicalData = [],
  userProfile
}) => {
  const { loading, insights, aiAnalysis, generatePersonalizedAnalysis } = useAIPredictions();

  // Генерируем базовые инсайты
  const basicInsights = useMemo(() => {
    const generated: Array<{
      id: string;
      type: 'achievement' | 'improvement' | 'warning' | 'goal';
      title: string;
      description: string;
      priority: 'high' | 'medium' | 'low';
      category: 'activity' | 'sleep' | 'heart' | 'overall';
      actionable: boolean;
      recommendations?: string[];
    }> = [];

    // Steps analysis
    if (userGoals.dailySteps) {
      const stepsProgress = (metrics.avgSteps / userGoals.dailySteps) * 100;
      if (stepsProgress >= 100) {
        generated.push({
          id: 'steps-achievement',
          type: 'achievement',
          title: 'Цель по шагам достигнута!',
          description: `Вы в среднем делаете ${metrics.avgSteps.toLocaleString()} шагов в день, превышая вашу цель.`,
          priority: 'high',
          category: 'activity',
          actionable: false
        });
      } else if (stepsProgress < 80) {
        generated.push({
          id: 'steps-improvement',
          type: 'improvement',
          title: 'Увеличьте ежедневную активность',
          description: `Вам не хватает ${(userGoals.dailySteps - metrics.avgSteps).toLocaleString()} шагов до цели.`,
          priority: 'medium',
          category: 'activity',
          actionable: true,
          recommendations: [
            'Попробуйте ходить пешком на одну остановку больше',
            'Делайте 5-минутные прогулки каждый час',
            'Используйте лестницу вместо лифта'
          ]
        });
      }
    }

    // Sleep analysis
    if (userGoals.sleepHours) {
      if (metrics.avgSleepHours < userGoals.sleepHours - 1) {
        generated.push({
          id: 'sleep-warning',
          type: 'warning',
          title: 'Недостаток сна',
          description: `Вы спите в среднем ${metrics.avgSleepHours.toFixed(1)} часов, что меньше рекомендуемых ${userGoals.sleepHours} часов.`,
          priority: 'high',
          category: 'sleep',
          actionable: true,
          recommendations: [
            'Установите регулярное время отхода ко сну',
            'Избегайте экранов за час до сна',
            'Создайте расслабляющую вечернюю рутину'
          ]
        });
      } else if (metrics.avgSleepHours >= userGoals.sleepHours) {
        generated.push({
          id: 'sleep-achievement',
          type: 'achievement',
          title: 'Отличный режим сна!',
          description: `Вы спите достаточно и поддерживаете здоровый режим.`,
          priority: 'medium',
          category: 'sleep',
          actionable: false
        });
      }
    }

    // Heart rate analysis
    if (metrics.avgHeartRate > 0) {
      if (metrics.avgHeartRate > 100) {
        generated.push({
          id: 'heart-rate-concern',
          type: 'warning',
          title: 'Повышенный пульс в покое',
          description: `Средний пульс ${metrics.avgHeartRate} ударов в минуту выше нормы.`,
          priority: 'high',
          category: 'heart',
          actionable: true,
          recommendations: [
            'Обратитесь к врачу для консультации',
            'Уменьшите потребление кофеина',
            'Практикуйте дыхательные упражнения'
          ]
        });
      } else if (metrics.avgHeartRate >= 60 && metrics.avgHeartRate <= 80) {
        generated.push({
          id: 'heart-rate-good',
          type: 'achievement',
          title: 'Здоровый пульс',
          description: `Ваш пульс в пределах нормы, что указывает на хорошее состояние сердечно-сосудистой системы.`,
          priority: 'low',
          category: 'heart',
          actionable: false
        });
      }
    }

    // Consistency analysis
    if (metrics.consistencyScore < 70) {
      generated.push({
        id: 'consistency-improvement',
        type: 'improvement',
        title: 'Улучшите постоянство',
        description: `Ваш показатель постоянства ${metrics.consistencyScore}%. Регулярность важна для достижения целей.`,
        priority: 'medium',
        category: 'overall',
        actionable: true,
        recommendations: [
          'Установите напоминания для активности',
          'Начните с малых, но постоянных целей',
          'Найдите партнера для совместных тренировок'
        ]
      });
    } else if (metrics.consistencyScore >= 90) {
      generated.push({
        id: 'consistency-achievement',
        type: 'achievement',
        title: 'Превосходная дисциплина!',
        description: `Показатель постоянства ${metrics.consistencyScore}% - вы очень дисциплинированы!`,
        priority: 'high',
        category: 'overall',
        actionable: false
      });
    }

    return generated.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }, [metrics, userGoals]);

  const getInsightIcon = (type: string, category: string) => {
    if (type === 'achievement') return CheckCircle;
    if (type === 'warning') return AlertTriangle;
    if (type === 'goal') return Target;
    
    switch (category) {
      case 'activity': return Activity;
      case 'sleep': return Moon;
      case 'heart': return Heart;
      default: return Lightbulb;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'achievement': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-red-600 bg-red-100';
      case 'improvement': return 'text-blue-600 bg-blue-100';
      case 'goal': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge variant="destructive">Высокий</Badge>;
      case 'medium': return <Badge variant="default">Средний</Badge>;
      case 'low': return <Badge variant="secondary">Низкий</Badge>;
      default: return null;
    }
  };

  const runAIAnalysis = () => {
    if (historicalData.length > 0) {
      generatePersonalizedAnalysis(historicalData, userProfile);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="ai-insights" className="flex items-center space-x-2">
            <Brain className="w-4 h-4" />
            <span>ИИ-Инсайты</span>
            {insights.length > 0 && <Badge variant="secondary">{insights.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="basic-insights">Базовые инсайты</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {/* Health Score Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span>Общий показатель здоровья</span>
                {aiAnalysis && (
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    ИИ: {aiAnalysis.healthScore} баллов
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                На основе ваших данных за последний период
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Постоянство активности</span>
                  <span className="text-sm text-gray-600">{metrics.consistencyScore}%</span>
                </div>
                <Progress value={metrics.consistencyScore} className="h-2" />
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <Footprints className="w-6 h-6 mx-auto mb-1 text-blue-600" />
                    <div className="text-sm font-medium">{metrics.avgSteps.toLocaleString()}</div>
                    <div className="text-xs text-gray-600">шагов/день</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <Heart className="w-6 h-6 mx-auto mb-1 text-red-600" />
                    <div className="text-sm font-medium">{metrics.avgHeartRate || '--'}</div>
                    <div className="text-xs text-gray-600">уд/мин</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <Moon className="w-6 h-6 mx-auto mb-1 text-purple-600" />
                    <div className="text-sm font-medium">{metrics.avgSleepHours.toFixed(1)}</div>
                    <div className="text-xs text-gray-600">часов сна</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <Activity className="w-6 h-6 mx-auto mb-1 text-green-600" />
                    <div className="text-sm font-medium">{metrics.avgActiveMinutes}</div>
                    <div className="text-xs text-gray-600">активных мин</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Analysis Promotion */}
          {!aiAnalysis && historicalData.length > 0 && (
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <CardContent className="pt-6">
                <div className="text-center py-4">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Получите персонализированные рекомендации ИИ
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Проведите комплексный анализ ваших данных и получите интеллектуальные рекомендации
                  </p>
                  <Button
                    onClick={runAIAnalysis}
                    disabled={loading}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Zap className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    {loading ? 'Анализ...' : 'Запустить ИИ-анализ'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="ai-insights">
          {insights.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-primary" />
                  <span>Персонализированные инсайты ИИ</span>
                </CardTitle>
                <CardDescription>
                  Рекомендации на основе продвинутого анализа ваших данных
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {insights
                    .sort((a, b) => b.personalizedScore - a.personalizedScore)
                    .map((insight, index) => {
                      const IconComponent = getInsightIcon(insight.type, insight.category);
                      const colorClass = getInsightColor(insight.type);
                      
                      return (
                        <div key={index} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <div className={`p-2 rounded-lg ${colorClass}`}>
                                <IconComponent className="w-5 h-5" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h4 className="font-medium">{insight.title}</h4>
                                  <Badge variant="outline" className="text-xs">
                                    {insight.personalizedScore}% релевантность
                                  </Badge>
                                  {getPriorityBadge(insight.priority)}
                                </div>
                                <p className="text-sm text-gray-600">{insight.description}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="ml-11 space-y-2">
                            <h5 className="text-sm font-medium text-gray-700">Рекомендация:</h5>
                            <p className="text-sm text-gray-600">{insight.recommendation}</p>
                            
                            <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                              <span>Воздействие: {insight.impact}</span>
                              <span>Временные рамки: {insight.timeframe}</span>
                            </div>
                            
                            {insight.actionable && (
                              <Button size="sm" variant="outline" className="mt-2">
                                Применить рекомендацию
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  }
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Brain className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Запустите ИИ-анализ
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Проведите персонализированный анализ для получения инсайтов
                  </p>
                  <Button
                    onClick={runAIAnalysis}
                    disabled={loading || historicalData.length === 0}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Zap className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    {loading ? 'Анализ...' : 'Запустить анализ'}
                  </Button>
                  {historicalData.length === 0 && (
                    <p className="text-xs text-gray-500 mt-2">
                      Недостаточно данных для анализа
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="basic-insights">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="w-5 h-5 text-primary" />
                <span>Базовые инсайты</span>
              </CardTitle>
              <CardDescription>
                Рекомендации на основе анализа ваших данных
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {basicInsights.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Brain className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>Недостаточно данных для анализа</p>
                    <p className="text-sm">Продолжайте отслеживать свою активность для получения инсайтов</p>
                  </div>
                ) : (
                  basicInsights.map((insight) => {
                    const IconComponent = getInsightIcon(insight.type, insight.category);
                    const colorClass = getInsightColor(insight.type);
                    
                    return (
                      <div key={insight.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg ${colorClass}`}>
                              <IconComponent className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-medium">{insight.title}</h4>
                                {getPriorityBadge(insight.priority)}
                              </div>
                              <p className="text-sm text-gray-600">{insight.description}</p>
                            </div>
                          </div>
                        </div>
                        
                        {insight.recommendations && insight.recommendations.length > 0 && (
                          <div className="ml-11 space-y-2">
                            <h5 className="text-sm font-medium text-gray-700">Рекомендации:</h5>
                            <ul className="space-y-1">
                              {insight.recommendations.map((rec, index) => (
                                <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                                  <span className="text-primary">•</span>
                                  <span>{rec}</span>
                                </li>
                              ))}
                            </ul>
                            {insight.actionable && (
                              <Button size="sm" variant="outline" className="mt-2">
                                Применить рекомендацию
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PersonalizedInsights;
