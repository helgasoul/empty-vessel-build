
import { useState, useCallback } from 'react';

export interface GailInputs {
  age: number;
  ageFirstPeriod: number;
  ageFirstBirth: number | null;
  numberOfRelatives: number;
  numberOfBiopsies: number;
  atypicalHyperplasia: boolean;
  race: 'white' | 'black' | 'hispanic' | 'asian' | 'other';
}

export interface GailResults {
  fiveYearRisk: number;
  lifetimeRisk: number;
  riskCategory: 'low' | 'average' | 'high';
  averageRisk: number;
  explanation: string;
  recommendations: string[];
}

type EmotionalState = 'calm' | 'anxious' | 'worried' | 'overwhelmed';
type PreparationStep = 'understanding' | 'emotional_prep' | 'support_system' | 'relaxation' | 'ready';
type DisclosureStage = 'preparation' | 'gradual' | 'full_disclosure' | 'support';

export const useGailCalculator = () => {
  // Basic calculator state
  const [gailInput, setGailInput] = useState<GailInputs>({
    age: 35,
    ageFirstPeriod: 13,
    ageFirstBirth: null,
    numberOfRelatives: 0,
    numberOfBiopsies: 0,
    atypicalHyperplasia: false,
    race: 'white'
  });

  const [results, setResults] = useState<GailResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showingResults, setShowingResults] = useState(false);

  // Emotional support state
  const [emotionalState, setEmotionalState] = useState<EmotionalState>('calm');
  const [preparationSteps, setPreparationSteps] = useState<PreparationStep[]>([]);
  const [currentStep, setCurrentStep] = useState<PreparationStep>('understanding');
  const [resultsDisclosureStage, setResultsDisclosureStage] = useState<DisclosureStage>('preparation');
  const [relaxationTechniques, setRelaxationTechniques] = useState<string[]>([]);

  // Calculate risk function
  const calculateRisk = useCallback(async (inputs: GailInputs): Promise<GailResults> => {
    setIsCalculating(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      // Simplified Gail calculation
      let relativeRisk = 1.0;
      
      // Age factor
      if (inputs.ageFirstPeriod < 12) relativeRisk *= 1.21;
      else if (inputs.ageFirstPeriod >= 14) relativeRisk *= 0.93;
      
      // Age at first birth
      if (inputs.ageFirstBirth === null) {
        if (inputs.age >= 20) relativeRisk *= 1.24;
      } else if (inputs.ageFirstBirth >= 30) {
        relativeRisk *= 1.24;
      }
      
      // Family history
      relativeRisk *= (1 + inputs.numberOfRelatives * 0.4);
      
      // Biopsies
      if (inputs.numberOfBiopsies >= 1) {
        relativeRisk *= inputs.atypicalHyperplasia ? 1.82 : 1.27;
      }
      
      // Race adjustment
      const raceMultipliers = {
        white: 1.0,
        black: 0.79,
        hispanic: 0.73,
        asian: 0.69,
        other: 0.8
      };
      relativeRisk *= raceMultipliers[inputs.race];
      
      // Calculate absolute risk
      const baselineRisk = 2.0; // Simplified baseline
      const fiveYearRisk = Math.min(baselineRisk * relativeRisk, 50);
      const lifetimeRisk = Math.min(fiveYearRisk * 4.2, 100);
      
      // Determine risk category
      let riskCategory: 'low' | 'average' | 'high';
      if (fiveYearRisk < 1.67) riskCategory = 'low';
      else if (fiveYearRisk < 5) riskCategory = 'average';
      else riskCategory = 'high';
      
      const result: GailResults = {
        fiveYearRisk: Math.round(fiveYearRisk * 10) / 10,
        lifetimeRisk: Math.round(lifetimeRisk * 10) / 10,
        riskCategory,
        averageRisk: baselineRisk,
        explanation: `Ваш риск составляет ${fiveYearRisk.toFixed(1)}% за 5 лет`,
        recommendations: [
          'Поддерживайте здоровый вес',
          'Регулярные обследования',
          'Здоровый образ жизни'
        ]
      };
      
      setResults(result);
      return result;
      
    } finally {
      setIsCalculating(false);
    }
  }, []);

  // Emotional support functions
  const prepareForResults = useCallback(() => {
    setCurrentStep('emotional_prep');
    setPreparationSteps(prev => [...prev, 'understanding']);
  }, []);

  const assessAnxiety = useCallback((level: EmotionalState) => {
    setEmotionalState(level);
  }, []);

  const setDisclosurePreference = useCallback((stage: DisclosureStage) => {
    setResultsDisclosureStage(stage);
  }, []);

  const performRelaxation = useCallback((technique: string) => {
    setCurrentStep('relaxation');
  }, []);

  const checkSupportSystem = useCallback(() => {
    setCurrentStep('support_system');
  }, []);

  const getProgressPercentage = useCallback(() => {
    return (preparationSteps.length / 5) * 100;
  }, [preparationSteps]);

  const getEmotionalSupport = useCallback(() => {
    const messages = {
      calm: "Отлично! Вы готовы узнать результаты.",
      anxious: "Беспокойство - это нормально.",
      worried: "Ваши переживания понятны.",
      overwhelmed: "Давайте сделаем глубокий вдох."
    };
    return messages[emotionalState];
  }, [emotionalState]);

  return {
    // State
    gailInput,
    setGailInput,
    results,
    isCalculating,
    emotionalState,
    preparationSteps,
    showingResults,
    resultsDisclosureStage,
    relaxationTechniques,
    
    // Actions
    calculateRisk,
    prepareForResults,
    assessAnxiety,
    setDisclosurePreference,
    performRelaxation,
    checkSupportSystem,
    getProgressPercentage,
    getEmotionalSupport,
    
    // Computed
    gailResult: results, // Alias for backward compatibility
  };
};
