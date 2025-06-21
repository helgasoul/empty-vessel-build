
/**
 * Recommendations Section Component
 * Displays AI-generated health recommendations
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/design-system/components';
import { Button } from '@/design-system/components';
import { 
  Lightbulb,
  Calendar,
  Users,
  ShoppingCart,
  ArrowRight
} from 'lucide-react';

interface Recommendation {
  id: string;
  type: 'lifestyle' | 'medical' | 'nutrition' | 'exercise' | 'monitoring';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  rationale: string;
  timeline: string;
  actionable_steps: string[];
  related_findings: string[];
  confidence_level: number;
}

interface RecommendationsSectionProps {
  recommendations: Recommendation[];
}

export const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({ 
  recommendations 
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'high';
      case 'medium': return 'medium';
      case 'low': return 'low';
      default: return 'info';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lifestyle': return '🎯';
      case 'medical': return '🏥';
      case 'nutrition': return '🥗';
      case 'exercise': return '💪';
      case 'monitoring': return '📊';
      default: return '💡';
    }
  };

  const getActionButtons = (type: string) => {
    switch (type) {
      case 'medical':
        return (
          <Button variant="outline" size="sm" icon={Calendar}>
            Записаться к врачу
          </Button>
        );
      case 'nutrition':
        return (
          <Button variant="outline" size="sm" icon={ShoppingCart}>
            Купить продукты
          </Button>
        );
      case 'exercise':
        return (
          <Button variant="outline" size="sm" icon={Users}>
            Найти тренера
          </Button>
        );
      default:
        return (
          <Button variant="outline" size="sm" icon={ArrowRight}>
            Подробнее
          </Button>
        );
    }
  };

  return (
    <Card className="border-0 bg-gradient-to-r from-blue-50 to-purple-50">
      <CardHeader>
        <CardTitle className="text-h4 text-text-primary flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-blue-600" />
          Персональные рекомендации
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((recommendation, index) => (
            <Card key={recommendation.id} className="border-0 bg-white/60 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{getTypeIcon(recommendation.type)}</div>
                    <div>
                      <h3 className="text-h4 font-semibold text-text-primary mb-2">
                        {recommendation.title}
                      </h3>
                      <p className="text-body text-text-secondary mb-3">
                        {recommendation.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getPriorityColor(recommendation.priority)} size="sm">
                      {recommendation.priority === 'high' ? 'Высокий приоритет' :
                       recommendation.priority === 'medium' ? 'Средний приоритет' : 'Низкий приоритет'}
                    </Badge>
                    <Badge variant="info" size="sm">
                      {Math.round(recommendation.confidence_level * 100)}% уверенность
                    </Badge>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-body font-medium text-text-primary mb-2">Обоснование:</h4>
                  <p className="text-body text-text-secondary">{recommendation.rationale}</p>
                </div>

                <div className="mb-4">
                  <h4 className="text-body font-medium text-text-primary mb-2">Шаги к выполнению:</h4>
                  <ul className="space-y-1">
                    {recommendation.actionable_steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="flex items-start gap-2 text-body text-text-secondary">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-body-small text-text-secondary">
                    Временные рамки: {recommendation.timeline}
                  </div>
                  {getActionButtons(recommendation.type)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
