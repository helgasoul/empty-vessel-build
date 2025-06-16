
import { supabase } from '@/integrations/supabase/client';
import { FraminghamAlzheimerFormData, FraminghamAlzheimerRiskResult } from './types';

export const saveFraminghamAssessment = async (
  userId: string,
  data: FraminghamAlzheimerFormData,
  result: FraminghamAlzheimerRiskResult
) => {
  const { error } = await supabase
    .from('risk_assessments')
    .insert({
      user_id: userId,
      assessment_type: 'framingham_alzheimer',
      assessment_data: data as any,
      results_data: result as any,
      risk_percentage: result.tenYearRisk,
      risk_level: result.riskLevel,
      recommendations: result.recommendations,
    });

  if (error) throw error;
};
