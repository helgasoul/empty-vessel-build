
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Brain, TrendingUp, AlertTriangle, Calendar, Target, Sparkles } from "lucide-react";
import { useSymptomMoodLog } from "@/hooks/useSymptomMoodLog";
import { useMenstrualCycle } from "@/hooks/useMenstrualCycle";
import { useHealthData } from "@/hooks/useHealthData";
import { format, addDays, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

interface SymptomPrediction {
  symptom: string;
  probability: number;
  expectedDate: string;
  severity: 'low' | 'medium' | 'high';
  confidence: number;
  triggerFactors: string[];
  preventionTips: string[];
}

interface MoodPrediction {
  date: string;
  predictedMood: number;
  confidence: number;
  factors: string[];
}

interface PredictiveInsight {
  type: 'symptom' | 'mood' | 'cycle' | 'wellness';
  title: string;
  description: string;
  likelihood: number;
  timeframe: string;
  actionable: boolean;
  recommendations: string[];
}

const PredictiveSymptomAnalysis = () => {
  const [symptomPredictions, setSymptomPredictions] = useState<SymptomPrediction[]>([]);
  const [moodPredictions, setMoodPredictions] = useState<MoodPrediction[]>([]);
  const [insights, setInsights] = useState<PredictiveInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('predictions');

  const { logs } = useSymptomMoodLog();
  const { cycles } = useMenstrualCycle();
  const { dailySummary } = useHealthData();

  const analyzeSymptomPatterns = () => {
    if (logs.length < 10) return [];

    // Анализ паттернов симптомов по дням цикла
    const symptomsByDay: { [day: number]: string[] } = {};
    const moodByDay: { [day: number]: number[] } = {};

    logs.forEach(log => {
      const logDate = new Date(log.log_date);
      const cycle = cycles.find(c => {
        const cycleStart = new Date(c.cycle_start_date);
        const cycleEnd = c.cycle_end_date ? new Date(c.cycle_end_date) : addDays(cycleStart, c.cycle_length || 28);
        return logDate >= cycleStart && logDate <= cycleEnd;
      });

      if (cycle) {
        const cycleStart = new Date(cycle.cycle_start_date);
        const dayOfCycle = Math.floor((logDate.getTime() - cycleStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        
        if (log.symptoms) {
          if (!symptomsByDay[dayOfCycle]) symptomsByDay[dayOfCycle] = [];
          symptomsByDay[dayOfCycle].push(...log.symptoms);
        }

        if (log.mood_rating) {
          if (!moodByDay[dayOfCycle]) moodByDay[dayOfCycle] = [];
          moodByDay[dayOfCycle].push(log.mood_rating);
        }
      }
    });

    // Создаем предсказания на основе паттернов
    const predictions: SymptomPrediction[] = [];
    const commonSymptoms = ['Головная боль', 'Боль в животе', 'Раздражительность', 'Усталость', 'Тошнота'];

    commonSymptoms.forEach(symptom => {
      const occurrences: number[] = [];
      Object.entries(symptomsByDay).forEach(([day, symptoms]) => {
        if (symptoms.includes(symptom)) {
          occurrences.push(parseInt(day));
        }
      });

      if (occurrences.length >= 2) {
        const avgDay = occurrences.reduce((sum, day) => sum + day, 0) / occurrences.length;
        const probability = (occurrences.length / Object.keys(symptomsByDay).length) * 100;
        
        // Предсказываем следующее появление симптома
        const currentCycle = cycles[0];
        if (currentCycle) {
          const cycleStart = new Date(currentCycle.cycle_start_date);
          const predictedDate = addDays(cycleStart, Math.round(avgDay) - 1);
          
          predictions.push({
            symptom,
            probability: Math.round(probability),
            expectedDate: predictedDate.toISOString(),
            severity: probability > 70 ? 'high' : probability > 40 ? 'medium' : 'low',
            confidence: Math.min(90, occurrences.length * 20),
            triggerFactors: [`День ${Math.round(avgDay)} цикла`, 'Гормональные изменения'],
            preventionTips: getPreventionTips(symptom)
          });
        }
      }
    });

    return predictions.sort((a, b) => b.probability - a.probability).slice(0, 5);
  };

  const getPreventionTips = (symptom: string): string[] => {
    const tips: { [key: string]: string[] } = {
      'Головная боль': [
        'Поддерживайте регулярный режим сна',
        'Пейте достаточно воды',
        'Избегайте стрессовых ситуаций',
        'Регулярно питайтесь'
      ],
      'Боль в животе': [
        'Применяйте тепло на область живота',
        'Практикуйте легкие растяжки',
        'Избегайте жирной пищи',
        'Принимайте магний'
      ],
      'Раздражительность': [
        'Практикуйте медитацию',
        'Делайте дыхательные упражнения',
        'Поддерживайте социальные связи',
        'Ограничьте кофеин'
      ],
      'Усталость': [
        'Обеспечьте качественный сон',
        'Принимайте витамин D',
        'Делайте легкие упражнения',
        'Сбалансируйте питание'
      ],
      'Тошнота': [
        'Ешьте небольшими порциями',
        'Избегайте резких запахов',
        'Пейте имбирный чай',
        'Поддерживайте уровень сахара в крови'
      ]
    };

    return tips[symptom] || ['Консультируйтесь с врачом', 'Ведите дневник симптомов'];
  };

  const generateMoodPredictions = (): MoodPrediction[] => {
    if (logs.length < 7) return [];

    const predictions: MoodPrediction[] = [];
    const today = new Date();

    // Анализ трендов настроения
    const recentMoods = logs.slice(0, 14).map(log => ({
      date: log.log_date,
      mood: log.mood_rating || 0,
      stress: log.stress_level || 0
    })).filter(item => item.mood > 0);

    if (recentMoods.length < 5) return [];

    // Создаем предсказания на 7 дней вперед
    for (let i = 1; i <= 7; i++) {
      const futureDate = addDays(today, i);
      
      // Простая модель предсказания на основе трендов
      const avgMood = recentMoods.reduce((sum, item) => sum + item.mood, 0) / recentMoods.length;
      const moodVariability = Math.sqrt(
        recentMoods.reduce((sum, item) => sum + Math.pow(item.mood - avgMood, 2), 0) / recentMoods.length
      );

      // Учитываем цикличность
      const dayOfWeek = futureDate.getDay();
      const weekendFactor = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.3 : 0;
      
      let predictedMood = avgMood + weekendFactor;
      
      // Учитываем фазу цикла
      if (cycles.length > 0) {
        const currentCycle = cycles[0];
        const cycleStart = new Date(currentCycle.cycle_start_date);
        const dayInCycle = Math.floor((futureDate.getTime() - cycleStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        
        // ПМС период (дни 22-28)
        if (dayInCycle >= 22 && dayInCycle <= 28) {
          predictedMood -= 1;
        }
        // Овуляция (дни 12-16)
        else if (dayInCycle >= 12 && dayInCycle <= 16) {
          predictedMood += 0.5;
        }
      }

      predictions.push({
        date: futureDate.toISOString().split('T')[0],
        predictedMood: Math.max(1, Math.min(10, predictedMood)),
        confidence: Math.max(30, 90 - (i * 10)),
        factors: [
          dayOfWeek === 0 || dayOfWeek === 6 ? 'Выходной день' : 'Рабочий день',
          'Фаза менструального цикла',
          'Исторические данные'
        ]
      });
    }

    return predictions;
  };

  const generateInsights = (): PredictiveInsight[] => {
    const insights: PredictiveInsight[] = [];

    // Анализ цикла
    if (cycles.length >= 2) {
      const avgCycleLength = cycles.slice(0, 3).reduce((sum, cycle) => 
        sum + (cycle.cycle_length || 28), 0) / Math.min(3, cycles.length);
      
      if (avgCycleLength < 21 || avgCycleLength > 35) {
        insights.push({
          type: 'cycle',
          title: 'Нерегулярный цикл',
          description: `Ваш средний цикл составляет ${Math.round(avgCycleLength)} дней`,
          likelihood: 85,
          timeframe: 'Текущее состояние',
          actionable: true,
          recommendations: [
            'Консультация с гинекологом',
            'Анализ гормонов',
            'Управление стрессом',
            'Регулярный режим сна'
          ]
        });
      }
    }

    // Анализ настроения
    const recentMoods = logs.slice(0, 7).map(log => log.mood_rating).filter(mood => mood && mood > 0);
    if (recentMoods.length >= 5) {
      const avgMood = recentMoods.reduce((sum, mood) => sum + mood, 0) / recentMoods.length;
      
      if (avgMood < 4) {
        insights.push({
          type: 'mood',
          title: 'Снижение настроения',
          description: 'Ваше настроение ниже обычного в последнюю неделю',
          likelihood: 75,
          timeframe: 'Последние 7 дней',
          actionable: true,
          recommendations: [
            'Практика медитации',
            'Физическая активность',
            'Социальная поддержка',
            'Консультация психолога'
          ]
        });
      }
    }

    // Анализ активности
    if (dailySummary && dailySummary.total_steps < 5000) {
      insights.push({
        type: 'wellness',
        title: 'Низкая физическая активность',
        description: 'Ваша активность ниже рекомендуемой',
        likelihood: 90,
        timeframe: 'Ежедневно',
        actionable: true,
        recommendations: [
          'Прогулки по 15-20 минут',
          'Подъем по лестнице',
          'Танцы или йога',
          'Активные перерывы в работе'
        ]
      });
    }

    return insights;
  };

  useEffect(() => {
    setLoading(true);
    
    const predictions = analyzeSymptomPatterns();
    const moodPreds = generateMoodPredictions();
    const analysisInsights = generateInsights();

    setSymptomPredictions(predictions);
    setMoodPredictions(moodPreds);
    setInsights(analysisInsights);
    
    setLoading(false);
  }, [logs, cycles, dailySummary]);

  const chartConfig = {
    predictedMood: {
      label: "Прогноз настроения",
      color: "#8B5CF6",
    },
    confidence: {
      label: "Уверенность",
      color: "#06B6D4",
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-40">
            <div className="text-center">
              <Brain className="w-8 h-8 mx-auto mb-2 text-purple-600 animate-pulse" />
              <p>Анализируем ваши данные...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <span>Предиктивная аналитика</span>
            <Badge variant="secondary">ИИ</Badge>
          </CardTitle>
          <CardDescription>
            Прогнозирование симптомов и состояния на основе ваших данных
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="predictions">Прогнозы симптомов</TabsTrigger>
          <TabsTrigger value="mood">Прогноз настроения</TabsTrigger>
          <TabsTrigger value="insights">Инсайты</TabsTrigger>
        </TabsList>

        <TabsContent value="predictions" className="space-y-4">
          {symptomPredictions.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Target className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Недостаточно данных
                  </h3>
                  <p className="text-gray-600">
                    Ведите дневник симптомов минимум 2 недели для получения прогнозов
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {symptomPredictions.map((prediction, index) => (
                <Card key={index}>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{prediction.symptom}</h4>
                          <p className="text-sm text-gray-600">
                            Ожидается: {format(parseISO(prediction.expectedDate), 'dd MMM', { locale: ru })}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant={
                            prediction.severity === 'high' ? 'destructive' :
                            prediction.severity === 'medium' ? 'secondary' : 'outline'
                          }>
                            {prediction.probability}% вероятность
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">
                            Уверенность: {prediction.confidence}%
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">Факторы риска:</p>
                        <div className="flex flex-wrap gap-1">
                          {prediction.triggerFactors.map((factor, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {factor}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">Рекомендации по профилактике:</p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {prediction.preventionTips.map((tip, i) => (
                            <li key={i} className="flex items-start">
                              <span className="w-1 h-1 bg-purple-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="mood" className="space-y-4">
          {moodPredictions.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Недостаточно данных о настроении
                  </h3>
                  <p className="text-gray-600">
                    Отмечайте настроение ежедневно для получения прогнозов
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Прогноз настроения на неделю</CardTitle>
                <CardDescription>
                  Основан на ваших исторических данных и фазе цикла
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={moodPredictions}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(value) => format(parseISO(value), 'dd.MM')}
                      />
                      <YAxis domain={[1, 10]} />
                      <ChartTooltip 
                        content={<ChartTooltipContent />}
                        formatter={(value: any, name: string, props: any) => {
                          if (name === 'predictedMood') {
                            return [`${value.toFixed(1)} (${props.payload.confidence}% точность)`, 'Настроение'];
                          }
                          return [value, name];
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="predictedMood"
                        stroke={chartConfig.predictedMood.color}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>

                <div className="mt-4 space-y-2">
                  {moodPredictions.slice(0, 3).map((pred, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span>{format(parseISO(pred.date), 'EEEE, dd MMM', { locale: ru })}</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={pred.predictedMood * 10} className="w-20" />
                        <span>{pred.predictedMood.toFixed(1)}/10</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          {insights.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Все показатели в норме
                  </h3>
                  <p className="text-gray-600">
                    Продолжайте вести здоровый образ жизни!
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {insights.map((insight, index) => (
                <Card key={index}>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium">{insight.title}</h4>
                            <Badge variant={insight.type === 'cycle' ? 'default' : 'secondary'}>
                              {insight.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{insight.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Временные рамки: {insight.timeframe}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-purple-600">
                            {insight.likelihood}%
                          </div>
                          <p className="text-xs text-gray-500">вероятность</p>
                        </div>
                      </div>

                      {insight.actionable && (
                        <div>
                          <p className="text-sm font-medium mb-2">Рекомендации:</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {insight.recommendations.map((rec, i) => (
                              <div key={i} className="flex items-center text-sm text-gray-600">
                                <AlertTriangle className="w-3 h-3 mr-2 text-amber-500" />
                                {rec}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PredictiveSymptomAnalysis;
