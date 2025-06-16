
import { z } from 'zod';

export const cancerRiskSchema = z.object({
  // Основная информация
  age: z.number().min(18).max(100),
  gender: z.enum(['male', 'female']),
  
  // Физические характеристики
  height: z.number().min(100).max(250), // см
  weight: z.number().min(30).max(300), // кг
  
  // Образ жизни
  smoking_status: z.enum(['never', 'former', 'current']),
  smoking_years: z.number().min(0).max(80).optional(),
  cigarettes_per_day: z.number().min(0).max(100).optional(),
  alcohol_consumption: z.enum(['none', 'light', 'moderate', 'heavy']),
  physical_activity: z.enum(['low', 'moderate', 'high']),
  
  // Питание
  fruit_vegetable_intake: z.enum(['low', 'moderate', 'high']),
  red_meat_consumption: z.enum(['low', 'moderate', 'high']),
  processed_meat_consumption: z.enum(['low', 'moderate', 'high']),
  
  // Медицинская история
  diabetes: z.boolean(),
  inflammatory_bowel_disease: z.boolean(),
  previous_cancer_history: z.boolean(),
  previous_cancer_types: z.array(z.string()).optional(),
  
  // Семейная история
  family_cancer_history: z.boolean(),
  family_cancer_types: z.array(z.string()).optional(),
  family_cancer_degree: z.enum(['first', 'second', 'both']).optional(),
  
  // Репродуктивные факторы (для женщин)
  age_at_menarche: z.number().min(8).max(18).optional(),
  age_at_menopause: z.number().min(35).max(65).optional(),
  pregnancies_count: z.number().min(0).max(20).optional(),
  age_at_first_birth: z.number().min(15).max(50).optional(),
  breastfeeding_duration: z.number().min(0).max(120).optional(), // месяцы
  hormone_replacement_therapy: z.boolean().optional(),
  oral_contraceptive_use: z.boolean().optional(),
  
  // Факторы окружающей среды
  sun_exposure: z.enum(['low', 'moderate', 'high']),
  skin_type: z.enum(['very_fair', 'fair', 'medium', 'olive', 'brown', 'black']),
  occupational_exposure: z.boolean(),
  exposure_types: z.array(z.string()).optional(),
  
  // Скрининг
  mammography_frequency: z.enum(['never', 'irregular', 'regular']).optional(),
  pap_smear_frequency: z.enum(['never', 'irregular', 'regular']).optional(),
  colonoscopy_frequency: z.enum(['never', 'irregular', 'regular']).optional(),
});

export type CancerRiskFormData = z.infer<typeof cancerRiskSchema>;

export interface CancerTypeRisk {
  type: string;
  name: string;
  tenYearRisk: number;
  lifetimeRisk: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'very_high';
  majorRiskFactors: string[];
}

export interface CancerRiskResult {
  overallRisk: {
    tenYearRisk: number;
    lifetimeRisk: number;
    riskLevel: 'low' | 'moderate' | 'high' | 'very_high';
  };
  cancerTypes: CancerTypeRisk[];
  recommendations: string[];
  screeningRecommendations: string[];
  lifestyleRecommendations: string[];
  populationComparison: {
    percentile: number;
    comparedToAge: string;
    comparedToGender: string;
  };
}
