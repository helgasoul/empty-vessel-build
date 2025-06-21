
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Heart, 
  Baby, 
  Flower2, 
  ArrowRight,
  Activity,
  CheckCircle
} from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigationHelper } from './shared/NavigationHelper';

const InteractiveFeaturesGrid = () => {
  const { user } = useAuth();
  const { handleButtonClick } = useNavigationHelper();

  // Универсальная функция для отладки кликов
  const debugButtonClick = (buttonName: string, targetPath: string, authRequired: boolean = false) => {
    return () => {
      console.log(`🔥 Кнопка "${buttonName}" нажата`);
      console.log(`📍 Переход на: ${targetPath}`);
      console.log(`🔒 Требует авторизации: ${authRequired}`);
      
      if (authRequired && !user) {
        console.log('👤 Пользователь не авторизован, переход на страницу входа');
        handleButtonClick(buttonName, '/auth')();
      } else {
        handleButtonClick(buttonName, targetPath)();
      }
    };
  };

  const features = [
    {
      title: "Цикл и фертильность",
      description: "Отслеживание менструального цикла и планирование беременности",
      icon: Calendar,
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
      borderColor: "border-blue-200",
      buttonText: "Начать отслеживать",
      buttonColor: "bg-blue-500 hover:bg-blue-600",
      targetPath: "/menstrual-cycle-tracker",
      authRequired: true,
      benefits: ["Точный календарь цикла", "Прогноз овуляции", "Планирование беременности"]
    },
    {
      title: "Гормональный баланс",
      description: "Мониторинг и коррекция гормонального здоровья",
      icon: Activity,
      color: "from-purple-500 to-indigo-600",
      bgColor: "bg-gradient-to-br from-purple-50 to-indigo-50",
      borderColor: "border-purple-200",
      buttonText: "Проверить баланс",
      buttonColor: "bg-purple-500 hover:bg-purple-600",
      targetPath: "/hormonal-health-demo",
      authRequired: false,
      benefits: ["Анализ гормонов", "Персональные рекомендации", "Отслеживание изменений"]
    },
    {
      title: "Планирование беременности",
      description: "Подготовка к зачатию и здоровая беременность",
      icon: Baby,
      color: "from-pink-500 to-rose-600",
      bgColor: "bg-gradient-to-br from-pink-50 to-rose-50",
      borderColor: "border-pink-200",
      buttonText: "Начать планирование",
      buttonColor: "bg-pink-500 hover:bg-pink-600",
      targetPath: "/pregnancy-planning",
      authRequired: true,
      benefits: ["Подготовка к зачатию", "Витамины и питание", "Медицинские обследования"]
    },
    {
      title: "Навигация менопаузы",
      description: "Поддержка и облегчение симптомов в переходный период",
      icon: Flower2,
      color: "from-orange-500 to-amber-600",
      bgColor: "bg-gradient-to-br from-orange-50 to-amber-50",
      borderColor: "border-orange-200",
      buttonText: "Получить поддержку",
      buttonColor: "bg-orange-500 hover:bg-orange-600",
      targetPath: "/menopause-demo",
      authRequired: false,
      benefits: ["Облегчение симптомов", "Гормональная терапия", "Образ жизни и питание"]
    }
  ];

  const generalBenefits = [
    "Персональная оценка рисков основных заболеваний",
    "План медицинских обследований на год",
    "Рекомендации по питанию и образу жизни",
    "Уведомления о важных профилактических мерах",
    "Связь с проверенными врачами при необходимости"
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <Badge className="bg-purple-100 text-purple-800 mb-4 sm:mb-6 text-xs sm:text-sm">
            🌸 Женское здоровье на каждом этапе
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
            Персонализированная забота о здоровье
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Комплексные решения для мониторинга и поддержания женского здоровья с использованием современных технологий
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={index} 
                className={`${feature.bgColor} ${feature.borderColor} hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group w-full`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 sm:p-3 rounded-full bg-gradient-to-r ${feature.color} relative group-hover:scale-110 transition-transform duration-200 flex-shrink-0`}>
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 mb-2 break-words">
                        {feature.title}
                      </CardTitle>
                      <CardDescription className="text-gray-700 text-sm sm:text-base leading-relaxed break-words">
                        {feature.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-4">
                  <div className="space-y-3 mb-6">
                    <h4 className="font-semibold text-gray-900 text-sm">Возможности:</h4>
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-start space-x-2">
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                        <span className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed break-words">{benefit}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-3">
                    <Button 
                      className={`w-full ${feature.buttonColor} text-white font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105 text-sm`}
                      onClick={debugButtonClick(feature.buttonText, feature.targetPath, feature.authRequired)}
                      aria-label={`${feature.buttonText} - ${feature.title}`}
                    >
                      {feature.buttonText}
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2" aria-hidden="true" />
                    </Button>
                    
                    {feature.authRequired && !user && (
                      <p className="text-xs text-gray-600 text-center leading-relaxed">
                        💡 Требуется регистрация для полного доступа
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* General Benefits */}
        <div className="text-center mb-8 sm:mb-12">
          <Badge className="bg-green-100 text-green-800 mb-4 sm:mb-6 text-xs sm:text-sm">
            ✅ Что вы получите
          </Badge>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
            Полный спектр заботы о здоровье
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {generalBenefits.map((benefit, index) => (
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

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none shadow-2xl w-full">
            <CardContent className="py-8 sm:py-12 px-4 sm:px-6">
              <h3 className="text-xl sm:text-2xl font-bold mb-4">
                Начните заботиться о своем здоровье сегодня
              </h3>
              <p className="text-base sm:text-lg mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
                Присоединяйтесь к тысячам женщин, которые уже управляют своими рисками здоровья с помощью PREVENT
              </p>
              <Button 
                size="lg" 
                variant="secondary" 
                className="text-purple-600 hover:text-purple-700 font-semibold hover:scale-105 transition-all duration-200 text-sm sm:text-base"
                onClick={debugButtonClick('Начать путешествие', '/auth', false)}
                aria-label="Начать персональную программу здоровья"
              >
                {user ? "Перейти в личный кабинет" : "Начать бесплатно"}
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 ml-2" aria-hidden="true" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default InteractiveFeaturesGrid;
