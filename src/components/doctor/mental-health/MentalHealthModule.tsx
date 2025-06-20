
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, TrendingDown, Users, AlertTriangle, Calendar, FileText } from "lucide-react";

interface MentalHealthAssessment {
  id: string;
  patientName: string;
  age: number;
  assessmentType: string;
  score: number;
  severity: 'minimal' | 'mild' | 'moderate' | 'severe';
  date: string;
  recommendations: string[];
}

const MentalHealthModule = () => {
  const [selectedScale, setSelectedScale] = useState('phq9');

  const mockAssessments: MentalHealthAssessment[] = [
    {
      id: '1',
      patientName: 'Анна Петрова',
      age: 45,
      assessmentType: 'PHQ-9',
      score: 12,
      severity: 'moderate',
      date: '2025-06-15',
      recommendations: ['Консультация психотерапевта', 'Рассмотреть антидепрессанты']
    },
    {
      id: '2',
      patientName: 'Мария Иванова',
      age: 52,
      assessmentType: 'GAD-7',
      score: 8,
      severity: 'mild',
      date: '2025-06-10',
      recommendations: ['Техники релаксации', 'Регулярная физическая активность']
    },
    {
      id: '3',
      patientName: 'Елена Сидорова',
      age: 38,
      assessmentType: 'DASS-21',
      score: 18,
      severity: 'severe',
      date: '2025-06-18',
      recommendations: ['Срочная консультация психиатра', 'Госпитализация по показаниям']
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'minimal': return 'bg-green-100 text-green-800';
      case 'mild': return 'bg-yellow-100 text-yellow-800';
      case 'moderate': return 'bg-orange-100 text-orange-800';
      case 'severe': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'minimal': return 'Минимальная';
      case 'mild': return 'Легкая';
      case 'moderate': return 'Умеренная';
      case 'severe': return 'Тяжелая';
      default: return 'Неизвестно';
    }
  };

  const mentalHealthScales = [
    {
      id: 'phq9',
      name: 'PHQ-9',
      description: 'Опросник депрессии',
      scoreRange: '0-27',
      usage: 34
    },
    {
      id: 'gad7',
      name: 'GAD-7',
      description: 'Шкала тревоги',
      scoreRange: '0-21',
      usage: 28
    },
    {
      id: 'dass21',
      name: 'DASS-21',
      description: 'Депрессия, тревога, стресс',
      scoreRange: '0-63',
      usage: 19
    },
    {
      id: 'hads',
      name: 'HADS',
      description: 'Госпитальная шкала',
      scoreRange: '0-42',
      usage: 15
    }
  ];

  return (
    <div className="space-y-6">
      {/* Статистика ментального здоровья */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-2xl font-bold">8</p>
                <p className="text-sm text-gray-600">Тяжелые случаи</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TrendingDown className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">23</p>
                <p className="text-sm text-gray-600">Умеренные</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">45</p>
                <p className="text-sm text-gray-600">Легкие</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">96</p>
                <p className="text-sm text-gray-600">Всего оценок</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="screening" className="space-y-4">
        <TabsList>
          <TabsTrigger value="screening">Скрининг</TabsTrigger>
          <TabsTrigger value="scales">Психошкалы</TabsTrigger>
          <TabsTrigger value="interventions">Вмешательства</TabsTrigger>
          <TabsTrigger value="progress">Динамика</TabsTrigger>
        </TabsList>

        <TabsContent value="screening" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Результаты скрининга психоэмоционального состояния</CardTitle>
              <CardDescription>
                Последние оценки пациентов по психометрическим шкалам
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAssessments.map((assessment) => (
                  <div key={assessment.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium">{assessment.patientName}, {assessment.age} лет</h3>
                        <p className="text-sm text-gray-600">
                          {assessment.assessmentType} • {assessment.date}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={getSeverityColor(assessment.severity)}>
                          {getSeverityText(assessment.severity)}
                        </Badge>
                        <span className="text-lg font-bold">{assessment.score}</span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <h4 className="text-sm font-medium mb-2">Рекомендации:</h4>
                      <ul className="space-y-1">
                        {assessment.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        История
                      </Button>
                      <Button size="sm">
                        Новая оценка
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scales">
          <Card>
            <CardHeader>
              <CardTitle>Доступные психометрические шкалы</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mentalHealthScales.map((scale) => (
                  <div 
                    key={scale.id} 
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedScale === scale.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedScale(scale.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{scale.name}</h3>
                      <Badge variant="outline">{scale.scoreRange}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{scale.description}</p>
                    <p className="text-sm text-blue-600">
                      Использовано: {scale.usage} раз в этом месяце
                    </p>
                  </div>
                ))}
              </div>

              {selectedScale && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium mb-2">Интерпретация результатов</h3>
                  <div className="text-sm space-y-1">
                    {selectedScale === 'phq9' && (
                      <>
                        <p>• 0-4: Минимальная депрессия</p>
                        <p>• 5-9: Легкая депрессия</p>
                        <p>• 10-14: Умеренная депрессия</p>
                        <p>• 15-19: Умеренно тяжелая депрессия</p>
                        <p>• 20-27: Тяжелая депрессия</p>
                      </>
                    )}
                    {selectedScale === 'gad7' && (
                      <>
                        <p>• 0-4: Минимальная тревога</p>
                        <p>• 5-9: Легкая тревога</p>
                        <p>• 10-14: Умеренная тревога</p>
                        <p>• 15-21: Тяжелая тревога</p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interventions">
          <Card>
            <CardHeader>
              <CardTitle>Рекомендуемые вмешательства</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    severity: 'Минимальная/Легкая',
                    interventions: ['Психообразование', 'Техники самопомощи', 'Регулярная физическая активность'],
                    color: 'border-green-200'
                  },
                  {
                    severity: 'Умеренная',
                    interventions: ['Когнитивно-поведенческая терапия', 'Групповая терапия', 'Антидепрессанты (при показаниях)'],
                    color: 'border-yellow-200'
                  },
                  {
                    severity: 'Тяжелая',
                    interventions: ['Интенсивная психотерапия', 'Фармакотерапия', 'Специализированная помощь'],
                    color: 'border-red-200'
                  }
                ].map((item, index) => (
                  <div key={index} className={`p-4 border-2 rounded-lg ${item.color}`}>
                    <h3 className="font-medium mb-2">{item.severity} степень</h3>
                    <ul className="space-y-1">
                      {item.interventions.map((intervention, idx) => (
                        <li key={idx} className="text-sm flex items-start">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                          {intervention}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>Динамика состояния пациентов</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">67%</p>
                    <p className="text-sm text-gray-600">Улучшение</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-600">23%</p>
                    <p className="text-sm text-gray-600">Стабильно</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">10%</p>
                    <p className="text-sm text-gray-600">Ухудшение</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Пациенты с положительной динамикой</h3>
                  {[
                    { name: 'Анна П.', change: -5, scale: 'PHQ-9', period: '3 месяца' },
                    { name: 'Мария И.', change: -3, scale: 'GAD-7', period: '2 месяца' },
                    { name: 'Елена С.', change: -8, scale: 'DASS-21', period: '4 месяца' }
                  ].map((patient, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{patient.name}</p>
                        <p className="text-sm text-gray-600">{patient.scale} за {patient.period}</p>
                      </div>
                      <span className="text-sm font-medium text-green-600">
                        {patient.change} баллов
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MentalHealthModule;
