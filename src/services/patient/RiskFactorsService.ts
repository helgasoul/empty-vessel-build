
import { supabase } from '@/integrations/supabase/client';
import { RiskFactors, CancerTypeRisk } from '@/types/patient';

export class RiskFactorsService {
  static async loadRiskFactors(patientId: string): Promise<RiskFactors> {
    const { data } = await supabase
      .from('risk_assessments')
      .select('*')
      .eq('user_id', patientId) // Fixed back to user_id
      .order('created_at', { ascending: false })
      .limit(1);

    // Генерируем демонстрационные данные для примера
    const mockCancerTypes: CancerTypeRisk[] = [
      {
        type: 'Рак молочной железы',
        score: 2.1,
        level: 'moderate',
        specificFactors: [
          'Семейная история рака молочной железы',
          'Возраст старше 40 лет',
          'Плотная ткань молочной железы'
        ]
      },
      {
        type: 'Колоректальный рак',
        score: 1.8,
        level: 'low',
        specificFactors: [
          'Низкое потребление клетчатки',
          'Сидячий образ жизни'
        ]
      },
      {
        type: 'Рак легких',
        score: 1.2,
        level: 'low',
        specificFactors: [
          'Отсутствие курения',
          'Хорошее качество воздуха'
        ]
      }
    ];

    return {
      cardiovascular: {
        score: 2.3,
        level: 'moderate' as const,
        factors: [
          'Повышенный уровень холестерина',
          'Семейная история сердечных заболеваний',
          'Малоподвижный образ жизни'
        ],
        recommendations: [
          'Увеличить физическую активность до 150 минут в неделю',
          'Снизить потребление насыщенных жиров',
          'Регулярно проверять артериальное давление'
        ],
        calculatedScores: {
          framinghamScore: 12.5,
          reynoldsScore: 8.3
        }
      },
      cancer: {
        score: 2.0,
        level: 'moderate' as const,
        factors: [
          'Семейная история онкологических заболеваний',
          'Возрастной фактор',
          'Экологические факторы'
        ],
        types: mockCancerTypes,
        geneticFactors: [
          'Мутация BRCA1/BRCA2 не обнаружена',
          'Повышенный риск по материнской линии'
        ],
        recommendations: [
          'Регулярные скрининговые обследования',
          'Поддержание здорового веса',
          'Ограничение алкоголя'
        ]
      },
      diabetes: {
        score: 1.8,
        level: 'low' as const,
        type: 'type2' as const,
        factors: [
          'Нормальный ИМТ',
          'Отсутствие семейной истории диабета'
        ],
        recommendations: [
          'Поддерживать активный образ жизни',
          'Контролировать потребление углеводов'
        ]
      },
      osteoporosis: {
        score: 1.5,
        level: 'low' as const,
        factors: [
          'Достаточное потребление кальция',
          'Регулярные физические нагрузки'
        ],
        recommendations: [
          'Увеличить потребление витамина D',
          'Силовые тренировки 2-3 раза в неделю'
        ]
      },
      mentalHealth: {
        depressionScore: 2,
        anxietyScore: 3,
        stressScore: 4,
        level: 'moderate' as const,
        factors: [
          'Рабочий стресс',
          'Недостаток сна',
          'Социальная изоляция'
        ],
        recommendations: [
          'Практика медитации и релаксации',
          'Улучшение качества сна',
          'Консультация с психологом'
        ]
      },
      calculatedScores: {
        framinghamScore: 12.5,
        reynoldsScore: 8.3,
        homaIR: 2.1,
        ft3ft4Ratio: 0.28,
        tshft4Ratio: 0.31,
        faiIndex: 4.2,
        nlrRatio: 1.8,
        tghdlRatio: 2.1
      },
      lastUpdated: new Date()
    };
  }

  static async saveRiskAssessment(patientId: string, riskData: Partial<RiskFactors>): Promise<void> {
    // Based on the database schema, we need to insert into risk_assessments table
    // with the correct column names
    const { error } = await supabase
      .from('risk_assessments')
      .insert({
        assessment_type: 'comprehensive',
        risk_percentage: this.calculateOverallRiskPercentage(riskData),
        risk_level: this.calculateOverallRiskLevel(riskData),
        assessment_data: riskData,
        results_data: riskData,
        recommendations: this.getAllRecommendations(riskData)
      });

    if (error) throw error;
  }

  private static calculateOverallRiskPercentage(riskData: Partial<RiskFactors>): number {
    if (!riskData.cardiovascular && !riskData.cancer && !riskData.diabetes) return 0;
    
    const scores = [
      riskData.cardiovascular?.score || 0,
      riskData.cancer?.score || 0,
      riskData.diabetes?.score || 0,
      riskData.osteoporosis?.score || 0
    ];
    
    return (scores.reduce((sum, score) => sum + score, 0) / scores.length) * 20;
  }

  private static calculateOverallRiskLevel(riskData: Partial<RiskFactors>): string {
    const percentage = this.calculateOverallRiskPercentage(riskData);
    
    if (percentage < 20) return 'low';
    if (percentage < 40) return 'moderate';
    if (percentage < 70) return 'high';
    return 'very-high';
  }

  private static getAllRecommendations(riskData: Partial<RiskFactors>): string[] {
    const recommendations: string[] = [];
    
    if (riskData.cardiovascular?.recommendations) {
      recommendations.push(...riskData.cardiovascular.recommendations);
    }
    if (riskData.cancer?.recommendations) {
      recommendations.push(...riskData.cancer.recommendations);
    }
    if (riskData.diabetes?.recommendations) {
      recommendations.push(...riskData.diabetes.recommendations);
    }
    if (riskData.osteoporosis?.recommendations) {
      recommendations.push(...riskData.osteoporosis.recommendations);
    }
    if (riskData.mentalHealth?.recommendations) {
      recommendations.push(...riskData.mentalHealth.recommendations);
    }
    
    return recommendations;
  }
}
