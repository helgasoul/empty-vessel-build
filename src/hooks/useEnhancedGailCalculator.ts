
import { useState } from 'react';

export interface GailInputs {
  age: number;
  ageFirstPeriod: number;
  ageFirstBirth: number | null;
  numRelatives: number;
  numBiopsies: number;
  hasAtypicalHyperplasia: boolean;
  race: 'white' | 'black' | 'hispanic' | 'asian' | 'other';
}

export interface GailResults {
  fiveYearRisk: number;
  lifetimeRisk: number;
  averageRisk: number;
  riskCategory: 'low' | 'moderate' | 'high';
  recommendations: string[];
}

export const useEnhancedGailCalculator = () => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [results, setResults] = useState<GailResults | null>(null);

  const calculateRisk = async (inputs: GailInputs): Promise<GailResults> => {
    setIsCalculating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock calculation based on Gail model factors
    const baseRisk = 0.02; // 2% base risk
    let riskMultiplier = 1;
    
    // Age factor
    if (inputs.age > 60) riskMultiplier *= 1.5;
    else if (inputs.age > 50) riskMultiplier *= 1.2;
    
    // Early menarche
    if (inputs.ageFirstPeriod < 12) riskMultiplier *= 1.2;
    
    // Late first birth or nulliparity
    if (inputs.ageFirstBirth === null || inputs.ageFirstBirth > 30) {
      riskMultiplier *= 1.3;
    }
    
    // Family history
    if (inputs.numRelatives > 0) {
      riskMultiplier *= (1 + inputs.numRelatives * 0.3);
    }
    
    // Biopsy history
    if (inputs.numBiopsies > 0) {
      riskMultiplier *= (1 + inputs.numBiopsies * 0.2);
    }
    
    // Atypical hyperplasia
    if (inputs.hasAtypicalHyperplasia) {
      riskMultiplier *= 1.8;
    }
    
    const fiveYearRisk = Math.min(baseRisk * riskMultiplier, 0.15);
    const lifetimeRisk = Math.min(fiveYearRisk * 4, 0.25);
    const averageRisk = 0.12;
    
    const riskCategory: 'low' | 'moderate' | 'high' = 
      fiveYearRisk < 0.017 ? 'low' :
      fiveYearRisk < 0.05 ? 'moderate' : 'high';
    
    const recommendations = [
      'Продолжайте ежегодные маммографии',
      'Обсудите с врачом дополнительные меры профилактики',
      'Поддерживайте здоровый образ жизни',
      'Регулярно проводите самообследование молочных желез'
    ];
    
    if (riskCategory === 'high') {
      recommendations.unshift('Рассмотрите консультацию онколога-маммолога');
      recommendations.push('Обсудите возможность генетического тестирования');
    }
    
    const calculatedResults: GailResults = {
      fiveYearRisk,
      lifetimeRisk,
      averageRisk,
      riskCategory,
      recommendations
    };
    
    setResults(calculatedResults);
    setIsCalculating(false);
    
    return calculatedResults;
  };

  return {
    calculateRisk,
    isCalculating,
    results
  };
};
