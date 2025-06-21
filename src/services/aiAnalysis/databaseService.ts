
/**
 * Database Service for AI Analysis
 * Handles all database interactions
 */

import { supabase } from '@/integrations/supabase/client';
import { AnalysisRequest, AnalysisResults, HealthPattern, HealthCorrelation, HealthAnomaly } from './types';

export class DatabaseService {
  /**
   * Create a new analysis session in the database
   */
  async createAnalysisSession(request: AnalysisRequest): Promise<string> {
    const sessionData = {
      session_type: request.sessionType,
      analysis_scope: request.scope as any,
      data_timeframe: request.timeframe as any,
      input_data_sources: ['wearable_data', 'health_records', 'lab_results'] as any,
      key_findings: [] as any,
      processing_status: 'processing',
      ai_model_version: 'v2.1.0'
    };

    const { data: session, error: sessionError } = await supabase
      .from('ai_analysis_sessions')
      .insert(sessionData)
      .select()
      .single();

    if (sessionError) {
      throw new Error(`Failed to create analysis session: ${sessionError.message}`);
    }

    return session.id;
  }

  /**
   * Get analysis session data
   */
  async getAnalysisSession(sessionId: string) {
    const { data: session, error: sessionError } = await supabase
      .from('ai_analysis_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (sessionError || !session) {
      console.error('Session not found:', sessionError);
      return null;
    }

    return session;
  }

  /**
   * Get related analysis data (patterns, correlations, anomalies)
   */
  async getAnalysisData(sessionId: string) {
    const [patternsResult, correlationsResult, anomaliesResult] = await Promise.all([
      supabase.from('health_patterns').select('*').eq('analysis_session_id', sessionId),
      supabase.from('health_correlations').select('*').eq('analysis_session_id', sessionId),
      supabase.from('health_anomalies').select('*').eq('analysis_session_id', sessionId)
    ]);

    return {
      patterns: patternsResult.data || [],
      correlations: correlationsResult.data || [],
      anomalies: anomaliesResult.data || []
    };
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
   * Update analysis session with results
   */
  async updateAnalysisSession(sessionId: string, results: any, processingTime: number) {
    const patternsDetected = results.patterns.map((p: HealthPattern) => p.id);
    const correlationsFound = results.correlations.map((c: HealthCorrelation) => c.id);
    const anomaliesDetected = results.anomalies.map((a: HealthAnomaly) => a.id);
    
    await supabase
      .from('ai_analysis_sessions')
      .update({
        processing_status: 'completed',
        processing_duration_ms: processingTime,
        confidence_score: results.confidenceScore,
        data_completeness: results.dataCompleteness,
        key_findings: results.keyFindings as any,
        patterns_detected: patternsDetected as any,
        correlations_found: correlationsFound as any,
        anomalies_detected: anomaliesDetected as any
      })
      .eq('id', sessionId);
  }

  /**
   * Mark session as failed
   */
  async markSessionAsFailed(sessionId: string, error: Error) {
    await supabase
      .from('ai_analysis_sessions')
      .update({
        processing_status: 'failed',
        error_details: error instanceof Error ? error.message : 'Unknown error'
      })
      .eq('id', sessionId);
  }

  /**
   * Save detailed analysis results to database
   */
  async saveDetailedResults(sessionId: string, userId: string, results: AnalysisResults): Promise<void> {
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
