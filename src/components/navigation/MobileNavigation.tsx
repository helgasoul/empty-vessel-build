
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { 
  Menu, 
  Shield, 
  Activity, 
  Users, 
  Brain, 
  Smartphone, 
  Stethoscope, 
  Video, 
  Leaf, 
  Trophy,
  Info,
  Pill,
  Calendar,
  User,
  Heart,
  TrendingUp,
  Baby,
  Star
} from "lucide-react";
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Separator } from "@/components/ui/separator";

const MobileNavigation = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const navigationItems = [
    // Профиль и настройки
    { 
      title: 'Мой профиль', 
      path: '/profile', 
      icon: User,
      description: 'Личные данные и настройки',
      category: 'Профиль и настройки'
    },
    { 
      title: 'Интеграции данных', 
      path: '/medical-integrations', 
      icon: Smartphone,
      description: 'Подключение устройств',
      category: 'Профиль и настройки'
    },

    // Женское здоровье
    { 
      title: 'Женское здоровье', 
      path: '/womens-health', 
      icon: Heart,
      description: 'Комплексный мониторинг',
      category: 'Женское здоровье'
    },
    { 
      title: 'Цикл и фертильность', 
      path: '/menstrual-cycle-tracker', 
      icon: Activity,
      description: 'Отслеживание цикла',
      category: 'Женское здоровье',
      status: 'events'
    },
    { 
      title: 'Планирование беременности', 
      path: '/pregnancy-planning', 
      icon: Baby,
      description: 'Подготовка к беременности',
      category: 'Женское здоровье'
    },

    // Контроль и планирование
    { 
      title: 'Оценка рисков', 
      path: '/risk-assessment', 
      icon: TrendingUp,
      description: 'Анализ здоровья'
    },
    { 
      title: 'Медицинский календарь', 
      path: '/medical-calendar', 
      icon: Calendar,
      description: 'Планирование визитов',
      status: 'events'
    },
    { 
      title: 'Мои лекарства', 
      path: '/medications', 
      icon: Pill,
      description: 'Управление приемом',
      status: 'new'
    },

    // Дополнительные инструменты
    { 
      title: 'ИИ-помощник', 
      path: '/ai-health', 
      icon: Brain,
      description: 'Умные рекомендации'
    },
    { 
      title: 'Семейная история', 
      path: '/family-data', 
      icon: Users,
      description: 'Медицинские данные семьи'
    },
    { 
      title: 'Телемедицина', 
      path: '/telemedicine-integrations', 
      icon: Video,
      description: 'Онлайн консультации'
    },
    { 
      title: 'Экология здоровья', 
      path: '/environmental-health', 
      icon: Leaf,
      description: 'Влияние среды'
    },
    { 
      title: 'Достижения', 
      path: '/gamification', 
      icon: Trophy,
      description: 'Мотивация и прогресс'
    },
    { 
      title: 'Сообщество', 
      path: '/community', 
      icon: Users,
      description: 'Общение и поддержка'
    }
  ];

  const handleNavigate = (path: string) => {
    console.log('MobileNavigation: переход к', path);
    navigate(path);
    setOpen(false);
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-green-100 text-green-800 text-xs ml-auto">Новое</Badge>;
      case 'events':
        return <Badge className="bg-blue-100 text-blue-800 text-xs ml-auto">События</Badge>;
      case 'updated':
        return <Badge className="bg-orange-100 text-orange-800 text-xs ml-auto">Обновлено</Badge>;
      default:
        return null;
    }
  };

  const isActive = (path: string) => location.pathname === path;

  if (!user) return null;

  // Группировка элементов по категориям
  const profileItems = navigationItems.filter(item => item.category === 'Профиль и настройки');
  const womenHealthItems = navigationItems.filter(item => item.category === 'Женское здоровье');
  const controlItems = navigationItems.filter(item => !item.category);
  const additionalItems = navigationItems.filter(item => !item.category && !controlItems.includes(item));

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="hover:bg-primary/10">
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0">
          <div className="prevent-gradient-primary p-6 text-white">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-montserrat font-bold">PREVENT</h2>
                <p className="text-sm text-white/80 font-roboto">Навигация</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-120px)]">
            {/* Текущий этап */}
            <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-purple-700">
                  Планирование беременности
                </span>
              </div>
            </div>

            {/* Профиль и настройки */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Профиль и настройки</h3>
              <div className="space-y-2">
                {profileItems.map((item) => (
                  <Button
                    key={item.path}
                    variant={isActive(item.path) ? "default" : "ghost"}
                    className="w-full justify-start h-auto p-3"
                    onClick={() => handleNavigate(item.path)}
                  >
                    <div className="flex items-center space-x-3 w-full">
                      <div className="prevent-icon-container bg-primary/10 w-8 h-8 shrink-0">
                        <item.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1 text-left">
                        <div className="font-medium text-sm">{item.title}</div>
                        <div className="text-xs text-gray-500 truncate">{item.description}</div>
                      </div>
                      {getStatusBadge(item.status)}
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Женское здоровье */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Женское здоровье</h3>
              <div className="space-y-2">
                {womenHealthItems.map((item) => (
                  <Button
                    key={item.path}
                    variant={isActive(item.path) ? "default" : "ghost"}
                    className="w-full justify-start h-auto p-3"
                    onClick={() => handleNavigate(item.path)}
                  >
                    <div className="flex items-center space-x-3 w-full">
                      <div className="prevent-icon-container bg-primary/10 w-8 h-8 shrink-0">
                        <item.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1 text-left">
                        <div className="font-medium text-sm">{item.title}</div>
                        <div className="text-xs text-gray-500 truncate">{item.description}</div>
                      </div>
                      {getStatusBadge(item.status)}
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Контроль и планирование */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Контроль и планирование</h3>
              <div className="space-y-2">
                {controlItems.map((item) => (
                  <Button
                    key={item.path}
                    variant={isActive(item.path) ? "default" : "ghost"}
                    className="w-full justify-start h-auto p-3"
                    onClick={() => handleNavigate(item.path)}
                  >
                    <div className="flex items-center space-x-3 w-full">
                      <div className="prevent-icon-container bg-primary/10 w-8 h-8 shrink-0">
                        <item.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1 text-left">
                        <div className="font-medium text-sm">{item.title}</div>
                        <div className="text-xs text-gray-500 truncate">{item.description}</div>
                      </div>
                      {getStatusBadge(item.status)}
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Дополнительные инструменты */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Дополнительные инструменты</h3>
              <div className="space-y-2">
                {navigationItems.filter(item => 
                  !profileItems.includes(item) && 
                  !womenHealthItems.includes(item) && 
                  !controlItems.includes(item)
                ).map((item) => (
                  <Button
                    key={item.path}
                    variant={isActive(item.path) ? "default" : "ghost"}
                    className="w-full justify-start h-auto p-3"
                    onClick={() => handleNavigate(item.path)}
                  >
                    <div className="flex items-center space-x-3 w-full">
                      <div className="prevent-icon-container bg-primary/10 w-8 h-8 shrink-0">
                        <item.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1 text-left">
                        <div className="font-medium text-sm">{item.title}</div>
                        <div className="text-xs text-gray-500 truncate">{item.description}</div>
                      </div>
                      {getStatusBadge(item.status)}
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export { MobileNavigation };
