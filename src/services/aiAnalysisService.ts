
/**
 * AI Analysis Service
 * Manages AI health analysis operations
 */

import { supabase } from '@/integrations/supabase/client';

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

class AIAnalysisService {
  /**
   * Start a new AI analysis session
   */
  async startAnalysis(request: AnalysisRequest): Promise<string> {
    const sessionId = crypto.randomUUID();
    
    try {
      // Create analysis session - remove 'id' from insert as it's auto-generated
      const { data: session, error: sessionError } = await supabase
        .from('ai_analysis_sessions')
        .insert({
          user_id: request.userId,
          session_type: request.sessionType,
          analysis_scope: request.scope,
          data_timeframe: request.timeframe,
          input_data_sources: ['wearable_data', 'health_records', 'lab_results'],
          key_findings: [],
          processing_status: 'processing',
          ai_model_version: 'v2.1.0'
        })
        .select()
        .single();

      if (sessionError) {
        throw new Error(`Failed to create analysis session: ${sessionError.message}`);
      }

      // Start background processing
      this.processAnalysis(session.id, request);

      return session.id;
    } catch (error) {
      console.error('Error starting analysis:', error);
      throw error;
    }
  }

  /**
   * Get analysis results by session ID
   */
  async getAnalysisResults(sessionId: string): Promise<AnalysisResults | null> {
    try {
      // Get session data
      const { data: session, error: sessionError } = await supabase
        .from('ai_analysis_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (sessionError || !session) {
        console.error('Session not found:', sessionError);
        return null;
      }

      if (session.processing_status !== 'completed') {
        return null; // Still processing
      }

      // Get related data
      const [patternsResult, correlationsResult, anomaliesResult] = await Promise.all([
        supabase.from('health_patterns').select('*').eq('analysis_session_id', sessionId),
        supabase.from('health_correlations').select('*').eq('analysis_session_id', sessionId),
        supabase.from('health_anomalies').select('*').eq('analysis_session_id', sessionId)
      ]);

      // Transform database results to interface format
      const patterns: HealthPattern[] = (patternsResult.data || []).map(p => ({
        id: p.id,
        patternType: p.pattern_type || '',
        patternCategory: p.pattern_category || '',
        patternName: p.pattern_name || '',
        description: p.pattern_description || '',
        strength: p.pattern_strength || 0,
        timePeriod: p.time_period || '',
        healthImpact: p.health_impact || '',
        clinicalRelevance: p.clinical_relevance || '',
        startDate: p.start_date || '',
        endDate: p.end_date || ''
      }));

      const correlations: HealthCorrelation[] = (correlationsResult.data || []).map(c => ({
        id: c.id,
        metric1: c.metric_1_name || '',
        metric2: c.metric_2_name || '',
        coefficient: c.correlation_coefficient || 0,
        significance: c.statistical_significance || 0,
        strength: c.relationship_strength || '',
        direction: c.relationship_direction || '',
        insights: c.actionable_insights || '',
        clinicalMeaning: c.clinical_meaningfulness || ''
      }));

      const anomalies: HealthAnomaly[] = (anomaliesResult.data || []).map(a => ({
        id: a.id,
        metricName: a.metric_name || '',
        metricType: a.metric_type || '',
        anomalyType: a.anomaly_type || '',
        detectedValue: a.detected_value || 0,
        expectedValue: a.expected_value || 0,
        anomalyScore: a.anomaly_score || 0,
        severity: a.severity_level || '',
        urgency: a.urgency || '',
        recommendedAction: a.recommended_action || '',
        detectionDate: a.detection_date || ''
      }));

      return {
        sessionId: session.id,
        keyFindings: Array.isArray(session.key_findings) ? session.key_findings as string[] : [],
        patterns,
        correlations,
        anomalies,
        recommendations: this.generateRecommendations(patterns, correlations, anomalies),
        confidenceScore: session.confidence_score || 0,
        dataCompleteness: session.data_completeness || 0,
        processingTime: session.processing_duration_ms || 0
      };

    } catch (error) {
      console.error('Error getting analysis results:', error);
      return null;
    }
  }

  /**
   * Get user's analysis sessions
   */
  async getUserAnalysisSessions(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('ai_analysis_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching user sessions:', error);
      return [];
    }
  }

  /**
   * Process analysis in the background
   */
  private async processAnalysis(sessionId: string, request: AnalysisRequest): Promise<void> {
    try {
      const startTime = Date.now();

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate mock results for demo
      const mockResults = await this.generateMockResults(request);

      // Update session with results
      const processingTime = Date.now() - startTime;
      
      // Convert string arrays to proper format for database
      const patternsDetected = mockResults.patterns.map(p => p.id);
      const correlationsFound = mockResults.correlations.map(c => c.id);
      const anomaliesDetected = mockResults.anomalies.map(a => a.id);
      
      await supabase
        .from('ai_analysis_sessions')
        .update({
          processing_status: 'completed',
          processing_duration_ms: processingTime,
          confidence_score: mockResults.confidenceScore,
          data_completeness: mockResults.dataCompleteness,
          key_findings: mockResults.keyFindings,
          patterns_detected: patternsDetected,
          correlations_found: correlationsFound,
          anomalies_detected: anomaliesDetected
        })
        .eq('id', sessionId);

      // Save detailed results
      await this.saveDetailedResults(sessionId, request.userId, mockResults);

    } catch (error) {
      console.error('Error processing analysis:', error);
      
      // Mark as failed
      await supabase
        .from('ai_analysis_sessions')
        .update({
          processing_status: 'failed',
          error_details: error instanceof Error ? error.message : 'Unknown error'
        })
        .eq('id', sessionId);
    }
  }

  /**
   * Generate mock results for demo purposes
   */
  private async generateMockResults(request: AnalysisRequest): Promise<AnalysisResults> {
    const patterns: HealthPattern[] = [
      {
        id: crypto.randomUUID(),
        patternType: 'sleep_pattern',
        patternCategory: 'circadian',
        patternName: 'Нарушение циркадного ритма',
        description: 'Обнаружена тенденция к позднему засыпанию в выходные дни',
        strength: 0.75,
        timePeriod: 'weekly',
        healthImpact: 'negative',
        clinicalRelevance: 'moderate',
        startDate: '2024-01-01',
        endDate: '2024-01-31'
      },
      {
        id: crypto.randomUUID(),
        patternType: 'activity_pattern',
        patternCategory: 'exercise',
        patternName: 'Стабильная физическая активность',
        description: 'Регулярные тренировки 3-4 раза в неделю с постепенным увеличением интенсивности',
        strength: 0.85,
        timePeriod: 'monthly',
        healthImpact: 'positive',
        clinicalRelevance: 'high',
        startDate: '2024-01-01',
        endDate: '2024-01-31'
      }
    ];

    const correlations: HealthCorrelation[] = [
      {
        id: crypto.randomUUID(),
        metric1: 'Качество сна',
        metric2: 'Уровень стресса',
        coefficient: -0.72,
        significance: 0.001,
        strength: 'strong',
        direction: 'negative',
        insights: 'Плохое качество сна сильно коррелирует с повышенным уровнем стресса',
        clinicalMeaning: 'high'
      },
      {
        id: crypto.randomUUID(),
        metric1: 'Физическая активность',
        metric2: 'Настроение',
        coefficient: 0.65,
        significance: 0.005,
        strength: 'moderate',
        direction: 'positive',
        insights: 'Увеличение физической активности связано с улучшением настроения',
        clinicalMeaning: 'moderate'
      }
    ];

    const anomalies: HealthAnomaly[] = [
      {
        id: crypto.randomUUID(),
        metricName: 'Частота сердечных сокращений в покое',
        metricType: 'cardiovascular',
        anomalyType: 'outlier',
        detectedValue: 95,
        expectedValue: 72,
        anomalyScore: 0.85,
        severity: 'moderate',
        urgency: 'within_week',
        recommendedAction: 'Обратиться к кардиологу для дополнительного обследования',
        detectionDate: new Date().toISOString()
      }
    ];

    return {
      sessionId: crypto.randomUUID(),
      keyFindings: [
        'Выявлены нарушения циркадного ритма, влияющие на качество сна',
        'Обнаружена сильная связь между стрессом и качеством сна',
        'Физическая активность показывает положительное влияние на настроение',
        'Зафиксированы отклонения в покойном пульсе, требующие внимания'
      ],
      patterns,
      correlations,
      anomalies,
      recommendations: [
        'Установите постоянное время отхода ко сну, включая выходные',
        'Рассмотрите техники управления стрессом: медитацию или йогу',
        'Продолжайте регулярные тренировки для поддержания хорошего настроения',
        'Запланируйте консультацию с кардиологом по поводу частоты пульса'
      ],
      confidenceScore: 0.82,
      dataCompleteness: 0.75,
      processingTime: 2500
    };
  }

  /**
   * Generate recommendations based on analysis results
   */
  private generateRecommendations(
    patterns: HealthPattern[],
    correlations: HealthCorrelation[],
    anomalies: HealthAnomaly[]
  ): string[] {
    const recommendations: string[] = [];

    // Recommendations based on patterns
    patterns.forEach(pattern => {
      if (pattern.healthImpact === 'negative') {
        switch (pattern.patternType) {
          case 'sleep_pattern':
            recommendations.push('Улучшите гигиену сна: постоянное время отхода ко сну и пробуждения');
            break;
          case 'activity_pattern':
            recommendations.push('Увеличьте физическую активность до рекомендованных 150 минут в неделю');
            break;
        }
      }
    });

    // Recommendations based on correlations
    correlations.forEach(correlation => {
      if (correlation.strength === 'strong') {
        recommendations.push(`Обратите внимание на связь между ${correlation.metric1} и ${correlation.metric2}`);
      }
    });

    // Recommendations based on anomalies
    anomalies.forEach(anomaly => {
      if (anomaly.severity === 'high' || anomaly.severity === 'critical') {
        recommendations.push(anomaly.recommendedAction);
      }
    });

    return recommendations;
  }

  /**
   * Save detailed analysis results to database
   */
  private async saveDetailedResults(
    sessionId: string,
    userId: string,
    results: AnalysisResults
  ): Promise<void> {
    try {
      // Save patterns
      if (results.patterns.length > 0) {
        const patternInserts = results.patterns.map(pattern => ({
          id: pattern.id,
          user_id: userId,
          analysis_session_id: sessionId,
          pattern_type: pattern.patternType,
          pattern_category: pattern.patternCategory,
          pattern_name: pattern.patternName,
          pattern_description: pattern.description,
          pattern_strength: pattern.strength,
          time_period: pattern.timePeriod,
          health_impact: pattern.healthImpact,
          clinical_relevance: pattern.clinicalRelevance,
          start_date: pattern.startDate,
          end_date: pattern.endDate,
          primary_metrics: {},
          statistical_significance: 0.05,
          effect_size: pattern.strength || 0
        }));

        await supabase.from('health_patterns').insert(patternInserts);
      }

      // Save correlations
      if (results.correlations.length > 0) {
        const correlationInserts = results.correlations.map(correlation => ({
          id: correlation.id,
          user_id: userId,
          analysis_session_id: sessionId,
          metric_1_name: correlation.metric1,
          metric_1_type: 'health_metric',
          metric_2_name: correlation.metric2,
          metric_2_type: 'health_metric',
          correlation_coefficient: correlation.coefficient,
          statistical_significance: correlation.significance,
          relationship_strength: correlation.strength,
          relationship_direction: correlation.direction,
          actionable_insights: correlation.insights,
          clinical_meaningfulness: correlation.clinicalMeaning,
          correlation_type: 'linear',
          sample_size: 30,
          time_lag_days: 0,
          correlation_period: 'monthly',
          temporal_stability: 'stable',
          causality_likelihood: 'possible'
        }));

        await supabase.from('health_correlations').insert(correlationInserts);
      }

      // Save anomalies
      if (results.anomalies.length > 0) {
        const anomalyInserts = results.anomalies.map(anomaly => ({
          id: anomaly.id,
          user_id: userId,
          analysis_session_id: sessionId,
          metric_name: anomaly.metricName,
          metric_type: anomaly.metricType,
          anomaly_type: anomaly.anomalyType,
          detected_value: anomaly.detectedValue,
          expected_value: anomaly.expectedValue,
          anomaly_score: anomaly.anomalyScore,
          threshold_used: anomaly.expectedValue * 1.2,
          detection_date: anomaly.detectionDate,
          anomaly_duration_days: 1,
          time_since_last_normal: 7,
          severity_level: anomaly.severity,
          urgency: anomaly.urgency,
          confidence_level: 0.85,
          recommended_action: anomaly.recommendedAction,
          follow_up_required: anomaly.severity === 'high' || anomaly.severity === 'critical',
          follow_up_timeline: anomaly.urgency,
          user_acknowledged: false,
          resolution_status: 'open',
          healthcare_provider_notified: false,
          potential_causes: [],
          concurrent_events: [],
          related_symptoms: [],
          external_factors: []
        }));

        await supabase.from('health_anomalies').insert(anomalyInserts);
      }

    } catch (error) {
      console.error('Error saving detailed results:', error);
      throw error;
    }
  }
}

export const aiAnalysisService = new AIAnalysisService();
