
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingUp, Shield, Refresh } from 'lucide-react';
import { RiskFactors } from '@/types/patient';

interface RiskFactorsSectionProps {
  data?: RiskFactors;
  onUpdate: (data: RiskFactors) => void;
}

export default function RiskFactorsSection({ data, onUpdate }: RiskFactorsSectionProps) {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Факторы риска</h2>
        <Button className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600">
          <Refresh className="w-4 h-4 mr-2" />
          Пересчитать риски
        </Button>
      </div>

      {data ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Сердечно-сосудистые риски */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                Сердечно-сосудистые заболевания
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">Уровень риска:</span>
                  <Badge className={getRiskLevelColor(data.cardiovascular.level)}>
                    {getRiskLevelText(data.cardiovascular.level)}
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${
                      data.cardiovascular.level === 'low' ? 'bg-green-500' :
                      data.cardiovascular.level === 'moderate' ? 'bg-yellow-500' :
                      data.cardiovascular.level === 'high' ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(data.cardiovascular.score * 20, 100)}%` }}
                  ></div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Факторы риска:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {data.cardiovascular.factors.map((factor, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Рекомендации:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {data.cardiovascular.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Онкологические риски */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-600" />
                Онкология
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">Уровень риска:</span>
                  <Badge className={getRiskLevelColor(data.cancer.level)}>
                    {getRiskLevelText(data.cancer.level)}
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${
                      data.cancer.level === 'low' ? 'bg-green-500' :
                      data.cancer.level === 'moderate' ? 'bg-yellow-500' :
                      data.cancer.level === 'high' ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(data.cancer.score * 20, 100)}%` }}
                  ></div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Генетические факторы:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {data.cancer.geneticFactors.map((factor, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Рекомендации:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {data.cancer.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Диабет */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Диабет
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">Уровень риска:</span>
                  <Badge className={getRiskLevelColor(data.diabetes.level)}>
                    {getRiskLevelText(data.diabetes.level)}
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${
                      data.diabetes.level === 'low' ? 'bg-green-500' :
                      data.diabetes.level === 'moderate' ? 'bg-yellow-500' :
                      data.diabetes.level === 'high' ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(data.diabetes.score * 20, 100)}%` }}
                  ></div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Факторы риска:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {data.diabetes.factors.map((factor, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Рекомендации:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {data.diabetes.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Остеопороз */}
          <Card>
            <CardHeader>
              <CardTitle>Остеопороз</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">Уровень риска:</span>
                  <Badge className={getRiskLevelColor(data.osteoporosis.level)}>
                    {getRiskLevelText(data.osteoporosis.level)}
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${
                      data.osteoporosis.level === 'low' ? 'bg-green-500' :
                      data.osteoporosis.level === 'moderate' ? 'bg-yellow-500' :
                      data.osteoporosis.level === 'high' ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(data.osteoporosis.score * 20, 100)}%` }}
                  ></div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Факторы риска:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {data.osteoporosis.factors.map((factor, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Рекомендации:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {data.osteoporosis.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Оценка рисков недоступна</h3>
            <p className="text-gray-600 mb-6">Заполните профиль здоровья для расчета персональных рисков</p>
            <Button 
              className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
              onClick={() => console.log('Start risk assessment')}
            >
              Начать оценку рисков
            </Button>
          </CardContent>
        </Card>
      )}

      {data && (
        <Card>
          <CardHeader>
            <CardTitle>Последнее обновление</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Риски были рассчитаны: {data.lastUpdated.toLocaleDateString('ru-RU')}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Рекомендуется обновлять оценку рисков каждые 6 месяцев или при изменении состояния здоровья
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
