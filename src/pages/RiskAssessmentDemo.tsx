
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Heart, Brain, Activity, ArrowRight } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import BackButton from '@/components/ui/back-button';

const RiskAssessmentDemo = () => {
  const navigate = useNavigate();

  const assessmentTypes = [
    {
      title: "QRISK3",
      description: "Оценка сердечно-сосудистых рисков",
      icon: Heart,
      color: "from-red-500 to-pink-500"
    },
    {
      title: "BCSC v3",
      description: "Риск рака молочной железы",
      icon: Activity,
      color: "from-pink-500 to-rose-500"
    },
    {
      title: "DemPoRT",
      description: "Популяционный риск деменции",
      icon: Brain,
      color: "from-purple-500 to-indigo-500"
    },
    {
      title: "Cancer Risk",
      description: "Общий риск развития рака",
      icon: Shield,
      color: "from-blue-500 to-cyan-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <BackButton className="mb-6" />
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Оценка рисков здоровья
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Получите персонализированный анализ рисков различных заболеваний 
            на основе научно-обоснованных алгоритмов
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {assessmentTypes.map((assessment, index) => {
            const IconComponent = assessment.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${assessment.color} flex items-center justify-center`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">{assessment.title}</CardTitle>
                  <CardDescription>{assessment.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-none">
          <CardContent className="py-12 text-center">
            <h3 className="text-2xl font-bold mb-4">
              Готовы узнать свои риски?
            </h3>
            <p className="text-lg mb-8 opacity-90">
              Зарегистрируйтесь и получите доступ к полной оценке рисков здоровья
            </p>
            <Button 
              size="lg" 
              variant="secondary" 
              className="text-purple-600 hover:text-purple-700"
              onClick={() => navigate('/auth')}
            >
              Начать оценку
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RiskAssessmentDemo;
