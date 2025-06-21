
/**
 * Quick Stats Component
 * Displays quick statistics and session ID
 */

import React from 'react';
import { Activity, TrendingUp, FileText } from 'lucide-react';

interface QuickStatsProps {
  patternsCount: number;
  correlationsCount: number;
  anomaliesCount: number;
  sessionId: string;
}

export const QuickStats: React.FC<QuickStatsProps> = ({
  patternsCount,
  correlationsCount,
  anomaliesCount,
  sessionId
}) => {
  return (
    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border-light">
      <div className="flex items-center gap-4 text-body-small text-text-secondary">
        {patternsCount > 0 && (
          <div className="flex items-center gap-1">
            <Activity className="h-3 w-3" />
            <span>{patternsCount} паттернов</span>
          </div>
        )}
        
        {correlationsCount > 0 && (
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            <span>{correlationsCount} корреляций</span>
          </div>
        )}
        
        {anomaliesCount > 0 && (
          <div className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            <span>{anomaliesCount} аномалий</span>
          </div>
        )}
      </div>
      
      <div className="text-body-small text-text-secondary">
        ID: {sessionId.slice(0, 8)}...
      </div>
    </div>
  );
};
