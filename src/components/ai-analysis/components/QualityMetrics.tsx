
/**
 * Quality Metrics Component
 * Displays analysis quality metrics
 */

import React from 'react';

interface QualityMetricsProps {
  confidenceScore?: number;
  dataCompleteness?: number;
  patternsCount: number;
  correlationsCount: number;
}

export const QualityMetrics: React.FC<QualityMetricsProps> = ({
  confidenceScore,
  dataCompleteness,
  patternsCount,
  correlationsCount
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      {confidenceScore && (
        <div className="text-center">
          <p className="text-body-small text-text-secondary">Уверенность</p>
          <p className="text-h4 font-bold text-text-primary">
            {Math.round(confidenceScore * 100)}%
          </p>
        </div>
      )}
      
      {dataCompleteness && (
        <div className="text-center">
          <p className="text-body-small text-text-secondary">Полнота данных</p>
          <p className="text-h4 font-bold text-text-primary">
            {Math.round(dataCompleteness * 100)}%
          </p>
        </div>
      )}
      
      <div className="text-center">
        <p className="text-body-small text-text-secondary">Паттерны</p>
        <p className="text-h4 font-bold text-text-primary">
          {patternsCount}
        </p>
      </div>
      
      <div className="text-center">
        <p className="text-body-small text-text-secondary">Корреляции</p>
        <p className="text-h4 font-bold text-text-primary">
          {correlationsCount}
        </p>
      </div>
    </div>
  );
};
