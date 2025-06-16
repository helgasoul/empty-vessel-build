
export interface CRCProFormData {
  // Базовая информация
  age: number;
  gender: 'male' | 'female';
  height_cm?: number;
  weight_kg?: number;
  
  // Семейная история
  family_history_crc: boolean;
  family_history_polyps: boolean;
  family_history_ibd: boolean;
  number_affected_relatives: number;
  
  // Личная медицинская история
  personal_history_polyps: boolean;
  personal_history_ibd: boolean;
  diabetes_type2: boolean;
  previous_colonoscopy: boolean;
  last_colonoscopy_date?: string;
  
  // Образ жизни
  smoking_status?: 'never' | 'former' | 'current';
  alcohol_consumption?: 'none' | 'light' | 'moderate' | 'heavy';
  physical_activity?: 'low' | 'moderate' | 'high';
  
  // Диетические факторы
  red_meat_consumption?: 'low' | 'moderate' | 'high';
  processed_meat_consumption?: 'low' | 'moderate' | 'high';
  fiber_intake?: 'low' | 'moderate' | 'high';
  vegetable_intake?: 'low' | 'moderate' | 'high';
  
  // Дополнительные факторы
  nsaid_use: boolean;
  calcium_supplements: boolean;
  multivitamin_use: boolean;
}

export interface CRCProRiskResult {
  risk_percentage: number;
  risk_level: 'low' | 'moderate' | 'high' | 'very_high';
  recommendations: string[];
  explanation: string;
}
