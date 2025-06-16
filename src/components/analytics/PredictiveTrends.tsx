
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, RefreshCw, TrendingUp, Sparkles, Zap } from 'lucide-react';
import { useAIPredictions, TrendPrediction } from '@/hooks/useAIPredictions';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import AIRecommendations from './AIRecommendations';

interface PredictiveTrendsProps {
  historicalData: any[];
  userProfile?: any;
}

const PredictiveTrends: React.FC<PredictiveTrendsProps> = ({ historicalData, userProfile }) => {
  const { loading, predictions, insights, aiAnalysis, generatePersonalizedAnalysis, generatePredictions } = useAIPredictions();
  const [selectedMetric, setSelectedMetric] = useState<'steps' | 'heartRate' | 'sleep'>('steps');
  const [activeTab, setActiveTab] = useState('predictions');

  useEffect(() => {
    if (historicalData.length > 0) {
      // Запускаем персонализированный анализ с профилем пользователя
      generatePersonalizedAnalysis(historicalData, userProfile);
    }
  }, [historicalData, userProfile]);

  const combinedData = React.useMemo(() => {
    const historical = historicalData.map(item => ({
      ...item,
      type: 'historical',
      formattedDate: format(parseISO(item.date), 'dd MMM', { locale: ru })
    }));

    const predicted = predictions.map(pred => ({
      date: pred.date,
      steps: pred.predictedSteps,
      heartRate: pred.predictedHeartRate,
      sleepHours: pred.predictedSleep,
      confidence: pred.confidence,
      type: 'predicted',
      formattedDate: format(parseISO(pred.date), 'dd MMM', { locale: ru })
    }));

    return [...historical, ...predicted].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [historicalData, predictions]);

  const chartConfig = {
    historical: {
      label: "Исторические данные",
      color: "#4A90E2",
    },
    predicted: {
      label: "Прогноз ИИ",
      color: "#9B59B6",
    },
    confidence: {
      label: "Доверительный интервал",
      color: "#E74C3C",
    }
  };

  const getMetricLabel = (metric: string) => {
    switch (metric) {
      case 'steps': return 'Шаги';
      case 'heartRate': return 'Пульс';
      case 'sleep': return 'Сон (часы)';
      default: return metric;
    }
  };

  const handleRunPersonalizedAnalysis = () => {
    generatePersonalizedAnalysis(historicalData, userProfile);
  };

  const handleApplyRecommendation = (recommendationId: string) => {
    // TODO: Implement recommendation application logic
    console.log('Applying recommendation:', recommendationId);
  };

  return (
    <div className="space-y-6">
      {/* Заголовок с новыми возможностями */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="w-6 h-6 text-purple-600" />
                <span>Персонализированный ИИ-анализ</span>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  Новое
                </Badge>
              </CardTitle>
              <CardDescription>
                Продвинутый анализ с персонализированными рекомендациями и прогнозированием
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={handleRunPersonalizedAnalysis}
                disabled={loading}
                variant="default"
                size="sm"
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Zap className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Анализ...' : 'Запустить ИИ-анализ'}
              </Button>
              <Button
                onClick={() => generatePredictions(historicalData)}
                disabled={loading}
                variant="outline"
                size="sm"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Обновить прогноз
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="predictions" className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Прогнозы</span>
          </TabsTrigger>
          <TabsTrigger value="ai-analysis" className="flex items-center space-x-2">
            <Brain className="w-4 h-4" />
            <span>ИИ-Анализ</span>
            {aiAnalysis && <Badge variant="secondary" className="ml-1">Готово</Badge>}
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4" />
            <span>Рекомендации</span>
            {aiAnalysis?.personalizedRecommendations.length && (
              <Badge variant="secondary" className="ml-1">
                {aiAnalysis.personalizedRecommendations.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="predictions">
          <div className="space-y-6">
            {/* Селектор метрик */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex space-x-2 mb-4">
                  {(['steps', 'heartRate', 'sleep'] as const).map((metric) => (
                    <Button
                      key={metric}
                      variant={selectedMetric === metric ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedMetric(metric)}
                    >
                      {getMetricLabel(metric)}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* График прогнозов */}
            <Card>
              <CardHeader>
                <CardTitle>Прогноз: {getMetricLabel(selectedMetric)}</CardTitle>
                <CardDescription>
                  Исторические данные и прогноз на 30 дней вперед
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={combinedData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="formattedDate" />
                      <YAxis />
                      <ChartTooltip 
                        content={<ChartTooltipContent />}
                        formatter={(value: any, name: string, props: any) => {
                          const item = props.payload;
                          if (item.type === 'predicted' && item.confidence) {
                            return [
                              `${value} (${Math.round(item.confidence * 100)}% точность)`,
                              name
                            ];
                          }
                          return [value, name];
                        }}
                      />
                      
                      <ReferenceLine 
                        x={historicalData.length > 0 ? format(parseISO(historicalData[historicalData.length - 1].date), 'dd MMM', { locale: ru }) : ''} 
                        stroke="#666" 
                        strokeDasharray="2 2"
                      />
                      
                      <Line
                        type="monotone"
                        dataKey={selectedMetric === 'sleep' ? 'sleepHours' : selectedMetric}
                        stroke={chartConfig.historical.color}
                        strokeWidth={2}
                        dot={(props: any) => {
                          const { payload } = props;
                          if (payload.type === 'historical') {
                            return <circle {...props} r={3} fill={chartConfig.historical.color} />;
                          }
                          return <circle {...props} r={3} fill={chartConfig.predicted.color} strokeDasharray="3 3" />;
                        }}
                        connectNulls={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Статистика прогнозов */}
            {predictions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Статистика прогноза</CardTitle>
                  <CardDescription>
                    Ключевые метрики прогнозируемого периода
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-600">
                        {Math.round(predictions.reduce((sum, p) => sum + p.predictedSteps, 0) / predictions.length).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Прогноз шагов/день</div>
                    </div>
                    
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-purple-600">
                        {Math.round(predictions.reduce((sum, p) => sum + p.predictedSleep, 0) / predictions.length * 10) / 10}ч
                      </div>
                      <div className="text-sm text-gray-600">Прогноз сна/день</div>
                    </div>
                    
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-600">
                        {Math.round(predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length * 100)}%
                      </div>
                      <div className="text-sm text-gray-600">Средняя точность</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="ai-analysis">
          <AIRecommendations 
            aiAnalysis={aiAnalysis}
            insights={insights}
            onApplyRecommendation={handleApplyRecommendation}
          />
        </TabsContent>

        <TabsContent value="recommendations">
          {aiAnalysis ? (
            <div className="space-y-4">
              {aiAnalysis.personalizedRecommendations.length > 0 ? (
                <AIRecommendations 
                  aiAnalysis={aiAnalysis}
                  insights={insights}
                  onApplyRecommendation={handleApplyRecommendation}
                />
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-400" />
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
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Brain className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Запустите ИИ-анализ
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Проведите персонализированный анализ для получения рекомендаций
                  </p>
                  <Button
                    onClick={handleRunPersonalizedAnalysis}
                    disabled={loading}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Zap className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    {loading ? 'Анализ...' : 'Запустить анализ'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PredictiveTrends;
