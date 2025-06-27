
export interface PersonalData {
  age: number;
  height: number;
  weight: number;
  bloodType?: string;
  allergies?: string[];
}

export interface GynecologicalData {
  menstrualCycleLength?: number;
  lastPeriodDate?: Date;
  pregnancies?: number;
  childbirths?: number;
  miscarriages?: number;
}

export interface BreastHealthData {
  familyHistoryBreastCancer: boolean;
  selfExamFrequency: 'never' | 'monthly' | 'occasionally' | 'regularly';
  lastMammogram?: Date;
}

export interface CardiovascularData {
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  cholesterolLevel?: number;
  heartRate?: number;
  exerciseFrequency: 'never' | 'rarely' | 'sometimes' | 'regularly' | 'daily';
}

export interface EndocrineData {
  diabetesHistory: boolean;
  thyroidIssues: boolean;
  hormonalMedications?: string[];
}

export interface NeurologyData {
  sleepQuality: 'poor' | 'fair' | 'good' | 'excellent';
  stressLevel: number; // 1-10
  moodChanges: boolean;
  memoryIssues: boolean;
}

export interface LifestyleData {
  smokingStatus: 'never' | 'former' | 'current';
  alcoholConsumption: 'never' | 'rarely' | 'moderate' | 'heavy';
  dietType?: string;
  supplementsUsed?: string[];
}

export interface FamilyHistoryData {
  heartDisease: boolean;
  diabetes: boolean;
  cancer: boolean;
  mentalHealth: boolean;
  otherConditions?: string[];
}

export interface HealthQuestionnaireData {
  personal: PersonalData;
  gynecological: GynecologicalData;
  breast: BreastHealthData;
  cardiovascular: CardiovascularData;
  endocrine: EndocrineData;
  neurology: NeurologyData;
  lifestyle: LifestyleData;
  family: FamilyHistoryData;
  completedAt: Date;
  userId: string;
}
