
/**
 * Content Sections Component
 * Renders different content sections based on active tab
 */

import React from 'react';
import { AnalysisResults } from '@/services/aiAnalysisService';
import { OverviewSection } from './OverviewSection';
import { PatternsSection } from './PatternsSection';
import { CorrelationsSection } from './CorrelationsSection';
import { AnomaliesSection } from './AnomaliesSection';

type ActiveSection = 'overview' | 'patterns' | 'correlations' | 'anomalies';

interface ContentSectionsProps {
  activeSection: ActiveSection;
  results: AnalysisResults;
}

export const ContentSections: React.FC<ContentSectionsProps> = ({
  activeSection,
  results
}) => {
  switch (activeSection) {
    case 'overview':
      return <OverviewSection results={results} />;
    case 'patterns':
      return <PatternsSection results={results} />;
    case 'correlations':
      return <CorrelationsSection results={results} />;
    case 'anomalies':
      return <AnomaliesSection results={results} />;
    default:
      return null;
  }
};
