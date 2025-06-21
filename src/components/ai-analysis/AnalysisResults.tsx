
/**
 * Analysis Results Component
 * Main component that orchestrates the display of AI analysis results
 */

import React, { useState } from 'react';
import { AnalysisResults as AnalysisResultsType } from '@/services/aiAnalysisService';
import { AnalysisResultsHeader } from './components/AnalysisResultsHeader';
import { KeyFindingsSection } from './components/KeyFindingsSection';
import { QualityMetricsGrid } from './components/QualityMetricsGrid';
import { NavigationTabs } from './components/NavigationTabs';
import { ContentSections } from './components/ContentSections';
import { RecommendationsSection } from './components/RecommendationsSection';

interface AnalysisResultsProps {
  results: AnalysisResultsType;
  onClose: () => void;
}

interface Recommendation {
  id: string;
  type: 'lifestyle' | 'medical' | 'nutrition' | 'exercise' | 'monitoring';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  rationale: string;
  timeline: string;
  actionable_steps: string[];
  related_findings: string[];
  confidence_level: number;
}

// Transform string recommendations to Recommendation objects
const transformRecommendations = (recommendations: string[]): Recommendation[] => {
  return recommendations.map((rec, index) => ({
    id: `rec_${index}`,
    type: 'lifestyle' as const,
    priority: 'medium' as const,
    title: `Рекомендация ${index + 1}`,
    description: rec,
    rationale: 'На основе анализа ваших данных о здоровье',
    timeline: '2-4 недели',
    actionable_steps: [rec],
    related_findings: [],
    confidence_level: 0.8
  }));
};

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  results,
  onClose
}) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'patterns' | 'correlations' | 'anomalies'>('overview');

  // Transform recommendations if they are strings, otherwise use as-is
  const transformedRecommendations: Recommendation[] = Array.isArray(results.recommendations) && 
    results.recommendations.length > 0 && 
    typeof results.recommendations[0] === 'string' 
    ? transformRecommendations(results.recommendations as string[])
    : results.recommendations as Recommendation[];

  return (
    <div className="space-y-6">
      {/* Header */}
      <AnalysisResultsHeader onClose={onClose} />

      {/* Key Findings */}
      <KeyFindingsSection keyFindings={results.keyFindings} />

      {/* Quality Metrics */}
      <QualityMetricsGrid 
        confidenceScore={results.confidenceScore}
        dataCompleteness={results.dataCompleteness}
      />

      {/* Navigation Tabs */}
      <NavigationTabs
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        patternsCount={results.patterns.length}
        correlationsCount={results.correlations.length}
        anomaliesCount={results.anomalies.length}
      />

      {/* Content Sections */}
      <ContentSections 
        activeSection={activeSection}
        results={results}
      />

      {/* Recommendations */}
      <RecommendationsSection recommendations={transformedRecommendations} />
    </div>
  );
};
