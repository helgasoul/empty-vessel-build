
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Brain, 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  ChevronDown,
  ChevronRight,
  Star,
  Activity,
  Heart,
  Moon,
  Utensils,
  Zap,
  User
} from 'lucide-react';
import { PersonalizedRecommendation, AIAnalysisResult, HealthInsight } from '@/hooks/useAIPredictions';

interface AIRecommendationsProps {
  aiAnalysis: AIAnalysisResult | null;
  insights: HealthInsight[];
  onApplyRecommendation?: (recommendationId: string) => void;
}

const AIRecommendations: React.FC<AIRecommendationsProps> = ({ 
  aiAnalysis, 
  insights, 
  onApplyRecommendation 
}) => {
  const [expandedRecommendations, setExpandedRecommendations] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState('overview');

  const toggleRecommendation = (id: string) => {
    const newExpanded = new Set(expandedRecommendations);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRecommendations(newExpanded);
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'critical': return <Badge variant="destructive">Критично</Badge>;
      case 'high': return <Badge variant="destructive">Высокая</Badge>;
      case 'medium': return <Badge variant="default">Средняя</Badge>;
      case 'low': return <Badge variant="secondary">Низкая</Badge>;
      default: return null;
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return <Badge variant="secondary" className="bg-green-100 text-green-800">Легко</Badge>;
      case 'moderate': return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Умеренно</Badge>;
      case 'hard': return <Badge variant="secondary" className="bg-red-100 text-red-800">Сложно</Badge>;
      default: return null;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'activity': return Activity;
      case 'sleep': return Moon;
      case 'nutrition': return Utensils;
      case 'stress': return Zap;
      case 'medical': return Heart;
      default: return Target;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'declining': return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />;
      case 'stable': return <div className="w-4 h-4 bg-gray-400 rounded-full"></div>;
      default: return null;
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'achievement': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'improvement': return TrendingUp;
      case 'maintenance': return Clock;
      default: return Target;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'achievement': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-red-600 bg-red-50 border-red-200';
      case 'improvement': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'maintenance': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (!aiAnalysis) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Brain className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              ИИ-анализ не проведен
            </h3>
            <p className="text-gray-600">
              Запустите персонализированный анализ для получения рекомендаций
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="recommendations">Рекомендации</TabsTrigger>
          <TabsTrigger value="insights">Инсайты</TabsTrigger>
          <TabsTrigger value="trends">Тренды</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {/* Общий показатель здоровья */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span>Показатель здоровья ИИ</span>
              </CardTitle>
              <CardDescription>
                Комплексная оценка на основе всех ваших данных
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getHealthScoreColor(aiAnalysis.healthScore)}`}>
                    {aiAnalysis.healthScore}
                  </div>
                  <div className="text-sm text-gray-600">из 100 баллов</div>
                </div>
                
                <Progress 
                  value={aiAnalysis.healthScore} 
                  className="h-3"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-600" />
                    <div className="text-sm font-medium">Активность</div>
                    <div className="flex items-center justify-center mt-1">
                      {getTrendIcon(aiAnalysis.trends.activity)}
                      <span className="ml-1 text-xs capitalize">{aiAnalysis.trends.activity}</span>
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Moon className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                    <div className="text-sm font-medium">Сон</div>
                    <div className="flex items-center justify-center mt-1">
                      {getTrendIcon(aiAnalysis.trends.sleep)}
                      <span className="ml-1 text-xs capitalize">{aiAnalysis.trends.sleep}</span>
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <Heart className="w-6 h-6 mx-auto mb-2 text-red-600" />
                    <div className="text-sm font-medium">Сердце</div>
                    <div className="flex items-center justify-center mt-1">
                      {getTrendIcon(aiAnalysis.trends.heart)}
                      <span className="ml-1 text-xs capitalize">{aiAnalysis.trends.heart}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Факторы риска и улучшения */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-red-600">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Факторы риска</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {aiAnalysis.riskFactors.length > 0 ? (
                  <ul className="space-y-2">
                    {aiAnalysis.riskFactors.map((risk, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm">{risk}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-600">Значительных факторов риска не выявлено</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-blue-600">
                  <Target className="w-5 h-5" />
                  <span>Области улучшения</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {aiAnalysis.improvements.length > 0 ? (
                  <ul className="space-y-2">
                    {aiAnalysis.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-600">Все основные показатели в норме</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations">
          <div className="space-y-4">
            {aiAnalysis.personalizedRecommendations.length > 0 ? (
              aiAnalysis.personalizedRecommendations.map((recommendation) => {
                const IconComponent = getCategoryIcon(recommendation.category);
                const isExpanded = expandedRecommendations.has(recommendation.id);
                
                return (
                  <Card key={recommendation.id} className="overflow-hidden">
                    <Collapsible 
                      open={isExpanded} 
                      onOpenChange={() => toggleRecommendation(recommendation.id)}
                    >
                      <CollapsibleTrigger asChild>
                        <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-primary/10 rounded-lg">
                                <IconComponent className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <CardTitle className="text-left">{recommendation.title}</CardTitle>
                                <div className="flex items-center space-x-2 mt-1">
                                  {getUrgencyBadge(recommendation.urgency)}
                                  {getDifficultyBadge(recommendation.difficulty)}
                                </div>
                              </div>
                            </div>
                            {isExpanded ? 
                              <ChevronDown className="w-5 h-5" /> : 
                              <ChevronRight className="w-5 h-5" />
                            }
                          </div>
                          <CardDescription className="text-left">
                            {recommendation.description}
                          </CardDescription>
                        </CardHeader>
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent>
                        <CardContent className="pt-0">
                          <div className="space-y-4">
                            <div className="p-4 bg-blue-50 rounded-lg">
                              <h4 className="font-medium text-blue-900 mb-2">Почему это важно?</h4>
                              <p className="text-sm text-blue-800">{recommendation.personalizedReason}</p>
                            </div>

                            <div>
                              <h4 className="font-medium mb-2">Ожидаемый результат:</h4>
                              <p className="text-sm text-gray-600">{recommendation.expectedOutcome}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                Результат виден через: {recommendation.timeToSeeResults}
                              </p>
                            </div>

                            <div>
                              <h4 className="font-medium mb-2">План действий:</h4>
                              <ol className="space-y-2">
                                {recommendation.steps.map((step, index) => (
                                  <li key={index} className="flex items-start space-x-2">
                                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                                      {index + 1}
                                    </span>
                                    <span className="text-sm">{step}</span>
                                  </li>
                                ))}
                              </ol>
                            </div>

                            <div>
                              <h4 className="font-medium mb-2">Метрики для отслеживания:</h4>
                              <div className="flex flex-wrap gap-2">
                                {recommendation.metrics.map((metric, index) => (
                                  <Badge key={index} variant="outline">{metric}</Badge>
                                ))}
                              </div>
                            </div>

                            <div className="flex space-x-2 pt-2">
                              <Button 
                                onClick={() => onApplyRecommendation?.(recommendation.id)}
                                className="flex-1"
                              >
                                Применить рекомендацию
                              </Button>
                              <Button variant="outline">
                                Напомнить позже
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                );
              })
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Target className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Рекомендации не найдены
                    </h3>
                    <p className="text-gray-600">
                      Ваши показатели в норме! Продолжайте поддерживать здоровый образ жизни.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="insights">
          <div className="space-y-4">
            {insights.length > 0 ? (
              insights
                .sort((a, b) => b.personalizedScore - a.personalizedScore)
                .map((insight, index) => {
                  const IconComponent = getInsightIcon(insight.type);
                  const colorClass = getInsightColor(insight.type);
                  
                  return (
                    <Card key={index} className={`border ${colorClass}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg`}>
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{insight.title}</h4>
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="text-xs">
                                  {insight.personalizedScore}% релевантность
                                </Badge>
                                <Badge variant={insight.priority === 'high' ? 'destructive' : 'secondary'}>
                                  {insight.priority === 'high' ? 'Высокий' : 
                                   insight.priority === 'medium' ? 'Средний' : 'Низкий'} приоритет
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm mb-2">{insight.description}</p>
                            <div className="text-sm font-medium mb-2">
                              💡 Рекомендация: {insight.recommendation}
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>Воздействие: {insight.impact}</span>
                              <span>Временные рамки: {insight.timeframe}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Brain className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Инсайты не найдены
                    </h3>
                    <p className="text-gray-600">
                      Недостаточно данных для генерации персонализированных инсайтов
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Анализ трендов</CardTitle>
              <CardDescription>
                Направление изменений ваших основных показателей здоровья
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 border rounded-lg">
                    <Activity className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                    <h3 className="font-medium mb-2">Физическая активность</h3>
                    <div className="flex items-center justify-center space-x-2">
                      {getTrendIcon(aiAnalysis.trends.activity)}
                      <span className="text-sm capitalize">{aiAnalysis.trends.activity}</span>
                    </div>
                  </div>

                  <div className="text-center p-6 border rounded-lg">
                    <Moon className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                    <h3 className="font-medium mb-2">Качество сна</h3>
                    <div className="flex items-center justify-center space-x-2">
                      {getTrendIcon(aiAnalysis.trends.sleep)}
                      <span className="text-sm capitalize">{aiAnalysis.trends.sleep}</span>
                    </div>
                  </div>

                  <div className="text-center p-6 border rounded-lg">
                    <Heart className="w-12 h-12 mx-auto mb-4 text-red-600" />
                    <h3 className="font-medium mb-2">Сердечно-сосудистая система</h3>
                    <div className="flex items-center justify-center space-x-2">
                      {getTrendIcon(aiAnalysis.trends.heart)}
                      <span className="text-sm capitalize">{aiAnalysis.trends.heart}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIRecommendations;
