
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, AlertTriangle, Calendar, TrendingUp } from "lucide-react";

const PatientRiskOverview = () => {
  return (
    <div className="space-y-6">
      {/* Статистика пациентов */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">142</p>
                <p className="text-sm text-gray-600">Всего пациентов</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
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
              <Calendar className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">15</p>
                <p className="text-sm text-gray-600">Просрочены осмотры</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">89%</p>
                <p className="text-sm text-gray-600">Комплаентность</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Список пациентов с высоким риском */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span>Пациенты в зоне риска</span>
          </CardTitle>
          <CardDescription>
            Требуют внимания в ближайшее время
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: "Анна Петрова", age: 45, risk: "ССЗ: Высокий", lastVisit: "2 мес назад", phone: "+7 (xxx) xxx-xx-xx" },
              { name: "Мария Иванова", age: 52, risk: "Остеопороз: Средний", lastVisit: "3 мес назад", phone: "+7 (xxx) xxx-xx-xx" },
              { name: "Елена Сидорова", age: 38, risk: "Депрессия: PHQ-9 ≥15", lastVisit: "1 мес назад", phone: "+7 (xxx) xxx-xx-xx" },
            ].map((patient, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <p className="font-medium">{patient.name}, {patient.age} лет</p>
                    <Badge variant="destructive">{patient.risk}</Badge>
                  </div>
                  <p className="text-sm text-gray-600">Последний визит: {patient.lastVisit}</p>
                  <p className="text-sm text-gray-500">{patient.phone}</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    Карта
                  </Button>
                  <Button size="sm">
                    Связаться
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientRiskOverview;
