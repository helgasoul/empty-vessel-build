
import { supabase } from '@/integrations/supabase/client';
import { DemPortFormData, DemPortRiskResult } from './types';

export const saveDemPortAssessment = async (
  userId: string,
  data: DemPortFormData,
  result: DemPortRiskResult
) => {
  const { error } = await supabase
    .from('risk_assessments')
    .insert({
      user_id: userId,
      assessment_type: 'demport',
      assessment_data: data as any,
      results_data: result as any,
      risk_percentage: result.tenYearRisk,
      risk_level: result.riskLevel,
      recommendations: result.recommendations,
    });

  if (error) throw error;
};
