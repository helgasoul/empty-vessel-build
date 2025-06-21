
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Shield, TrendingUp } from 'lucide-react';
import { RiskFactors } from '@/types/patient';

interface RiskAssessmentWidgetProps {
  data?: RiskFactors;
}

const RiskIndicator = ({ 
  label, 
  score, 
  level 
}: { 
  label: string; 
  score: number; 
  level: 'low' | 'moderate' | 'high' | 'very-high' 
}) => {
  const getColorClass = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'very-high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getProgressColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-500';
      case 'moderate': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'very-high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const levelText = {
    'low': 'Низкий',
    'moderate': 'Умеренный',
    'high': 'Высокий',
    'very-high': 'Очень высокий'
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <Badge className={getColorClass(level)}>
          {levelText[level]}
        </Badge>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${getProgressColor(level)}`}
          style={{ width: `${Math.min(score * 20, 100)}%` }}
        ></div>
      </div>
    </div>
  );
};

export default function RiskAssessmentWidget({ data }: RiskAssessmentWidgetProps) {
  const calculateOverallRisk = (riskData?: RiskFactors) => {
    if (!riskData) {
      return { level: 'low' as const, message: 'Пройдите оценку рисков для получения персонализированных рекомендаций' };
    }

    const scores = [
      riskData.cardiovascular.score,
      riskData.cancer.score,
      riskData.diabetes.score
    ];

    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;

    if (averageScore < 2) {
      return { level: 'low' as const, message: 'Ваш общий риск заболеваний находится в пределах нормы' };
    } else if (averageScore < 4) {
      return { level: 'moderate' as const, message: 'Рекомендуется профилактическое наблюдение' };
    } else {
      return { level: 'high' as const, message: 'Необходима консультация с врачом' };
    }
  };

  const overallRisk = calculateOverallRisk(data);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-rose-100 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-rose-600">
          <AlertTriangle className="w-5 h-5" />
          Оценка рисков
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {data ? (
          <>
            <div className="space-y-3">
              <RiskIndicator 
                label="Сердечно-сосудистые"
                score={data.cardiovascular.score}
                level={data.cardiovascular.level}
              />
              <RiskIndicator 
                label="Онкология"
                score={data.cancer.score}
                level={data.cancer.level}
              />
              <RiskIndicator 
                label="Диабет"
                score={data.diabetes.score}
                level={data.diabetes.level}
              />
              <RiskIndicator 
                label="Остеопороз"
                score={data.osteoporosis.score}
                level={data.osteoporosis.level}
              />
            </div>
            
            <div className="mt-4 p-3 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg border border-rose-100">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-4 h-4 text-rose-600" />
                <span className="text-sm font-medium text-gray-700">
                  Общий риск: {overallRisk.level === 'low' ? 'Низкий' : 
                              overallRisk.level === 'moderate' ? 'Умеренный' : 'Высокий'}
                </span>
              </div>
              <p className="text-xs text-gray-600">
                {overallRisk.message}
              </p>
            </div>

            {/* Последнее обновление */}
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Обновлено: {data.lastUpdated.toLocaleDateString('ru-RU')}
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-600 mb-3">
              Пройдите оценку рисков для получения персонализированных рекомендаций
            </p>
            <button className="text-rose-600 hover:text-rose-700 text-sm font-medium">
              Начать оценку →
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
