
export interface PersonalInfoData {
  firstName: string;
  lastName: string;
  dateOfBirth: Date | null;
  height: number | null;
  weight: number | null;
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed' | 'partnered' | '';
  phone: string;
  country: string;
  city: string;
  timezone: string;
}

export interface GynecologyHealthData {
  menstrualCycleLength: number | null;
  menstrualCycleRegular: boolean | null;
  lastMenstrualPeriod: Date | null;
  pregnanciesCount: number;
  liveBirthsCount: number;
  miscarriagesCount: number;
  ageFirstPregnancy: number | null;
  breastfeedingDuration: number;
  currentContraception: string;
  hormoneTherapy: boolean;
  hormoneTherapyType: string;
}

export interface BreastHealthData {
  breastSelfExamFrequency: 'monthly' | 'occasionally' | 'never' | '';
  lastMammography: Date | null;
  lastUltrasound: Date | null;
  breastDensity: 'low' | 'scattered' | 'heterogeneous' | 'dense' | '';
  breastSurgery: boolean;
  breastSurgeryType: string;
}

export interface CardiovascularHealthData {
  systolicBP: number | null;
  diastolicBP: number | null;
  restingHeartRate: number | null;
  cholesterolTotal: number | null;
  cholesterolHDL: number | null;
  cholesterolLDL: number | null;
  hypertension: boolean;
  heartDisease: boolean;
  strokeHistory: boolean;
}

export interface EndocrineHealthData {
  diabetesType: 'none' | 'type1' | 'type2' | 'gestational' | '';
  diabetesDiagnósedAge: number | null;
  lastHbA1c: number | null;
  thyroidDisease: boolean;
  thyroidDiseaseType: string;
  pcos: boolean;
  insulinResistance: boolean;
}

export interface NeuroHealthData {
  depressionHistory: boolean;
  anxietyDisorder: boolean;
  sleepQuality: number; // 1-10 scale
  sleepDuration: number | null; // hours
  stressLevel: number; // 1-10 scale
  memoryConcerns: boolean;
  headacheFrequency: 'never' | 'rarely' | 'monthly' | 'weekly' | 'daily' | '';
}

export interface LifestyleData {
  smokingStatus: 'never' | 'former' | 'current' | '';
  smokingPackYears: number | null;
  alcoholFrequency: 'never' | 'monthly' | 'weekly' | 'daily' | '';
  alcoholDrinksPerWeek: number;
  exerciseFrequency: 'never' | 'rarely' | 'weekly' | 'daily' | '';
  exerciseIntensity: 'light' | 'moderate' | 'vigorous' | '';
  dietType: string;
  occupation: string;
  workStressLevel: number; // 1-10 scale
  chemicalExposure: boolean;
  radiationExposure: boolean;
}

export interface FamilyHistoryData {
  relationship: string;
  breastCancer: boolean;
  breastCancerAge: number | null;
  ovarianCancer: boolean;
  ovarianCancerAge: number | null;
  colorectalCancer: boolean;
  colorectalCancerAge: number | null;
  lungCancer: boolean;
  lungCancerAge: number | null;
  otherCancer: string;
  otherCancerAge: number | null;
  heartAttack: boolean;
  heartAttackAge: number | null;
  stroke: boolean;
  strokeAge: number | null;
  hypertension: boolean;
  diabetes: boolean;
  diabetesAge: number | null;
  osteoporosis: boolean;
  alzheimer: boolean;
  alzheimerAge: number | null;
}

export interface OnboardingData {
  personalInfo: PersonalInfoData;
  gynecologyHealth: GynecologyHealthData;
  breastHealth: BreastHealthData;
  cardiovascularHealth: CardiovascularHealthData;
  endocrineHealth: EndocrineHealthData;
  neuroHealth: NeuroHealthData;
  lifestyle: LifestyleData;
  familyHistory: FamilyHistoryData[];
}

export interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  component: React.ComponentType<any>;
  optional?: boolean;
}

export interface OnboardingProgress {
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
  stepData: Partial<OnboardingData>;
}
