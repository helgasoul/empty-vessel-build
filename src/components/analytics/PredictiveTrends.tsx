
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart, ReferenceLine } from 'recharts';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, RefreshCw, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useAIPredictions, TrendPrediction, HealthInsight } from '@/hooks/useAIPredictions';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

interface PredictiveTrendsProps {
  historicalData: any[];
}

const PredictiveTrends: React.FC<PredictiveTrendsProps> = ({ historicalData }) => {
  const { loading, predictions, insights, generatePredictions } = useAIPredictions();
  const [selectedMetric, setSelectedMetric] = useState<'steps' | 'heartRate' | 'sleep'>('steps');

  useEffect(() => {
    if (historicalData.length > 0) {
      generatePredictions(historicalData);
    }
  }, [historicalData]);

  // Объединяем исторические и прогнозируемые данные
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

  const getInsightIcon = (type: HealthInsight['type']) => {
    switch (type) {
      case 'improvement': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'maintenance': return Clock;
      default: return CheckCircle;
    }
  };

  const getInsightColor = (type: HealthInsight['type']) => {
    switch (type) {
      case 'improvement': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-red-600 bg-red-50 border-red-200';
      case 'maintenance': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityBadge = (priority: HealthInsight['priority']) => {
    const variants = {
      high: 'destructive',
      medium: 'default',
      low: 'secondary'
    } as const;
    
    return variants[priority] || 'secondary';
  };

  return (
    <div className="space-y-6">
      {/* Заголовок и управление */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-600" />
                <span>Прогнозирование трендов ИИ</span>
              </CardTitle>
              <CardDescription>
                Анализ ваших данных и прогноз показателей здоровья на основе ИИ
              </CardDescription>
            </div>
            <Button
              onClick={() => generatePredictions(historicalData)}
              disabled={loading}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Анализ...' : 'Обновить прогноз'}
            </Button>
          </div>
        </CardHeader>
      </Card>

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
                
                {/* Вертикальная линия разделения исторических и прогнозируемых данных */}
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

      {/* ИИ Инсайты */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <span>Персонализированные рекомендации ИИ</span>
          </CardTitle>
          <CardDescription>
            Анализ ваших данных и рекомендации для улучшения здоровья
          </CardDescription>
        </CardHeader>
        <CardContent>
          {insights.length > 0 ? (
            <div className="space-y-4">
              {insights.map((insight, index) => {
                const Icon = getInsightIcon(insight.type);
                const colorClass = getInsightColor(insight.type);
                
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${colorClass}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Icon className="w-5 h-5" />
                        <h4 className="font-semibold">{insight.title}</h4>
                      </div>
                      <Badge variant={getPriorityBadge(insight.priority)}>
                        {insight.priority === 'high' ? 'Высокий' : 
                         insight.priority === 'medium' ? 'Средний' : 'Низкий'} приоритет
                      </Badge>
                    </div>
                    <p className="text-sm mb-2">{insight.description}</p>
                    <div className="text-sm font-medium">
                      💡 Рекомендация: {insight.recommendation}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Пока недостаточно данных для генерации персонализированных рекомендаций.</p>
              <p className="text-sm mt-2">Продолжайте отслеживать активность для получения инсайтов.</p>
            </div>
          )}
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
  );
};

export default PredictiveTrends;
