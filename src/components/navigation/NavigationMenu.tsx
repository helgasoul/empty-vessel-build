
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Star, 
  StarIcon,
  User,
  Heart,
  Calendar,
  Pill,
  Activity,
  Settings,
  Smartphone,
  TrendingUp,
  Users,
  Stethoscope,
  Video,
  Leaf,
  Trophy,
  Brain,
  Baby
} from "lucide-react";
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface NavigationItem {
  path: string;
  title: string;
  icon: React.ComponentType<any>;
  description: string;
  category: string;
  status?: 'new' | 'events' | 'updated';
  isFavorite?: boolean;
}

const NavigationMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<string[]>(['medical-calendar', 'medications']);

  const navigationItems: NavigationItem[] = [
    // Профиль и настройки
    {
      path: '/profile',
      title: 'Мой профиль',
      icon: User,
      description: 'Личные данные и настройки',
      category: 'Профиль и настройки'
    },
    {
      path: '/medical-integrations',
      title: 'Интеграции данных',
      icon: Smartphone,
      description: 'Подключение устройств и приложений',
      category: 'Профиль и настройки'
    },

    // Женское здоровье
    {
      path: '/womens-health',
      title: 'Женское здоровье',
      icon: Heart,
      description: 'Комплексный мониторинг здоровья',
      category: 'Женское здоровье'
    },
    {
      path: '/menstrual-cycle-tracker',
      title: 'Цикл и фертильность',
      icon: Activity,
      description: 'Отслеживание менструального цикла',
      category: 'Женское здоровье',
      status: 'events'
    },
    {
      path: '/pregnancy-planning',
      title: 'Планирование беременности',
      icon: Baby,
      description: 'Подготовка к беременности',
      category: 'Женское здоровье'
    },

    // Контроль и планирование
    {
      path: '/risk-assessment',
      title: 'Оценка рисков',
      icon: TrendingUp,
      description: 'Анализ здоровья и рисков',
      category: 'Контроль и планирование'
    },
    {
      path: '/medical-calendar',
      title: 'Медицинский календарь',
      icon: Calendar,
      description: 'Планирование визитов и процедур',
      category: 'Контроль и планирование',
      status: 'events',
      isFavorite: true
    },
    {
      path: '/medications',
      title: 'Мои лекарства',
      icon: Pill,
      description: 'Управление приемом лекарств',
      category: 'Контроль и планирование',
      status: 'new',
      isFavorite: true
    },

    // Дополнительные инструменты
    {
      path: '/ai-health',
      title: 'ИИ-помощник',
      icon: Brain,
      description: 'Умные рекомендации по здоровью',
      category: 'Дополнительные инструменты'
    },
    {
      path: '/family-data',
      title: 'Семейная история',
      icon: Users,
      description: 'Медицинские данные семьи',
      category: 'Дополнительные инструменты'
    },
    {
      path: '/telemedicine-integrations',
      title: 'Телемедицина',
      icon: Video,
      description: 'Онлайн консультации',
      category: 'Дополнительные инструменты'
    },
    {
      path: '/environmental-health',
      title: 'Экология здоровья',
      icon: Leaf,
      description: 'Влияние окружающей среды',
      category: 'Дополнительные инструменты'
    },
    {
      path: '/gamification',
      title: 'Достижения',
      icon: Trophy,
      description: 'Мотивация и прогресс',
      category: 'Дополнительные инструменты'
    },
    {
      path: '/community',
      title: 'Сообщество',
      icon: Users,
      description: 'Общение и поддержка',
      category: 'Дополнительные инструменты'
    }
  ];

  const filteredItems = navigationItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, NavigationItem[]>);

  const favoriteItems = filteredItems.filter(item => favorites.includes(item.path.replace('/', '')));

  const toggleFavorite = (path: string) => {
    const itemKey = path.replace('/', '');
    setFavorites(prev => 
      prev.includes(itemKey) 
        ? prev.filter(fav => fav !== itemKey)
        : [...prev, itemKey]
    );
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-green-100 text-green-800 text-xs">Новое</Badge>;
      case 'events':
        return <Badge className="bg-blue-100 text-blue-800 text-xs">События</Badge>;
      case 'updated':
        return <Badge className="bg-orange-100 text-orange-800 text-xs">Обновлено</Badge>;
      default:
        return null;
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-80 max-w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Поиск */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Поиск разделов..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Текущий этап */}
        <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-purple-700">
              Текущий этап: Планирование беременности
            </span>
          </div>
        </div>

        {/* Избранное */}
        {favoriteItems.length > 0 && (
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <Star className="w-4 h-4 mr-2 text-yellow-500" />
              Избранное
            </h3>
            <div className="space-y-2">
              {favoriteItems.map((item) => (
                <Button
                  key={item.path}
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className="w-full justify-start h-auto p-3"
                  onClick={() => navigate(item.path)}
                >
                  <div className="flex items-center space-x-3 w-full">
                    <item.icon className="w-4 h-4 shrink-0" />
                    <div className="flex-1 text-left">
                      <div className="font-medium text-sm">{item.title}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                    {getStatusBadge(item.status)}
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Группированные разделы */}
        <div className="space-y-6 p-4">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">{category}</h3>
              <div className="space-y-1">
                {items.map((item) => (
                  <div key={item.path} className="relative group">
                    <Button
                      variant={isActive(item.path) ? "default" : "ghost"}
                      className="w-full justify-start h-auto p-3 pr-8"
                      onClick={() => navigate(item.path)}
                    >
                      <div className="flex items-center space-x-3 w-full">
                        <item.icon className="w-4 h-4 shrink-0" />
                        <div className="flex-1 text-left">
                          <div className="font-medium text-sm">{item.title}</div>
                          <div className="text-xs text-gray-500">{item.description}</div>
                        </div>
                        {getStatusBadge(item.status)}
                      </div>
                    </Button>
                    
                    {/* Кнопка избранного */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(item.path);
                      }}
                    >
                      {favorites.includes(item.path.replace('/', '')) ? (
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      ) : (
                        <StarIcon className="w-3 h-3 text-gray-400" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
              {Object.keys(groupedItems).indexOf(category) < Object.keys(groupedItems).length - 1 && (
                <Separator className="mt-4" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NavigationMenu;
