
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

interface RiskCardProps {
  title: string;
  icon: LucideIcon;
  iconColor: string;
  level: string;
  score: number;
  factors: string[];
  recommendations: string[];
  additionalContent?: React.ReactNode;
}

export default function RiskCard({ 
  title, 
  icon: Icon, 
  iconColor, 
  level, 
  score, 
  factors, 
  recommendations,
  additionalContent 
}: RiskCardProps) {
  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'very-high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskLevelText = (level: string) => {
    switch (level) {
      case 'low': return 'Низкий';
      case 'moderate': return 'Умеренный';
      case 'high': return 'Высокий';
      case 'very-high': return 'Очень высокий';
      default: return 'Неизвестно';
    }
  };

  const getProgressBarColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-500';
      case 'moderate': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'very-high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${iconColor}`} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Уровень риска:</span>
            <Badge className={getRiskLevelColor(level)}>
              {getRiskLevelText(level)}
            </Badge>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full ${getProgressBarColor(level)}`}
              style={{ width: `${Math.min(score * 20, 100)}%` }}
            ></div>
          </div>
          {additionalContent}
          {factors.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Факторы риска:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {factors.map((factor, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                    {factor}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {recommendations.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Рекомендации:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {recommendations.map((rec, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
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
