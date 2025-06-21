
import { supabase } from '@/integrations/supabase/client';
import { RiskFactors } from '@/types/patient';

export class RiskFactorsService {
  static async loadRiskFactors(patientId: string): Promise<RiskFactors> {
    const { data } = await supabase
      .from('risk_assessments')
      .select('*')
      .eq('user_id', patientId)
      .order('created_at', { ascending: false })
      .limit(1);

    const defaultRisk = {
      score: 0,
      level: 'low' as const,
      factors: [],
      recommendations: []
    };

    return {
      cardiovascular: defaultRisk,
      cancer: {
        ...defaultRisk,
        types: [],
        geneticFactors: []
      },
      diabetes: {
        ...defaultRisk,
        type: 'type2' as const
      },
      osteoporosis: defaultRisk,
      mentalHealth: {
        ...defaultRisk,
        depressionScore: 0,
        anxietyScore: 0,
        stressScore: 0
      },
      calculatedScores: {
        framinghamScore: 0,
        reynoldsScore: 0
      },
      lastUpdated: new Date()
    };
  }
}
