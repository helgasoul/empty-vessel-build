// src/types/calculator.ts

export interface GailModelData {
  age: number;
  ageAtMenarche: number;
  ageAtFirstBirth: number | null;
  firstDegreeRelatives: number;
  biopsies: number;
  atypicalHyperplasia: boolean;
  race: 'white' | 'black' | 'hispanic' | 'asian' | 'other';
}

export interface BiomarkerData {
  inflammation: {
    crp: number;
    il6: number;
    tnfAlpha: number;
  };
  oxidativeStress: {
    mda: number;
    gsh: number;
    catalase: number;
  };
  hormonal: {
    estradiol: number;
    testosterone: number;
    igf1: number;
  };
}

export interface ExposomeData {
  environmental: {
    airPollution: number;
    chemicalExposure: number;
    radiation: number;
  };
  lifestyle: {
    alcohol: number;
    smoking: number;
    physicalActivity: number;
  };
  stress: {
    psychologicalStress: number;
    sleepQuality: number;
    socialSupport: number;
  };
}

export interface EnhancedGailResult {
  standardRisk: {
    fiveYear: number;
    lifetime: number;
    category: 'low' | 'average' | 'high' | 'very-high';
  };
  enhancedRisk: {
    biomarkerModified: number;
    exposomeModified: number;
    finalRisk: number;
    confidence: number;
  };
  riskFactors: {
    primary: string[];
    secondary: string[];
    protective: string[];
  };
  recommendations: {
    screening: string[];
    lifestyle: string[];
    followUp: string[];
  };
}

export interface CalculatorHistory {
  id: string;
  patientId: string;
  calculationType: 'gail' | 'prevent' | 'frax';
  timestamp: Date;
  inputData: GailModelData | any;
  result: EnhancedGailResult | any;
  doctorId: string;
}

export interface RiskCategory {
  level: 'low' | 'average' | 'high' | 'very-high';
  color: string;
  description: string;
  recommendations: string[];
}