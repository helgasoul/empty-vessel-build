
/**
 * Anomalies Section Component
 * Displays anomaly detection results
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/design-system/components';
import { CheckCircle2 } from 'lucide-react';
import { AnalysisResults } from '@/services/aiAnalysisService';

interface AnomaliesSectionProps {
  results: AnalysisResults;
}

export const AnomaliesSection: React.FC<AnomaliesSectionProps> = ({ results }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'high';
      case 'high': return 'high';
      case 'moderate': return 'medium';
      case 'low': return 'low';
      default: return 'info';
    }
  };

  if (results.anomalies.length === 0) {
    return (
      <Card className="border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <p className="text-body text-green-600 font-medium">Аномалии не обнаружены</p>
          <p className="text-body-small text-text-secondary">Ваши показатели в пределах нормы</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {results.anomalies.map((anomaly, index) => (
        <Card key={index} className="border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-h4 font-semibold text-text-primary mb-2">
                  {anomaly.metricName}
                </h3>
                <p className="text-body text-text-secondary mb-3">
                  {anomaly.recommendedAction}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={getSeverityColor(anomaly.severity)} size="sm">
                  {anomaly.severity === 'critical' ? 'Критическая' :
                   anomaly.severity === 'high' ? 'Высокая' :
                   anomaly.severity === 'moderate' ? 'Умеренная' : 'Низкая'}
                </Badge>
                <Badge variant="warning" size="sm">
                  {anomaly.urgency === 'immediate' ? 'Немедленно' :
                   anomaly.urgency === 'within_week' ? 'В течение недели' :
                   anomaly.urgency === 'within_month' ? 'В течение месяца' : 'Плановое'}
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-body-small text-text-secondary">Обнаружено</p>
                <p className="text-body font-medium text-text-primary">
                  {(anomaly.detectedValue || 0).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-body-small text-text-secondary">Ожидалось</p>
                <p className="text-body font-medium text-text-primary">
                  {(anomaly.expectedValue || 0).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-body-small text-text-secondary">Отклонение</p>
                <p className="text-body font-medium text-text-primary">
                  {Math.round((anomaly.anomalyScore || 0) * 100)}%
                </p>
              </div>
              <div>
                <p className="text-body-small text-text-secondary">Дата</p>
                <p className="text-body font-medium text-text-primary">
                  {new Date(anomaly.detectionDate).toLocaleDateString('ru-RU')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
