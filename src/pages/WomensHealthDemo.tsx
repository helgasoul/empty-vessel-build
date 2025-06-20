
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Calendar, Baby, Flower, ArrowRight } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import BackButton from '@/components/ui/back-button';

const WomensHealthDemo = () => {
  const navigate = useNavigate();

  const healthAreas = [
    {
      title: "Менструальный цикл",
      description: "Отслеживание и анализ цикла",
      icon: Calendar,
      color: "from-pink-500 to-rose-500"
    },
    {
      title: "Планирование беременности",
      description: "Подготовка к материнству",
      icon: Baby,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Гормональное здоровье",
      description: "Мониторинг гормонального баланса",
      icon: Heart,
      color: "from-red-500 to-pink-500"
    },
    {
      title: "Менопауза",
      description: "Поддержка в переходный период",
      icon: Flower,
      color: "from-orange-500 to-pink-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <BackButton className="mb-6" />
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Женское здоровье
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Комплексный подход к заботе о женском здоровье на всех этапах жизни
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {healthAreas.map((area, index) => {
            const IconComponent = area.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${area.color} flex items-center justify-center`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">{area.title}</CardTitle>
                  <CardDescription>{area.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        <Card className="bg-gradient-to-r from-pink-600 to-purple-600 text-white border-none">
          <CardContent className="py-12 text-center">
            <h3 className="text-2xl font-bold mb-4">
              Присоединяйтесь к PREVENT
            </h3>
            <p className="text-lg mb-8 opacity-90">
              Получите персонализированные рекомендации и поддержку в заботе о своем здоровье
            </p>
            <Button 
              size="lg" 
              variant="secondary" 
              className="text-pink-600 hover:text-pink-700"
              onClick={() => navigate('/auth')}
            >
              Начать заботу о здоровье
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WomensHealthDemo;
