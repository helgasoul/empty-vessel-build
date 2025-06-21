import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Sun, Moon, Coffee, Sunset } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from 'react-router-dom';
import EnhancedTodayGoals from './EnhancedTodayGoals';

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
    const userName = user?.user_metadata?.full_name || user?.name || 'пользователь';
    
    switch (timeOfDay) {
      case 'morning':
        return {
          greeting: `Доброе утро, ${userName}!`,
          message: 'Начните день с заботы о своем здоровье',
          icon: Sun,
          gradient: 'from-feminine-peach-300 to-feminine-pink-300',
          bgGradient: 'from-feminine-peach-50 to-feminine-pink-50',
        };
      case 'afternoon':
        return {
          greeting: `Добрый день, ${userName}!`,
          message: 'Как дела с вашими целями сегодня?',
          icon: Coffee,
          gradient: 'from-feminine-lavender-300 to-feminine-pink-300',
          bgGradient: 'from-feminine-lavender-50 to-feminine-pink-50',
        };
      case 'evening':
        return {
          greeting: `Добрый вечер, ${userName}!`,
          message: 'Время подвести итоги дня',
          icon: Sunset,
          gradient: 'from-feminine-pink-400 to-feminine-peach-400',
          bgGradient: 'from-feminine-pink-50 to-feminine-peach-50',
        };
      default:
        return {
          greeting: `Добро пожаловать, ${userName}!`,
          message: 'Поздно, но здоровье важно в любое время',
          icon: Moon,
          gradient: 'from-feminine-lavender-400 to-feminine-lavender-300',
          bgGradient: 'from-feminine-lavender-50 to-feminine-lavender-100',
        };
    }
  };

  const { greeting, message, icon: Icon, gradient, bgGradient } = getGreeting();

  const quickTips = [
    'Не забудьте выпить стакан воды',
    'Сделайте 5-минутную разминку',
    'Проверьте свои цели на сегодня',
    'Запишите настроение в дневник',
    'Примите витамины',
    'Прогуляйтесь на свежем воздухе',
    'Сделайте дыхательное упражнение',
    'Запланируйте здоровый перекус'
  ];

  const randomTip = quickTips[Math.floor(Math.random() * quickTips.length)];

  return (
    <div className="space-y-6">
      <Card className={`prevent-card-soft bg-gradient-to-r ${bgGradient} border-0 overflow-hidden relative shadow-lg hover:shadow-xl transition-shadow duration-300`}>
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          <div className={`w-full h-full bg-gradient-to-br ${gradient} rounded-full transform translate-x-8 -translate-y-8`} />
        </div>
        
        <CardContent className="p-6 relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${gradient} flex items-center justify-center shadow-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-montserrat font-bold text-gray-800">
                  {greeting}
                </h2>
                <p className="text-gray-600 font-roboto">
                  {message}
                </p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-feminine-pink-400" />
              <span className="text-sm font-medium text-gray-700">
                Ваш персональный помощник
              </span>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/60 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium font-montserrat text-gray-800 mb-1">
                  💡 Совет дня
                </h3>
                <p className="text-sm text-gray-700 font-roboto">
                  {randomTip}
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="prevent-button-soft bg-white/80 hover:bg-white border-white/60 hover:border-white transition-all shadow-sm hover:shadow-md"
              >
                Выполнено
              </Button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="prevent-button-soft bg-gradient-to-r from-feminine-lavender-200 to-feminine-pink-200 hover:from-feminine-lavender-300 hover:to-feminine-pink-300 text-gray-700 border border-feminine-lavender-200 font-medium transition-all duration-200 hover:shadow-md"
              onClick={() => navigate('/risk-assessment')}
            >
              Быстрая оценка рисков
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="prevent-button-soft bg-gradient-to-r from-feminine-pink-200 to-feminine-peach-200 hover:from-feminine-pink-300 hover:to-feminine-peach-300 text-gray-700 border border-feminine-pink-200 font-medium transition-all duration-200 hover:shadow-md"
              onClick={() => navigate('/womens-health?tab=symptoms')}
            >
              Записать симптомы
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="prevent-button-soft bg-gradient-to-r from-feminine-peach-200 to-feminine-lavender-200 hover:from-feminine-peach-300 hover:to-feminine-lavender-300 text-gray-700 border border-feminine-peach-200 font-medium transition-all duration-200 hover:shadow-md"
              onClick={() => navigate('/health-analytics')}
            >
              Посмотреть статистику
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="prevent-button-soft bg-gradient-to-r from-feminine-lavender-200 to-feminine-peach-200 hover:from-feminine-lavender-300 hover:to-feminine-peach-300 text-gray-700 border border-feminine-lavender-200 font-medium transition-all duration-200 hover:shadow-md"
              onClick={() => navigate('/environmental-health')}
            >
              Экологическое здоровье
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Улучшенные цели на сегодня */}
      <EnhancedTodayGoals />
    </div>
  );
};

export default PersonalizedWelcome;
