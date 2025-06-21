
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Activity, Moon, Zap } from 'lucide-react';
import { HealthAssessment } from '@/types/patient';

interface HealthStatusWidgetProps {
  data?: HealthAssessment;
}

export default function HealthStatusWidget({ data }: HealthStatusWidgetProps) {
  const getLifestyleScore = (lifestyle?: HealthAssessment['lifestyle']) => {
    if (!lifestyle) return 0;
    
    let score = 0;
    if (lifestyle.smokingStatus === 'never') score += 20;
    if (lifestyle.alcoholConsumption === 'none' || lifestyle.alcoholConsumption === 'light') score += 20;
    if (lifestyle.exerciseFrequency === 'moderate' || lifestyle.exerciseFrequency === 'vigorous') score += 20;
    if (lifestyle.sleepHours >= 7 && lifestyle.sleepHours <= 9) score += 20;
    if (lifestyle.stressLevel <= 5) score += 20;
    
    return score;
  };

  const lifestyleScore = getLifestyleScore(data?.lifestyle);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreText = (score: number) => {
    if (score >= 80) return 'Отличное';
    if (score >= 60) return 'Хорошее';
    return 'Требует внимания';
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-rose-100 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-rose-600">
          <Heart className="w-5 h-5" />
          Статус здоровья
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {data ? (
          <>
            {/* Общий балл */}
            <div className="text-center p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg border border-rose-100">
              <div className="text-3xl font-bold text-gray-800 mb-1">{lifestyleScore}/100</div>
              <Badge className={getScoreColor(lifestyleScore)}>
                {getScoreText(lifestyleScore)}
              </Badge>
            </div>

            {/* Детализация */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-700">Физическая активность</span>
                </div>
                <Badge variant={data.lifestyle.exerciseFrequency === 'vigorous' ? 'default' : 'secondary'}>
                  {data.lifestyle.exerciseFrequency === 'vigorous' ? 'Высокая' :
                   data.lifestyle.exerciseFrequency === 'moderate' ? 'Умеренная' :
                   data.lifestyle.exerciseFrequency === 'light' ? 'Низкая' : 'Отсутствует'}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Moon className="w-4 h-4 text-indigo-500" />
                  <span className="text-sm text-gray-700">Сон</span>
                </div>
                <Badge variant={data.lifestyle.sleepHours >= 7 && data.lifestyle.sleepHours <= 9 ? 'default' : 'secondary'}>
                  {data.lifestyle.sleepHours}ч
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-gray-700">Уровень стресса</span>
                </div>
                <Badge variant={data.lifestyle.stressLevel <= 5 ? 'default' : 'destructive'}>
                  {data.lifestyle.stressLevel}/10
                </Badge>
              </div>
            </div>

            {/* Текущие симптомы */}
            {data.currentSymptoms.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Текущие симптомы:</h4>
                <div className="flex flex-wrap gap-1">
                  {data.currentSymptoms.slice(0, 3).map((symptom, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {symptom.name}
                    </Badge>
                  ))}
                  {data.currentSymptoms.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{data.currentSymptoms.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Лекарства */}
            {data.medications.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Принимаемые препараты:</h4>
                <div className="space-y-1">
                  {data.medications.slice(0, 2).map((medication, index) => (
                    <div key={index} className="text-xs text-gray-600">
                      {medication.name} - {medication.dosage}
                    </div>
                  ))}
                  {data.medications.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{data.medications.length - 2} препаратов
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Менструальное здоровье */}
            {data.menstrualHealth && (
              <div className="p-3 bg-pink-50 rounded-lg border border-pink-100">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Менструальное здоровье</h4>
                <div className="space-y-1 text-xs text-gray-600">
                  <div>Цикл: {data.menstrualHealth.cycleLength} дней</div>
                  <div>Последние месячные: {data.menstrualHealth.lastPeriodDate.toLocaleDateString('ru-RU')}</div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-6">
            <Heart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-600 mb-3">
              Заполните анкету здоровья для получения персонализированных рекомендаций
            </p>
            <button className="text-rose-600 hover:text-rose-700 text-sm font-medium">
              Заполнить анкету →
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
