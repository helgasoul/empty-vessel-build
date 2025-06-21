
import { AIRecommendation, PatientProfile } from '@/types/patient';

export class AIRecommendationsService {
  static async generateAIRecommendations(patientData: PatientProfile): Promise<AIRecommendation[]> {
    const recommendations: AIRecommendation[] = [];

    // Анализ на основе результатов анализов
    if (patientData.labResults.length > 0) {
      const latestLab = patientData.labResults[0];
      
      // Проверка критических значений
      for (const [key, value] of Object.entries(latestLab.results)) {
        if (value.isAbnormal) {
          recommendations.push({
            id: `rec_${Date.now()}_${key}`,
            type: 'medical',
            category: 'Результаты анализов',
            title: `Обратите внимание на показатель ${key}`,
            description: `Значение ${key} выходит за пределы нормы`,
            actionItems: [
              'Обратитесь к врачу для консультации',
              'Повторите анализ через 2-4 недели',
              'Следуйте рекомендациям по образу жизни'
            ],
            priority: value.severity === 'severe' ? 'critical' : 'high',
            basedOn: ['lab_results'],
            confidence: 0.9,
            generatedAt: new Date(),
            status: 'new'
          });
        }
      }
    }

    return recommendations;
  }

  static getDefaultRecommendations(): AIRecommendation[] {
    return [
      {
        id: '1',
        type: 'lifestyle',
        category: 'Физическая активность',
        title: 'Увеличьте физическую активность',
        description: 'Рекомендуется увеличить количество шагов до 10,000 в день',
        actionItems: [
          'Начните с 15-минутных прогулок',
          'Используйте лестницу вместо лифта',
          'Паркуйтесь дальше от места назначения'
        ],
        priority: 'medium',
        basedOn: ['health_assessment', 'activity_data'],
        confidence: 0.8,
        generatedAt: new Date(),
        status: 'new'
      }
    ];
  }
}
