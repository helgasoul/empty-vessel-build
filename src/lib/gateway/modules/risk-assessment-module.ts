
import { ApiModule, GatewayRequest } from '../types';
import { supabase } from '@/integrations/supabase/client';

export const riskAssessmentModule: ApiModule = {
  name: 'risk-assessment',
  version: '1.0.0',
  routes: {
    'POST:calculate': async (req: GatewayRequest): Promise<any> => {
      if (!req.user) {
        throw new Error('Authentication required');
      }

      const { assessmentType, assessmentData } = req.body;
      
      if (!assessmentType || !assessmentData) {
        throw new Error('Assessment type and data are required');
      }

      // Здесь будет логика расчета рисков в зависимости от типа
      let results;
      switch (assessmentType) {
        case 'qrisk3':
          results = await calculateQRISK3(assessmentData);
          break;
        case 'brca':
          results = await calculateBRCA(assessmentData);
          break;
        case 'cancer':
          results = await calculateCancerRisk(assessmentData);
          break;
        default:
          throw new Error(`Unknown assessment type: ${assessmentType}`);
      }

      // Сохраняем результаты в базу
      const { data, error } = await supabase
        .from('risk_assessments')
        .insert({
          user_id: req.user.id,
          assessment_type: assessmentType,
          assessment_data: assessmentData,
          results_data: results,
          risk_percentage: results.riskPercentage,
          risk_level: results.riskLevel,
          recommendations: results.recommendations
        })
        .select()
        .single();

      if (error) {
        throw new Error('Failed to save risk assessment: ' + error.message);
      }

      return data;
    },

    'GET:history': async (req: GatewayRequest): Promise<any> => {
      if (!req.user) {
        throw new Error('Authentication required');
      }

      const { data: assessments, error } = await supabase
        .from('risk_assessments')
        .select('*')
        .eq('user_id', req.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error('Failed to fetch assessment history: ' + error.message);
      }

      return assessments;
    },

    'GET:latest': async (req: GatewayRequest): Promise<any> => {
      if (!req.user) {
        throw new Error('Authentication required');
      }

      const { data: assessment, error } = await supabase
        .from('risk_assessments')
        .select('*')
        .eq('user_id', req.user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw new Error('Failed to fetch latest assessment: ' + error.message);
      }

      return assessment;
    }
  },

  healthCheck: async () => {
    try {
      const { error } = await supabase
        .from('risk_assessments')
        .select('count')
        .limit(1);
      
      if (error) {
        return { status: 'unhealthy', details: error.message };
      }

      return { status: 'healthy' };
    } catch (error: any) {
      return { status: 'unhealthy', details: error.message };
    }
  }
};

// Placeholder функции для расчета рисков - будут реализованы в следующих шагах
async function calculateQRISK3(data: any) {
  // Логика расчета QRISK3
  return {
    riskPercentage: 15.5,
    riskLevel: 'moderate',
    recommendations: ['Увеличить физическую активность', 'Контролировать давление']
  };
}

async function calculateBRCA(data: any) {
  // Логика расчета BRCA
  return {
    riskPercentage: 25.0,
    riskLevel: 'high',
    recommendations: ['Регулярное обследование', 'Консультация генетика']
  };
}

async function calculateCancerRisk(data: any) {
  // Логика расчета общего риска рака
  return {
    riskPercentage: 8.2,
    riskLevel: 'low',
    recommendations: ['Здоровый образ жизни', 'Регулярные скрининги']
  };
}
