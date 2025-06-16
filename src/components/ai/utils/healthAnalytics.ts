
import { ComprehensiveHealthContext, CycleData, LogData, HealthData } from '../types/aiTypes';

export const calculateRegularityScore = (lengths: number[]): number => {
  if (lengths.length < 3) return 50;
  const variance = lengths.reduce((sum, len, _, arr) => {
    const mean = arr.reduce((s, l) => s + l, 0) / arr.length;
    return sum + Math.pow(len - mean, 2);
  }, 0) / lengths.length;
  return Math.max(0, 100 - (variance * 3));
};

export const analyzeSymptomPatterns = (logs: LogData[]): string[] => {
  const symptomCounts: { [key: string]: number } = {};
  logs.forEach(log => {
    (log.symptoms || []).forEach((symptom: string) => {
      symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
    });
  });
  
  return Object.entries(symptomCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([symptom]) => symptom);
};

export const analyzeTrend = (values: number[]): 'improving' | 'stable' | 'declining' => {
  if (values.length < 3) return 'stable';
  const firstHalf = values.slice(0, Math.ceil(values.length / 2));
  const secondHalf = values.slice(Math.ceil(values.length / 2));
  const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
  
  const threshold = Math.abs(firstAvg) * 0.1;
  if (secondAvg > firstAvg + threshold) return 'improving';
  if (secondAvg < firstAvg - threshold) return 'declining';
  return 'stable';
};

export const analyzeStepsTrend = (values: number[]): 'increasing' | 'stable' | 'decreasing' => {
  if (values.length < 3) return 'stable';
  const firstHalf = values.slice(0, Math.ceil(values.length / 2));
  const secondHalf = values.slice(Math.ceil(values.length / 2));
  const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
  
  const threshold = Math.abs(firstAvg) * 0.1;
  if (secondAvg > firstAvg + threshold) return 'increasing';
  if (secondAvg < firstAvg - threshold) return 'decreasing';
  return 'stable';
};

export const analyzeSymptomMoodCorrelations = (logs: LogData[]) => {
  const correlations: { symptom: string; impact: number }[] = [];
  const symptomImpacts: { [key: string]: number[] } = {};

  logs.forEach(log => {
    const moodRating = log.mood_rating || 5;
    (log.symptoms || []).forEach((symptom: string) => {
      if (!symptomImpacts[symptom]) symptomImpacts[symptom] = [];
      symptomImpacts[symptom].push(moodRating);
    });
  });

  Object.entries(symptomImpacts).forEach(([symptom, ratings]) => {
    if (ratings.length > 2) {
      const avgRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
      const impact = 5 - avgRating;
      correlations.push({ symptom, impact });
    }
  });

  return correlations.sort((a, b) => b.impact - a.impact).slice(0, 3);
};

export const generatePredictions = (data: any) => {
  const predictions = {
    nextCycleStart: new Date(Date.now() + data.averageLength * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    expectedSymptoms: data.symptomPatterns.slice(0, 3),
    optimalWorkoutDays: [] as number[],
    nutritionFocus: [] as string[]
  };

  if (data.cyclePhase === 'follicular') {
    predictions.optimalWorkoutDays = [8, 10, 12];
  } else if (data.cyclePhase === 'ovulatory') {
    predictions.optimalWorkoutDays = [14, 15, 16];
  } else if (data.cyclePhase === 'luteal') {
    predictions.optimalWorkoutDays = [20, 22, 24];
  }

  if (data.stressLevel > 6) {
    predictions.nutritionFocus.push('Магний', 'Адаптогены');
  }
  if (data.energyLevel < 5) {
    predictions.nutritionFocus.push('Железо', 'B-витамины');
  }

  return predictions;
};

export const generatePersonalizedRecommendations = (data: any) => ({
  immediate: [
    data.cyclePhase === 'menstrual' ? 'Увеличьте потребление железа' : 'Планируйте интенсивные тренировки',
    data.stressLevel > 6 ? 'Попробуйте 10-минутную медитацию' : 'Отличное время для новых челленджей',
    data.energyLevel < 5 ? 'Сделайте легкую прогулку на свежем воздухе' : 'Используйте высокую энергию для продуктивности'
  ],
  weekly: [
    'Запланируйте 3-4 тренировки умеренной интенсивности',
    'Добавьте в рацион больше листовых зеленых овощей',
    'Обеспечьте 7-8 часов качественного сна'
  ],
  lifestyle: [
    'Ведите дневник симптомов для лучшего понимания паттернов',
    'Практикуйте техники управления стрессом',
    'Поддерживайте социальные связи'
  ],
  medical: data.stressLevel > 8 || data.energyLevel < 3 ? [
    'Рассмотрите консультацию с гинекологом-эндокринологом',
    'Сдайте анализы на гормоны щитовидной железы'
  ] : []
});
