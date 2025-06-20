
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Baby, Zap, Heart, ArrowRight, Shield, ExternalLink } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const TargetSegments = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    console.log('Navigating to auth page...');
    navigate('/auth');
  };

  const segments = [
    {
      title: "Осознанная забота",
      subtitle: "30-45 лет",
      icon: Brain,
      emoji: "🧠",
      color: "from-purple-400 to-indigo-500",
      bgColor: "bg-gradient-to-br from-purple-50 to-indigo-50",
      borderColor: "border-purple-200",
      description: "Хочу знать свои риски и действовать заранее",
      features: ["Оценка рисков рака груди", "Сердечно-сосудистые риски", "Профилактика диабета"],
      cta: "Узнать свои риски",
      demoPath: "/risk-assessment-demo"
    },
    {
      title: "Планирую стать мамой",
      subtitle: "Подготовка к материнству",
      icon: Baby,
      emoji: "💝",
      color: "from-pink-400 to-rose-500",
      bgColor: "bg-gradient-to-br from-pink-50 to-rose-50",
      borderColor: "border-pink-200",
      description: "Готовлюсь к беременности и думаю о будущем",
      features: ["Подготовка к зачатию", "Генетические риски", "Фертильность"],
      cta: "Подготовиться к беременности",
      demoPath: "/womens-health-demo"
    },
    {
      title: "Навигирую менопаузу",
      subtitle: "45-60 лет",
      icon: Zap,
      emoji: "🌸",
      color: "from-orange-400 to-amber-500",
      bgColor: "bg-gradient-to-br from-orange-50 to-amber-50",
      borderColor: "border-orange-200",
      description: "Хочу комфортно пройти этот период",
      features: ["Гормональная поддержка", "Профилактика остеопороза", "Когнитивное здоровье"],
      cta: "Получить поддержку",
      demoPath: "/womens-health-demo"
    },
    {
      title: "Живу с хроническими состояниями",
      subtitle: "Любой возраст",
      icon: Heart,
      emoji: "💚",
      color: "from-emerald-400 to-teal-500",
      bgColor: "bg-gradient-to-br from-emerald-50 to-teal-50",
      borderColor: "border-emerald-200",
      description: "Контролирую здоровье и предотвращаю осложнения",
      features: ["Персональный мониторинг", "Связь с врачами", "Управление рисками"],
      cta: "Начать мониторинг",
      demoPath: "/environmental-health-demo"
    }
  ];

  return (
    <section className="py-20 px-4 md:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="bg-purple-100 text-purple-800 mb-6 hover:bg-purple-200 transition-colors duration-200">
            👥 Персонализированный подход
          </Badge>
          <h2 className="text-4xl font-bold bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent mb-6">
            Кому подходит PREVENT?
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Мы создали решения для женщин на разных этапах жизни, 
            каждый из которых требует особого подхода к заботе о здоровье
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {segments.map((segment, index) => {
            const IconComponent = segment.icon;
            return (
              <Card key={index} className={`${segment.bgColor} ${segment.borderColor} hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group`}>
                <CardHeader className="pb-4">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-full bg-gradient-to-r ${segment.color} relative group-hover:scale-110 transition-transform duration-200`}>
                      <IconComponent className="w-6 h-6 text-white" aria-hidden="true" />
                      <span className="absolute -top-1 -right-1 text-lg" role="img" aria-label="Emoji decoration">{segment.emoji}</span>
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                        {segment.title}
                      </CardTitle>
                      <Badge variant="secondary" className="mb-3 bg-white/80">
                        {segment.subtitle}
                      </Badge>
                      <CardDescription className="text-gray-800 text-base leading-relaxed font-medium">
                        "{segment.description}"
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-4">
                  <div className="space-y-3 mb-6">
                    <h4 className="font-semibold text-gray-900 text-sm">Что входит:</h4>
                    {segment.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <Shield className="w-3 h-3 text-green-600 flex-shrink-0" aria-hidden="true" />
                        <span className="text-sm text-gray-700 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-3">
                    <Button 
                      className={`w-full bg-gradient-to-r ${segment.color} hover:opacity-90 transition-all duration-200 hover:shadow-lg font-semibold`}
                      onClick={handleButtonClick}
                      aria-label={`${segment.cta} - начать использование PREVENT`}
                    >
                      {segment.cta}
                      <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full text-gray-700 border-gray-300 hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => navigate(segment.demoPath)}
                      aria-label={`Посмотреть демо для ${segment.title.toLowerCase()}`}
                    >
                      <ExternalLink className="w-3 h-3 mr-2" aria-hidden="true" />
                      Посмотреть демо
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none shadow-2xl">
            <CardContent className="py-12">
              <h3 className="text-2xl font-bold mb-4">
                Готовы узнать больше о своем здоровье?
              </h3>
              <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                Присоединяйтесь к тысячам женщин, которые уже управляют своими рисками здоровья
              </p>
              <Button 
                size="lg" 
                variant="secondary" 
                className="text-purple-600 hover:text-purple-700 font-semibold hover:scale-105 transition-all duration-200"
                onClick={handleButtonClick}
                aria-label="Начать персональную оценку рисков здоровья"
              >
                Пройти оценку рисков за 5 минут
                <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TargetSegments;
