
export type UserRole = 'patient' | 'doctor' | 'specialist';
export type CalculatorType = 'gail' | 'prevent' | 'frax' | 'framingham' | 'crat';
export type EvidenceLevel = 'high' | 'moderate' | 'low';
export type Category = 'oncology' | 'cardiovascular' | 'bone' | 'neurological';

export interface Calculator {
  id: CalculatorType;
  name: string;
  description: {
    patient: string;
    doctor: string;
    specialist: string;
  };
  icon: string; // Lucide icon name
  color: {
    primary: string;
    bg: string;
    text: string;
  };
  category: Category;
  timeframe: string;
  estimatedTime: string;
  evidenceLevel: EvidenceLevel;
  complexity: 'simple' | 'moderate' | 'complex';
  requiredData: {
    basic: string[];
    standard: string[];
    advanced: string[];
  };
  guidelines: string[];
}

export interface RiskResult {
  value: number;
  category: 'low' | 'moderate' | 'high' | 'very-high';
  explanation: {
    patient: string;
    doctor: string;
    specialist: string;
  };
  recommendations: string[];
  populationComparison?: {
    percentile: number;
    averageRisk: number;
  };
}
