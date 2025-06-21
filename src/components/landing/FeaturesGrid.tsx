
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ClipboardList, 
  Smartphone, 
  Brain, 
  Calendar, 
  TrendingUp,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { useNavigate } from 'react-router-dom';

const FeaturesGrid = () => {
  const navigate = useNavigate();

  // Функция для обработки кликов по кнопкам с отладкой
  const handleButtonClick = (stepName: string, targetPath: string) => {
    return () => {
      console.log(`🔥 Шаг "${stepName}" - кнопка нажата`);
      console.log(`📍 Переход на: ${targetPath}`);
      
      try {
        navigate(targetPath);
        console.log(`✅ Навигация успешна к ${targetPath}`);
      } catch (error) {
        console.error(`❌ Ошибка навигации:`, error);
        // Fallback для опубликованных сайтов
        window.location.href = targetPath;
      }
    };
  };

  const journeySteps = [
    {
      step: "1️⃣",
      title: "Расскажите о себе",
      subtitle: "5 минут",
      description: "Анкета здоровья + семейная история",
      icon: ClipboardList,
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-50",
      details: ["Базовые показатели здоровья", "История семьи", "Текущий образ жизни"],
      buttonText: "Заполнить анкету",
      targetPath: "/auth"
    },
    {
      step: "2️⃣",
      title: "Подключите данные",
      subtitle: "Опционально",
      description: "Apple Health, анализы, генетика",
      icon: Smartphone,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      details: ["Данные фитнес-трекеров", "Результаты анализов", "Генетические тесты"],
      buttonText: "Интеграции",
      targetPath: "/medical-integrations"
    },
    {
      step: "3️⃣",
      title: "Получите анализ рисков",
      subtitle: "Мгновенно",
      description: "ИИ оценивает риски рака, сердца, диабета",
      icon: Brain,
      color: "from-purple-500 to-indigo-600",
      bgColor: "bg-purple-50",
      details: ["Персональная оценка рисков", "Научно-обоснованные алгоритмы", "Понятные объяснения"],
      buttonText: "Демо анализа",
      targetPath: "/risk-assessment-demo"
    },
    {
      step: "4️⃣",
      title: "Следуйте персональному плану",
      subtitle: "Конкретные шаги",
      description: "Анализы, образ жизни, профилактика",
      icon: Calendar,
      color: "from-orange-500 to-red-600",
      bgColor: "bg-orange-50",
      details: ["План медицинских обследований", "Рекомендации по питанию", "Профилактические меры"],
      buttonText: "Персональный план",
      targetPath: "/personal-plan"
    },
    {
      step: "5️⃣",
      title: "Отслеживайте прогресс",
      subtitle: "Регулярно",
      description: "Видите, как снижаются ваши риски",
      icon: TrendingUp,
      color: "from-teal-500 to-blue-600",
      bgColor: "bg-teal-50",
      details: ["Динамика показателей", "Отчеты о прогрессе", "Мотивация и поддержка"],
      buttonText: "Посмотреть прогресс",
      targetPath: "/auth"
    }
  ];

  const benefits = [
    "Персональная оценка рисков основных заболеваний",
    "План медицинских обследований на год",
    "Рекомендации по питанию и образу жизни",
    "Уведомления о важных профилактических мерах",
    "Связь с проверенными врачами при необходимости"
  ];

  return (
    <section className="py-20 px-4 md:px-6 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* How it works */}
        <div className="text-center mb-16">
          <Badge className="bg-purple-100 text-purple-800 mb-6">
            🚀 Простой процесс
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Как работает PREVENT?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            От первичной оценки до постоянного мониторинга — полный цикл заботы о вашем здоровье
          </p>
        </div>

        {/* Journey Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {journeySteps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <Card key={index} className={`${step.bgColor} border-none hover:shadow-lg transition-all duration-300 hover:scale-105 relative group`}>
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-2xl">{step.step}</span>
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-900 leading-tight">
                    {step.title}
                  </CardTitle>
                  <Badge variant="secondary" className="w-fit">
                    {step.subtitle}
                  </Badge>
                  <CardDescription className="text-gray-700 text-sm mt-2">
                    {step.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {step.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                        <span className="text-xs text-gray-600">{detail}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    className={`w-full bg-gradient-to-r ${step.color} hover:opacity-90 text-white font-medium transition-all duration-200 hover:shadow-lg hover:scale-105`}
                    onClick={handleButtonClick(step.title, step.targetPath)}
                    aria-label={`${step.buttonText} - ${step.title}`}
                  >
                    {step.buttonText}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>

                {/* Arrow for desktop */}
                {index < journeySteps.length - 1 && (
                  <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-gray-300" />
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* What you get */}
        <div className="text-center mb-12">
          <Badge className="bg-green-100 text-green-800 mb-6">
            ✅ Что вы получите
          </Badge>
          <h3 className="text-3xl font-bold text-gray-900 mb-8">
            Полный спектр заботы о здоровье
          </h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {benefits.map((benefit, index) => (
            <Card key={index} className="bg-white hover:shadow-md transition-shadow border-green-100">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-800 font-medium">{benefit}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Process Flow Visualization for Mobile */}
        <div className="lg:hidden">
          <h4 className="text-xl font-bold text-center text-gray-900 mb-8">
            Ваш путь к здоровью
          </h4>
          <div className="space-y-4">
            {journeySteps.map((step, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className={`w-12 h-12 ${step.color.replace('from-', 'bg-').replace(' to-', '-').replace('-600', '-500').replace('-500', '')} rounded-full flex items-center justify-center shadow-md`}>
                  <step.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <span className="text-base font-medium text-gray-800">{step.title}</span>
                  <p className="text-sm text-gray-600">{step.description}</p>
                  <Button 
                    size="sm"
                    className="mt-2 text-xs"
                    onClick={handleButtonClick(step.title, step.targetPath)}
                  >
                    {step.buttonText}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
