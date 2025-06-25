
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Brain, AlertCircle, TrendingUp, Users, MessageCircle } from "lucide-react";

const MentalHealthModule = () => {
  const mentalHealthStats = [
    {
      condition: "Депрессия",
      totalPatients: 12,
      riskLevels: { high: 3, medium: 5, low: 4 },
      averageScore: 6.2
    },
    {
      condition: "Тревожность",
      totalPatients: 18,
      riskLevels: { high: 2, medium: 8, low: 8 },
      averageScore: 5.8
    },
    {
      condition: "Стресс",
      totalPatients: 25,
      riskLevels: { high: 5, medium: 12, low: 8 },
      averageScore: 7.1
    },
    {
      condition: "Нарушения сна",
      totalPatients: 15,
      riskLevels: { high: 4, medium: 7, low: 4 },
      averageScore: 6.5
    }
  ];

  const criticalPatients = [
    {
      name: "Анна П.",
      age: 45,
      conditions: ["Депрессия", "Тревожность"],
      score: 8.5,
      lastAssessment: "2 дня назад",
      status: "critical"
    },
    {
      name: "Мария И.",
      age: 38,
      conditions: ["Стресс", "Нарушения сна"],
      score: 7.8,
      lastAssessment: "1 неделя назад",
      status: "high"
    },
    {
      name: "Елена С.",
      age: 42,
      conditions: ["Тревожность"],
      score: 7.2,
      lastAssessment: "3 дня назад",
      status: "high"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'destructive';
      case 'high': return 'warning';
      case 'medium': return 'secondary';
      default: return 'success';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'critical': return 'Критический';
      case 'high': return 'Высокий';
      case 'medium': return 'Средний';
      default: return 'Низкий';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Психическое здоровье</h2>
        <p className="text-gray-600 mt-1">
          Мониторинг психоэмоционального состояния пациентов
        </p>
      </div>

      {/* Общая статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mentalHealthStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.condition}</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">{stat.totalPatients}</div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Высокий: {stat.riskLevels.high}</span>
                  <span>Средний: {stat.riskLevels.medium}</span>
                  <span>Низкий: {stat.riskLevels.low}</span>
                </div>
                <Progress value={(stat.averageScore / 10) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Средний балл: {stat.averageScore}/10
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Пациенты требующие внимания */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            <span>Пациенты, требующие внимания</span>
          </CardTitle>
          <CardDescription>
            Пациенты с высокими показателями психологического дистресса
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {criticalPatients.map((patient, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{patient.name}</h3>
                    <p className="text-sm text-gray-500">{patient.age} лет</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={getStatusColor(patient.status) as any}>
                      {getStatusText(patient.status)}
                    </Badge>
                    <p className="text-sm text-gray-500 mt-1">
                      Балл: {patient.score}/10
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {patient.conditions.map((condition, condIndex) => (
                    <Badge key={condIndex} variant="outline" className="text-xs">
                      {condition}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Последняя оценка: {patient.lastAssessment}
                  </span>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Связаться
                    </Button>
                    <Button size="sm" variant="outline">
                      Подробнее
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Инструменты психологической поддержки */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Инструменты оценки</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                Шкала депрессии Beck
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Шкала тревоги Hamilton
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Опросник стресса PSS
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Индекс качества сна Pittsburgh
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ресурсы поддержки</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Группы поддержки
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Brain className="w-4 h-4 mr-2" />
                Техники релаксации
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageCircle className="w-4 h-4 mr-2" />
                Кризисная линия
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="w-4 h-4 mr-2" />
                Программы реабилитации
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MentalHealthModule;
