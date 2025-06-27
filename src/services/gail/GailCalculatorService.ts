import { supabase } from '@/integrations/supabase/client';

export interface GailInputData {
  age: number;
  ageAtFirstPeriod: number;
  ageAtFirstBirth: number | null;
  firstDegreeRelatives: number;
  biopsies: number;
  atypicalHyperplasia: boolean;
  race: 'white' | 'black' | 'hispanic' | 'asian' | 'other';
}

export interface GailResult {
  fiveYear: number;
  lifetime: number;
  sameAgeGroup: number;
}

export class GailCalculatorService {
  static calculateRisk(data: GailInputData): GailResult {
    // Age-based baseline risk (5-year risk per 1000 women)
    const ageRiskFactors: Record<number, { fiveYear: number; lifetime: number; sameAgeGroup: number }> = {
      35: { fiveYear: 3.8, lifetime: 92.1, sameAgeGroup: 3.8 },
      40: { fiveYear: 5.5, lifetime: 89.2, sameAgeGroup: 5.5 },
      45: { fiveYear: 8.1, lifetime: 85.8, sameAgeGroup: 8.1 },
      50: { fiveYear: 11.4, lifetime: 81.8, sameAgeGroup: 11.4 },
      55: { fiveYear: 15.1, lifetime: 77.1, sameAgeGroup: 15.1 },
      60: { fiveYear: 18.8, lifetime: 71.8, sameAgeGroup: 18.8 },
      65: { fiveYear: 22.1, lifetime: 65.8, sameAgeGroup: 22.1 },
      70: { fiveYear: 24.5, lifetime: 59.2, sameAgeGroup: 24.5 }
    };

    // Find the appropriate age group
    let baseRisk = ageRiskFactors[35];
    for (const age of Object.keys(ageRiskFactors).map(Number).sort((a, b) => a - b)) {
      if (data.age >= age) {
        baseRisk = ageRiskFactors[age];
      }
    }

    let riskMultiplier = 1.0;

    // Age at first menstrual period
    if (data.ageAtFirstPeriod < 12) {
      riskMultiplier *= 1.21;
    } else if (data.ageAtFirstPeriod >= 14) {
      riskMultiplier *= 0.93;
    }

    // Age at first live birth
    if (data.ageAtFirstBirth === null) {
      // Nulliparous
      riskMultiplier *= 1.24;
    } else if (data.ageAtFirstBirth < 20) {
      riskMultiplier *= 0.76;
    } else if (data.ageAtFirstBirth >= 30) {
      riskMultiplier *= 1.24;
    }

    // First-degree relatives with breast cancer
    if (data.firstDegreeRelatives === 1) {
      riskMultiplier *= 1.78;
    } else if (data.firstDegreeRelatives >= 2) {
      riskMultiplier *= 2.76;
    }

    // Number of breast biopsies
    if (data.biopsies === 1) {
      riskMultiplier *= 1.27;
    } else if (data.biopsies >= 2) {
      riskMultiplier *= 1.62;
    }

    // Atypical hyperplasia
    if (data.atypicalHyperplasia) {
      riskMultiplier *= 1.82;
    }

    // Race/ethnicity adjustments
    switch (data.race) {
      case 'black':
        riskMultiplier *= 0.85;
        break;
      case 'hispanic':
        riskMultiplier *= 0.73;
        break;
      case 'asian':
        riskMultiplier *= 0.65;
        break;
      case 'other':
        riskMultiplier *= 0.80;
        break;
    }

    const adjustedFiveYear = Math.round((baseRisk.fiveYear * riskMultiplier) * 10) / 10;
    const adjustedLifetime = Math.round((baseRisk.lifetime * riskMultiplier) * 10) / 10;
    const adjustedSameAge = Math.round((baseRisk.sameAgeGroup * riskMultiplier) * 10) / 10;

    return {
      fiveYear: Math.min(adjustedFiveYear, 50.0), // Cap at 50%
      lifetime: Math.min(adjustedLifetime, 100.0), // Cap at 100%
      sameAgeGroup: Math.min(adjustedSameAge, 50.0) // Cap at 50%
    };
  }

  static async saveAssessment(userId: string, inputData: GailInputData, results: GailResult) {
    try {
      const { data, error } = await supabase
        .from('risk_assessments')
        .insert({
          user_id: userId,
          assessment_type: 'gail_breast_cancer',
          assessment_data: inputData as any,
          results_data: results as any,
          risk_percentage: results.fiveYear,
          risk_level: results.fiveYear < 1.7 ? 'low' : results.fiveYear < 5.0 ? 'moderate' : 'high',
          recommendations: GailCalculatorService.generateRecommendations(results)
        })
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving Gail assessment:', error);
      throw error;
    }
  }

  static generateRecommendations(results: GailResult): string[] {
    const recommendations: string[] = [];

    if (results.fiveYear >= 1.7) {
      recommendations.push('Обсудите с врачом возможность химиопрофилактики');
      recommendations.push('Рассмотрите усиленный скрининг с МРТ молочных желез');
    }

    if (results.fiveYear >= 3.0) {
      recommendations.push('Генетическое консультирование может быть полезным');
      recommendations.push('Обсудите с врачом участие в программах раннего выявления');
    }

    // Always include general recommendations
    recommendations.push('Регулярные маммографии согласно возрастным рекомендациям');
    recommendations.push('Ежемесячное самообследование молочных желез');
    recommendations.push('Поддержание здорового образа жизни');

    return recommendations;
  }

  static getRiskLevel(fiveYearRisk: number): 'low' | 'moderate' | 'high' {
    if (fiveYearRisk < 1.7) return 'low';
    if (fiveYearRisk < 5.0) return 'moderate';
    return 'high';
  }

  static getRiskDescription(results: GailResult): string {
    const level = GailCalculatorService.getRiskLevel(results.fiveYear);
    
    switch (level) {
      case 'low':
        return `Ваш риск развития рака молочной железы в течение следующих 5 лет составляет ${results.fiveYear}%, что считается низким риском.`;
      case 'moderate':
        return `Ваш риск развития рака молочной железы в течение следующих 5 лет составляет ${results.fiveYear}%, что считается умеренным риском.`;
      case 'high':
        return `Ваш риск развития рака молочной железы в течение следующих 5 лет составляет ${results.fiveYear}%, что считается высоким риском.`;
    }
  }
}
