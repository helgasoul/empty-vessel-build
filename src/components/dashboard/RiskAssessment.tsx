
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Heart, Brain, Zap, RefreshCw } from "lucide-react";

const RiskAssessment = () => {
  const riskCategories = [
    {
      category: "Сердечно-сосудистые",
      risk: 15,
      level: "Низкий",
      color: "green",
      icon: Heart,
      recommendations: 2
    },
    {
      category: "Онкология",
      risk: 25,
      level: "Средний",
      color: "yellow",
      icon: TrendingUp,
      recommendations: 3
    },
    {
      category: "Нейродегенеративные",
      risk: 8,
      level: "Низкий",
      color: "green",
      icon: Brain,
      recommendations: 1
    }
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Низкий':
        return 'text-green-700 bg-green-100';
      case 'Средний':
        return 'text-yellow-700 bg-yellow-100';
      case 'Высокий':
        return 'text-red-700 bg-red-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const getProgressColor = (level: string) => {
    switch (level) {
      case 'Низкий':
        return 'bg-green-500';
      case 'Средний':
        return 'bg-yellow-500';
      case 'Высокий':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span>Оценка рисков</span>
            </CardTitle>
            <CardDescription>
              Персонализированный анализ рисков здоровья
            </CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Обновить
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {riskCategories.map((item, index) => (
          <div key={index} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <item.icon className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{item.category}</h4>
                  <p className="text-sm text-gray-600">{item.recommendations} рекомендаций</p>
                </div>
              </div>
              <Badge className={getRiskColor(item.level)}>
                {item.level} риск
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Риск: {item.risk}%</span>
                <span className="text-gray-900 font-medium">{item.risk}/100</span>
              </div>
              <div className="relative">
                <Progress value={item.risk} className="h-2" />
                <div 
                  className={`absolute top-0 left-0 h-2 rounded-full transition-all ${getProgressColor(item.level)}`}
                  style={{ width: `${item.risk}%` }}
                />
              </div>
            </div>
          </div>
        ))}

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Последнее обновление:</span>
            <span className="text-gray-900">3 дня назад</span>
          </div>
          <Button className="w-full mt-4" variant="outline">
            Посмотреть детальный анализ
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskAssessment;
