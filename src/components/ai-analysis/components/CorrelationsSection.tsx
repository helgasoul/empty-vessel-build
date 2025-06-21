
/**
 * Correlations Section Component
 * Displays correlation analysis results
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/design-system/components';
import { TrendingUp } from 'lucide-react';
import { AnalysisResults } from '@/services/aiAnalysisService';

interface CorrelationsSectionProps {
  results: AnalysisResults;
}

export const CorrelationsSection: React.FC<CorrelationsSectionProps> = ({ results }) => {
  if (results.correlations.length === 0) {
    return (
      <Card className="border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <TrendingUp className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
          <p className="text-body text-text-secondary">Корреляции не найдены</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {results.correlations.map((correlation, index) => (
        <Card key={index} className="border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-h4 font-semibold text-text-primary mb-2">
                  {correlation.metric1} ↔ {correlation.metric2}
                </h3>
                <p className="text-body text-text-secondary mb-3">
                  {correlation.insights}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  variant={correlation.direction === 'positive' ? 'success' : 'warning'} 
                  size="sm"
                >
                  {correlation.direction === 'positive' ? 'Положительная' :
                   correlation.direction === 'negative' ? 'Отрицательная' : 'Двунаправленная'}
                </Badge>
                <Badge variant="info" size="sm">
                  {correlation.strength === 'strong' ? 'Сильная' :
                   correlation.strength === 'moderate' ? 'Умеренная' : 'Слабая'}
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-body-small text-text-secondary">Коэффициент</p>
                <p className="text-body font-medium text-text-primary">
                  {(correlation.coefficient || 0).toFixed(3)}
                </p>
              </div>
              <div>
                <p className="text-body-small text-text-secondary">Значимость</p>
                <p className="text-body font-medium text-text-primary">
                  p &lt; {(correlation.significance || 0).toFixed(3)}
                </p>
              </div>
              <div>
                <p className="text-body-small text-text-secondary">Сила связи</p>
                <p className="text-body font-medium text-text-primary">
                  {correlation.strength}
                </p>
              </div>
              <div>
                <p className="text-body-small text-text-secondary">Значимость</p>
                <p className="text-body font-medium text-text-primary">
                  {correlation.clinicalMeaning}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
