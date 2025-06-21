
/**
 * Recommendations Section Component
 * Displays personalized recommendations
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

interface RecommendationsSectionProps {
  recommendations: string[];
}

export const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({
  recommendations
}) => {
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Card className="border-0 bg-gradient-to-r from-green-50 to-blue-50">
      <CardHeader>
        <CardTitle className="text-h4 text-text-primary flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-green-600" />
          Персонализированные рекомендации
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recommendations.map((recommendation, index) => (
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
  );
};
