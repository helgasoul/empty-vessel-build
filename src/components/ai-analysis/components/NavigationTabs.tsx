
/**
 * Navigation Tabs Component
 * Tab navigation for different analysis sections
 */

import React from 'react';
import { Button } from '@/design-system/components';
import { Badge } from '@/design-system/components';
import { 
  BarChart3,
  Activity,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

interface NavigationTabsProps {
  activeSection: 'overview' | 'patterns' | 'correlations' | 'anomalies';
  onSectionChange: (section: 'overview' | 'patterns' | 'correlations' | 'anomalies') => void;
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
  const tabs = [
    {
      id: 'overview' as const,
      label: 'Обзор',
      icon: BarChart3,
      count: null
    },
    {
      id: 'patterns' as const,
      label: 'Паттерны',
      icon: Activity,
      count: patternsCount
    },
    {
      id: 'correlations' as const,
      label: 'Корреляции',
      icon: TrendingUp,
      count: correlationsCount
    },
    {
      id: 'anomalies' as const,
      label: 'Аномалии',
      icon: AlertTriangle,
      count: anomaliesCount
    }
  ];

  return (
    <div className="flex space-x-1 bg-white/60 backdrop-blur-sm p-1 rounded-lg">
      {tabs.map((tab) => {
        const IconComponent = tab.icon;
        const isActive = activeSection === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onSectionChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-body font-medium transition-colors flex-1 justify-center ${
              isActive
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <IconComponent className="h-4 w-4" />
            <span>{tab.label}</span>
            {tab.count !== null && (
              <Badge variant="info" size="sm">
                {tab.count}
              </Badge>
            )}
          </button>
        );
      })}
    </div>
  );
};
