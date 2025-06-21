
/**
 * AI Analysis Types and Interfaces
 */

// Core interfaces for analysis
export interface AnalysisRequest {
  userId: string;
  sessionType: 'full_analysis' | 'targeted_analysis' | 'pattern_detection';
  scope: AnalysisScope;
  timeframe: AnalysisTimeframe;
}

export interface AnalysisScope {
  includeWearableData: boolean;
  includeLabResults: boolean;
  includeMenstrualCycle: boolean;
  includeSymptoms: boolean;
  includeMedications: boolean;
}

export interface AnalysisTimeframe {
  startDate: string;
  endDate: string;
  period: 'week' | 'month' | 'quarter' | 'year';
}

// Result interfaces
export interface HealthPattern {
  id: string;
  patternType: string;
  patternCategory: string;
  patternName: string;
  description: string;
  strength?: number;
  timePeriod: string;
  healthImpact: string;
  clinicalRelevance: string;
  startDate?: string;
  endDate?: string;
}

export interface HealthCorrelation {
  id: string;
  metric1: string;
  metric2: string;
  coefficient: number;
  significance: number;
  strength: string;
  direction: string;
  insights: string;
  clinicalMeaning: string;
}

export interface HealthAnomaly {
  id: string;
  metricName: string;
  metricType: string;
  anomalyType: string;
  detectedValue: number;
  expectedValue: number;
  anomalyScore: number;
  severity: string;
  urgency: string;
  recommendedAction: string;
  detectionDate: string;
}

export interface AnalysisResults {
  sessionId: string;
  keyFindings: string[];
  patterns: HealthPattern[];
  correlations: HealthCorrelation[];
  anomalies: HealthAnomaly[];
  recommendations: string[];
  confidenceScore: number;
  dataCompleteness: number;
  processingTime: number;
}
