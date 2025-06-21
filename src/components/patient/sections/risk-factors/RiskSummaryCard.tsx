
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, AlertTriangle, Shield } from 'lucide-react';
import { RiskFactors } from '@/types/patient';

interface RiskSummaryCardProps {
  data: RiskFactors;
}

export default function RiskSummaryCard({ data }: RiskSummaryCardProps) {
  const calculateOverallRisk = () => {
    const risks = [
      data.cardiovascular.score,
      data.cancer.score,
      data.diabetes.score,
      data.osteoporosis.score,
      (data.mentalHealth.stressScore + data.mentalHealth.depressionScore + data.mentalHealth.anxietyScore) / 3
    ];
    
    const averageScore = risks.reduce((sum, score) => sum + score, 0) / risks.length;
    
    if (averageScore < 2) return { level: 'low', text: 'Низкий', color: 'text-green-600 bg-green-100' };
    if (averageScore < 3.5) return { level: 'moderate', text: 'Умеренный', color: 'text-yellow-600 bg-yellow-100' };
    if (averageScore < 4.5) return { level: 'high', text: 'Высокий', color: 'text-orange-600 bg-orange-100' };
    return { level: 'very-high', text: 'Очень высокий', color: 'text-red-600 bg-red-100' };
  };

  const overallRisk = calculateOverallRisk();
  
  const getTopRecommendations = () => {
    const allRecommendations = [
      ...data.cardiovascular.recommendations,
      ...data.cancer.recommendations,
      ...data.diabetes.recommendations,
      ...data.osteoporosis.recommendations,
      ...data.mentalHealth.recommendations
    ];
    return allRecommendations.slice(0, 3);
  };

  return (
    <Card className="bg-gradient-to-r from-rose-50 to-pink-50 border-rose-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-rose-600" />
          Общий анализ рисков
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">Общий уровень риска:</span>
            <Badge className={overallRisk.color}>
              {overallRisk.text}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Сердечно-сосудистые:</span>
              <span className="font-medium">{data.cardiovascular.score}/5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Онкология:</span>
              <span className="font-medium">{data.cancer.score}/5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Диабет:</span>
              <span className="font-medium">{data.diabetes.score}/5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Остеопороз:</span>
              <span className="font-medium">{data.osteoporosis.score}/5</span>
            </div>
          </div>

          {getTopRecommendations().length > 0 && (
            <div className="border-t border-rose-200 pt-4">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Приоритетные рекомендации:
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {getTopRecommendations().map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <AlertTriangle className="w-3 h-3 mt-0.5 text-orange-500 flex-shrink-0" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
