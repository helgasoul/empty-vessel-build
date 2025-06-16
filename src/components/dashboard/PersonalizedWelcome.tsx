
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Sun, Moon, Coffee, Sunset } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from 'react-router-dom';

const PersonalizedWelcome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 6) return 'night';
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    if (hour < 22) return 'evening';
    return 'night';
  };

  const getGreeting = () => {
    const timeOfDay = getTimeOfDay();
    const userName = user?.user_metadata?.full_name || 'пользователь';
    
    switch (timeOfDay) {
      case 'morning':
        return {
          greeting: `Доброе утро, ${userName}!`,
          message: 'Начните день с заботы о своем здоровье',
          icon: Sun,
          gradient: 'from-yellow-400 to-orange-500',
          bgGradient: 'from-yellow-50 to-orange-50',
        };
      case 'afternoon':
        return {
          greeting: `Добрый день, ${userName}!`,
          message: 'Как дела с вашими целями сегодня?',
          icon: Coffee,
          gradient: 'from-blue-400 to-cyan-500',
          bgGradient: 'from-blue-50 to-cyan-50',
        };
      case 'evening':
        return {
          greeting: `Добрый вечер, ${userName}!`,
          message: 'Время подвести итоги дня',
          icon: Sunset,
          gradient: 'from-orange-400 to-pink-500',
          bgGradient: 'from-orange-50 to-pink-50',
        };
      default:
        return {
          greeting: `Добро пожаловать, ${userName}!`,
          message: 'Поздно, но здоровье важно в любое время',
          icon: Moon,
          gradient: 'from-purple-400 to-indigo-500',
          bgGradient: 'from-purple-50 to-indigo-50',
        };
    }
  };

  const { greeting, message, icon: Icon, gradient, bgGradient } = getGreeting();

  const quickTips = [
    'Не забудьте выпить стакан воды',
    'Сделайте 5-минутную разминку',
    'Проверьте свои цели на сегодня',
    'Запишите настроение в дневник',
  ];

  const randomTip = quickTips[Math.floor(Math.random() * quickTips.length)];

  return (
    <Card className={`prevent-card bg-gradient-to-r ${bgGradient} border-0 overflow-hidden relative`}>
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <div className={`w-full h-full bg-gradient-to-br ${gradient} rounded-full transform translate-x-8 -translate-y-8`} />
      </div>
      
      <CardContent className="p-6 relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${gradient} flex items-center justify-center shadow-lg`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-montserrat font-bold text-gray-900">
                {greeting}
              </h2>
              <p className="text-gray-600 font-roboto">
                {message}
              </p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">
              Ваш персональный помощник
            </span>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium font-montserrat text-gray-900 mb-1">
                💡 Совет дня
              </h3>
              <p className="text-sm text-gray-700 font-roboto">
                {randomTip}
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-white/80 hover:bg-white border-white/50 hover:border-white transition-all"
            >
              Выполнено
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="bg-blue-500 hover:bg-blue-600 text-white border border-blue-600 font-medium transition-all duration-200 hover:shadow-md"
            onClick={() => navigate('/risk-assessment')}
          >
            Быстрая оценка рисков
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="bg-green-500 hover:bg-green-600 text-white border border-green-600 font-medium transition-all duration-200 hover:shadow-md"
            onClick={() => navigate('/womens-health')}
          >
            Записать симптомы
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="bg-purple-500 hover:bg-purple-600 text-white border border-purple-600 font-medium transition-all duration-200 hover:shadow-md"
            onClick={() => navigate('/health-analytics')}
          >
            Посмотреть статистику
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalizedWelcome;
