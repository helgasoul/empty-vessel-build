
// Main Enhanced Gail Calculator hooks
export { useGailCalculator } from './useGailCalculator';
export { useGeneticData } from './useGeneticData';
export { useWearableSync } from './useWearableSync';
export { usePersonalizedRecommendations } from './usePersonalizedRecommendations';

// Internal utility hooks
export { useCalculationProgress } from './internal/useCalculationProgress';
export { useCalculationCache } from './internal/useCalculationCache';
export { useCalculationHistory } from './internal/useCalculationHistory';
export { useCalculationValidation } from './internal/useCalculationValidation';

// Re-export types for convenience
export type {
  GailCalculatorInput,
  GailCalculatorResult,
  EnhancedRiskAssessment,
  GeneticRiskFactors,
  EnvironmentalFactors,
  PersonalizedRecommendations,
} from '../types/gail-calculator';
