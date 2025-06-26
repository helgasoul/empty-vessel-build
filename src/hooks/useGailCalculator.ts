
import { useState } from 'react';

export interface GailInputs {
  age: number;
  raceEthnicity: string;
  ageAtMenarche: number;
  ageAtFirstBirth: number | null;
  numberOfRelatives: number;
  numberOfBiopsies: number;
  atypicalHyperplasia: boolean;
}

export interface GailResults {
  fiveYearRisk: number;
  lifetimeRisk: number;
  riskCategory: 'low' | 'moderate' | 'high';
  recommendations: string[];
  comparisonToAverage: {
    fiveYear: number;
    lifetime: number;
  };
}

export const useGailCalculator = () => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [results, setResults] = useState<GailResults>({
    fiveYearRisk: 0,
    lifetimeRisk: 0,
    riskCategory: 'low',
    recommendations: [],
    comparisonToAverage: { fiveYear: 0, lifetime: 0 }
  });

  const calculateRisk = async (inputs: GailInputs): Promise<GailResults> => {
    setIsCalculating(true);
    
    try {
      // Simplified Gail model calculation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let baseRisk = 1.2; // Base 5-year risk percentage
      
      // Age factor
      if (inputs.age >= 60) baseRisk *= 1.5;
      else if (inputs.age >= 50) baseRisk *= 1.2;
      
      // Age at menarche
      if (inputs.ageAtMenarche < 12) baseRisk *= 1.1;
      
      // Age at first birth
      if (inputs.ageAtFirstBirth === null || inputs.ageAtFirstBirth > 30) {
        baseRisk *= 1.3;
      } else if (inputs.ageAtFirstBirth < 20) {
        baseRisk *= 0.8;
      }
      
      // Family history
      baseRisk *= (1 + inputs.numberOfRelatives * 0.4);
      
      // Biopsy history
      if (inputs.numberOfBiopsies > 0) {
        baseRisk *= (1 + inputs.numberOfBiopsies * 0.2);
      }
      
      // Atypical hyperplasia
      if (inputs.atypicalHyperplasia) {
        baseRisk *= 1.8;
      }
      
      const fiveYearRisk = Math.min(baseRisk, 15); // Cap at 15%
      const lifetimeRisk = fiveYearRisk * 6; // Approximate lifetime risk
      
      const riskCategory: 'low' | 'moderate' | 'high' = 
        fiveYearRisk < 1.7 ? 'low' : 
        fiveYearRisk < 3.0 ? 'moderate' : 'high';
      
      const recommendations = [
        'Регулярные маммографические исследования',
        'Самообследование молочных желез',
        'Консультация с онкологом-маммологом'
      ];
      
      if (riskCategory === 'high') {
        recommendations.push('Рассмотреть возможность генетического консультирования');
        recommendations.push('Обсудить возможность химиопрофилактики');
      }
      
      const calculatedResults: GailResults = {
        fiveYearRisk: Number(fiveYearRisk.toFixed(2)),
        lifetimeRisk: Number(lifetimeRisk.toFixed(1)),
        riskCategory,
        recommendations,
        comparisonToAverage: {
          fiveYear: Number((fiveYearRisk / 1.2).toFixed(1)),
          lifetime: Number((lifetimeRisk / 12.5).toFixed(1))
        }
      };
      
      setResults(calculatedResults);
      return calculatedResults;
    } finally {
      setIsCalculating(false);
    }
  };

  return {
    calculateRisk,
    isCalculating,
    results
  };
};
