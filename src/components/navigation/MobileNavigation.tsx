
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
  Calendar
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const MobileNavigation = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const navigationItems = [
    { 
      title: 'Дашборд', 
      path: '/dashboard', 
      icon: Shield,
      description: 'Главная панель'
    },
    { 
      title: 'О нас', 
      path: '/about', 
      icon: Info,
      description: 'Миссия и команда'
    },
    { 
      title: 'Оценка рисков', 
      path: '/risk-assessment', 
      icon: Activity,
      description: 'Анализ здоровья'
    },
    { 
      title: 'Женское здоровье', 
      path: '/womens-health', 
      icon: Users,
      description: 'Специализированные инструменты'
    },
    { 
      title: 'Лекарства', 
      path: '/medications', 
      icon: Pill,
      description: 'Управление приемом лекарств'
    },
    { 
      title: 'Медицинский календарь', 
      path: '/medical-calendar', 
      icon: Calendar,
      description: 'Планирование визитов'
    },
    { 
      title: 'ИИ-помощник', 
      path: '/ai-health', 
      icon: Brain,
      description: 'Умные рекомендации'
    },
    { 
      title: 'Интеграции', 
      path: '/external-integrations', 
      icon: Smartphone,
      description: 'Подключение устройств'
    },
    { 
      title: 'Медицинские услуги', 
      path: '/medical-integrations', 
      icon: Stethoscope,
      description: 'Записи и консультации'
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
      title: 'Геймификация', 
      path: '/gamification', 
      icon: Trophy,
      description: 'Достижения и мотивация'
    },
    { 
      title: 'Сообщество', 
      path: '/community', 
      icon: Users,
      description: 'Общение и поддержка'
    }
  ];

  const handleNavigate = (path: string) => {
    console.log('MobileNavigation: переход к', path); // Для отладки
    navigate(path);
    setOpen(false);
  };

  if (!user) return null;

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
          
          <div className="p-6 space-y-2">
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                className="w-full justify-start h-auto p-4 text-left hover:bg-primary/5"
                onClick={() => handleNavigate(item.path)}
              >
                <div className="flex items-center space-x-3">
                  <div className="prevent-icon-container bg-primary/10 w-10 h-10 shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-gray-900">{item.title}</div>
                    <div className="text-sm text-gray-500 truncate">{item.description}</div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export { MobileNavigation };
