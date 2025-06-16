
import { supabase } from '@/integrations/supabase/client';
import { CancerRiskFormData, CancerRiskResult } from './types';

export const saveCancerRiskAssessment = async (
  userId: string,
  data: CancerRiskFormData,
  result: CancerRiskResult
) => {
  const { error } = await supabase
    .from('risk_assessments')
    .insert({
      user_id: userId,
      assessment_type: 'cancer_risk',
      assessment_data: data as any,
      results_data: result as any,
      risk_percentage: result.overallRisk.tenYearRisk,
      risk_level: result.overallRisk.riskLevel,
      recommendations: [
        ...result.recommendations,
        ...result.screeningRecommendations,
        ...result.lifestyleRecommendations
      ],
    });

  if (error) throw error;
};
