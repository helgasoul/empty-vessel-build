
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Shield, TrendingUp, Users } from "lucide-react";

const RiskStratificationModule = () => {
  const riskCategories = [
    {
      title: "Высокий риск",
      count: 8,
      color: "destructive",
      icon: AlertTriangle,
      patients: [
        { name: "Анна П.", age: 45, risk: "Сердечно-сосудистые заболевания", score: 85 },
        { name: "Мария И.", age: 52, risk: "Рак молочной железы", score: 78 },
        { name: "Елена С.", age: 38, risk: "Диабет 2 типа", score: 72 }
      ]
    },
    {
      title: "Средний риск",
      count: 15,
      color: "warning",
      icon: TrendingUp,
      patients: [
        { name: "Ольга К.", age: 41, risk: "Остеопороз", score: 45 },
        { name: "Татьяна М.", age: 35, risk: "Гипертония", score: 52 }
      ]
    },
    {
      title: "Низкий риск",
      count: 23,
      color: "success",
      icon: Shield,
      patients: [
        { name: "Юлия В.", age: 28, risk: "Общие риски", score: 25 },
        { name: "Екатерина Л.", age: 31, risk: "Профилактика", score: 18 }
      ]
    }
  ];

  const getRiskColor = (score: number) => {
    if (score >= 70) return "text-red-600 bg-red-100";
    if (score >= 40) return "text-yellow-600 bg-yellow-100";
    return "text-green-600 bg-green-100";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Стратификация рисков</h2>
        <p className="text-gray-600 mt-1">
          Анализ и группировка пациентов по уровням риска заболеваний
        </p>
      </div>

      {/* Сводная статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {riskCategories.map((category, index) => {
          const IconComponent = category.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{category.title}</CardTitle>
                <IconComponent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{category.count}</div>
                <p className="text-xs text-muted-foreground">пациентов</p>
                <Badge variant={category.color as any} className="mt-2">
                  {Math.round((category.count / 46) * 100)}% от общего числа
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Детализация по группам риска */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {riskCategories.map((category, index) => {
          const IconComponent = category.icon;
          return (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <IconComponent className="w-5 h-5" />
                  <span>{category.title}</span>
                </CardTitle>
                <CardDescription>
                  {category.count} пациентов требуют внимания
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {category.patients.map((patient, patientIndex) => (
                    <div key={patientIndex} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-sm text-gray-500">{patient.age} лет</p>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(patient.score)}`}>
                          {patient.score}%
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{patient.risk}</p>
                      <Progress value={patient.score} className="h-2" />
                    </div>
                  ))}
                  
                  {category.patients.length < category.count && (
                    <Button variant="outline" size="sm" className="w-full">
                      Показать еще {category.count - category.patients.length}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Инструменты анализа */}
      <Card>
        <CardHeader>
          <CardTitle>Инструменты анализа рисков</CardTitle>
          <CardDescription>
            Дополнительные возможности для работы с рисками пациентов
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Тренды рисков</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Сравнение групп</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Критические случаи</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Профилактика</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskStratificationModule;
