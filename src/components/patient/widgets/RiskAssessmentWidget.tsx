
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Shield, TrendingUp, Calculator } from 'lucide-react';
import { RiskFactors } from '@/types/patient';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  const calculateOverallRisk = (riskData?: RiskFactors) => {
    if (!riskData) {
      return { level: 'low' as const, message: 'Пройдите оценку рисков для получения персонализированных рекомендаций' };
    }

    const scores = [
      riskData.cardiovascular.score,
      riskData.cancer.score,
      riskData.diabetes.score,
      riskData.osteoporosis.score,
      (riskData.mentalHealth.stressScore + riskData.mentalHealth.depressionScore + riskData.mentalHealth.anxietyScore) / 3
    ];

    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;

    if (averageScore < 2) {
      return { level: 'low' as const, message: 'Ваш общий риск заболеваний находится в пределах нормы' };
    } else if (averageScore < 3.5) {
      return { level: 'moderate' as const, message: 'Рекомендуется профилактическое наблюдение' };
    } else {
      return { level: 'high' as const, message: 'Необходима консультация с врачом' };
    }
  };

  const overallRisk = calculateOverallRisk(data);

  const handleStartAssessment = () => {
    navigate('/risk-assessment');
  };

  const handleViewDetails = () => {
    navigate('/dashboard', { state: { activeSection: 'risk-factors' } });
  };

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
                label="Нейродегенеративные"
                score={(data.mentalHealth.stressScore + data.mentalHealth.depressionScore + data.mentalHealth.anxietyScore) / 3}
                level={data.mentalHealth.level}
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

            {/* Кнопки действий */}
            <div className="flex gap-2 pt-2">
              <Button 
                size="sm"
                onClick={handleStartAssessment}
                className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 flex-1"
              >
                <Calculator className="w-3 h-3 mr-1" />
                Новая оценка
              </Button>
              <Button 
                size="sm"
                variant="outline"
                onClick={handleViewDetails}
                className="border-rose-200 text-rose-600 hover:bg-rose-50"
              >
                Подробнее
              </Button>
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
              Пройдите комплексную оценку рисков для получения персонализированных рекомендаций
            </p>
            <Button 
              onClick={handleStartAssessment}
              className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
            >
              <Calculator className="w-4 h-4 mr-2" />
              Начать оценку
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
