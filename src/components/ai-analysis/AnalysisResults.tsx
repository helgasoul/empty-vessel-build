
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

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  results,
  onClose
}) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'patterns' | 'correlations' | 'anomalies'>('overview');

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
      <RecommendationsSection recommendations={results.recommendations} />
    </div>
  );
};
