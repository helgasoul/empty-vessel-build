
/**
 * Quality Metrics Grid Component
 * Displays data quality and confidence metrics
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/design-system/components';
import { 
  TrendingUp,
  Database,
  Shield,
  CheckCircle2
} from 'lucide-react';

interface QualityMetricsGridProps {
  confidenceScore: number;
  dataCompleteness: number;
}

export const QualityMetricsGrid: React.FC<QualityMetricsGridProps> = ({
  confidenceScore,
  dataCompleteness
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'success';
    if (score >= 0.6) return 'warning';
    return 'error';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 0.8) return 'Высокое';
    if (score >= 0.6) return 'Умеренное';
    return 'Низкое';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-4 text-center">
          <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <p className="text-h3 font-bold text-text-primary">{Math.round(confidenceScore * 100)}%</p>
          <p className="text-body-small text-text-secondary mb-2">Достоверность</p>
          <Badge variant={getScoreColor(confidenceScore)} size="sm">
            {getScoreLabel(confidenceScore)}
          </Badge>
        </CardContent>
      </Card>

      <Card className="border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-4 text-center">
          <Database className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <p className="text-h3 font-bold text-text-primary">{Math.round(dataCompleteness * 100)}%</p>
          <p className="text-body-small text-text-secondary mb-2">Полнота данных</p>
          <Badge variant={getScoreColor(dataCompleteness)} size="sm">
            {getScoreLabel(dataCompleteness)}
          </Badge>
        </CardContent>
      </Card>

      <Card className="border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-4 text-center">
          <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
          <p className="text-h3 font-bold text-text-primary">GDPR</p>
          <p className="text-body-small text-text-secondary mb-2">Соответствие</p>
          <Badge variant="success" size="sm">
            Соблюдено
          </Badge>
        </CardContent>
      </Card>

      <Card className="border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-4 text-center">
          <CheckCircle2 className="h-8 w-8 text-orange-600 mx-auto mb-2" />
          <p className="text-h3 font-bold text-text-primary">AI v2.1</p>
          <p className="text-body-small text-text-secondary mb-2">Модель</p>
          <Badge variant="info" size="sm">
            Актуальная
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
};
