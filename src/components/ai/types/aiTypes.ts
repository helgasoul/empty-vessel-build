
export interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  context?: 'cycle' | 'symptoms' | 'health' | 'general' | 'analysis';
  attachments?: {
    type: 'chart' | 'recommendation' | 'insight';
    data: any;
  }[];
}

export interface HealthInsight {
  id: string;
  type: 'trend' | 'correlation' | 'prediction' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  data?: any;
}

export interface ComprehensiveHealthContext {
  // Базовые метрики
  currentCycleDay?: number;
  cyclePhase?: string;
  cycleTrends?: {
    averageLength: number;
    regularityScore: number;
    symptomPatterns: string[];
  };
  
  // Данные здоровья
  healthMetrics?: {
    steps: number;
    sleep: number;
    heartRate: number;
    stepstrend: 'increasing' | 'stable' | 'decreasing';
    sleepTrend: 'improving' | 'stable' | 'declining';
  };
  
  // Симптомы и настроение
  moodAnalysis?: {
    currentRating: number;
    trend: 'improving' | 'stable' | 'declining';
    stressLevel: number;
    energyLevel: number;
    correlations: { symptom: string; impact: number }[];
  };
  
  // Прогнозы и инсайты
  predictions?: {
    nextCycleStart: string;
    expectedSymptoms: string[];
    optimalWorkoutDays: number[];
    nutritionFocus: string[];
  };
  
  // Персонализированные рекомендации
  recommendations?: {
    immediate: string[];
    weekly: string[];
    lifestyle: string[];
    medical: string[];
  };
}

export interface HealthData {
  data_type: string;
  data_value: number;
  recorded_at: string;
}

export interface CycleData {
  cycle_start_date: string;
  cycle_length?: number;
}

export interface LogData {
  log_date: string;
  symptoms?: string[];
  mood_rating?: number;
  stress_level?: number;
  energy_level?: number;
}
