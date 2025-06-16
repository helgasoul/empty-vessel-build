
import { z } from 'zod';

export const demportSchema = z.object({
  age: z.number().min(40).max(100),
  gender: z.enum(['male', 'female']),
  education_years: z.number().min(0).max(25),
  apoe4_status: z.enum(['none', 'one_copy', 'two_copies', 'unknown']),
  
  // Сердечно-сосудистые факторы
  systolic_bp: z.number().min(80).max(250),
  total_cholesterol: z.number().min(100).max(400),
  hdl_cholesterol: z.number().min(20).max(100),
  diabetes: z.boolean(),
  smoking_status: z.enum(['never', 'former', 'current']),
  
  // Образ жизни
  physical_activity: z.enum(['low', 'moderate', 'high']),
  bmi: z.number().min(15).max(50).optional(),
  alcohol_consumption: z.enum(['none', 'light', 'moderate', 'heavy']),
  
  // Медицинская история
  depression_history: z.boolean(),
  head_injury_history: z.boolean(),
  stroke_history: z.boolean(),
  heart_disease: z.boolean(),
  
  // Когнитивные и социальные факторы
  cognitive_activities: z.enum(['low', 'moderate', 'high']),
  social_engagement: z.enum(['low', 'moderate', 'high']),
  sleep_quality: z.enum(['poor', 'fair', 'good']),
  stress_levels: z.enum(['low', 'moderate', 'high']),
  
  // Семейная история
  family_dementia_history: z.boolean(),
  family_cardiovascular_history: z.boolean(),
});

export type DemPortFormData = z.infer<typeof demportSchema>;

export interface DemPortRiskResult {
  tenYearRisk: number;
  lifetimeRisk: number;
  riskLevel: 'low' | 'intermediate' | 'high';
  riskFactors: string[];
  protectiveFactors: string[];
  recommendations: string[];
  populationPercentile: number;
}
