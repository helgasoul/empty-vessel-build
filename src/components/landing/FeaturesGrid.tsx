
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Activity, 
  Heart, 
  Bell, 
  BarChart3, 
  Users, 
  Smartphone,
  Calendar,
  Shield
} from "lucide-react";

const FeaturesGrid = () => {
  const featureMap = [
    {
      trigger: "Начало путешествия к себе",
      description: "Первые шаги к осознанному управлению здоровьем",
      icon: Bell,
      color: "from-red-500 to-pink-600",
      bgColor: "bg-red-50",
      items: ["Анкета здоровья", "Психологическая оценка", "Семейная история"]
    },
    {
      trigger: "Анкета + Подключение данных",
      description: "Apple Health, генетика, анализы",
      icon: Smartphone,
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-50",
      items: ["Apple Health", "Генетические тесты", "Лабораторные анализы"]
    },
    {
      trigger: "ИИ-оценка рисков",
      description: "Мультифакторная оценка здоровья",
      icon: Brain,
      color: "from-purple-500 to-indigo-600",
      bgColor: "bg-purple-50",
      items: ["Онкологические риски", "Сердечно-сосудистые", "Нейродегенеративные"]
    },
    {
      trigger: "План действий",
      description: "Чекапы, питание, сон, активность + конкретные шаги",
      icon: Calendar,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      items: ["Медицинские чекапы", "План питания", "Режим сна и активности"]
    },
    {
      trigger: "Поведенческая поддержка",
      description: "Нуджи, трекеры, уведомления, микро-контент",
      icon: Activity,
      color: "from-orange-500 to-red-600",
      bgColor: "bg-orange-50",
      items: ["Умные напоминания", "Трекинг привычек", "Образовательный контент"]
    },
    {
      trigger: "Мониторинг прогресса",
      description: "Динамика риска, сравнение до/после",
      icon: BarChart3,
      color: "from-teal-500 to-blue-600",
      bgColor: "bg-teal-50",
      items: ["Динамика показателей", "Сравнительная аналитика", "Достижения"]
    }
  ];

  return (
    <section className="py-20 px-4 md:px-6 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="bg-purple-100 text-purple-800 mb-6">
            🚀 Карта функций платформы
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Как работает PREVENT?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            От первичной оценки до постоянного мониторинга — полный цикл превентивной медицины
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureMap.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className={`${feature.bgColor} border-none hover:shadow-lg transition-all duration-300 hover:scale-105`}>
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-900 leading-tight">
                    {feature.trigger}
                  </CardTitle>
                  <CardDescription className="text-gray-700 text-sm">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-2">
                    {feature.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                        <span className="text-xs text-gray-600">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Process Flow */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-12">
            Ваш путь к здоровью
          </h3>
          
          <div className="relative">
            {/* Desktop Flow */}
            <div className="hidden lg:flex items-center justify-between">
              {[
                { icon: Bell, text: "Оценка", color: "bg-red-500" },
                { icon: Smartphone, text: "Данные", color: "bg-blue-500" },
                { icon: Brain, text: "ИИ-анализ", color: "bg-purple-500" },
                { icon: Calendar, text: "План", color: "bg-green-500" },
                { icon: BarChart3, text: "Мониторинг", color: "bg-teal-500" }
              ].map((step, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center shadow-lg`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <span className="mt-3 text-sm font-medium text-gray-700">{step.text}</span>
                  {index < 4 && (
                    <div className="absolute top-8 w-24 h-0.5 bg-gray-300" style={{left: `${(index + 1) * 20}%`}}></div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Flow */}
            <div className="lg:hidden space-y-4">
              {[
                { icon: Bell, text: "Первичная оценка рисков", color: "bg-red-500" },
                { icon: Smartphone, text: "Подключение ваших данных", color: "bg-blue-500" },
                { icon: Brain, text: "ИИ-анализ и прогноз", color: "bg-purple-500" },
                { icon: Calendar, text: "Персональный план действий", color: "bg-green-500" },
                { icon: BarChart3, text: "Постоянный мониторинг", color: "bg-teal-500" }
              ].map((step, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className={`w-12 h-12 ${step.color} rounded-full flex items-center justify-center shadow-md`}>
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-base font-medium text-gray-800">{step.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
