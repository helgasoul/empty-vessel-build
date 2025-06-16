
import * as z from 'zod';

export const bcscSchema = z.object({
  age: z.number().min(35).max(79),
  race_ethnicity: z.enum([
    'white',
    'african_american',
    'hispanic',
    'asian',
    'native_american',
    'other'
  ]),
  family_history_first_degree: z.boolean().default(false),
  previous_breast_biopsy: z.boolean().default(false),
  biopsy_with_atypia: z.boolean().default(false),
  breast_density: z.enum([
    'almost_entirely_fatty', // BI-RADS A
    'scattered_fibroglandular', // BI-RADS B
    'heterogeneously_dense', // BI-RADS C
    'extremely_dense' // BI-RADS D
  ]),
  current_hormone_therapy: z.boolean().default(false),
  age_at_first_birth: z.number().min(0).max(60).optional(),
  nulliparous: z.boolean().default(false),
});

export type BCSCFormData = z.infer<typeof bcscSchema>;

export interface BCSCRiskResult {
  fiveYearRisk: number;
  lifetimeRisk: number;
  riskLevel: 'low' | 'intermediate' | 'high';
  recommendations: string[];
}
