
/**
 * Mock Data Service
 * Generates mock analysis results for demo purposes
 */

import { AnalysisRequest, AnalysisResults, HealthPattern, HealthCorrelation, HealthAnomaly } from './types';

export class MockDataService {
  /**
   * Generate mock results for demo purposes
   */
  async generateMockResults(request: AnalysisRequest): Promise<AnalysisResults> {
    const patterns: HealthPattern[] = [
      {
        id: crypto.randomUUID(),
        patternType: 'sleep_pattern',
        patternCategory: 'circadian',
        patternName: 'Нарушение циркадного ритма',
        description: 'Обнаружена тенденция к позднему засыпанию в выходные дни',
        strength: 0.75,
        timePeriod: 'weekly',
        healthImpact: 'negative',
        clinicalRelevance: 'moderate',
        startDate: '2024-01-01',
        endDate: '2024-01-31'
      },
      {
        id: crypto.randomUUID(),
        patternType: 'activity_pattern',
        patternCategory: 'exercise',
        patternName: 'Стабильная физическая активность',
        description: 'Регулярные тренировки 3-4 раза в неделю с постепенным увеличением интенсивности',
        strength: 0.85,
        timePeriod: 'monthly',
        healthImpact: 'positive',
        clinicalRelevance: 'high',
        startDate: '2024-01-01',
        endDate: '2024-01-31'
      }
    ];

    const correlations: HealthCorrelation[] = [
      {
        id: crypto.randomUUID(),
        metric1: 'Качество сна',
        metric2: 'Уровень стресса',
        coefficient: -0.72,
        significance: 0.001,
        strength: 'strong',
        direction: 'negative',
        insights: 'Плохое качество сна сильно коррелирует с повышенным уровнем стресса',
        clinicalMeaning: 'high'
      },
      {
        id: crypto.randomUUID(),
        metric1: 'Физическая активность',
        metric2: 'Настроение',
        coefficient: 0.65,
        significance: 0.005,
        strength: 'moderate',
        direction: 'positive',
        insights: 'Увеличение физической активности связано с улучшением настроения',
        clinicalMeaning: 'moderate'
      }
    ];

    const anomalies: HealthAnomaly[] = [
      {
        id: crypto.randomUUID(),
        metricName: 'Частота сердечных сокращений в покое',
        metricType: 'cardiovascular',
        anomalyType: 'outlier',
        detectedValue: 95,
        expectedValue: 72,
        anomalyScore: 0.85,
        severity: 'moderate',
        urgency: 'within_week',
        recommendedAction: 'Обратиться к кардиологу для дополнительного обследования',
        detectionDate: new Date().toISOString()
      }
    ];

    return {
      sessionId: crypto.randomUUID(),
      keyFindings: [
        'Выявлены нарушения циркадного ритма, влияющие на качество сна',
        'Обнаружена сильная связь между стрессом и качеством сна',
        'Физическая активность показывает положительное влияние на настроение',
        'Зафиксированы отклонения в покойном пульсе, требующие внимания'
      ],
      patterns,
      correlations,
      anomalies,
      recommendations: [
        'Установите постоянное время отхода ко сну, включая выходные',
        'Рассмотрите техники управления стрессом: медитацию или йогу',
        'Продолжайте регулярные тренировки для поддержания хорошего настроения',
        'Запланируйте консультацию с кардиологом по поводу частоты пульса'
      ],
      confidenceScore: 0.82,
      dataCompleteness: 0.75,
      processingTime: 2500
    };
  }
}
