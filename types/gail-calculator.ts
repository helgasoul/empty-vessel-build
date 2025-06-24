/**
 * types/gail-calculator.ts
 * 
 * Типы данных для Enhanced Gail Calculator
 * 💖 Полная типизация для безопасности и удобства разработки
 */

// ========================================
// Базовые типы
// ========================================

export type RiskLevel = 'low' | 'moderate' | 'high' | 'very_high';
export type RecommendationType = 'lifestyle' | 'screening' | 'genetic' | 'medical';

// ========================================
// Персональная информация
// ========================================

export interface PersonalInfo {
  age: number;
  race: 'caucasian' | 'african_american' | 'hispanic' | 'asian' | 'other';
  height?: number; // см
  weight?: number; // кг
  bmi?: number; // рассчитывается автоматически
}

// ========================================
// Медицинская история
// ========================================

export interface HormonalTherapy {
  everUsed: boolean;
  currentlyUsing?: boolean;
  durationMonths?: number;
  type?: 'estrogen_only' | 'combined' | 'other';
}

export interface HormonalContraception {
  everUsed: boolean;
  currentlyUsing?: boolean;
  durationMonths?: number;
  ageStarted?: number;
  ageStopped?: number;
}

export interface MedicalHistory {
  ageAtMenarche: number; // возраст первой менструации
  ageAtFirstBirth?: number; // возраст первых родов (undefined если не рожала)
  numberOfBirths: number; // количество родов
  numberOfBiopsies: number; // количество биопсий молочной железы
  atypicalHyperplasia: boolean; // атипичная гиперплазия
  lobularCarcinomaInSitu: boolean; // дольковая карцинома in situ
  hormonalReplacementTherapy?: HormonalTherapy;
  hormonalContraception?: HormonalContraception;
  breastfeedingMonths?: number; // общая продолжительность грудного вскармливания
  ageAtMenopause?: number; // возраст менопаузы (если наступила)
}

// ========================================
// Семейная история
// ========================================

export interface FirstDegreeRelatives {
  mother: boolean;
  sisters: number;
  daughters: number;
}

export interface FamilyHistory {
  breastCancerRelatives: number; // общее количество родственников с РМЖ
  ovarianCancerRelatives: number; // родственники с раком яичников
  firstDegreeRelatives?: FirstDegreeRelatives; // родственники первой степени
  maleBreastCancer: boolean; // мужчины в семье с РМЖ
  knownGeneticMutations?: string[]; // известные мутации (BRCA1, BRCA2, etc.)
  averageAgeAtDiagnosis?: number; // средний возраст диагностики в семье
  paternalHistory?: boolean; // история по отцовской линии
  maternalHistory?: boolean; // история по материнской линии
}

// ========================================
// Образ жизни
// ========================================

export interface SmokingHistory {
  status: 'never' | 'former' | 'current';
  packYears?: number; // пачко-лет
  ageStarted?: number;
  ageStopped?: number;
}

export interface AlcoholConsumption {
  frequency: 'never' | 'rarely' | 'moderate' | 'heavy';
  drinksPerWeek?: number;
  yearsOfConsumption?: number;
}

export interface PhysicalActivity {
  level: 'sedentary' | 'light' | 'moderate' | 'vigorous';
  hoursPerWeek?: number;
  primaryActivities?: string[];
}

export interface SleepPattern {
  averageHours?: number;
  quality: 'poor' | 'fair' | 'good' | 'excellent';
  regularSchedule?: boolean;
}

export interface StressLevel {
  level: number; // 1-10
  managementMethods?: ('meditation' | 'yoga' | 'exercise' | 'therapy' | 'none')[];
  chronicStressors?: string[];
}

export interface DietPattern {
  type: 'vegetarian' | 'vegan' | 'mixed' | 'mediterranean' | 'ketogenic';
  vegetableFruitServings?: number;
  redMeatFrequency?: 'never' | 'rarely' | 'weekly' | 'daily';
  fatIntake?: 'low' | 'moderate' | 'high';
}

export interface LifestyleFactors {
  smoking?: SmokingHistory;
  alcohol?: AlcoholConsumption;
  physicalActivity?: PhysicalActivity;
  sleep?: SleepPattern;
  stress?: StressLevel;
  diet?: DietPattern;
  occupationalExposures?: string[];
  environmentalFactors?: {
    airQuality?: 'poor' | 'moderate' | 'good';
    chemicalExposures?: string[];
    radiationExposure?: boolean;
  };
}

// ========================================
// Генетические данные
// ========================================

export interface GeneticVariant {
  gene: string;
  variant: string;
  significance: 'pathogenic' | 'likely_pathogenic' | 'uncertain' | 'benign';
  riskContribution: number; // вклад в риск (множитель)
}

export interface GeneticRiskFactors {
  source: '23andme' | 'ancestrydna' | 'myheritage' | 'genetico' | 'genotek' | 'other';
  uploadDate: string;
  totalSnps: number;
  significantVariants: number;
  riskFactors?: {
    [gene: string]: 'low' | 'moderate' | 'high';
  };
  polygeneticRiskScore?: number;
  brca1Status?: 'normal' | 'variant' | 'pathogenic';
  brca2Status?: 'normal' | 'variant' | 'pathogenic';
  otherGenes?: GeneticVariant[];
  ethnicity?: string; // генетическая этническая принадлежность
}

// ========================================
// Входные данные калькулятора
// ========================================

export interface GailCalculatorInput {
  personalInfo: PersonalInfo;
  medicalHistory: MedicalHistory;
  familyHistory: FamilyHistory;
  lifestyle: LifestyleFactors;
  calculationDate: Date;
  userId: string;
}

// ========================================
// Результаты расчетов
// ========================================

export interface RiskFactor {
  name: string;
  value: string | number;
  impact: 'protective' | 'neutral' | 'moderate' | 'high';
  description: string;
  evidenceLevel?: 'low' | 'moderate' | 'high';
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: RecommendationType;
  priority: 'low' | 'medium' | 'high';
  actionItems?: string[];
  timeframe?: string;
  expectedBenefit?: string;
}

export interface GailCalculatorResult {
  calculationId: string;
  userId: string;
  calculationDate: Date;
  
  // Основные результаты
  fiveYearRisk: number; // 5-летний абсолютный риск (%)
  lifetimeRisk: number; // пожизненный риск (%)
  relativeRisk: number; // относительный риск по сравнению с популяцией
  
  // Дополнительная информация
  riskLevel: RiskLevel;
  riskFactors?: RiskFactor[];
  recommendations?: Recommendation[];
  populationComparison?: string;
  
  // Метаданные
  modelVersion: string;
  confidenceInterval?: {
    lower: number;
    upper: number;
  };
}

// ========================================
// Расширенные результаты
// ========================================

export interface GeneticContribution {
  riskContribution: number; // вклад генетических факторов в общий риск
  significantVariants?: string[];
  polygeneticScore?: number;
  heritabilityEstimate?: number;
}

export interface CombinedRisk {
  fiveYear: number;
  tenYear: number;
  lifetime: number;
  nextDecade?: number;
}

export interface EnhancedGailResult extends Omit<GailCalculatorResult, 'fiveYearRisk' | 'lifetimeRisk'> {
  // Объединенные риски
  combinedRisk: CombinedRisk;
  
  // Вклады различных факторов
  geneticContribution?: GeneticContribution;
  lifestyleContribution?: {
    protectiveFactors: string[];
    riskFactors: string[];
    modifiableRisk: number; // процент риска, который можно изменить
  };
  
  // Персонализированные аспекты
  personalizedRecommendations?: Recommendation[];
  screeningSchedule?: {
    mammography: string;
    clinicalExam: string;
    selfExam: string;
    mri?: string;
    geneticCounseling?: string;
  };
  
  // Прогностические модели
  riskTrajectory?: {
    age: number;
    risk: number;
  }[];
}

// ========================================
// Ошибки валидации
// ========================================

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

// ========================================
// Утилиты калькулятора
// ========================================

export interface CalculationProgress {
  stage: string;
  current: number;
  total: number;
  message?: string;
}

export interface GailCalculatorUtils {
  formatRiskPercentage: (risk: number) => string;
  calculateBMI: (height: number, weight: number) => number;
  getRiskLevel: (risk: number) => RiskLevel;
  compareToPopulation: (risk: number, age: number, race: string) => string;
  generateRecommendations: (result: GailCalculatorResult | EnhancedGailResult) => Recommendation[];
  exportResults: (format: 'json' | 'pdf' | 'csv') => string;
}

// ========================================
// Конфигурация калькулятора
// ========================================

export interface GailCalculatorConfig {
  autoSaveHistory?: boolean;
  enableEnhancedAnalysis?: boolean;
  enableGeneticAnalysis?: boolean;
  enableEnvironmentalAnalysis?: boolean;
  onProgress?: (progress: CalculationProgress) => void;
  onCalculationComplete?: (result: GailCalculatorResult | EnhancedGailResult) => void;
  onError?: (error: string) => void;
}

// ========================================
// Хуки и состояние
// ========================================

export interface UseGailCalculatorReturn {
  // Методы расчета
  calculateRisk: (input: GailCalculatorInput) => Promise<GailCalculatorResult>;
  calculateEnhancedRisk: (
    input: GailCalculatorInput,
    geneticData?: GeneticRiskFactors,
    environmentalData?: any
  ) => Promise<EnhancedGailResult>;
  
  // Состояние
  currentResult?: GailCalculatorResult | null;
  enhancedResult?: EnhancedGailResult | null;
  isCalculating: boolean;
  progress?: CalculationProgress;
  
  // Валидация и ошибки
  validationErrors: ValidationError[];
  hasValidationErrors: boolean;
  
  // Утилиты
  utils: GailCalculatorUtils;
  clearResults: () => void;
  exportResults: (format: 'json' | 'pdf' | 'csv') => string;
}

export interface UseGeneticDataReturn {
  uploadGeneticFile: (file: File, userId: string, source: string) => Promise<GeneticRiskFactors>;
  geneticData?: GeneticRiskFactors | null;
  isUploading: boolean;
  uploadProgress?: number;
  error?: string | null;
}

export interface UseWearableSyncReturn {
  connectedDevices: any[];
  syncDevice: (deviceType: string, data: any) => Promise<void>;
  issyncing: boolean;
  lastSyncDate?: Date;
}

export interface UseNotificationsReturn {
  showSuccessNotification: (title: string, message: string) => void;
  showErrorNotification: (title: string, message: string) => void;
  showHealthReminder: (type: string, message: string) => void;
}

export interface UseFormValidationReturn {
  validateForm: (data: any) => boolean;
  getFieldStatus: (field: string) => 'valid' | 'invalid' | 'pending';
  hasErrors: boolean;
  clearErrors: () => void;
}