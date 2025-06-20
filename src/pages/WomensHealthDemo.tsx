import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Calendar, Baby, Flower, ArrowRight, TrendingUp, Activity } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import BackButton from '@/components/ui/back-button';

const WomensHealthDemo = () => {
  const navigate = useNavigate();

  const healthAreas = [
    {
      title: "Менструальный цикл",
      description: "Отслеживание и анализ цикла",
      expandedDescription: "Персонализированное отслеживание менструального цикла с прогнозированием и выявлением паттернов для улучшения женского здоровья",
      icon: Calendar,
      color: "from-rose-500 to-pink-500",
      bgColor: "from-rose-50 to-pink-50",
      borderColor: "border-rose-200",
      textColor: "text-rose-700",
      buttonAction: "Начать отслеживать",
      value: "Точные прогнозы и здоровые циклы",
      route: "/menstrual-cycle-tracker"
    },
    {
      title: "Планирование беременности",
      description: "Подготовка к материнству",
      expandedDescription: "Комплексная подготовка к беременности с оптимизацией фертильности, планированием витаминов и мониторингом готовности организма",
      icon: Baby,
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-700",
      buttonAction: "Начать планирование",
      value: "Повышение шансов на здоровую беременность",
      route: "/auth"
    },
    {
      title: "Гормональное здоровье",
      description: "Мониторинг гормонального баланса",
      expandedDescription: "Отслеживание гормональных показателей, выявление дисбаланса и персонализированные рекомендации для гормональной гармонии",
      icon: Heart,
      color: "from-purple-500 to-violet-500",
      bgColor: "from-purple-50 to-violet-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-700",
      buttonAction: "Проверить баланс",
      value: "Гормональная гармония и энергия",
      route: "/auth"
    },
    {
      title: "Менопауза",
      description: "Поддержка в переходный период",
      expandedDescription: "Комфортное прохождение менопаузы с персонализированными рекомендациями, отслеживанием симптомов и поддержкой здоровья",
      icon: Flower,
      color: "from-amber-500 to-orange-500",
      bgColor: "from-amber-50 to-orange-50",
      borderColor: "border-amber-200",
      textColor: "text-amber-700",
      buttonAction: "Получить поддержку",
      value: "Комфортный переход и активная жизнь",
      route: "/auth"
    }
  ];

  const handleAreaAction = (area: typeof healthAreas[0]) => {
    navigate(area.route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <BackButton className="mb-6" />
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            Женское здоровье
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Комплексный подход к заботе о женском здоровье на всех этапах жизни с персонализированными решениями и научным подходом
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
          {healthAreas.map((area, index) => {
            const IconComponent = area.icon;
            return (
              <Card 
                key={index} 
                className={`group hover:shadow-xl transition-all duration-300 hover:scale-[1.03] ${area.borderColor} border-2 bg-white overflow-hidden hover:-translate-y-1`}
              >
                <CardHeader className={`bg-gradient-to-r ${area.bgColor} pb-6 relative`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-4 rounded-full bg-gradient-to-r ${area.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <Badge className={`${area.textColor} bg-white/80 border-current`}>
                      Доступно
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <CardTitle className={`text-2xl font-bold ${area.textColor} group-hover:text-opacity-80 transition-colors`}>
                      {area.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 text-base leading-relaxed">
                      {area.expandedDescription}
                    </CardDescription>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-3 rounded-lg">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-medium">{area.value}</span>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <Button 
                      className={`w-full bg-gradient-to-r ${area.color} hover:opacity-90 text-white font-semibold py-3 group-hover:shadow-lg transition-all duration-300`}
                      onClick={() => handleAreaAction(area)}
                    >
                      <Activity className="w-4 h-4 mr-2" />
                      {area.buttonAction}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className={`w-full ${area.textColor} ${area.borderColor} hover:bg-opacity-10 transition-colors`}
                      onClick={() => navigate('/womens-health')}
                    >
                      Подробнее
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Дополнительная информация о преимуществах */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-lg border border-purple-100">
            <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Научный подход</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Все рекомендации основаны на последних научных исследованиях и международных стандартах
            </p>
          </div>
          
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-lg border border-blue-100">
            <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Персонализация</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Индивидуальные рекомендации с учетом возраста, образа жизни и особенностей организма
            </p>
          </div>
          
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-lg border border-green-100">
            <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Комплексность</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Полный спектр решений для поддержания женского здоровья на каждом этапе жизни
            </p>
          </div>
        </div>

        <Card className="bg-gradient-to-r from-pink-600 to-purple-600 text-white border-none shadow-2xl">
          <CardContent className="py-12 text-center">
            <h3 className="text-3xl font-bold mb-4">
              Присоединяйтесь к PREVENT
            </h3>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
              Получите персонализированные рекомендации и профессиональную поддержку в заботе о своем здоровье на каждом этапе жизни
            </p>
            <Button 
              size="lg" 
              variant="secondary" 
              className="text-pink-600 hover:text-pink-700 font-semibold px-8 py-4 text-lg hover:scale-105 transition-all duration-300 shadow-lg"
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
