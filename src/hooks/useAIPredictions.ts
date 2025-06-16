
import { useState } from 'react';
import { toast } from 'sonner';

export interface TrendPrediction {
  date: string;
  predictedSteps: number;
  predictedHeartRate: number;
  predictedSleep: number;
  confidence: number;
}

export interface HealthInsight {
  type: 'improvement' | 'warning' | 'maintenance' | 'achievement';
  title: string;
  description: string;
  recommendation: string;
  priority: 'high' | 'medium' | 'low';
  category: 'activity' | 'sleep' | 'heart' | 'nutrition' | 'stress' | 'overall';
  actionable: boolean;
  impact: 'high' | 'medium' | 'low';
  timeframe: 'immediate' | 'short_term' | 'long_term';
  personalizedScore: number; // 0-100, насколько релевантна рекомендация для пользователя
}

export interface PersonalizedRecommendation {
  id: string;
  title: string;
  description: string;
  category: 'activity' | 'sleep' | 'nutrition' | 'stress' | 'medical';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  evidence: string[];
  expectedOutcome: string;
  timeToSeeResults: string;
  difficulty: 'easy' | 'moderate' | 'hard';
  personalizedReason: string;
  steps: string[];
  metrics: string[];
}

export interface AIAnalysisResult {
  healthScore: number; // 0-100
  riskFactors: string[];
  improvements: string[];
  trends: {
    activity: 'improving' | 'stable' | 'declining';
    sleep: 'improving' | 'stable' | 'declining';
    heart: 'improving' | 'stable' | 'declining';
  };
  personalizedRecommendations: PersonalizedRecommendation[];
}

export const useAIPredictions = () => {
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState<TrendPrediction[]>([]);
  const [insights, setInsights] = useState<HealthInsight[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);

  const generatePersonalizedAnalysis = async (historicalData: any[], userProfile?: any) => {
    setLoading(true);
    try {
      // Проводим комплексный ИИ-анализ
      const analysis = performAdvancedAnalysis(historicalData, userProfile);
      const personalizedInsights = generatePersonalizedInsights(historicalData, userProfile, analysis);
      const futurePredictions = generateAdvancedPredictions(historicalData, analysis);
      const recommendations = generateIntelligentRecommendations(analysis, userProfile);

      setAiAnalysis(analysis);
      setInsights(personalizedInsights);
      setPredictions(futurePredictions);

      toast.success('Персонализированный ИИ-анализ завершен');
    } catch (error) {
      console.error('Ошибка ИИ-анализа:', error);
      toast.error('Не удалось выполнить ИИ-анализ');
    } finally {
      setLoading(false);
    }
  };

  const generatePredictions = async (historicalData: any[]) => {
    setLoading(true);
    try {
      const trends = analyzeTrends(historicalData);
      const futurePredictions = generateFutureTrends(trends, 30);
      const healthInsights = generateHealthInsights(historicalData, trends);

      setPredictions(futurePredictions);
      setInsights(healthInsights);
      toast.success('Прогнозы ИИ успешно обновлены');
    } catch (error) {
      console.error('Ошибка генерации прогнозов:', error);
      toast.error('Не удалось сгенерировать прогнозы');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    predictions,
    insights,
    aiAnalysis,
    generatePredictions,
    generatePersonalizedAnalysis
  };
};

// Продвинутый анализ здоровья с ИИ
const performAdvancedAnalysis = (data: any[], userProfile?: any): AIAnalysisResult => {
  if (data.length < 3) {
    return {
      healthScore: 50,
      riskFactors: ['Недостаточно данных для анализа'],
      improvements: ['Продолжайте отслеживать показатели здоровья'],
      trends: { activity: 'stable', sleep: 'stable', heart: 'stable' },
      personalizedRecommendations: []
    };
  }

  // Анализ трендов по категориям
  const activityTrend = analyzeActivityTrend(data);
  const sleepTrend = analyzeSleepTrend(data);
  const heartTrend = analyzeHeartRateTrend(data);

  // Расчет общего показателя здоровья
  const healthScore = calculateHealthScore(data, userProfile);

  // Выявление факторов риска
  const riskFactors = identifyRiskFactors(data, userProfile);

  // Определение областей для улучшения
  const improvements = identifyImprovementAreas(data, userProfile);

  // Генерация персонализированных рекомендаций
  const personalizedRecommendations = generateIntelligentRecommendations({
    healthScore,
    riskFactors,
    improvements,
    trends: { activity: activityTrend, sleep: sleepTrend, heart: heartTrend }
  }, userProfile);

  return {
    healthScore,
    riskFactors,
    improvements,
    trends: {
      activity: activityTrend,
      sleep: sleepTrend,
      heart: heartTrend
    },
    personalizedRecommendations
  };
};

// Анализ трендов активности
const analyzeActivityTrend = (data: any[]): 'improving' | 'stable' | 'declining' => {
  const recentWeek = data.slice(-7);
  const previousWeek = data.slice(-14, -7);

  if (recentWeek.length < 3 || previousWeek.length < 3) return 'stable';

  const recentAvg = recentWeek.reduce((sum, d) => sum + (d.steps || 0), 0) / recentWeek.length;
  const previousAvg = previousWeek.reduce((sum, d) => sum + (d.steps || 0), 0) / previousWeek.length;

  const change = ((recentAvg - previousAvg) / previousAvg) * 100;

  if (change > 10) return 'improving';
  if (change < -10) return 'declining';
  return 'stable';
};

// Анализ трендов сна
const analyzeSleepTrend = (data: any[]): 'improving' | 'stable' | 'declining' => {
  const recentWeek = data.slice(-7);
  const previousWeek = data.slice(-14, -7);

  if (recentWeek.length < 3 || previousWeek.length < 3) return 'stable';

  const recentAvg = recentWeek.reduce((sum, d) => sum + (d.sleepHours || 0), 0) / recentWeek.length;
  const previousAvg = previousWeek.reduce((sum, d) => sum + (d.sleepHours || 0), 0) / previousWeek.length;

  const change = recentAvg - previousAvg;

  if (change > 0.5) return 'improving';
  if (change < -0.5) return 'declining';
  return 'stable';
};

// Анализ трендов пульса
const analyzeHeartRateTrend = (data: any[]): 'improving' | 'stable' | 'declining' => {
  const recentWeek = data.slice(-7);
  const previousWeek = data.slice(-14, -7);

  if (recentWeek.length < 3 || previousWeek.length < 3) return 'stable';

  const recentAvg = recentWeek.reduce((sum, d) => sum + (d.heartRate || 0), 0) / recentWeek.length;
  const previousAvg = previousWeek.reduce((sum, d) => sum + (d.heartRate || 0), 0) / previousWeek.length;

  // Для пульса покоя - снижение это хорошо
  const change = previousAvg - recentAvg;

  if (change > 3) return 'improving';
  if (change < -3) return 'declining';
  return 'stable';
};

// Расчет общего показателя здоровья
const calculateHealthScore = (data: any[], userProfile?: any): number => {
  let score = 50; // базовый показатель

  const recent = data.slice(-7);
  if (recent.length === 0) return score;

  // Анализ активности (30% от общего показателя)
  const avgSteps = recent.reduce((sum, d) => sum + (d.steps || 0), 0) / recent.length;
  const stepsScore = Math.min(100, (avgSteps / 10000) * 100);
  score += (stepsScore - 50) * 0.3;

  // Анализ сна (25% от общего показателя)
  const avgSleep = recent.reduce((sum, d) => sum + (d.sleepHours || 0), 0) / recent.length;
  const sleepScore = avgSleep >= 7 && avgSleep <= 9 ? 100 : Math.max(0, 100 - Math.abs(avgSleep - 8) * 25);
  score += (sleepScore - 50) * 0.25;

  // Анализ пульса (20% от общего показателя)
  const avgHeartRate = recent.reduce((sum, d) => sum + (d.heartRate || 0), 0) / recent.length;
  let heartScore = 50;
  if (avgHeartRate > 0) {
    heartScore = avgHeartRate >= 60 && avgHeartRate <= 80 ? 100 : Math.max(0, 100 - Math.abs(avgHeartRate - 70) * 2);
  }
  score += (heartScore - 50) * 0.2;

  // Консистентность (25% от общего показателя)
  const activeDays = recent.filter(d => d.steps > 1000).length;
  const consistencyScore = (activeDays / recent.length) * 100;
  score += (consistencyScore - 50) * 0.25;

  return Math.max(0, Math.min(100, Math.round(score)));
};

// Выявление факторов риска
const identifyRiskFactors = (data: any[], userProfile?: any): string[] => {
  const risks: string[] = [];
  const recent = data.slice(-7);

  if (recent.length === 0) return ['Недостаточно данных'];

  const avgSteps = recent.reduce((sum, d) => sum + (d.steps || 0), 0) / recent.length;
  const avgSleep = recent.reduce((sum, d) => sum + (d.sleepHours || 0), 0) / recent.length;
  const avgHeartRate = recent.reduce((sum, d) => sum + (d.heartRate || 0), 0) / recent.length;

  if (avgSteps < 5000) risks.push('Низкая физическая активность');
  if (avgSleep < 6) risks.push('Хронический недосып');
  if (avgSleep > 10) risks.push('Избыточная продолжительность сна');
  if (avgHeartRate > 90) risks.push('Повышенный пульс покоя');

  // Анализ консистентности
  const activeDays = recent.filter(d => d.steps > 3000).length;
  if (activeDays < recent.length * 0.5) {
    risks.push('Нерегулярная физическая активность');
  }

  return risks;
};

// Определение областей для улучшения
const identifyImprovementAreas = (data: any[], userProfile?: any): string[] => {
  const improvements: string[] = [];
  const recent = data.slice(-14);

  if (recent.length === 0) return ['Продолжайте отслеживание'];

  const avgSteps = recent.reduce((sum, d) => sum + (d.steps || 0), 0) / recent.length;
  const avgSleep = recent.reduce((sum, d) => sum + (d.sleepHours || 0), 0) / recent.length;

  if (avgSteps < 8000) improvements.push('Увеличить ежедневную активность');
  if (avgSleep < 7.5) improvements.push('Улучшить качество и продолжительность сна');

  // Анализ вариабельности
  const stepVariability = calculateVariability(recent.map(d => d.steps || 0));
  if (stepVariability > 0.5) {
    improvements.push('Сделать активность более регулярной');
  }

  return improvements;
};

// Вспомогательная функция для расчета вариабельности
const calculateVariability = (values: number[]): number => {
  if (values.length < 2) return 0;
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  return Math.sqrt(variance) / mean;
};

// Генерация интеллектуальных рекомендаций
const generateIntelligentRecommendations = (analysis: Partial<AIAnalysisResult>, userProfile?: any): PersonalizedRecommendation[] => {
  const recommendations: PersonalizedRecommendation[] = [];

  // Рекомендации по активности
  if (analysis.trends?.activity === 'declining' || analysis.riskFactors?.includes('Низкая физическая активность')) {
    recommendations.push({
      id: 'increase-activity',
      title: 'Увеличить физическую активность',
      description: 'Ваша активность снижается. Рекомендуем постепенно увеличивать ежедневную нагрузку.',
      category: 'activity',
      urgency: 'medium',
      evidence: ['Снижение среднего количества шагов', 'Нерегулярная активность'],
      expectedOutcome: 'Улучшение сердечно-сосудистого здоровья и общего самочувствия',
      timeToSeeResults: '2-3 недели',
      difficulty: 'easy',
      personalizedReason: 'На основе анализа ваших данных за последние 2 недели',
      steps: [
        'Начните с 10-минутных прогулок после еды',
        'Постепенно увеличивайте время ходьбы на 5 минут каждую неделю',
        'Используйте лестницу вместо лифта',
        'Припаркуйтесь дальше от места назначения'
      ],
      metrics: ['Количество шагов', 'Активные минуты', 'Пульс при нагрузке']
    });
  }

  // Рекомендации по сну
  if (analysis.trends?.sleep === 'declining' || analysis.riskFactors?.includes('Хронический недосып')) {
    recommendations.push({
      id: 'improve-sleep',
      title: 'Улучшить качество сна',
      description: 'Продолжительность вашего сна сокращается. Важно восстановить здоровый режим.',
      category: 'sleep',
      urgency: 'high',
      evidence: ['Сокращение времени сна', 'Нерегулярный режим'],
      expectedOutcome: 'Улучшение когнитивных функций, настроения и иммунитета',
      timeToSeeResults: '1-2 недели',
      difficulty: 'moderate',
      personalizedReason: 'Выявлена тенденция к сокращению продолжительности сна',
      steps: [
        'Установите фиксированное время отхода ко сну',
        'Создайте расслабляющую вечернюю рутину',
        'Избегайте экранов за час до сна',
        'Обеспечьте прохладную и темную обстановку в спальне'
      ],
      metrics: ['Продолжительность сна', 'Качество сна', 'Время засыпания']
    });
  }

  // Рекомендации по сердечно-сосудистому здоровью
  if (analysis.riskFactors?.includes('Повышенный пульс покоя')) {
    recommendations.push({
      id: 'heart-health',
      title: 'Улучшить сердечно-сосудистое здоровье',
      description: 'Обнаружен повышенный пульс покоя. Рекомендуем принять меры для его нормализации.',
      category: 'medical',
      urgency: 'high',
      evidence: ['Повышенный пульс покоя', 'Нерегулярность показателей'],
      expectedOutcome: 'Снижение пульса покоя и улучшение выносливости',
      timeToSeeResults: '4-6 недель',
      difficulty: 'moderate',
      personalizedReason: 'Средний пульс покоя превышает норму',
      steps: [
        'Проконсультируйтесь с кардиологом',
        'Включите кардиотренировки средней интенсивности',
        'Практикуйте дыхательные упражнения',
        'Сократите потребление кофеина'
      ],
      metrics: ['Пульс покоя', 'Вариабельность сердечного ритма', 'Восстановление после нагрузки']
    });
  }

  return recommendations;
};

// Оригинальные функции для совместимости
const analyzeTrends = (data: any[]) => {
  if (data.length < 7) return { steps: 0, heartRate: 0, sleep: 0 };

  const recent = data.slice(-7);
  const previous = data.slice(-14, -7);

  const recentAvg = {
    steps: recent.reduce((sum, d) => sum + (d.steps || 0), 0) / recent.length,
    heartRate: recent.reduce((sum, d) => sum + (d.heartRate || 0), 0) / recent.length,
    sleep: recent.reduce((sum, d) => sum + (d.sleepHours || 0), 0) / recent.length
  };

  const previousAvg = {
    steps: previous.length > 0 ? previous.reduce((sum, d) => sum + (d.steps || 0), 0) / previous.length : recentAvg.steps,
    heartRate: previous.length > 0 ? previous.reduce((sum, d) => sum + (d.heartRate || 0), 0) / previous.length : recentAvg.heartRate,
    sleep: previous.length > 0 ? previous.reduce((sum, d) => sum + (d.sleepHours || 0), 0) / previous.length : recentAvg.sleep
  };

  return {
    steps: recentAvg.steps - previousAvg.steps,
    heartRate: recentAvg.heartRate - previousAvg.heartRate,
    sleep: recentAvg.sleep - previousAvg.sleep
  };
};

const generateFutureTrends = (trends: any, days: number): TrendPrediction[] => {
  const predictions: TrendPrediction[] = [];
  const today = new Date();

  for (let i = 1; i <= days; i++) {
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + i);

    const baseSteps = 8000 + trends.steps * i + (Math.random() - 0.5) * 1000;
    const baseHeartRate = 70 + trends.heartRate * (i / 10) + (Math.random() - 0.5) * 5;
    const baseSleep = 7.5 + trends.sleep * (i / 20) + (Math.random() - 0.5) * 0.5;

    predictions.push({
      date: futureDate.toISOString().split('T')[0],
      predictedSteps: Math.max(0, Math.round(baseSteps)),
      predictedHeartRate: Math.max(50, Math.round(baseHeartRate)),
      predictedSleep: Math.max(4, Math.round(baseSleep * 10) / 10),
      confidence: Math.max(0.3, 0.9 - (i / days) * 0.6)
    });
  }

  return predictions;
};

const generatePersonalizedInsights = (data: any[], userProfile?: any, analysis?: AIAnalysisResult): HealthInsight[] => {
  const insights: HealthInsight[] = [];

  if (!analysis) return generateHealthInsights(data, analyzeTrends(data));

  // Генерируем инсайты на основе ИИ-анализа
  analysis.riskFactors.forEach(risk => {
    insights.push({
      type: 'warning',
      title: `Выявлен фактор риска: ${risk}`,
      description: `Анализ ваших данных показал наличие фактора риска для здоровья.`,
      recommendation: `Рекомендуем принять меры для снижения данного риска.`,
      priority: 'high',
      category: 'overall',
      actionable: true,
      impact: 'high',
      timeframe: 'short_term',
      personalizedScore: 90
    });
  });

  analysis.improvements.forEach(improvement => {
    insights.push({
      type: 'improvement',
      title: `Область для улучшения: ${improvement}`,
      description: `Выявлена возможность улучшения в данной области.`,
      recommendation: `Следуйте персонализированным рекомендациям для достижения лучших результатов.`,
      priority: 'medium',
      category: 'overall',
      actionable: true,
      impact: 'medium',
      timeframe: 'long_term',
      personalizedScore: 75
    });
  });

  // Позитивные инсайты при хорошем показателе здоровья
  if (analysis.healthScore > 80) {
    insights.push({
      type: 'achievement',
      title: 'Отличные показатели здоровья!',
      description: `Ваш общий показатель здоровья составляет ${analysis.healthScore} баллов.`,
      recommendation: 'Продолжайте поддерживать здоровый образ жизни.',
      priority: 'low',
      category: 'overall',
      actionable: false,
      impact: 'high',
      timeframe: 'immediate',
      personalizedScore: 95
    });
  }

  return insights;
};

const generateHealthInsights = (data: any[], trends: any): HealthInsight[] => {
  const insights: HealthInsight[] = [];

  if (trends.steps < -1000) {
    insights.push({
      type: 'warning',
      title: 'Снижение активности',
      description: 'Ваша ежедневная активность снизилась на более чем 1000 шагов',
      recommendation: 'Рекомендуем увеличить время прогулок или добавить легкие упражнения',
      priority: 'high',
      category: 'activity',
      actionable: true,
      impact: 'high',
      timeframe: 'short_term',
      personalizedScore: 85
    });
  } else if (trends.steps > 1000) {
    insights.push({
      type: 'improvement',
      title: 'Отличный прогресс!',
      description: 'Ваша активность увеличилась значительно',
      recommendation: 'Продолжайте в том же духе!',
      priority: 'low',
      category: 'activity',
      actionable: false,
      impact: 'medium',
      timeframe: 'immediate',
      personalizedScore: 90
    });
  }

  if (trends.sleep < -0.5) {
    insights.push({
      type: 'warning',
      title: 'Недостаток сна',
      description: 'Продолжительность сна сокращается',
      recommendation: 'Старайтесь ложиться спать раньше и создайте режим для лучшего сна',
      priority: 'high',
      category: 'sleep',
      actionable: true,
      impact: 'high',
      timeframe: 'short_term',
      personalizedScore: 88
    });
  }

  if (trends.heartRate > 5) {
    insights.push({
      type: 'warning',
      title: 'Повышенный пульс покоя',
      description: 'Средний пульс покоя увеличился',
      recommendation: 'Рекомендуем проконсультироваться с врачом и снизить уровень стресса',
      priority: 'medium',
      category: 'heart',
      actionable: true,
      impact: 'high',
      timeframe: 'short_term',
      personalizedScore: 92
    });
  }

  if (insights.length === 0) {
    insights.push({
      type: 'maintenance',
      title: 'Поддерживайте текущий режим',
      description: 'Ваши показатели здоровья стабильны',
      recommendation: 'Продолжайте следовать здоровому образу жизни',
      priority: 'low',
      category: 'overall',
      actionable: false,
      impact: 'medium',
      timeframe: 'long_term',
      personalizedScore: 70
    });
  }

  return insights;
};

const generateAdvancedPredictions = (data: any[], analysis: AIAnalysisResult): TrendPrediction[] => {
  const trends = analyzeTrends(data);
  return generateFutureTrends(trends, 30);
};
