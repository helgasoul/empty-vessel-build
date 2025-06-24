// types/gail-calculator.ts
// Типы и интерфейсы для Enhanced Gail Calculator

export interface PatientData {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  email?: string;
  phone?: string;
  medicalHistory: MedicalRecord[];
  riskAssessments: RiskAssessment[];
}

export interface MedicalRecord {
  id: string;
  date: Date;
  type: 'screening' | 'diagnostic' | 'genetic' | 'consultation';
  provider: string;
  findings: string;
  recommendations: string[];
  attachments?: FileAttachment[];
}

export interface FileAttachment {
  id: string;
  fileName: string;
  fileType: 'image' | 'document' | 'dicom';
  url: string;
  uploadedAt: Date;
}

// ========== GAIL MODEL ТИПЫ ==========

export interface GailModelInput {
  // Основные демографические данные
  age: number; // 35-90 лет
  race: RaceEthnicity;
  
  // Репродуктивная история
  ageAtMenarche: number; // 9-16 лет
  ageAtFirstBirth: number | null; // null = nulliparity
  numberOfChildren?: number;
  breastfeedingDuration?: number; // месяцы
  
  // Медицинская история
  numberOfBiopsies: number; // 0-3+
  atypicalHyperplasia: boolean;
  lcisHistory?: boolean; // Lobular carcinoma in situ
  
  // Семейный анамнез
  firstDegreeRelatives: number; // количество с РМЖ
  familyHistoryAge?: number[]; // возраст диагноза у родственников
  ovariesCancerFamily?: number; // родственники с раком яичников
  
  // Дополнительные факторы (Enhanced версия)
  breastDensity?: BreastDensity;
  hormonalTherapy?: HormonalTherapyType;
  hormonalTherapyDuration?: number; // годы
  geneticTestingResults?: GeneticResults[];
  bmi?: number;
  alcoholConsumption?: AlcoholLevel;
  physicalActivity?: ActivityLevel;
  smokingHistory?: SmokingHistory;
}

export type RaceEthnicity = 
  | 'white' 
  | 'african-american' 
  | 'hispanic' 
  | 'asian-pacific' 
  | 'native-american' 
  | 'other';

export type BreastDensity = 
  | 'almost-entirely-fatty' 
  | 'scattered-densities' 
  | 'heterogeneously-dense' 
  | 'extremely-dense';

export type HormonalTherapyType = 
  | 'none' 
  | 'estrogen-only' 
  | 'estrogen-progestin' 
  | 'selective-estrogen-receptor-modulators';

export type AlcoholLevel = 'none' | 'light' | 'moderate' | 'heavy';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'vigorous';

export interface SmokingHistory {
  status: 'never' | 'current' | 'former';
  packsPerDay?: number;
  yearsSmoked?: number;
  quitDate?: Date;
}

export interface GeneticResults {
  gene: 'BRCA1' | 'BRCA2' | 'TP53' | 'PTEN' | 'ATM' | 'CHEK2' | 'PALB2';
  result: 'positive' | 'negative' | 'variant-of-uncertain-significance';
  testDate: Date;
  laboratory: string;
}

// ========== РЕЗУЛЬТАТЫ РАСЧЕТА ==========

export interface GailModelResult {
  // Основные риски
  fiveYearRisk: number; // 5-летний абсолютный риск (%)
  lifetimeRisk: number; // пожизненный риск до 90 лет (%)
  tenYearRisk?: number; // 10-летний риск (для Enhanced версии)
  
  // Сравнительные данные
  averageRisk: number; // средний риск для возраста и расы
  relativeRisk: number; // относительный риск (отношение к среднему)
  
  // Категоризация
  riskCategory: RiskCategory;
  biradsEquivalent?: number; // эквивалент BI-RADS (для интеграции с маммографией)
  
  // Доверительные интервалы
  confidenceInterval?: {
    lower: number;
    upper: number;
    level: number; // 95% обычно
  };
  
  // Качество расчета
  confidenceLevel: number; // уверенность модели (60-95%)
  dataCompleteness: number; // полнота входных данных (%)
  
  // Рекомендации
  recommendations: ClinicalRecommendation[];
  screeningProtocol: ScreeningProtocol;
  
  // Enhanced факторы (ИИ анализ)
  enhancedFactors?: EnhancedRiskFactors;
  
  // Метаданные расчета
  calculationMetadata: CalculationMetadata;
}

export type RiskCategory = 
  | 'низкий'      // < 1.67%
  | 'умеренный'   // 1.67-3.0%
  | 'повышенный'  // 3.0-5.0%
  | 'высокий';    // > 5.0%

export interface ClinicalRecommendation {
  category: 'screening' | 'prevention' | 'genetic' | 'lifestyle';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  evidence: EvidenceLevel;
  timeline?: string; // "немедленно", "в течение месяца"
  provider?: string; // "онколог-маммолог", "генетик"
}

export type EvidenceLevel = 'I' | 'II-1' | 'II-2' | 'II-3' | 'III';

export interface ScreeningProtocol {
  mammographyFrequency: 'annual' | 'biennial' | 'individualized';
  startAge: number;
  additionalImaging?: ('breast-mri' | 'breast-ultrasound' | 'tomosynthesis')[];
  clinicalExamFrequency: 'every-6-months' | 'annual' | 'biennial';
  selfExamRecommended: boolean;
  nextScreeningDate?: Date;
}

export interface EnhancedRiskFactors {
  // ИИ-анализ дополнительных факторов
  environmentalRisk: {
    score: number; // 0-100
    factors: string[];
    impact: 'low' | 'moderate' | 'high';
  };
  
  lifestyleRisk: {
    score: number;
    modifiableFactors: LifestyleFactor[];
    potentialReduction: number; // возможное снижение риска (%)
  };
  
  geneticPredisposition: {
    score: number;
    knownMutations: GeneticResults[];
    polygeneticRiskScore?: number;
    recommendation: string;
  };
  
  metabolicFactors?: {
    insulinResistance: number;
    hormonalProfile: HormonalProfile;
    inflammation: InflammationMarkers;
  };
}

export interface LifestyleFactor {
  factor: 'diet' | 'exercise' | 'alcohol' | 'smoking' | 'stress' | 'sleep';
  currentLevel: string;
  targetLevel: string;
  riskReduction: number; // потенциальное снижение риска (%)
  actionItems: string[];
}

export interface HormonalProfile {
  estradiol?: number;
  testosterone?: number;
  progesterone?: number;
  shbg?: number; // Sex hormone-binding globulin
  analyzed: boolean;
}

export interface InflammationMarkers {
  crp?: number; // C-reactive protein
  il6?: number; // Interleukin-6
  tnfAlpha?: number;
  analyzed: boolean;
}

export interface CalculationMetadata {
  modelVersion: string; // версия модели Gail
  calculationDate: Date;
  calculatedBy?: string; // ID врача/пользователя
  inputHash: string; // хеш входных данных для кеширования
  processingTime: number; // время расчета в мс
  enhancementsUsed: Enhancement[];
}

export interface Enhancement {
  type: 'ai-analysis' | 'external-data' | 'genetic-integration' | 'imaging-correlation';
  version: string;
  confidence: number;
  dataSource?: string;
}

// ========== ВАЛИДАЦИЯ ==========

export interface ValidationError {
  field: keyof GailModelInput;
  message: string;
  severity: 'error' | 'warning';
}

export interface GailCalculationHistory {
  id: string;
  patientId?: string;
  input: GailModelInput;
  result: GailModelResult;
  createdAt: Date;
  notes?: string;
}

// ========== ДАШБОРД ТИПЫ ==========

export interface DoctorMetrics {
  todayPatients: number;
  pendingCalculations: number;
  highRiskPatients: number;
  averageRiskScore: number;
  completedToday: number;
  accuracy: number;
}

export interface PatientQueue {
  id: string;
  name: string;
  age: number;
  scheduledTime: string;
  riskStatus: RiskCategory | 'pending';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  lastCalculation?: Date;
}

export interface RiskAlert {
  id: string;
  patientId: string;
  patientName: string;
  riskLevel: RiskCategory;
  reason: string;
  timestamp: Date;
  acknowledged: boolean;
}

export interface RiskAssessment {
  id: string;
  type: 'gail' | 'prevent' | 'frax';
  result: GailModelResult;
  createdAt: Date;
  updatedAt: Date;
}