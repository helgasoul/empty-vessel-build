
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
  type: 'improvement' | 'warning' | 'maintenance';
  title: string;
  description: string;
  recommendation: string;
  priority: 'high' | 'medium' | 'low';
}

export const useAIPredictions = () => {
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState<TrendPrediction[]>([]);
  const [insights, setInsights] = useState<HealthInsight[]>([]);

  const generatePredictions = async (historicalData: any[]) => {
    setLoading(true);
    try {
      // Симуляция ИИ-анализа на основе исторических данных
      const trends = analyzeTrends(historicalData);
      const futurePredictions = generateFutureTrends(trends, 30); // 30 дней вперед
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
    generatePredictions
  };
};

// Анализ трендов на основе исторических данных
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

// Генерация будущих трендов
const generateFutureTrends = (trends: any, days: number): TrendPrediction[] => {
  const predictions: TrendPrediction[] = [];
  const today = new Date();

  for (let i = 1; i <= days; i++) {
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + i);

    // Простая линейная экстраполяция с некоторой случайностью
    const baseSteps = 8000 + trends.steps * i + (Math.random() - 0.5) * 1000;
    const baseHeartRate = 70 + trends.heartRate * (i / 10) + (Math.random() - 0.5) * 5;
    const baseSleep = 7.5 + trends.sleep * (i / 20) + (Math.random() - 0.5) * 0.5;

    predictions.push({
      date: futureDate.toISOString().split('T')[0],
      predictedSteps: Math.max(0, Math.round(baseSteps)),
      predictedHeartRate: Math.max(50, Math.round(baseHeartRate)),
      predictedSleep: Math.max(4, Math.round(baseSleep * 10) / 10),
      confidence: Math.max(0.3, 0.9 - (i / days) * 0.6) // Уверенность убывает со временем
    });
  }

  return predictions;
};

// Генерация инсайтов здоровья
const generateHealthInsights = (data: any[], trends: any): HealthInsight[] => {
  const insights: HealthInsight[] = [];

  // Анализ шагов
  if (trends.steps < -1000) {
    insights.push({
      type: 'warning',
      title: 'Снижение активности',
      description: 'Ваша ежедневная активность снизилась на более чем 1000 шагов',
      recommendation: 'Рекомендуем увеличить время прогулок или добавить легкие упражнения',
      priority: 'high'
    });
  } else if (trends.steps > 1000) {
    insights.push({
      type: 'improvement',
      title: 'Отличный прогресс!',
      description: 'Ваша активность увеличилась значительно',
      recommendation: 'Продолжайте в том же духе!',
      priority: 'low'
    });
  }

  // Анализ сна
  if (trends.sleep < -0.5) {
    insights.push({
      type: 'warning',
      title: 'Недостаток сна',
      description: 'Продолжительность сна сокращается',
      recommendation: 'Старайтесь ложиться спать раньше и создайте режим для лучшего сна',
      priority: 'high'
    });
  }

  // Анализ пульса
  if (trends.heartRate > 5) {
    insights.push({
      type: 'warning',
      title: 'Повышенный пульс покоя',
      description: 'Средний пульс покоя увеличился',
      recommendation: 'Рекомендуем проконсультироваться с врачом и снизить уровень стресса',
      priority: 'medium'
    });
  }

  // Общие рекомендации
  if (insights.length === 0) {
    insights.push({
      type: 'maintenance',
      title: 'Поддерживайте текущий режим',
      description: 'Ваши показатели здоровья стабильны',
      recommendation: 'Продолжайте следовать здоровому образу жизни',
      priority: 'low'
    });
  }

  return insights;
};
