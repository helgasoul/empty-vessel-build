
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Baby, Zap, Heart, ArrowRight } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const TargetSegments = () => {
  const navigate = useNavigate();

  const segments = [
    {
      title: "Осознанный исследователь",
      subtitle: "30-45 лет",
      icon: Brain,
      color: "from-purple-500 to-indigo-600",
      bgColor: "bg-gradient-to-br from-purple-50 to-indigo-50",
      borderColor: "border-purple-200",
      features: ["Превентивный контроль", "Анализ данных", "Четкая обратная связь"],
      cta: "Начать анализ рисков"
    },
    {
      title: "Будущая мама",
      subtitle: "Планирование беременности",
      icon: Baby,
      color: "from-pink-500 to-rose-600",
      bgColor: "bg-gradient-to-br from-pink-50 to-rose-50",
      borderColor: "border-pink-200",
      features: ["Планирование беременности", "Гормональный баланс", "Генетическая подготовка"],
      cta: "Планировать беременность"
    },
    {
      title: "Навигатор менопаузы",
      subtitle: "45-60 лет",
      icon: Zap,
      color: "from-orange-500 to-red-600",
      bgColor: "bg-gradient-to-br from-orange-50 to-red-50",
      borderColor: "border-orange-200",
      features: ["Гормональная поддержка", "Когнитивное здоровье", "Метаболическая адаптация"],
      cta: "Получить поддержку"
    },
    {
      title: "Управление хроническими заболеваниями",
      subtitle: "Любой возраст",
      icon: Heart,
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-gradient-to-br from-emerald-50 to-teal-50",
      borderColor: "border-emerald-200",
      features: ["Мониторинг здоровья", "Связь с врачами", "Управление рисками"],
      cta: "Подключить врача"
    }
  ];

  return (
    <section className="py-20 px-4 md:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Кому подходит PREVENT?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Мы создали платформу для женщин на разных этапах жизни, 
            каждый из которых требует особого подхода к здоровью
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {segments.map((segment, index) => {
            const IconComponent = segment.icon;
            return (
              <Card key={index} className={`${segment.bgColor} ${segment.borderColor} hover:shadow-xl transition-all duration-300 hover:scale-105`}>
                <CardHeader className="pb-4">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-full bg-gradient-to-r ${segment.color}`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                        {segment.title}
                      </CardTitle>
                      <Badge variant="secondary" className="mb-3">
                        {segment.subtitle}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-4">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {segment.features.map((feature, featureIndex) => (
                      <Badge key={featureIndex} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button 
                    className={`w-full bg-gradient-to-r ${segment.color} hover:opacity-90 transition-opacity`}
                    onClick={() => navigate('/auth')}
                  >
                    {segment.cta}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-none">
            <CardContent className="py-12">
              <h3 className="text-2xl font-bold mb-4">
                Готовы начать свой путь к здоровью?
              </h3>
              <p className="text-lg mb-8 opacity-90">
                Присоединяйтесь к тысячам женщин, которые уже управляют своими рисками здоровья
              </p>
              <Button 
                size="lg" 
                variant="secondary" 
                className="text-purple-600 hover:text-purple-700"
                onClick={() => navigate('/auth')}
              >
                Начать бесплатно
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TargetSegments;
