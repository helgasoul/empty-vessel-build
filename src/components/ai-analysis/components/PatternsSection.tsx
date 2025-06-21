
/**
 * Patterns Section Component
 * Displays health patterns analysis
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/design-system/components';
import { Activity } from 'lucide-react';
import { AnalysisResults } from '@/services/aiAnalysisService';

interface PatternsSectionProps {
  results: AnalysisResults;
}

export const PatternsSection: React.FC<PatternsSectionProps> = ({ results }) => {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'success';
      case 'negative': return 'error';
      case 'mixed': return 'warning';
      default: return 'info';
    }
  };

  if (results.patterns.length === 0) {
    return (
      <Card className="border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <Activity className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
          <p className="text-body text-text-secondary">Паттерны не найдены</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {results.patterns.map((pattern, index) => (
        <Card key={index} className="border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-h4 font-semibold text-text-primary mb-2">
                  {pattern.patternName}
                </h3>
                <p className="text-body text-text-secondary mb-3">
                  {pattern.description}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={getImpactColor(pattern.healthImpact)} size="sm">
                  {pattern.healthImpact === 'positive' ? 'Позитивный' : 
                   pattern.healthImpact === 'negative' ? 'Негативный' : 
                   pattern.healthImpact === 'mixed' ? 'Смешанный' : 'Нейтральный'}
                </Badge>
                <Badge variant="info" size="sm">
                  {pattern.clinicalRelevance === 'high' ? 'Высокая значимость' :
                   pattern.clinicalRelevance === 'moderate' ? 'Умеренная значимость' : 'Низкая значимость'}
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-body-small text-text-secondary">Тип</p>
                <p className="text-body font-medium text-text-primary">
                  {pattern.patternType.replace('_', ' ')}
                </p>
              </div>
              <div>
                <p className="text-body-small text-text-secondary">Категория</p>
                <p className="text-body font-medium text-text-primary">
                  {pattern.patternCategory}
                </p>
              </div>
              <div>
                <p className="text-body-small text-text-secondary">Сила</p>
                <p className="text-body font-medium text-text-primary">
                  {Math.round((pattern.strength || 0) * 100)}%
                </p>
              </div>
              <div>
                <p className="text-body-small text-text-secondary">Период</p>
                <p className="text-body font-medium text-text-primary">
                  {pattern.timePeriod}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
