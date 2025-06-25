
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calculator, Heart, Activity, Bone, Brain, Target, CheckCircle, AlertTriangle, TrendingUp } from "lucide-react";
import { RiskCalculatorHub } from '../risk-calculators/RiskCalculatorHub';

interface RiskCalculator {
  id: string;
  name: string;
  description: string;
  category: 'oncology' | 'cardiovascular' | 'bone' | 'neurological';
  icon: any;
  color: string;
  timeframe: string;
  evidenceLevel: 'high' | 'moderate' | 'low';
  estimatedTime: string;
  isCompleted: boolean;
  lastResult?: {
    value: number;
    category: 'low' | 'moderate' | 'high' | 'very-high';
    date: Date;
  };
}

const RiskAssessmentCenter: React.FC = () => {
  const [selectedCalculator, setSelectedCalculator] = useState<string | null>(null);
  const [completedAssessments, setCompletedAssessments] = useState<Set<string>>(new Set());

  const calculators: RiskCalculator[] = [
    {
      id: 'gail',
      name: 'Модель Gail',
      description: 'Оценка риска рака молочной железы на 5 лет и пожизненно',
      category: 'oncology',
      icon: Heart,
      color: 'bg-pink-500',
      timeframe: '5 лет / пожизненно',
      evidenceLevel: 'high',
      estimatedTime: '5-7 минут',
      isCompleted: completedAssessments.has('gail'),
      lastResult: completedAssessments.has('gail') ? {
        value: 0.024,
        category: 'low',
        date: new Date()
      } : undefined
    },
    {
      id: 'prevent',
      name: 'PREVENT Calculator',
      description: 'Современная оценка сердечно-сосудистых рисков (AHA 2023)',
      category: 'cardiovascular',
      icon: Activity,
      color: 'bg-red-500',
      timeframe: '10 лет',
      evidenceLevel: 'high',
      estimatedTime: '4-6 минут',
      isCompleted: completedAssessments.has('prevent')
    },
    {
      id: 'frax',
      name: 'FRAX Calculator',
      description: 'Оценка риска остеопоротических переломов',
      category: 'bone',
      icon: Bone,
      color: 'bg-orange-500',
      timeframe: '10 лет',
      evidenceLevel: 'high',
      estimatedTime: '3-4 минуты',
      isCompleted: completedAssessments.has('frax')
    },
    {
      id: 'crat',
      name: 'CRAT Calculator',
      description: 'Риск колоректального рака (NCI)',
      category: 'oncology',
      icon: Target,
      color: 'bg-blue-500',
      timeframe: '5 лет',
      evidenceLevel: 'high',
      estimatedTime: '3-4 минуты',
      isCompleted: completedAssessments.has('crat')
    },
    {
      id: 'framingham',
      name: 'Framingham Dementia',
      description: 'Риск нейродегенеративных заболеваний',
      category: 'neurological',
      icon: Brain,
      color: 'bg-purple-500',
      timeframe: '10 лет',
      evidenceLevel: 'moderate',
      estimatedTime: '4-6 минут',
      isCompleted: completedAssessments.has('framingham')
    }
  ];

  const getEvidenceBadge = (level: string) => {
    switch (level) {
      case 'high':
        return <Badge variant="default" className="bg-green-100 text-green-800">Высокий уровень доказательности</Badge>;
      case 'moderate':
        return <Badge variant="secondary">Умеренный уровень доказательности</Badge>;
      case 'low':
        return <Badge variant="outline">Низкий уровень доказательности</Badge>;
      default:
        return null;
    }
  };

  const getRiskColor = (category: string) => {
    switch (category) {
      case 'low': return 'text-green-600';
      case 'moderate': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      case 'very-high': return 'text-red-800';
      default: return 'text-gray-600';
    }
  };

  const completedCount = completedAssessments.size;
  const totalCount = calculators.length;
  const completionPercentage = (completedCount / totalCount) * 100;

  if (selectedCalculator) {
    return <RiskCalculatorHub />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Центр оценки рисков PREVENT
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Персонализированная оценка рисков заболеваний на основе современных клинических алгоритмов и научных данных
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <span>Прогресс оценки рисков</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Завершено {completedCount} из {totalCount} оценок
                </span>
                <span className="text-sm font-semibold">
                  {Math.round(completionPercentage)}%
                </span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
              {completionPercentage === 100 && (
                <div className="flex items-center justify-center space-x-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Все оценки завершены!</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Risk Calculators Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {calculators.map((calculator) => {
            const Icon = calculator.icon;
            return (
              <Card 
                key={calculator.id}
                className={`relative transition-all duration-200 hover:shadow-lg cursor-pointer ${
                  calculator.isCompleted ? 'ring-2 ring-green-200 bg-green-50/30' : 'hover:scale-105'
                }`}
                onClick={() => setSelectedCalculator(calculator.id)}
              >
                {calculator.isCompleted && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  </div>
                )}

                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`w-12 h-12 ${calculator.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{calculator.name}</CardTitle>
                      <div className="text-xs text-gray-500">{calculator.timeframe}</div>
                    </div>
                  </div>
                  {getEvidenceBadge(calculator.evidenceLevel)}
                </CardHeader>

                <CardContent className="space-y-4">
                  <CardDescription className="text-sm">
                    {calculator.description}
                  </CardDescription>

                  <div className="flex justify-between text-xs text-gray-500">
                    <span>⏱️ {calculator.estimatedTime}</span>
                    <span className="capitalize">{calculator.category}</span>
                  </div>

                  {calculator.lastResult ? (
                    <div className="bg-white rounded-lg p-3 border">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Последний результат:</span>
                        <span className={`text-sm font-semibold ${getRiskColor(calculator.lastResult.category)}`}>
                          {(calculator.lastResult.value * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {calculator.lastResult.date.toLocaleDateString('ru-RU')}
                      </div>
                    </div>
                  ) : (
                    <Button className="w-full" variant="outline">
                      <Calculator className="w-4 h-4 mr-2" />
                      Начать оценку
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Information Cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <span>Важная информация</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600 space-y-2">
              <p>
                Калькуляторы рисков предназначены для информационных целей и не заменяют 
                медицинскую консультацию.
              </p>
              <p>
                Результаты должны интерпретироваться врачом с учетом индивидуальных 
                особенностей пациента.
              </p>
              <p>
                Все алгоритмы основаны на актуальных клинических рекомендациях и 
                научных исследованиях.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-pink-600" />
                <span>Персонализированный подход</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600 space-y-2">
              <p>
                Наша платформа использует данные из вашей анкеты здоровья для 
                максимально точной оценки рисков.
              </p>
              <p>
                Рекомендации адаптируются под ваш возраст, образ жизни, семейную 
                историю и другие факторы.
              </p>
              <p>
                Результаты регулярно обновляются при добавлении новых данных о здоровье.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RiskAssessmentCenter;
