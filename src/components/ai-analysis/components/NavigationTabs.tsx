
/**
 * Navigation Tabs Component
 * Tab navigation for different sections of analysis results
 */

import React from 'react';
import { Badge } from '@/design-system/components';

type TabId = 'overview' | 'patterns' | 'correlations' | 'anomalies';

interface Tab {
  id: TabId;
  label: string;
  count: number | null;
}

interface NavigationTabsProps {
  activeSection: TabId;
  onSectionChange: (section: TabId) => void;
  patternsCount: number;
  correlationsCount: number;
  anomaliesCount: number;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeSection,
  onSectionChange,
  patternsCount,
  correlationsCount,
  anomaliesCount
}) => {
  const tabs: Tab[] = [
    { id: 'overview', label: 'Обзор', count: null },
    { id: 'patterns', label: 'Паттерны', count: patternsCount },
    { id: 'correlations', label: 'Корреляции', count: correlationsCount },
    { id: 'anomalies', label: 'Аномалии', count: anomaliesCount }
  ];

  return (
    <div className="flex space-x-1 bg-white/60 backdrop-blur-sm p-1 rounded-lg">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onSectionChange(tab.id)}
          className={`flex-1 py-2 px-4 rounded-md text-body font-medium transition-colors flex items-center justify-center gap-2 ${
            activeSection === tab.id
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          {tab.label}
          {tab.count !== null && (
            <Badge variant="info" size="sm">{tab.count}</Badge>
          )}
        </button>
      ))}
    </div>
  );
};
