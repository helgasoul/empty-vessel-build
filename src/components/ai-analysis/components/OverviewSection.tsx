
/**
 * Overview Section Component
 * Displays overview statistics cards
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Activity,
  TrendingUp,
  AlertTriangle,
  Heart
} from 'lucide-react';
import { AnalysisResults } from '@/services/aiAnalysisService';

interface OverviewSectionProps {
  results: AnalysisResults;
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({ results }) => {
  return (
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
  );
};
