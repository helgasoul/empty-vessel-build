
/**
 * AI Analysis Service
 * Multi-modal health data analysis engine
 */

import { supabase } from '@/integrations/supabase/client';

export interface AnalysisScope {
  includeWearableData: boolean;
  includeLabResults: boolean;
  includeMenstrualCycle: boolean;
  includeSymptoms: boolean;
  includeMedications: boolean;
  customMetrics?: string[];
}

export interface AnalysisTimeframe {
  startDate: string;
  endDate: string;
  period: 'week' | 'month' | 'quarter' | 'year' | 'all';
}

export interface AnalysisRequest {
  sessionType: 'full_analysis' | 'targeted_analysis' | 'pattern_detection';
  scope: AnalysisScope;
  timeframe: AnalysisTimeframe;
  userId: string;
}

export interface HealthPattern {
  patternType: string;
  patternCategory: string;
  patternName: string;
  description: string;
  strength: number;
  timePeriod: string;
  healthImpact: 'positive' | 'negative' | 'neutral' | 'mixed';
  clinicalRelevance: 'high' | 'moderate' | 'low';
  primaryMetrics: any[];
  triggers: any[];
}

export interface HealthCorrelation {
  metric1: { name: string; type: string };
  metric2: { name: string; type: string };
  coefficient: number;
  significance: number;
  strength: 'weak' | 'moderate' | 'strong' | 'very_strong';
  direction: 'positive' | 'negative' | 'bidirectional';
  clinicalMeaning: 'high' | 'moderate' | 'low' | 'unclear';
  insights: string;
}

export interface HealthAnomaly {
  metricName: string;
  metricType: string;
  anomalyType: 'outlier' | 'trend_change' | 'pattern_break' | 'missing_data';
  detectedValue: number;
  expectedValue: number;
  anomalyScore: number;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  urgency: 'immediate' | 'within_week' | 'within_month' | 'routine';
  potentialCauses: string[];
  recommendedAction: string;
}

export interface AnalysisResults {
  sessionId: string;
  keyFindings: string[];
  patterns: HealthPattern[];
  correlations: HealthCorrelation[];
  anomalies: HealthAnomaly[];
  trends: any[];
  confidenceScore: number;
  dataCompleteness: number;
  recommendations: string[];
}

class AIAnalysisService {
  async startAnalysis(request: AnalysisRequest): Promise<string> {
    try {
      // Create analysis session
      const { data: session, error: sessionError } = await supabase
        .from('ai_analysis_sessions')
        .insert({
          user_id: request.userId,
          session_type: request.sessionType,
          ai_model_version: '1.0.0',
          input_data_sources: this.mapDataSources(request.scope),
          analysis_scope: request.scope,
          data_timeframe: request.timeframe,
          key_findings: [],
          processing_status: 'processing'
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      // Start background analysis
      this.performAnalysis(session.id, request);

      return session.id;
    } catch (error) {
      console.error('Failed to start analysis:', error);
      throw error;
    }
  }

  private async performAnalysis(sessionId: string, request: AnalysisRequest) {
    try {
      const startTime = Date.now();

      // Fetch user health data
      const healthData = await this.fetchHealthData(request.userId, request.timeframe);
      
      // Perform multi-modal analysis
      const patterns = await this.detectPatterns(healthData, sessionId, request.userId);
      const correlations = await this.findCorrelations(healthData, sessionId, request.userId);
      const anomalies = await this.detectAnomalies(healthData, sessionId, request.userId);
      const trends = await this.identifyTrends(healthData);

      // Calculate quality metrics
      const confidenceScore = this.calculateConfidenceScore(healthData, patterns, correlations);
      const dataCompleteness = this.calculateDataCompleteness(healthData, request.scope);

      // Generate key findings
      const keyFindings = this.generateKeyFindings(patterns, correlations, anomalies, trends);

      // Update session with results
      const processingTime = Date.now() - startTime;
      await supabase
        .from('ai_analysis_sessions')
        .update({
          key_findings: keyFindings,
          patterns_detected: patterns.map(p => ({ id: p.id, name: p.patternName })),
          correlations_found: correlations.map(c => ({ 
            metrics: `${c.metric1.name} - ${c.metric2.name}`, 
            strength: c.strength 
          })),
          anomalies_detected: anomalies.map(a => ({ 
            metric: a.metricName, 
            severity: a.severity 
          })),
          trends_identified: trends,
          confidence_score: confidenceScore,
          data_completeness: dataCompleteness,
          processing_duration_ms: processingTime,
          processing_status: 'completed'
        })
        .eq('id', sessionId);

    } catch (error) {
      console.error('Analysis failed:', error);
      await supabase
        .from('ai_analysis_sessions')
        .update({
          processing_status: 'failed',
          error_details: error.message
        })
        .eq('id', sessionId);
    }
  }

  private async fetchHealthData(userId: string, timeframe: AnalysisTimeframe) {
    const { data: healthDeviceData } = await supabase
      .from('health_device_data')
      .select('*')
      .eq('user_id', userId)
      .gte('recorded_at', timeframe.startDate)
      .lte('recorded_at', timeframe.endDate);

    const { data: dailySummary } = await supabase
      .from('daily_health_summary')
      .select('*')
      .eq('user_id', userId)
      .gte('summary_date', timeframe.startDate)
      .lte('summary_date', timeframe.endDate);

    const { data: menstrualCycles } = await supabase
      .from('menstrual_cycles')
      .select('*')
      .eq('user_id', userId)
      .gte('cycle_start_date', timeframe.startDate)
      .lte('cycle_start_date', timeframe.endDate);

    const { data: symptoms } = await supabase
      .from('symptom_mood_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('log_date', timeframe.startDate)
      .lte('log_date', timeframe.endDate);

    return {
      healthDeviceData: healthDeviceData || [],
      dailySummary: dailySummary || [],
      menstrualCycles: menstrualCycles || [],
      symptoms: symptoms || []
    };
  }

  private async detectPatterns(healthData: any, sessionId: string, userId: string): Promise<any[]> {
    const patterns = [];

    // Sleep pattern analysis
    const sleepPattern = this.analyzeSleepPattern(healthData.dailySummary);
    if (sleepPattern) {
      const { data: pattern } = await supabase
        .from('health_patterns')
        .insert({
          user_id: userId,
          analysis_session_id: sessionId,
          pattern_type: 'sleep_pattern',
          pattern_category: 'circadian',
          pattern_name: sleepPattern.name,
          pattern_description: sleepPattern.description,
          pattern_strength: sleepPattern.strength,
          time_period: 'daily',
          primary_metrics: ['sleep_hours', 'sleep_quality'],
          health_impact: sleepPattern.impact,
          clinical_relevance: sleepPattern.relevance,
          actionability: 'actionable'
        })
        .select()
        .single();

      if (pattern) patterns.push(pattern);
    }

    // Activity pattern analysis
    const activityPattern = this.analyzeActivityPattern(healthData.dailySummary);
    if (activityPattern) {
      const { data: pattern } = await supabase
        .from('health_patterns')
        .insert({
          user_id: userId,
          analysis_session_id: sessionId,
          pattern_type: 'activity_pattern',
          pattern_category: 'behavioral',
          pattern_name: activityPattern.name,
          pattern_description: activityPattern.description,
          pattern_strength: activityPattern.strength,
          time_period: 'daily',
          primary_metrics: ['total_steps', 'active_minutes'],
          health_impact: activityPattern.impact,
          clinical_relevance: activityPattern.relevance,
          actionability: 'actionable'
        })
        .select()
        .single();

      if (pattern) patterns.push(pattern);
    }

    return patterns;
  }

  private async findCorrelations(healthData: any, sessionId: string, userId: string): Promise<any[]> {
    const correlations = [];

    // Sleep-Activity correlation
    const sleepActivityCorr = this.calculateCorrelation(
      healthData.dailySummary.map(d => d.sleep_hours),
      healthData.dailySummary.map(d => d.total_steps)
    );

    if (sleepActivityCorr.significance < 0.05) {
      const { data: correlation } = await supabase
        .from('health_correlations')
        .insert({
          user_id: userId,
          analysis_session_id: sessionId,
          metric_1_name: 'Sleep Hours',
          metric_1_type: 'wearable',
          metric_2_name: 'Daily Steps',
          metric_2_type: 'wearable',
          correlation_coefficient: sleepActivityCorr.coefficient,
          statistical_significance: sleepActivityCorr.significance,
          correlation_type: 'linear',
          relationship_direction: sleepActivityCorr.coefficient > 0 ? 'positive' : 'negative',
          relationship_strength: this.classifyCorrelationStrength(sleepActivityCorr.coefficient),
          clinical_meaningfulness: 'moderate',
          actionable_insights: this.generateCorrelationInsights('sleep', 'activity', sleepActivityCorr.coefficient)
        })
        .select()
        .single();

      if (correlation) correlations.push(correlation);
    }

    return correlations;
  }

  private async detectAnomalies(healthData: any, sessionId: string, userId: string): Promise<any[]> {
    const anomalies = [];

    // Check for sleep anomalies
    const sleepHours = healthData.dailySummary.map(d => d.sleep_hours).filter(h => h != null);
    if (sleepHours.length > 0) {
      const sleepAnomalies = this.detectOutliers(sleepHours, 'Sleep Hours');
      for (const anomaly of sleepAnomalies) {
        const { data: anomalyRecord } = await supabase
          .from('health_anomalies')
          .insert({
            user_id: userId,
            analysis_session_id: sessionId,
            metric_name: 'Sleep Hours',
            metric_type: 'wearable',
            anomaly_type: 'outlier',
            detected_value: anomaly.value,
            expected_value: anomaly.expected,
            anomaly_score: anomaly.score,
            detection_date: new Date().toISOString().split('T')[0],
            severity_level: this.classifyAnomalySeverity(anomaly.score),
            urgency: this.determineUrgency('Sleep Hours', anomaly.score),
            potential_causes: ['stress', 'lifestyle_change', 'medical_condition'],
            recommended_action: 'monitor'
          })
          .select()
          .single();

        if (anomalyRecord) anomalies.push(anomalyRecord);
      }
    }

    return anomalies;
  }

  private async identifyTrends(healthData: any): Promise<any[]> {
    const trends = [];

    // Analyze sleep trend
    const sleepHours = healthData.dailySummary
      .map(d => ({ date: d.summary_date, value: d.sleep_hours }))
      .filter(d => d.value != null)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (sleepHours.length >= 7) {
      const trend = this.calculateTrend(sleepHours);
      trends.push({
        metric: 'Sleep Hours',
        direction: trend.direction,
        strength: trend.strength,
        significance: trend.significance
      });
    }

    return trends;
  }

  // Helper methods
  private mapDataSources(scope: AnalysisScope): string[] {
    const sources = [];
    if (scope.includeWearableData) sources.push('wearable_devices');
    if (scope.includeLabResults) sources.push('lab_results');
    if (scope.includeMenstrualCycle) sources.push('menstrual_tracking');
    if (scope.includeSymptoms) sources.push('symptom_logs');
    if (scope.includeMedications) sources.push('medications');
    return sources;
  }

  private analyzeSleepPattern(dailyData: any[]): any | null {
    const sleepHours = dailyData.map(d => d.sleep_hours).filter(h => h != null);
    if (sleepHours.length < 7) return null;

    const avgSleep = sleepHours.reduce((a, b) => a + b, 0) / sleepHours.length;
    const consistency = 1 - (Math.max(...sleepHours) - Math.min(...sleepHours)) / 24;

    return {
      name: avgSleep >= 7 ? 'Healthy Sleep Pattern' : 'Insufficient Sleep Pattern',
      description: `Average sleep: ${avgSleep.toFixed(1)} hours, Consistency: ${(consistency * 100).toFixed(1)}%`,
      strength: consistency,
      impact: avgSleep >= 7 && consistency > 0.8 ? 'positive' : 'negative',
      relevance: 'high'
    };
  }

  private analyzeActivityPattern(dailyData: any[]): any | null {
    const steps = dailyData.map(d => d.total_steps).filter(s => s != null);
    if (steps.length < 7) return null;

    const avgSteps = steps.reduce((a, b) => a + b, 0) / steps.length;
    const consistency = 1 - (Math.max(...steps) - Math.min(...steps)) / Math.max(...steps);

    return {
      name: avgSteps >= 8000 ? 'Active Lifestyle Pattern' : 'Sedentary Pattern',
      description: `Average steps: ${Math.round(avgSteps)}, Activity consistency: ${(consistency * 100).toFixed(1)}%`,
      strength: Math.min(avgSteps / 10000, 1),
      impact: avgSteps >= 8000 ? 'positive' : 'negative',
      relevance: 'high'
    };
  }

  private calculateCorrelation(x: number[], y: number[]): { coefficient: number; significance: number } {
    if (x.length !== y.length || x.length < 3) {
      return { coefficient: 0, significance: 1 };
    }

    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    if (denominator === 0) return { coefficient: 0, significance: 1 };

    const r = numerator / denominator;
    
    // Simplified significance calculation
    const t = r * Math.sqrt((n - 2) / (1 - r * r));
    const significance = Math.abs(t) > 2 ? 0.05 : 0.1; // Simplified p-value

    return { coefficient: r, significance };
  }

  private classifyCorrelationStrength(coefficient: number): string {
    const abs = Math.abs(coefficient);
    if (abs >= 0.7) return 'strong';
    if (abs >= 0.5) return 'moderate';
    if (abs >= 0.3) return 'weak';
    return 'very_weak';
  }

  private generateCorrelationInsights(metric1: string, metric2: string, coefficient: number): string {
    const direction = coefficient > 0 ? 'increases' : 'decreases';
    const strength = this.classifyCorrelationStrength(coefficient);
    return `There is a ${strength} relationship where better ${metric1} ${direction} ${metric2} performance.`;
  }

  private detectOutliers(values: number[], metricName: string): any[] {
    if (values.length < 5) return [];

    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const std = Math.sqrt(values.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / values.length);
    
    const outliers = [];
    values.forEach(value => {
      const zScore = Math.abs((value - mean) / std);
      if (zScore > 2) {
        outliers.push({
          value,
          expected: mean,
          score: zScore / 3 // Normalize to 0-1
        });
      }
    });

    return outliers;
  }

  private classifyAnomalySeverity(score: number): string {
    if (score >= 0.8) return 'critical';
    if (score >= 0.6) return 'high';
    if (score >= 0.4) return 'moderate';
    return 'low';
  }

  private determineUrgency(metricName: string, score: number): string {
    if (score >= 0.8) return 'immediate';
    if (score >= 0.6) return 'within_week';
    if (score >= 0.4) return 'within_month';
    return 'routine';
  }

  private calculateTrend(data: { date: string; value: number }[]): any {
    if (data.length < 2) return { direction: 'stable', strength: 0, significance: 1 };

    const n = data.length;
    const x = data.map((_, i) => i);
    const y = data.map(d => d.value);

    const correlation = this.calculateCorrelation(x, y);
    
    return {
      direction: correlation.coefficient > 0.1 ? 'increasing' : 
                correlation.coefficient < -0.1 ? 'decreasing' : 'stable',
      strength: Math.abs(correlation.coefficient),
      significance: correlation.significance
    };
  }

  private calculateConfidenceScore(healthData: any, patterns: any[], correlations: any[]): number {
    let score = 0.5; // Base confidence

    // More data = higher confidence
    const dataPoints = Object.values(healthData).reduce((sum: number, arr: any[]) => sum + arr.length, 0);
    score += Math.min(dataPoints / 1000, 0.3);

    // More patterns found = higher confidence
    score += Math.min(patterns.length * 0.05, 0.2);

    return Math.min(score, 1);
  }

  private calculateDataCompleteness(healthData: any, scope: AnalysisScope): number {
    let totalExpected = 0;
    let totalFound = 0;

    if (scope.includeWearableData) {
      totalExpected += 2;
      if (healthData.healthDeviceData.length > 0) totalFound++;
      if (healthData.dailySummary.length > 0) totalFound++;
    }

    if (scope.includeMenstrualCycle) {
      totalExpected++;
      if (healthData.menstrualCycles.length > 0) totalFound++;
    }

    if (scope.includeSymptoms) {
      totalExpected++;
      if (healthData.symptoms.length > 0) totalFound++;
    }

    return totalExpected > 0 ? totalFound / totalExpected : 1;
  }

  private generateKeyFindings(patterns: any[], correlations: any[], anomalies: any[], trends: any[]): string[] {
    const findings = [];

    if (patterns.length > 0) {
      findings.push(`Identified ${patterns.length} significant health patterns`);
    }

    if (correlations.length > 0) {
      findings.push(`Found ${correlations.length} meaningful correlations between health metrics`);
    }

    if (anomalies.length > 0) {
      const criticalAnomalies = anomalies.filter(a => a.severity_level === 'critical').length;
      if (criticalAnomalies > 0) {
        findings.push(`Detected ${criticalAnomalies} critical health anomalies requiring attention`);
      } else {
        findings.push(`Identified ${anomalies.length} health anomalies for monitoring`);
      }
    }

    if (trends.length > 0) {
      const improvingTrends = trends.filter(t => t.direction === 'increasing').length;
      findings.push(`${improvingTrends} health metrics showing positive trends`);
    }

    if (findings.length === 0) {
      findings.push('Health data analyzed - maintaining stable patterns');
    }

    return findings;
  }

  async getAnalysisResults(sessionId: string): Promise<AnalysisResults | null> {
    try {
      const { data: session } = await supabase
        .from('ai_analysis_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (!session) return null;

      const { data: patterns } = await supabase
        .from('health_patterns')
        .select('*')
        .eq('analysis_session_id', sessionId);

      const { data: correlations } = await supabase
        .from('health_correlations')
        .select('*')
        .eq('analysis_session_id', sessionId);

      const { data: anomalies } = await supabase
        .from('health_anomalies')
        .select('*')
        .eq('analysis_session_id', sessionId);

      return {
        sessionId: session.id,
        keyFindings: session.key_findings || [],
        patterns: patterns || [],
        correlations: correlations || [],
        anomalies: anomalies || [],
        trends: session.trends_identified || [],
        confidenceScore: session.confidence_score || 0,
        dataCompleteness: session.data_completeness || 0,
        recommendations: this.generateRecommendations(patterns || [], correlations || [], anomalies || [])
      };
    } catch (error) {
      console.error('Failed to get analysis results:', error);
      return null;
    }
  }

  private generateRecommendations(patterns: any[], correlations: any[], anomalies: any[]): string[] {
    const recommendations = [];

    // Pattern-based recommendations
    patterns.forEach(pattern => {
      if (pattern.health_impact === 'negative' && pattern.actionability === 'actionable') {
        if (pattern.pattern_type === 'sleep_pattern') {
          recommendations.push('Improve sleep consistency by maintaining regular bedtime and wake times');
        } else if (pattern.pattern_type === 'activity_pattern') {
          recommendations.push('Increase daily physical activity to reach 8,000+ steps per day');
        }
      }
    });

    // Anomaly-based recommendations
    const criticalAnomalies = anomalies.filter(a => a.severity_level === 'critical');
    if (criticalAnomalies.length > 0) {
      recommendations.push('Consult with your healthcare provider about recent unusual health readings');
    }

    // Correlation-based recommendations
    const strongCorrelations = correlations.filter(c => c.relationship_strength === 'strong');
    strongCorrelations.forEach(corr => {
      if (corr.clinical_meaningfulness === 'high') {
        recommendations.push(`Focus on improving ${corr.metric_1_name} as it strongly affects ${corr.metric_2_name}`);
      }
    });

    if (recommendations.length === 0) {
      recommendations.push('Continue maintaining your current healthy patterns');
    }

    return recommendations;
  }

  async getUserAnalysisSessions(userId: string, limit: number = 10): Promise<any[]> {
    const { data } = await supabase
      .from('ai_analysis_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    return data || [];
  }
}

export const aiAnalysisService = new AIAnalysisService();
