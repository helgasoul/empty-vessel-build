
import { supabase } from '@/integrations/supabase/client';
import { RaisRiskFormData, RaisRiskResult } from './types';

export const saveRaisRiskAssessment = async (
  userId: string,
  data: RaisRiskFormData,
  result: RaisRiskResult
) => {
  const { error } = await supabase
    .from('risk_assessments')
    .insert({
      user_id: userId,
      assessment_type: 'rais_chemical',
      assessment_data: data as any,
      results_data: result as any,
      risk_percentage: result.overallRisk.totalCancerRisk * 100,
      risk_level: result.overallRisk.riskLevel,
      recommendations: [
        ...result.recommendations,
        ...result.protectiveMeasures,
        ...result.monitoringRecommendations
      ],
    });

  if (error) throw error;
};
