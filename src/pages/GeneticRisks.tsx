
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dna, ArrowLeft, Heart, Brain, TrendingUp, AlertTriangle } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const GeneticRisks = () => {
  const navigate = useNavigate();

  const mockRisks = [
    {
      condition: 'Рак молочной железы',
      risk: 'Повышенный',
      percentage: 75,
      description: 'На основе семейной истории и генетических факторов',
      color: 'text-orange-600 bg-orange-50'
    },
    {
      condition: 'Сердечно-сосудистые заболевания',
      risk: 'Средний',
      percentage: 45,
      description: 'Умеренная предрасположенность по материнской линии',
      color: 'text-yellow-600 bg-yellow-50'
    },
    {
      condition: 'Диабет 2 типа',
      risk: 'Низкий',
      percentage: 20,
      description: 'Минимальные генетические факторы риска',
      color: 'text-green-600 bg-green-50'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-6 text-purple-600 hover:text-purple-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          На главную
        </Button>
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Генетические риски
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Анализ наследственных предрасположенностей и генетических факторов риска на основе семейной истории и современных исследований.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <Card className="prevent-card mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                  Оценка генетических рисков
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {mockRisks.map((risk, index) => (
                    <div key={index} className="p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-lg">{risk.condition}</h3>
                        <Badge className={risk.color}>
                          {risk.risk}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{risk.description}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Уровень риска</span>
                          <span className="font-medium">{risk.percentage}%</span>
                        </div>
                        <Progress value={risk.percentage} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="prevent-card">
              <CardHeader className="pb-4">
                <div className="prevent-icon-container bg-purple-500 mb-4">
                  <Dna className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">Генетическое тестирование</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 text-sm">
                  Пройдите профессиональное генетическое тестирование для точной оценки рисков.
                </p>
                <Button className="w-full prevent-button-primary">
                  Записаться на тест
                </Button>
              </CardContent>
            </Card>

            <Card className="prevent-card">
              <CardHeader className="pb-4">
                <div className="prevent-icon-container bg-blue-500 mb-4">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">Профилактика</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 text-sm">
                  Получите персональные рекомендации по профилактике и снижению рисков.
                </p>
                <Button className="w-full prevent-button-secondary">
                  План профилактики
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="prevent-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-500" />
              Важная информация
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h3 className="font-semibold mb-2 text-amber-800">Обратите внимание:</h3>
              <ul className="space-y-1 text-amber-700 text-sm">
                <li>• Генетические риски не означают обязательное развитие заболевания</li>
                <li>• Результаты должны интерпретироваться вместе с врачом-генетиком</li>
                <li>• Образ жизни может значительно влиять на реализацию генетических рисков</li>
                <li>• Регулярный медицинский контроль поможет выявить изменения на ранней стадии</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Card className="prevent-card bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="pt-6">
              <Brain className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Страница находится в разработке</h3>
              <p className="text-gray-600 mb-4">
                Мы работаем над интеграцией с ведущими генетическими лабораториями для предоставления точных анализов.
              </p>
              <Button 
                onClick={() => navigate('/risk-assessment-demo')}
                className="prevent-button-primary"
              >
                Пройти оценку рисков
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GeneticRisks;
