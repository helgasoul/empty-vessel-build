
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Leaf, Wind, Droplets, Sun, ArrowRight } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import BackButton from '@/components/ui/back-button';

const EnvironmentalHealthDemo = () => {
  const navigate = useNavigate();

  const environmentalFactors = [
    {
      title: "Качество воздуха",
      description: "Мониторинг загрязнения воздуха",
      icon: Wind,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Качество воды",
      description: "Анализ водных ресурсов",
      icon: Droplets,
      color: "from-cyan-500 to-blue-500"
    },
    {
      title: "УФ-излучение",
      description: "Защита от солнечного излучения",
      icon: Sun,
      color: "from-yellow-500 to-orange-500"
    },
    {
      title: "Экология дома",
      description: "Создание здоровой среды",
      icon: Leaf,
      color: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-cyan-50">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <BackButton className="mb-6" />
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Экология здоровья
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Анализ влияния окружающей среды на ваше здоровье и персонализированные 
            рекомендации по защите
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {environmentalFactors.map((factor, index) => {
            const IconComponent = factor.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${factor.color} flex items-center justify-center`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">{factor.title}</CardTitle>
                  <CardDescription>{factor.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white border-none">
          <CardContent className="py-12 text-center">
            <h3 className="text-2xl font-bold mb-4">
              Защитите свое здоровье
            </h3>
            <p className="text-lg mb-8 opacity-90">
              Получите персональные рекомендации по защите от экологических рисков
            </p>
            <Button 
              size="lg" 
              variant="secondary" 
              className="text-green-600 hover:text-green-700"
              onClick={() => navigate('/auth')}
            >
              Начать мониторинг
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnvironmentalHealthDemo;
