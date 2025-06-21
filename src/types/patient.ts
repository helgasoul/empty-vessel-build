export interface PatientProfile {
  id: string;
  personalInfo: PersonalInfo;
  healthAssessment: HealthAssessment;
  riskFactors: RiskFactors;
  environmentalHealth?: EnvironmentalHealth;
  labResults: LabResult[];
  medicalHistory: MedicalHistory;
  familyHistory?: FamilyHistory;
  aiRecommendations: AIRecommendation[];
  doctorNotes: DoctorNote[];
  preferences: PatientPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface PersonalInfo {
  name: string;
  dateOfBirth: Date;
  email: string;
  phone?: string;
  address?: Address;
  emergencyContact?: EmergencyContact;
  insurance?: InsuranceInfo;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface InsuranceInfo {
  provider: string;
  policyNumber: string;
  groupNumber?: string;
}

export interface HealthAssessment {
  currentSymptoms: Symptom[];
  chronicConditions: ChronicCondition[];
  allergies: Allergy[];
  medications: Medication[];
  lifestyle: LifestyleFactors;
  menstrualHealth?: MenstrualHealth;
  reproductiveHealth?: ReproductiveHealth;
  physicalActivity?: PhysicalActivity;
  nutrition?: NutritionData;
}

export interface Symptom {
  id: string;
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  duration: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'occasionally';
  description?: string;
  firstNoticed: Date;
}

export interface ChronicCondition {
  id: string;
  name: string;
  diagnosisDate: Date;
  severity: 'mild' | 'moderate' | 'severe';
  treatment: string[];
  status: 'active' | 'remission' | 'resolved';
}

export interface Allergy {
  id: string;
  allergen: string;
  reaction: string;
  severity: 'mild' | 'moderate' | 'severe' | 'life-threatening';
  firstOccurrence?: Date;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: Date;
  endDate?: Date;
  prescribedBy: string;
  purpose: string;
  sideEffects?: string[];
}

export interface LifestyleFactors {
  smokingStatus: 'never' | 'former' | 'current';
  alcoholConsumption: 'none' | 'light' | 'moderate' | 'heavy';
  exerciseFrequency: 'none' | 'light' | 'moderate' | 'vigorous';
  sleepHours: number;
  stressLevel: number; // 1-10 scale
  diet: 'standard' | 'vegetarian' | 'vegan' | 'keto' | 'mediterranean' | 'other';
}

export interface MenstrualHealth {
  cycleLength: number;
  periodLength: number;
  lastPeriodDate: Date;
  irregularities: string[];
  symptoms: string[];
  contraception?: string;
}

export interface ReproductiveHealth {
  pregnancies: number;
  births: number;
  miscarriages: number;
  fertilityPlanning: boolean;
  breastfeeding: boolean;
  menopauseStatus: 'premenopausal' | 'perimenopausal' | 'postmenopausal';
}

export interface PhysicalActivity {
  averageSteps: number;
  activeMinutes: number;
  exerciseTypes: string[];
  heartRateData?: HeartRateData;
}

export interface HeartRateData {
  restingHR: number;
  maxHR: number;
  averageHR: number;
  measurementDate: Date;
}

export interface NutritionData {
  dailyCalories: number;
  macros: {
    carbs: number;
    protein: number;
    fat: number;
  };
  supplements: string[];
  dietaryRestrictions: string[];
}

export interface RiskFactors {
  cardiovascular: CardiovascularRisk;
  cancer: CancerRisk;
  diabetes: DiabetesRisk;
  osteoporosis: OsteoporosisRisk;
  mentalHealth: MentalHealthRisk;
  calculatedScores: RiskScores;
  lastUpdated: Date;
}

export interface CardiovascularRisk {
  score: number;
  level: 'low' | 'moderate' | 'high' | 'very-high';
  factors: string[];
  recommendations: string[];
  calculatedScores?: {
    framinghamScore?: number;
    reynoldsScore?: number;
  };
}

export interface CancerRisk {
  score: number;
  level: 'low' | 'moderate' | 'high' | 'very-high';
  factors: string[];
  types: CancerTypeRisk[];
  geneticFactors: string[];
  recommendations: string[];
}

export interface CancerTypeRisk {
  type: string;
  score: number;
  level: 'low' | 'moderate' | 'high' | 'very-high';
  specificFactors: string[];
}

export interface DiabetesRisk {
  score: number;
  level: 'low' | 'moderate' | 'high' | 'very-high';
  type: 'type1' | 'type2' | 'gestational';
  factors: string[];
  recommendations: string[];
}

export interface OsteoporosisRisk {
  score: number;
  level: 'low' | 'moderate' | 'high' | 'very-high';
  boneDensity?: number;
  factors: string[];
  recommendations: string[];
}

export interface MentalHealthRisk {
  depressionScore: number;
  anxietyScore: number;
  stressScore: number;
  level: 'low' | 'moderate' | 'high' | 'very-high';
  factors: string[];
  recommendations: string[];
}

export interface RiskScores {
  framinghamScore: number;
  reynoldsScore: number;
  homaIR?: number;
  ft3ft4Ratio?: number;
  tshft4Ratio?: number;
  faiIndex?: number;
  nlrRatio?: number;
  tghdlRatio?: number;
}

export interface EnvironmentalHealth {
  livingEnvironment: LivingEnvironment;
  workEnvironment: WorkEnvironment;
  exposures: EnvironmentalExposure[];
  airQuality?: AirQualityData;
  waterQuality?: WaterQualityData;
  lifestyle: EnvironmentalLifestyle;
}

export interface LivingEnvironment {
  housingType: 'apartment' | 'house' | 'mobile_home' | 'other';
  proximityToIndustrial: 'very_close' | 'close' | 'moderate' | 'far';
  airPollutionLevel: 'low' | 'moderate' | 'high' | 'very_high';
  noiseLevel: 'low' | 'moderate' | 'high' | 'very_high';
  greenSpaceAccess: 'none' | 'limited' | 'moderate' | 'abundant';
}

export interface WorkEnvironment {
  type: 'office' | 'industrial' | 'healthcare' | 'outdoor' | 'laboratory' | 'other';
  chemicalExposure: boolean;
  radiationExposure: boolean;
  physicalHazards: string[];
  stressLevel: number;
  workHours: number;
}

export interface EnvironmentalExposure {
  substance: string;
  exposureLevel: 'low' | 'moderate' | 'high' | 'very_high';
  duration: string;
  source: string;
  protectiveMeasures: string[];
}

export interface AirQualityData {
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
  measurementDate: Date;
  location: string;
}

export interface WaterQualityData {
  source: 'municipal' | 'well' | 'bottled' | 'filtered';
  contaminants: string[];
  testDate?: Date;
  qualityRating: 'excellent' | 'good' | 'fair' | 'poor';
}

export interface EnvironmentalLifestyle {
  organicFoodConsumption: 'never' | 'rarely' | 'sometimes' | 'often' | 'always';
  plasticUsage: 'minimal' | 'moderate' | 'high';
  naturalProductUsage: 'never' | 'rarely' | 'sometimes' | 'often' | 'always';
  exerciseOutdoors: boolean;
  stressFromEnvironment: number;
}

export interface LabResult {
  id: string;
  testType: string;
  testDate: Date;
  results: Record<string, LabValue>;
  interpretation: string;
  referenceRanges: Record<string, string>;
  status: 'pending' | 'completed' | 'reviewed';
  uploadedBy: 'patient' | 'doctor' | 'lab';
  doctorNotes?: string;
  calculatedIndices?: CalculatedIndex[];
  criticalValues?: CriticalValue[];
}

export interface LabValue {
  value: number | string;
  unit: string;
  normalRange: string;
  isAbnormal: boolean;
  severity?: 'mild' | 'moderate' | 'severe';
}

export interface CalculatedIndex {
  name: string;
  value: number;
  interpretation: string;
  normalRange: string;
  calculatedAt: Date;
  basedOn: string[];
}

export interface CriticalValue {
  parameter: string;
  value: number | string;
  criticalThreshold: string;
  recommendation: string;
  urgency: 'immediate' | 'urgent' | 'follow-up';
}

export interface MedicalHistory {
  surgeries: Surgery[];
  hospitalizations: Hospitalization[];
  majorIllnesses: MajorIllness[];
  immunizations: Immunization[];
  screenings: Screening[];
}

export interface Surgery {
  id: string;
  procedure: string;
  date: Date;
  hospital: string;
  surgeon: string;
  complications?: string;
  recovery: string;
}

export interface Hospitalization {
  id: string;
  reason: string;
  admissionDate: Date;
  dischargeDate: Date;
  hospital: string;
  diagnosis: string;
  treatment: string;
}

export interface MajorIllness {
  id: string;
  condition: string;
  diagnosisDate: Date;
  severity: 'mild' | 'moderate' | 'severe';
  treatment: string;
  outcome: 'resolved' | 'ongoing' | 'chronic';
}

export interface Immunization {
  id: string;
  vaccine: string;
  date: Date;
  location: string;
  batch?: string;
  reactions?: string;
}

export interface Screening {
  id: string;
  type: string;
  date: Date;
  result: string;
  recommendation: string;
  nextDue?: Date;
}

export interface FamilyHistory {
  maternalSide: FamilyMember[];
  paternalSide: FamilyMember[];
  geneticRisks: GeneticRisk[];
  hereditaryConditions: HereditaryCondition[];
}

export interface FamilyMember {
  id: string;
  relationship: string;
  name?: string;
  birthYear?: number;
  deathYear?: number;
  conditions: MedicalCondition[];
  lifestyle?: LifestyleFactors;
}

export interface MedicalCondition {
  condition: string;
  ageAtDiagnosis: number;
  severity: 'mild' | 'moderate' | 'severe';
  outcome: 'resolved' | 'ongoing' | 'fatal';
}

export interface GeneticRisk {
  gene: string;
  variant: string;
  associatedConditions: string[];
  riskLevel: 'low' | 'moderate' | 'high' | 'very-high';
  recommendations: string[];
}

export interface HereditaryCondition {
  condition: string;
  inheritancePattern: 'autosomal_dominant' | 'autosomal_recessive' | 'x_linked' | 'multifactorial';
  affectedRelatives: string[];
  riskLevel: 'low' | 'moderate' | 'high' | 'very-high';
}

export interface AIRecommendation {
  id: string;
  type: 'lifestyle' | 'medical' | 'preventive' | 'urgent';
  category: string;
  title: string;
  description: string;
  actionItems: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  basedOn: string[];
  confidence: number;
  generatedAt: Date;
  status: 'new' | 'acknowledged' | 'implemented' | 'dismissed';
  implementationDate?: Date;
  feedback?: string;
}

export interface DoctorNote {
  id: string;
  doctorId: string;
  doctorName: string;
  date: Date;
  type: 'consultation' | 'review' | 'recommendation' | 'prescription';
  content: string;
  relatedData?: string[];
  followUpRequired: boolean;
  followUpDate?: Date;
}

export interface PatientPreferences {
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
  language: string;
  timezone: string;
  units: 'metric' | 'imperial';
  dashboardLayout: string[];
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  reminderFrequency: 'daily' | 'weekly' | 'monthly';
  criticalAlertsOnly: boolean;
}

export interface PrivacyPreferences {
  shareWithFamily: boolean;
  shareWithDoctors: boolean;
  anonymousData: boolean;
  researchParticipation: boolean;
  dataRetention: number; // years
}

export interface PatientPermission {
  doctorId: string;
  doctorName: string;
  permissions: string[];
  grantedAt: Date;
  expiresAt?: Date;
  isActive: boolean;
}

export interface OverallRiskAssessment {
  level: 'low' | 'moderate' | 'high' | 'very-high';
  score: number;
  primaryConcerns: string[];
  recommendations: string[];
  nextAssessmentDate: Date;
}
