
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Activity, TrendingUp, Users, Target, CheckCircle, AlertCircle, Clock } from "lucide-react";

interface PatientCompliance {
  id: string;
  name: string;
  age: number;
  complianceScore: number;
  medications: { name: string; compliance: number }[];
  appointments: { kept: number; total: number };
  lifestyle: { exercise: number; diet: number; sleep: number };
  lastUpdate: string;
}

const BehaviorMonitoringModule = () => {
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);

  const mockPatients: PatientCompliance[] = [
    {
      id: '1',
      name: 'Анна Петрова',
      age: 45,
      complianceScore: 85,
      medications: [
        { name: 'Метформин', compliance: 90 },
        { name: 'Лизиноприл', compliance: 80 }
      ],
      appointments: { kept: 8, total: 10 },
      lifestyle: { exercise: 75, diet: 80, sleep: 85 },
      lastUpdate: '2025-06-18'
    },
    {
      id: '2',
      name: 'Мария Иванова',
      age: 52,
      complianceScore: 62,
      medications: [
        { name: 'Аторвастатин', compliance: 70 },
        { name: 'Омепразол', compliance: 85 }
      ],
      appointments: { kept: 6, total: 10 },
      lifestyle: { exercise: 45, diet: 60, sleep: 70 },
      lastUpdate: '2025-06-17'
    }
  ];

  const getComplianceColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getComplianceBadge = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      {/* Общая статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">78%</p>
                <p className="text-sm text-gray-600">Средняя комплаентность</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-gray-600">Требуют внимания</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">45</p>
                <p className="text-sm text-gray-600">Активные цели</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">89%</p>
                <p className="text-sm text-gray-600">Посещаемость</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="compliance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="compliance">Комплаентность</TabsTrigger>
          <TabsTrigger value="lifestyle">Образ жизни</TabsTrigger>
          <TabsTrigger value="goals">Цели и достижения</TabsTrigger>
          <TabsTrigger value="reminders">Напоминания</TabsTrigger>
        </TabsList>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Мониторинг комплаентности пациентов</CardTitle>
              <CardDescription>
                Отслеживание приверженности лечению и рекомендациям
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockPatients.map((patient) => (
                  <div key={patient.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-medium">{patient.name}, {patient.age} лет</h3>
                        <Badge className={getComplianceBadge(patient.complianceScore)}>
                          Комплаентность: {patient.complianceScore}%
                        </Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPatient(patient.id)}
                      >
                        Подробнее
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Медикаменты */}
                      <div>
                        <h4 className="text-sm font-medium mb-2">Медикаменты</h4>
                        <div className="space-y-2">
                          {patient.medications.map((med, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <span className="text-sm">{med.name}</span>
                              <span className={`text-sm ${getComplianceColor(med.compliance)}`}>
                                {med.compliance}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Посещения */}
                      <div>
                        <h4 className="text-sm font-medium mb-2">Посещения</h4>
                        <div className="text-sm">
                          <p>Проведено: {patient.appointments.kept}/{patient.appointments.total}</p>
                          <Progress 
                            value={(patient.appointments.kept / patient.appointments.total) * 100} 
                            className="mt-2"
                          />
                        </div>
                      </div>

                      {/* Образ жизни */}
                      <div>
                        <h4 className="text-sm font-medium mb-2">Образ жизни</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Упражнения:</span>
                            <span className={getComplianceColor(patient.lifestyle.exercise)}>
                              {patient.lifestyle.exercise}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Диета:</span>
                            <span className={getComplianceColor(patient.lifestyle.diet)}>
                              {patient.lifestyle.diet}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Сон:</span>
                            <span className={getComplianceColor(patient.lifestyle.sleep)}>
                              {patient.lifestyle.sleep}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 mt-4">
                      Последнее обновление: {patient.lastUpdate}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lifestyle">
          <Card>
            <CardHeader>
              <CardTitle>Мониторинг образа жизни</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Физическая активность</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Цель: 150 мин/неделя</span>
                      <span className="text-sm text-green-600">78% пациентов</span>
                    </div>
                    <Progress value={78} />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Питание</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Соблюдение диеты</span>
                      <span className="text-sm text-yellow-600">65% пациентов</span>
                    </div>
                    <Progress value={65} />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Сон</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">7-9 часов сна</span>
                      <span className="text-sm text-blue-600">82% пациентов</span>
                    </div>
                    <Progress value={82} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals">
          <Card>
            <CardHeader>
              <CardTitle>Цели и достижения</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { goal: 'Снижение веса на 5%', progress: 75, patients: 23 },
                  { goal: 'Контроль гликемии <7%', progress: 68, patients: 34 },
                  { goal: 'АД <140/90 мм рт.ст.', progress: 82, patients: 45 },
                  { goal: 'Отказ от курения', progress: 45, patients: 12 }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">{item.goal}</h3>
                      <p className="text-sm text-gray-600">Пациентов: {item.patients}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-32">
                        <Progress value={item.progress} />
                      </div>
                      <span className="text-sm font-medium">{item.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reminders">
          <Card>
            <CardHeader>
              <CardTitle>Система напоминаний</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-4">Активные напоминания</h3>
                  <div className="space-y-3">
                    {[
                      { patient: 'Анна П.', reminder: 'Прием метформина', time: '08:00' },
                      { patient: 'Мария И.', reminder: 'Измерение АД', time: '19:00' },
                      { patient: 'Елена С.', reminder: 'Прогулка 30 мин', time: '17:00' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{item.patient}</p>
                          <p className="text-sm text-gray-600">{item.reminder}</p>
                        </div>
                        <span className="text-sm font-medium">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-4">Статистика напоминаний</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Отправлено сегодня:</span>
                      <span className="font-medium">127</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Подтверждено:</span>
                      <span className="font-medium text-green-600">89%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Пропущено:</span>
                      <span className="font-medium text-red-600">11%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BehaviorMonitoringModule;
