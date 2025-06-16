
import { z } from 'zod';

export const raisRiskSchema = z.object({
  // Основная информация
  age: z.number().min(0).max(100),
  gender: z.enum(['male', 'female']),
  body_weight: z.number().min(30).max(200), // кг
  
  // Параметры экспозиции
  exposure_scenario: z.enum(['residential', 'occupational', 'industrial', 'recreational']),
  exposure_duration: z.number().min(0).max(70), // лет
  exposure_frequency: z.number().min(1).max(365), // дней в году
  exposure_time_per_day: z.number().min(0).max(24), // часов в день
  
  // Химические вещества и концентрации
  chemical_substance: z.enum([
    'benzene',
    'toluene',
    'formaldehyde',
    'mercury',
    'lead',
    'cadmium',
    'chromium_vi',
    'arsenic',
    'vinyl_chloride',
    'dichloromethane',
    'tetrachloroethylene',
    'trichloroethylene',
    'pcb',
    'dioxin',
    'pah',
    'other'
  ]),
  other_chemical_name: z.string().optional(),
  
  // Пути воздействия
  inhalation_exposure: z.boolean(),
  inhalation_concentration: z.number().min(0).optional(), // мг/м³
  
  dermal_exposure: z.boolean(),
  dermal_concentration: z.number().min(0).optional(), // мг/см²
  skin_surface_area: z.number().min(0).max(25000).optional(), // см²
  
  oral_exposure: z.boolean(),
  oral_dose: z.number().min(0).optional(), // мг/кг/день
  
  // Факторы среды
  air_temperature: z.number().min(-40).max(50), // °C
  humidity: z.number().min(0).max(100), // %
  soil_type: z.enum(['clay', 'sand', 'loam', 'organic']),
  
  // Образ жизни
  smoking_status: z.enum(['never', 'former', 'current']),
  alcohol_consumption: z.enum(['none', 'light', 'moderate', 'heavy']),
  diet_type: z.enum(['standard', 'vegetarian', 'high_fish', 'organic']),
  
  // Медицинская история
  respiratory_diseases: z.boolean(),
  liver_diseases: z.boolean(),
  kidney_diseases: z.boolean(),
  cardiovascular_diseases: z.boolean(),
  immune_disorders: z.boolean(),
  
  // Профессиональные факторы
  work_environment: z.enum(['office', 'industrial', 'laboratory', 'outdoor', 'healthcare', 'other']),
  protective_equipment_use: z.boolean(),
  ventilation_quality: z.enum(['poor', 'adequate', 'good', 'excellent']),
  
  // Жилищные условия
  housing_type: z.enum(['apartment', 'house', 'mobile_home', 'other']),
  housing_age: z.number().min(0).max(150), // лет
  proximity_to_industrial_sites: z.enum(['very_close', 'close', 'moderate', 'far']),
  water_source: z.enum(['municipal', 'well', 'bottled', 'other']),
});

export type RaisRiskFormData = z.infer<typeof raisRiskSchema>;

export interface ChemicalRiskResult {
  substance: string;
  cancerRisk: number;
  nonCancerRisk: number;
  exposureRoute: string;
  riskLevel: 'acceptable' | 'of_concern' | 'high' | 'very_high';
}

export interface RaisRiskResult {
  overallRisk: {
    totalCancerRisk: number;
    totalNonCancerRisk: number;
    hazardIndex: number;
    riskLevel: 'acceptable' | 'of_concern' | 'high' | 'very_high';
  };
  chemicalRisks: ChemicalRiskResult[];
  exposureRoutes: {
    inhalation: number;
    dermal: number;
    oral: number;
  };
  recommendations: string[];
  protectiveMeasures: string[];
  monitoringRecommendations: string[];
  populationComparison: {
    percentile: number;
    comparedToAge: string;
    comparedToScenario: string;
  };
}
