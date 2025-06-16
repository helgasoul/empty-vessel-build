
import * as z from 'zod';

export const brcaSchema = z.object({
  brca1_mutation: z.boolean().default(false),
  brca2_mutation: z.boolean().default(false),
  family_history_breast: z.boolean().default(false),
  family_history_ovarian: z.boolean().default(false),
  ashkenazi_ancestry: z.boolean().default(false),
  age: z.number().min(18).max(100),
  gender: z.enum(['female', 'male']),
});

export type BRCAFormData = z.infer<typeof brcaSchema>;

export interface BRCARiskResult {
  riskPercentage: number;
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
}
