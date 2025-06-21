
/**
 * Analysis Results Component
 * Displays comprehensive AI analysis results
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, Badge } from '@/design-system/components';
import { 
  TrendingUp,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Eye,
  X,
  BarChart3,
  Target,
  Lightbulb,
  Heart
} from 'lucide-react';
import { AnalysisResults as AnalysisResultsType } from '@/services/aiAnalysisService';

interface AnalysisResultsProps {
  results: AnalysisResultsType;
  onClose: () => void;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  results,
  onClose
}) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'patterns' | 'correlations' | 'anomalies'>('overview');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'high';
      case 'high': return 'high';
      case 'moderate': return 'medium';
      case 'low': return 'low';
      default: return 'info';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'success';
      case 'negative': return 'error';
      case 'mixed': return 'warning';
      default: return 'info';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-h3 text-text-primary flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                Анализ завершен
              </CardTitle>
              <CardDescription>
                Результаты анализа ваших данных о здоровье
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              icon={X}
            />
          </div>
        </CardHeader>
      </Card>

      {/* Key Findings */}
      <Card className="border-0 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="text-h4 text-text-primary flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-purple-600" />
            Ключевые выводы
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {results.keyFindings.map((finding, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                <p className="text-body text-text-primary">{finding}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quality Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-small text-text-secondary font-medium">Уверенность анализа</p>
                <p className="text-h3 text-text-primary font-bold">
                  {Math.round(results.confidenceScore * 100)}%
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
                  {Math.round(results.dataCompleteness * 100)}%
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <BarChart3 className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-white/60 backdrop-blur-sm p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Обзор', count: null },
          { id: 'patterns', label: 'Паттерны', count: results.patterns.length },
          { id: 'correlations', label: 'Корреляции', count: results.correlations.length },
          { id: 'anomalies', label: 'Аномалии', count: results.anomalies.length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as any)}
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

      {/* Content Sections */}
      {activeSection === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Activity className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-h3 font-bold text-text-primary">{results.patterns.length}</p>
              <p className="text-body-small text-text-secondary">Паттернов найдено</p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-h3 font-bold text-text-primary">{results.correlations.length}</p>
              <p className="text-body-small text-text-secondary">Корреляций</p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <AlertTriangle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <p className="text-h3 font-bold text-text-primary">{results.anomalies.length}</p>
              <p className="text-body-small text-text-secondary">Аномалий</p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Heart className="h-8 w-8 text-pink-600 mx-auto mb-2" />
              <p className="text-h3 font-bold text-text-primary">{results.recommendations.length}</p>
              <p className="text-body-small text-text-secondary">Рекомендаций</p>
            </CardContent>
          </Card>
        </div>
      )}

      {activeSection === 'patterns' && (
        <div className="space-y-4">
          {results.patterns.length === 0 ? (
            <Card className="border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <Activity className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
                <p className="text-body text-text-secondary">Паттерны не найдены</p>
              </CardContent>
            </Card>
          ) : (
            results.patterns.map((pattern, index) => (
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
            ))
          )}
        </div>
      )}

      {activeSection === 'correlations' && (
        <div className="space-y-4">
          {results.correlations.length === 0 ? (
            <Card className="border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <TrendingUp className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
                <p className="text-body text-text-secondary">Корреляции не найдены</p>
              </CardContent>
            </Card>
          ) : (
            results.correlations.map((correlation, index) => (
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
            ))
          )}
        </div>
      )}

      {activeSection === 'anomalies' && (
        <div className="space-y-4">
          {results.anomalies.length === 0 ? (
            <Card className="border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <p className="text-body text-green-600 font-medium">Аномалии не обнаружены</p>
                <p className="text-body-small text-text-secondary">Ваши показатели в пределах нормы</p>
              </CardContent>
            </Card>
          ) : (
            results.anomalies.map((anomaly, index) => (
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
            ))
          )}
        </div>
      )}

      {/* Recommendations */}
      {results.recommendations.length > 0 && (
        <Card className="border-0 bg-gradient-to-r from-green-50 to-blue-50">
          <CardHeader>
            <CardTitle className="text-h4 text-text-primary flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-green-600" />
              Персонализированные рекомендации
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 text-body-small font-bold">{index + 1}</span>
                  </div>
                  <p className="text-body text-text-primary">{recommendation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
