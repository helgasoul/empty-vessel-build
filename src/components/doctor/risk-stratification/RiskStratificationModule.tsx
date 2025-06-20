
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp, Users, Search, Filter } from "lucide-react";

interface PatientRisk {
  id: string;
  name: string;
  age: number;
  riskScore: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  conditions: string[];
  lastAssessment: string;
}

const RiskStratificationModule = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string>('all');

  const mockPatients: PatientRisk[] = [
    {
      id: '1',
      name: 'Анна Петрова',
      age: 45,
      riskScore: 85,
      riskLevel: 'high',
      conditions: ['ССЗ', 'Диабет 2 типа'],
      lastAssessment: '2025-06-15'
    },
    {
      id: '2',
      name: 'Мария Иванова',
      age: 52,
      riskScore: 92,
      riskLevel: 'critical',
      conditions: ['Онкология', 'Гипертония'],
      lastAssessment: '2025-06-10'
    },
    {
      id: '3',
      name: 'Елена Сидорова',
      age: 38,
      riskScore: 45,
      riskLevel: 'moderate',
      conditions: ['Остеопороз'],
      lastAssessment: '2025-06-18'
    }
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskText = (level: string) => {
    switch (level) {
      case 'low': return 'Низкий';
      case 'moderate': return 'Умеренный';
      case 'high': return 'Высокий';
      case 'critical': return 'Критический';
      default: return 'Неизвестно';
    }
  };

  const filteredPatients = mockPatients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = selectedRiskLevel === 'all' || patient.riskLevel === selectedRiskLevel;
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="space-y-6">
      {/* Статистика рисков */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-2xl font-bold">8</p>
                <p className="text-sm text-gray-600">Критический риск</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">23</p>
                <p className="text-sm text-gray-600">Высокий риск</p>
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
                <p className="text-sm text-gray-600">Умеренный риск</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-green-600 rounded-full"></div>
              <div>
                <p className="text-2xl font-bold">66</p>
                <p className="text-sm text-gray-600">Низкий риск</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="patients" className="space-y-4">
        <TabsList>
          <TabsTrigger value="patients">Пациенты по рискам</TabsTrigger>
          <TabsTrigger value="algorithms">Алгоритмы оценки</TabsTrigger>
          <TabsTrigger value="protocols">Протоколы вмешательства</TabsTrigger>
        </TabsList>

        <TabsContent value="patients" className="space-y-4">
          {/* Фильтры */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="search">Поиск пациентов</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="search"
                      placeholder="Введите имя пациента..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="risk-filter">Уровень риска</Label>
                  <select
                    id="risk-filter"
                    value={selectedRiskLevel}
                    onChange={(e) => setSelectedRiskLevel(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="all">Все уровни</option>
                    <option value="critical">Критический</option>
                    <option value="high">Высокий</option>
                    <option value="moderate">Умеренный</option>
                    <option value="low">Низкий</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Список пациентов */}
          <Card>
            <CardHeader>
              <CardTitle>Пациенты с стратификацией рисков</CardTitle>
              <CardDescription>
                Найдено пациентов: {filteredPatients.length}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPatients.map((patient) => (
                  <div key={patient.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium">{patient.name}, {patient.age} лет</h3>
                        <Badge className={getRiskColor(patient.riskLevel)}>
                          {getRiskText(patient.riskLevel)} риск ({patient.riskScore})
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {patient.conditions.map((condition, index) => (
                          <Badge key={index} variant="outline">
                            {condition}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">
                        Последняя оценка: {patient.lastAssessment}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Просмотр
                      </Button>
                      <Button size="sm">
                        Обновить риск
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="algorithms">
          <Card>
            <CardHeader>
              <CardTitle>Алгоритмы оценки рисков</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'QRISK3', description: 'Сердечно-сосудистые риски', patients: 89 },
                  { name: 'FRAX', description: 'Риск переломов', patients: 34 },
                  { name: 'ASCVD', description: 'Атеросклеротические ССЗ', patients: 67 },
                  { name: 'CHA2DS2-VASc', description: 'Риск инсульта при ФП', patients: 23 }
                ].map((algorithm, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h3 className="font-medium">{algorithm.name}</h3>
                    <p className="text-sm text-gray-600">{algorithm.description}</p>
                    <p className="text-sm text-blue-600 mt-2">
                      Оценено пациентов: {algorithm.patients}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="protocols">
          <Card>
            <CardHeader>
              <CardTitle>Протоколы вмешательства</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    risk: 'Высокий ССЗ риск',
                    protocol: 'Интенсивная липидснижающая терапия + антигипертензивная терапия',
                    frequency: 'Контроль каждые 3 месяца'
                  },
                  {
                    risk: 'Диабет 2 типа',
                    protocol: 'Метформин + контроль гликемии + обучение пациента',
                    frequency: 'Контроль каждые 6 месяцев'
                  },
                  {
                    risk: 'Остеопороз',
                    protocol: 'Бисфосфонаты + витамин D + кальций',
                    frequency: 'Денситометрия каждые 2 года'
                  }
                ].map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h3 className="font-medium text-orange-600">{item.risk}</h3>
                    <p className="text-sm mt-2">{item.protocol}</p>
                    <p className="text-sm text-gray-600 mt-1">{item.frequency}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RiskStratificationModule;
