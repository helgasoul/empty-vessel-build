
import { supabase } from "@/integrations/supabase/client";
import { CRCProFormData, CRCProRiskResult } from "./types";

export const saveCRCProAssessment = async (
  formData: CRCProFormData,
  riskResult: CRCProRiskResult
) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Пользователь не авторизован');

  // Сначала сохраняем основную оценку риска
  const { data: riskAssessment, error: riskError } = await supabase
    .from('risk_assessments')
    .insert({
      user_id: user.id,
      assessment_type: 'crc_pro',
      risk_percentage: riskResult.risk_percentage,
      risk_level: riskResult.risk_level,
      assessment_data: formData,
      results_data: riskResult,
      recommendations: riskResult.recommendations
    })
    .select()
    .single();

  if (riskError) throw riskError;

  // Затем сохраняем специфические данные CRC-PRO
  const { error: crcError } = await supabase
    .from('crc_pro_assessments')
    .insert({
      user_id: user.id,
      assessment_id: riskAssessment.id,
      ...formData
    });

  if (crcError) throw crcError;

  return riskAssessment;
};
