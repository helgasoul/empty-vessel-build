
import * as z from 'zod';

export const framinghamAlzheimerSchema = z.object({
  age: z.number().min(40).max(95),
  gender: z.enum(['male', 'female']),
  education_years: z.number().min(0).max(25),
  apoe4_status: z.enum([
    'unknown',
    'negative',
    'heterozygous', // одна копия
    'homozygous'    // две копии
  ]),
  family_history_dementia: z.boolean().default(false),
  cardiovascular_disease: z.boolean().default(false),
  diabetes: z.boolean().default(false),
  hypertension: z.boolean().default(false),
  smoking_status: z.enum(['never', 'former', 'current']),
  physical_activity: z.enum(['low', 'moderate', 'high']),
  bmi: z.number().min(15).max(50).optional(),
  depression_history: z.boolean().default(false),
  head_injury_history: z.boolean().default(false),
  alcohol_consumption: z.enum(['none', 'light', 'moderate', 'heavy']),
  social_isolation: z.boolean().default(false),
  cognitive_complaints: z.boolean().default(false),
});

export type FraminghamAlzheimerFormData = z.infer<typeof framinghamAlzheimerSchema>;

export interface FraminghamAlzheimerRiskResult {
  tenYearRisk: number;
  lifetimeRisk: number;
  riskLevel: 'low' | 'intermediate' | 'high';
  riskFactors: string[];
  protectiveFactors: string[];
  recommendations: string[];
}
