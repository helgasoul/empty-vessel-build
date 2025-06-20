
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { 
  Menu,
  Star,
  User,
  Smartphone,
  Heart,
  Activity,
  Baby,
  TrendingUp,
  Calendar,
  Pill,
  Brain,
  Users,
  Video,
  Leaf,
  Trophy
} from "lucide-react";
import { useNavigate, useLocation } from 'react-router-dom';

const NavigationDropdown = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationSections = [
    {
      label: "Избранное",
      items: [
        { 
          title: 'Женское здоровье', 
          path: '/womens-health', 
          icon: Heart,
          description: 'Комплексный мониторинг'
        },
        { 
          title: 'Оценка рисков', 
          path: '/risk-assessment', 
          icon: TrendingUp,
          description: 'Анализ здоровья'
        },
        { 
          title: 'ИИ-помощник', 
          path: '/ai-health', 
          icon: Brain,
          description: 'Умные рекомендации'
        }
      ]
    },
    {
      label: "Профиль и настройки",
      items: [
        { 
          title: 'Мой профиль', 
          path: '/profile', 
          icon: User,
          description: 'Личные данные и настройки'
        },
        { 
          title: 'Интеграции данных', 
          path: '/medical-integrations', 
          icon: Smartphone,
          description: 'Подключение устройств'
        }
      ]
    },
    {
      label: "Женское здоровье",
      items: [
        { 
          title: 'Женское здоровье', 
          path: '/womens-health', 
          icon: Heart,
          description: 'Комплексный мониторинг'
        },
        { 
          title: 'Цикл и фертильность', 
          path: '/menstrual-cycle-tracker', 
          icon: Activity,
          description: 'Отслеживание цикла',
          status: 'events'
        },
        { 
          title: 'Планирование беременности', 
          path: '/pregnancy-planning', 
          icon: Baby,
          description: 'Подготовка к беременности'
        }
      ]
    },
    {
      label: "Контроль и планирование",
      items: [
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
        }
      ]
    },
    {
      label: "Дополнительные инструменты",
      items: [
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
      ]
    }
  ];

  const handleNavigate = (path: string) => {
    console.log('NavigationDropdown: переход к', path);
    navigate(path);
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="hover:bg-purple-100/50 transition-colors"
          title="Навигация по разделам"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-80 max-h-[80vh] overflow-y-auto bg-white border border-purple-200/50 shadow-xl rounded-xl"
        align="end"
        sideOffset={8}
      >
        {navigationSections.map((section, sectionIndex) => (
          <div key={section.label}>
            <DropdownMenuLabel className="text-sm font-semibold text-gray-700 px-3 py-2">
              {section.label}
            </DropdownMenuLabel>
            
            {section.items.map((item) => (
              <DropdownMenuItem
                key={item.path}
                className={`px-3 py-3 cursor-pointer transition-colors ${
                  isActive(item.path) 
                    ? 'bg-purple-50 text-purple-700' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleNavigate(item.path)}
              >
                <div className="flex items-center space-x-3 w-full">
                  <div className="prevent-icon-container bg-primary/10 w-8 h-8 shrink-0">
                    <item.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm">{item.title}</div>
                    <div className="text-xs text-gray-500 truncate">{item.description}</div>
                  </div>
                  {getStatusBadge(item.status)}
                </div>
              </DropdownMenuItem>
            ))}
            
            {sectionIndex < navigationSections.length - 1 && (
              <DropdownMenuSeparator className="my-2" />
            )}
          </div>
        ))}
        
        <DropdownMenuSeparator className="my-2" />
        
        {/* Быстрые действия */}
        <div className="px-3 py-2">
          <div className="text-xs text-gray-500 mb-2">Быстрые действия</div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="justify-start h-8 text-xs"
              onClick={() => handleNavigate('/risk-assessment')}
            >
              <TrendingUp className="w-3 h-3 mr-1" />
              Оценка рисков
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="justify-start h-8 text-xs"
              onClick={() => handleNavigate('/womens-health?tab=symptoms')}
            >
              <Heart className="w-3 h-3 mr-1" />
              Симптомы
            </Button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavigationDropdown;
