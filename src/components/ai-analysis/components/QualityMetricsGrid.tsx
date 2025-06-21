
/**
 * Quality Metrics Grid Component
 * Displays analysis quality metrics in a grid layout
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Target, BarChart3 } from 'lucide-react';

interface QualityMetricsGridProps {
  confidenceScore: number;
  dataCompleteness: number;
}

export const QualityMetricsGrid: React.FC<QualityMetricsGridProps> = ({
  confidenceScore,
  dataCompleteness
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body-small text-text-secondary font-medium">Уверенность анализа</p>
              <p className="text-h3 text-text-primary font-bold">
                {Math.round(confidenceScore * 100)}%
              </p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body-small text-text-secondary font-medium">Полнота данных</p>
              <p className="text-h3 text-text-primary font-bold">
                {Math.round(dataCompleteness * 100)}%
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <BarChart3 className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
