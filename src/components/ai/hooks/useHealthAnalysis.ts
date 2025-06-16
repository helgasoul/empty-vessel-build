
import { useState, useEffect } from 'react';
import { ComprehensiveHealthContext, HealthInsight, CycleData, LogData, HealthData } from '../types/aiTypes';
import { 
  calculateRegularityScore, 
  analyzeSymptomPatterns, 
  analyzeTrend, 
  analyzeStepsTrend, 
  analyzeSymptomMoodCorrelations, 
  generatePredictions, 
  generatePersonalizedRecommendations 
} from '../utils/healthAnalytics';

export const useHealthAnalysis = (
  cycles: CycleData[], 
  logs: LogData[], 
  healthData: HealthData[],
  getHealthMetrics: () => { steps: number; sleepHours: number; avgHeartRate: number }
) => {
  const [healthContext, setHealthContext] = useState<ComprehensiveHealthContext>({});
  const [healthInsights, setHealthInsights] = useState<HealthInsight[]>([]);

  useEffect(() => {
    if (cycles.length > 0 && logs.length > 0 && healthData.length > 0) {
      const context = analyzeComprehensiveHealth();
      setHealthContext(context);
      generateHealthInsights(context);
    }
  }, [cycles, logs, healthData]);

  const analyzeComprehensiveHealth = (): ComprehensiveHealthContext => {
    const latestCycle = cycles[0];
    const recentLogs = logs.slice(0, 30);
    const metrics = getHealthMetrics();

    const cycleStart = new Date(latestCycle.cycle_start_date);
    const currentCycleDay = Math.floor((Date.now() - cycleStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    let cyclePhase = 'unknown';
    
    if (currentCycleDay <= 5) cyclePhase = 'menstrual';
    else if (currentCycleDay <= 13) cyclePhase = 'follicular';
    else if (currentCycleDay <= 16) cyclePhase = 'ovulatory';
    else cyclePhase = 'luteal';

    const cycleLengths = cycles.slice(0, 6).map(c => c.cycle_length).filter(Boolean);
    const averageLength = cycleLengths.reduce((sum, len) => sum + (len || 28), 0) / cycleLengths.length;
    const regularityScore = calculateRegularityScore(cycleLengths);

    const symptomPatterns = analyzeSymptomPatterns(recentLogs);

    const moodRatings = recentLogs.map(log => log.mood_rating || 0).filter(rating => rating > 0);
    const currentMoodRating = moodRatings[0] || 5;
    const moodTrend = analyzeTrend(moodRatings);
    
    const stressLevels = recentLogs.map(log => log.stress_level || 0).filter(level => level > 0);
    const currentStressLevel = stressLevels[0] || 5;
    
    const energyLevels = recentLogs.map(log => log.energy_level || 0).filter(level => level > 0);
    const currentEnergyLevel = energyLevels[0] || 5;

    const correlations = analyzeSymptomMoodCorrelations(recentLogs);

    const stepsData = healthData.filter(d => d.data_type === 'steps').slice(0, 14);
    const stepsValues = stepsData.map(d => d.data_value);
    const stepstrend = analyzeStepsTrend(stepsValues);

    const sleepData = healthData.filter(d => d.data_type === 'sleep').slice(0, 14);
    const sleepValues = sleepData.map(d => d.data_value);
    const sleepTrend = analyzeTrend(sleepValues);

    const nextCycleStart = new Date(cycleStart);
    nextCycleStart.setDate(nextCycleStart.getDate() + averageLength);
    
    const predictions = generatePredictions({
      cyclePhase,
      currentCycleDay,
      averageLength,
      symptomPatterns,
      stressLevel: currentStressLevel,
      energyLevel: currentEnergyLevel
    });

    return {
      currentCycleDay,
      cyclePhase,
      cycleTrends: {
        averageLength,
        regularityScore,
        symptomPatterns
      },
      healthMetrics: {
        steps: metrics.steps,
        sleep: metrics.sleepHours,
        heartRate: metrics.avgHeartRate,
        stepstrend: stepstrend as any,
        sleepTrend: sleepTrend as any
      },
      moodAnalysis: {
        currentRating: currentMoodRating,
        trend: moodTrend as any,
        stressLevel: currentStressLevel,
        energyLevel: currentEnergyLevel,
        correlations
      },
      predictions,
      recommendations: generatePersonalizedRecommendations({
        cyclePhase,
        stressLevel: currentStressLevel,
        energyLevel: currentEnergyLevel,
        symptomPatterns,
        stepsAverage: metrics.steps,
        sleepQuality: metrics.sleepHours
      })
    };
  };

  const generateHealthInsights = (context: ComprehensiveHealthContext) => {
    const insights: HealthInsight[] = [];

    if (context.cycleTrends?.regularityScore !== undefined) {
      insights.push({
        id: '1',
        type: 'trend',
        title: 'Регулярность цикла',
        description: `Ваш цикл регулярен на ${context.cycleTrends.regularityScore.toFixed(0)}%. ${
          context.cycleTrends.regularityScore > 80 ? 'Отличный показатель!' : 
          context.cycleTrends.regularityScore > 60 ? 'Хороший уровень регулярности.' : 
          'Стоит обратить внимание на факторы, влияющие на регулярность.'
        }`,
        confidence: 85,
        actionable: context.cycleTrends.regularityScore < 70
      });
    }

    if (context.moodAnalysis?.correlations && context.moodAnalysis.correlations.length > 0) {
      const topCorrelation = context.moodAnalysis.correlations[0];
      insights.push({
        id: '2',
        type: 'correlation',
        title: 'Влияние симптомов на настроение',
        description: `"${topCorrelation.symptom}" наиболее сильно влияет на ваше настроение. Обратите внимание на способы смягчения этого симптома.`,
        confidence: 78,
        actionable: true
      });
    }

    if (context.healthMetrics?.steps !== undefined) {
      const stepsGoal = 8000;
      const percentage = (context.healthMetrics.steps / stepsGoal) * 100;
      insights.push({
        id: '3',
        type: 'recommendation',
        title: 'Физическая активность',
        description: `Вы достигли ${percentage.toFixed(0)}% от рекомендуемой нормы активности. ${
          percentage >= 100 ? 'Отличная работа!' : 
          percentage >= 75 ? 'Почти достигли цели!' : 
          'Попробуйте увеличить ежедневную активность.'
        }`,
        confidence: 90,
        actionable: percentage < 100
      });
    }

    if (context.predictions) {
      insights.push({
        id: '4',
        type: 'prediction',
        title: 'Прогноз симптомов',
        description: `На основе ваших данных, в следующем цикле возможны: ${context.predictions.expectedSymptoms.join(', ')}. Подготовьтесь заранее!`,
        confidence: 72,
        actionable: true
      });
    }

    setHealthInsights(insights);
  };

  return { healthContext, healthInsights };
};
