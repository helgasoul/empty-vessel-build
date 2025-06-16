
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import RiskAssessmentForm from "@/components/risk/RiskAssessmentForm";
import RiskAssessmentHistory from "@/components/risk/RiskAssessmentHistory";
import { Heart, History, Calculator, Info, Activity, Dna } from "lucide-react";

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
                    <span>QRISK3</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">
                    QRISK3 - научно обоснованный калькулятор 10-летнего риска 
                    сердечно-сосудистых заболеваний.
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-medium">Факторы риска:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      <li>Возраст, пол, этническая принадлежность</li>
                      <li>Артериальное давление, холестерин</li>
                      <li>Курение, ИМТ</li>
                      <li>Семейная история, сопутствующие заболевания</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-pink-500" />
                    <span>BCSC v3</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">
                    Breast Cancer Surveillance Consortium v3 - наиболее валидированная 
                    модель оценки риска рака молочной железы.
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-medium">Ключевые особенности:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      <li>Учитывает плотность молочной железы (BI-RADS)</li>
                      <li>Семейная история и биопсии</li>
                      <li>Репродуктивные факторы</li>
                      <li>5-летний и пожизненный риск</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Dna className="w-5 h-5 text-purple-500" />
                    <span>BRCA</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">
                    Оценка генетического риска наследственного рака молочной железы 
                    и яичников.
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-medium">Включает:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      <li>Мутации BRCA1 и BRCA2</li>
                      <li>Семейная история онкологии</li>
                      <li>Этническая принадлежность</li>
                      <li>Возрастные факторы</li>
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
                        <span className="font-medium">Низкий риск</span>
                        <p className="text-sm text-gray-600">
                          Стандартные рекомендации по скринингу
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                      <div>
                        <span className="font-medium">Средний риск</span>
                        <p className="text-sm text-gray-600">
                          Дополнительное наблюдение
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-red-500 rounded"></div>
                      <div>
                        <span className="font-medium">Высокий риск</span>
                        <p className="text-sm text-gray-600">
                          Интенсивное наблюдение и профилактика
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Важно:</strong> Результаты носят информационный характер. 
                      Всегда консультируйтесь с врачом для получения персонализированных 
                      медицинских рекомендаций.
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
