
/**
 * Data Transformation Service
 * Handles data transformation between database and interface formats
 */

import { HealthPattern, HealthCorrelation, HealthAnomaly, AnalysisResults } from './types';

export class DataTransformService {
  /**
   * Transform database patterns to interface format
   */
  transformPatterns(patternsData: any[]): HealthPattern[] {
    return patternsData.map(p => ({
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
  }

  /**
   * Transform database correlations to interface format
   */
  transformCorrelations(correlationsData: any[]): HealthCorrelation[] {
    return correlationsData.map(c => ({
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
  }

  /**
   * Transform database anomalies to interface format
   */
  transformAnomalies(anomaliesData: any[]): HealthAnomaly[] {
    return anomaliesData.map(a => ({
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
  }

  /**
   * Build complete analysis results from session data and related data
   */
  buildAnalysisResults(
    session: any,
    patterns: HealthPattern[],
    correlations: HealthCorrelation[],
    anomalies: HealthAnomaly[]
  ): AnalysisResults {
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
}
