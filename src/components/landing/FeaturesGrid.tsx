
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
import { useNavigationHelper } from './shared/NavigationHelper';

const FeaturesGrid = () => {
  const { handleButtonClick } = useNavigationHelper();

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
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* How it works */}
        <div className="text-center mb-12 sm:mb-16">
          <Badge className="bg-purple-100 text-purple-800 mb-4 sm:mb-6 text-xs sm:text-sm">
            🚀 Простой процесс
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
            Как работает PREVENT?
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            От первичной оценки до постоянного мониторинга — полный цикл заботы о вашем здоровье
          </p>
        </div>

        {/* Journey Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-20">
          {journeySteps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <Card 
                key={index} 
                className={`${step.bgColor} border-none hover:shadow-lg transition-all duration-300 hover:scale-105 relative group w-full`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-xl sm:text-2xl">{step.step}</span>
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                      <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                    {step.title}
                  </CardTitle>
                  <Badge variant="secondary" className="w-fit text-xs">
                    {step.subtitle}
                  </Badge>
                  <CardDescription className="text-gray-700 text-sm mt-2">
                    {step.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-2 mb-4">
                    {step.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-xs text-gray-600 leading-relaxed">{detail}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    className={`w-full bg-gradient-to-r ${step.color} hover:opacity-90 text-white font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 text-sm`}
                    onClick={handleButtonClick(step.title, step.targetPath)}
                    aria-label={`${step.buttonText} - ${step.title}`}
                  >
                    {step.buttonText}
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
                  </Button>
                </CardContent>

                {/* Arrow for desktop */}
                {index < journeySteps.length - 1 && (
                  <div className="hidden xl:block absolute -right-4 top-1/2 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 text-gray-300" />
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* What you get */}
        <div className="text-center mb-8 sm:mb-12">
          <Badge className="bg-green-100 text-green-800 mb-4 sm:mb-6 text-xs sm:text-sm">
            ✅ Что вы получите
          </Badge>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
            Полный спектр заботы о здоровье
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {benefits.map((benefit, index) => (
            <Card key={index} className="bg-white hover:shadow-md transition-shadow border-green-100 w-full">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-800 font-medium text-sm sm:text-base leading-relaxed break-words">{benefit}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
