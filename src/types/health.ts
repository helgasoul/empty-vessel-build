
export interface PersonalData {
  fullName: string;
  dateOfBirth: Date | null;
  age: number;
  height: number; // cm
  weight: number; // kg
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed' | 'partnered';
  occupation: string;
  location: {
    country: string;
    city: string;
  };
}

export interface GynecologicalData {
  ageFirstPeriod: number;
  menstrualCycleLength: number;
  menstrualCycleRegular: boolean;
  lastMenstrualPeriod: Date | null;
  pregnanciesCount: number;
  liveBirthsCount: number;
  miscarriagesCount: number;
  ageFirstPregnancy: number | null;
  breastfeedingDuration: number; // months
  contraception: {
    current: string;
    hormonal: boolean;
    duration: number; // months
  };
  menopauseStatus: 'premenopausal' | 'perimenopausal' | 'postmenopausal';
}

export interface BreastHealthData {
  selfExamination: {
    frequency: 'monthly' | 'occasionally' | 'never';
    lastExam: Date | null;
  };
  screening: {
    lastMammography: Date | null;
    lastUltrasound: Date | null;
    mammographyFrequency: 'annual' | 'biennial' | 'irregular' | 'never';
  };
  breastDensity: 'low' | 'scattered' | 'heterogeneous' | 'dense' | 'unknown';
  breastSurgery: {
    hasSurgery: boolean;
    surgeryType: string;
    surgeryDate: Date | null;
  };
  familyHistory: {
    motherBreastCancer: boolean;
    sisterBreastCancer: boolean;
    otherRelativesBreastCancer: number;
    ovarianCancerFamily: boolean;
  };
}

export interface CardiovascularData {
  bloodPressure: {
    systolic: number;
    diastolic: number;
    measurementDate: Date | null;
  };
  heartRate: {
    resting: number;
    measurementDate: Date | null;
  };
  cholesterol: {
    total: number | null;
    hdl: number | null;
    ldl: number | null;
    triglycerides: number | null;
    lastTest: Date | null;
  };
  conditions: {
    hypertension: boolean;
    heartDisease: boolean;
    stroke: boolean;
    diabetes: boolean;
  };
  familyHistory: {
    heartDisease: boolean;
    stroke: boolean;
    diabetes: boolean;
  };
}

export interface EndocrineData {
  diabetes: {
    type: 'none' | 'type1' | 'type2' | 'gestational';
    diagnosisAge: number | null;
    medications: string[];
    lastHbA1c: number | null;
  };
  thyroid: {
    hasDisease: boolean;
    diseaseType: string;
    medications: string[];
    lastTSH: number | null;
    lastT4: number | null;
  };
  reproductive: {
    pcos: boolean;
    endometriosis: boolean;
    fibroids: boolean;
    fertilityIssues: boolean;
  };
}

export interface NeurologyData {
  mentalHealth: {
    depression: boolean;
    anxiety: boolean;
    currentTherapy: boolean;
    medications: string[];
  };
  sleep: {
    hoursPerNight: number;
    quality: 'excellent' | 'good' | 'fair' | 'poor';
    sleepDisorders: string[];
  };
  cognition: {
    memoryConcerns: boolean;
    concentrationIssues: boolean;
    familyDementia: boolean;
  };
  headaches: {
    frequency: 'never' | 'rarely' | 'monthly' | 'weekly' | 'daily';
    type: string;
    triggers: string[];
  };
}

export interface LifestyleData {
  smoking: {
    status: 'never' | 'former' | 'current';
    packYears: number | null;
    quitDate: Date | null;
  };
  alcohol: {
    frequency: 'never' | 'monthly' | 'weekly' | 'daily';
    drinksPerWeek: number;
  };
  exercise: {
    frequency: 'never' | 'rarely' | 'weekly' | 'daily';
    intensity: 'light' | 'moderate' | 'vigorous';
    types: string[];
    minutesPerWeek: number;
  };
  diet: {
    type: 'standard' | 'vegetarian' | 'vegan' | 'keto' | 'mediterranean' | 'other';
    supplements: string[];
    waterIntake: number; // glasses per day
  };
  stress: {
    level: number; // 1-10 scale
    sources: string[];
    copingMethods: string[];
  };
  work: {
    type: 'office' | 'physical' | 'healthcare' | 'outdoor' | 'other';
    stressLevel: number; // 1-10 scale
    chemicalExposure: boolean;
    nightShifts: boolean;
  };
}

export interface FamilyHistoryData {
  cancers: {
    breastCancer: FamilyCondition[];
    ovarianCancer: FamilyCondition[];
    colorectalCancer: FamilyCondition[];
    lungCancer: FamilyCondition[];
    otherCancers: FamilyCondition[];
  };
  cardiovascular: {
    heartAttack: FamilyCondition[];
    stroke: FamilyCondition[];
    hypertension: FamilyCondition[];
  };
  metabolic: {
    diabetes: FamilyCondition[];
    thyroidDisease: FamilyCondition[];
    osteoporosis: FamilyCondition[];
  };
  neurological: {
    alzheimer: FamilyCondition[];
    parkinson: FamilyCondition[];
    otherDementia: FamilyCondition[];
  };
}

export interface FamilyCondition {
  relationship: 'mother' | 'father' | 'sister' | 'brother' | 'grandmother' | 'grandfather' | 'aunt' | 'uncle' | 'cousin';
  ageAtDiagnosis: number | null;
  currentAge: number | null;
  deceased: boolean;
  ageAtDeath: number | null;
}

export interface HealthQuestionnaireData {
  personalInfo: PersonalData;
  gynecologicalHealth: GynecologicalData;
  breastHealth: BreastHealthData;
  cardiovascularHealth: CardiovascularData;
  endocrineHealth: EndocrineData;
  neurology: NeurologyData;
  lifestyle: LifestyleData;
  familyHistory: FamilyHistoryData;
  completedAt: Date | null;
  userId: string;
}

export interface HealthProfile {
  userId: string;
  personalData: PersonalData;
  healthQuestionnaire: HealthQuestionnaireData;
  riskAssessments: RiskAssessment[];
  medicalHistory: MedicalRecord[];
  recommendations: Recommendation[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RiskAssessment {
  id: string;
  userId: string;
  assessmentType: 'gail' | 'prevent' | 'frax' | 'crat' | 'framingham';
  inputData: Record<string, any>;
  results: {
    riskPercentage: number;
    riskCategory: 'low' | 'moderate' | 'high' | 'very-high';
    timeframe: string;
    populationComparison: number;
    explanation: string;
  };
  calculatedAt: Date;
}

export interface MedicalRecord {
  id: string;
  userId: string;
  recordType: 'lab_result' | 'imaging' | 'consultation' | 'procedure';
  title: string;
  date: Date;
  provider: string;
  results: Record<string, any>;
  attachments: string[];
}

export interface Recommendation {
  id: string;
  userId: string;
  type: 'lifestyle' | 'screening' | 'medical' | 'preventive';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: Date | null;
  completed: boolean;
  source: 'ai' | 'doctor' | 'guideline';
}
