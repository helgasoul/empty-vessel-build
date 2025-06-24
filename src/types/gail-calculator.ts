export interface GailCalculatorInput {
  personalInfo: {
    age: number;
    race: string;
  };
  medicalHistory: {
    ageAtMenarche: number;
    ageAtFirstBirth?: number;
    numberOfBiopsies: number;
    atypicalHyperplasia: boolean;
    lobularCarcinomaInSitu?: boolean;
  };
  familyHistory: {
    breastCancerRelatives: number;
  };
  genetic?: GeneticRiskFactors;
  environmental?: EnvironmentalFactors;
  lifestyle?: LifestyleFactors;
}

export interface GailCalculatorResult {
  fiveYearRisk: number;
  lifetimeRisk: number;
  relativeRisk: number;
  riskCategory: RiskLevel;
  riskFactors: {
    age: number;
    race: number;
    familyHistory: number;
    reproductiveHistory: number;
    biopsyHistory: number;
  };
  populationRisk: {
    fiveYear: number;
    lifetime: number;
    sameAgeGroup: number;
  };
  screeningRecommendations: {
    mammographyFrequency: 'annual' | 'biannual';
    additionalScreening: string[];
    geneticCounseling: boolean;
    clinicalExam: 'standard' | 'enhanced';
  };
  calculationMetadata: {
    modelVersion: string;
    calculationDate: Date;
    inputHash: string;
    confidence: number;
  };
}

export interface EnhancedRiskAssessment {
  gailResult: GailCalculatorResult;
  combinedRisk: {
    fiveYear: number;
    lifetime: number;
    confidence: number;
  };
  riskContributions: {
    genetic: number;
    lifestyle: number;
    environmental: number;
    medical: number;
    family: number;
  };
  geneticAnalysis?: {
    highRiskVariants: string[];
    protectiveVariants: string[];
    polygeneticRiskScore: number;
    carriageStatus: 'pathogenic' | 'negative';
  };
  environmentalAnalysis?: {
    riskScore: number;
    primaryRiskFactors: string[];
    mitigationRecommendations: string[];
  };
  lifestyleAnalysis: {
    protectiveFactors: string[];
    riskFactors: string[];
    modifiableRisks: {
      factor: string;
      currentImpact: number;
      potentialImprovement: number;
    }[];
  };
  riskTrajectory: {
    age: number;
    risk: number;
    interventions?: string[];
  }[];
  personalizedRecommendations: PersonalizedRecommendations;
}

export interface GeneticRiskFactors {
  brca1?: 'positive' | 'negative' | 'unknown';
  brca2?: 'positive' | 'negative' | 'unknown';
  tp53?: 'positive' | 'negative' | 'unknown';
  pten?: 'positive' | 'negative' | 'unknown';
  chek2?: 'positive' | 'negative' | 'unknown';
  atm?: 'positive' | 'negative' | 'unknown';
  palb2?: 'positive' | 'negative' | 'unknown';
  polygeneticScore?: number;
}

export interface EnvironmentalFactors {
  airQuality?: {
    aqi: number;
    mainPollutant: string;
  };
  environmentalToxins?: {
    pesticides: boolean;
    heavyMetals?: string[];
    industrialChemicals?: boolean;
  };
}

export interface LifestyleFactors {
  smoking?: {
    status: 'never' | 'past' | 'current';
    yearsSmoked?: number;
    cigarettesPerDay?: number;
  };
  alcohol?: {
    frequency: 'never' | 'rarely' | 'moderate' | 'heavy';
    drinksPerWeek?: number;
  };
  physicalActivity?: {
    level: 'sedentary' | 'light' | 'moderate' | 'vigorous';
    minutesPerWeek?: number;
  };
  diet?: {
    fruitServings: number;
    vegetableServings: number;
    redMeatServings: number;
    processedFoodIntake: 'low' | 'moderate' | 'high';
  };
}

export type RiskLevel = 'low' | 'average' | 'high' | 'very_high';

export interface PersonalizedRecommendations {
  screening: {
    mammography: {
      frequency: 'Ежегодно' | 'Каждые 2 года';
      startAge: number;
      additionalProtocols: string[];
    };
    ultrasound: {
      recommended: boolean;
      frequency?: string;
      indications: string[];
    };
    mri: {
      recommended: boolean;
      frequency?: string;
      criteria: string[];
    };
    clinicalExams: {
      frequency: string;
      selfExamGuidance: boolean;
    };
    geneticTesting: {
      recommended: boolean;
      genes: string[];
      counselingRequired: boolean;
    };
  };
  lifestyle: {
    nutrition: {
      recommendations: string[];
      avoidFoods: string[];
      supplements?: string[];
    };
    exercise: {
      type: string[];
      frequency: string;
      duration: string;
      intensity: string;
    };
    stressManagement: {
      techniques: string[];
      resources: string[];
    };
    sleep: {
      targetHours: number;
      hygieneTips: string[];
    };
  };
  medical: {
    chemoprevention: {
      eligible: boolean;
      options?: string[];
      considerations: string[];
    };
    surgicalOptions: {
      eligible: boolean;
      procedures?: string[];
      consultationRecommended: boolean;
    };
    hormonalManagement: {
      recommendations: string[];
      avoidance: string[];
    };
  };
  monitoring: {
    biomarkers: string[];
    frequency: string;
    alertThresholds: {
      [key: string]: number;
    };
  };
  education: {
    topics: string[];
    resources: {
      title: string;
      url: string;
      type: string;
    }[];
  };
  support: {
    groupsRecommended: boolean;
    counselingType: string[];
    apps: string[];
  };
  priority: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ApiResponse<T> {
  data?: T;
  success: boolean;
  message?: string;
  errors?: ValidationError[];
  metadata?: {
    timestamp: string;
    requestId: string;
    version: string;
    processingTime?: number;
  };
}
