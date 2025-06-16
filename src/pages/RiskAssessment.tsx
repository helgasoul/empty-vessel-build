
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import RiskAssessmentForm from "@/components/risk/RiskAssessmentForm";
import RiskAssessmentHistory from "@/components/risk/RiskAssessmentHistory";
import { Heart, History, Calculator, Info } from "lucide-react";

const RiskAssessment = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("assessment");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Calculator className="w-8 h-8 animate-spin mx-auto mb-2 text-gray-500" />
          <p>Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Оценка рисков здоровья
          </h1>
          <p className="text-gray-600">
            Персонализированная оценка рисков и рекомендации для улучшения вашего здоровья
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info" className="flex items-center space-x-2">
              <Info className="w-4 h-4" />
              <span>Информация</span>
            </TabsTrigger>
            <TabsTrigger value="assessment" className="flex items-center space-x-2">
              <Calculator className="w-4 h-4" />
              <span>Новая оценка</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center space-x-2">
              <History className="w-4 h-4" />
              <span>История</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    <span>Что такое QRISK3?</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">
                    QRISK3 - это научно обоснованный калькулятор, который оценивает 
                    ваш 10-летний риск развития сердечно-сосудистых заболеваний.
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-medium">Что учитывается в расчете:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      <li>Возраст и пол</li>
                      <li>Этническая принадлежность</li>
                      <li>Статус курения</li>
                      <li>Артериальное давление</li>
                      <li>Уровень холестерина</li>
                      <li>Индекс массы тела</li>
                      <li>Семейная история заболеваний</li>
                      <li>Сопутствующие заболевания</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Интерпретация результатов</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <div>
                        <span className="font-medium">Низкий риск (&lt; 10%)</span>
                        <p className="text-sm text-gray-600">
                          Продолжайте здоровый образ жизни
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                      <div>
                        <span className="font-medium">Средний риск (10-20%)</span>
                        <p className="text-sm text-gray-600">
                          Рекомендуется изменение образа жизни
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-red-500 rounded"></div>
                      <div>
                        <span className="font-medium">Высокий риск (&gt; 20%)</span>
                        <p className="text-sm text-gray-600">
                          Требуется медицинское вмешательство
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Важно:</strong> Этот калькулятор предоставляет оценку риска 
                      для информационных целей. Всегда консультируйтесь с врачом для 
                      получения персонализированных медицинских рекомендаций.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="assessment">
            <RiskAssessmentForm />
          </TabsContent>

          <TabsContent value="history">
            <RiskAssessmentHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RiskAssessment;
