
import { supabase } from '@/integrations/supabase/client';
import { CancerRiskFormData, CancerRiskResult } from './types';

export const saveCancerRiskAssessment = async (
  userId: string,
  data: CancerRiskFormData,
  result: CancerRiskResult
) => {
  try {
    // Валидируем данные перед сохранением
    if (!userId) {
      throw new Error('User ID is required');
    }

    if (!result.overallRisk) {
      throw new Error('Overall risk data is missing');
    }

    // Собираем все рекомендации в один массив
    const allRecommendations = [
      ...(result.recommendations || []),
      ...(result.screeningRecommendations || []),
      ...(result.lifestyleRecommendations || [])
    ].filter(rec => rec && rec.trim().length > 0); // Фильтруем пустые рекомендации

    // Валидируем риск
    const riskPercentage = result.overallRisk.tenYearRisk || 0;
    const riskLevel = result.overallRisk.riskLevel || 'low';

    console.log('Saving cancer risk assessment:', {
      userId,
      riskPercentage,
      riskLevel,
      recommendationsCount: allRecommendations.length
    });

    const { data: savedData, error } = await supabase
      .from('risk_assessments')
      .insert({
        user_id: userId,
        assessment_type: 'cancer_risk',
        assessment_data: JSON.parse(JSON.stringify(data)), // Убираем возможные circular references
        results_data: JSON.parse(JSON.stringify(result)), // Убираем возможные circular references
        risk_percentage: Math.max(0, Math.min(100, riskPercentage)), // Ограничиваем диапазон 0-100
        risk_level: riskLevel,
        recommendations: allRecommendations,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Ошибка сохранения в базе данных: ${error.message}`);
    }

    console.log('Cancer risk assessment saved successfully:', savedData);
    return savedData;
  } catch (error) {
    console.error('Error in saveCancerRiskAssessment:', error);
    throw error;
  }
};
