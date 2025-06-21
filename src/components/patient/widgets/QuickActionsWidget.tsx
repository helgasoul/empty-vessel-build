
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, FileText, Stethoscope, ShoppingBag, Activity, Users } from 'lucide-react';

interface QuickActionsWidgetProps {
  onActionClick: (action: string) => void;
}

export default function QuickActionsWidget({ onActionClick }: QuickActionsWidgetProps) {
  const actions = [
    {
      id: 'book-lab',
      title: 'Записаться на анализы',
      icon: FileText,
      color: 'bg-blue-500 hover:bg-blue-600',
      description: 'Найти лабораторию'
    },
    {
      id: 'book-consultation',
      title: 'Консультация врача',
      icon: Stethoscope,
      color: 'bg-green-500 hover:bg-green-600',
      description: 'Онлайн или офлайн'
    },
    {
      id: 'fitness-programs',
      title: 'Фитнес программы',
      icon: Activity,
      color: 'bg-purple-500 hover:bg-purple-600',
      description: 'Персональные тренировки'
    },
    {
      id: 'shop-recommendations',
      title: 'Магазин здоровья',
      icon: ShoppingBag,
      color: 'bg-orange-500 hover:bg-orange-600',
      description: 'Рекомендованные товары'
    },
    {
      id: 'schedule-appointment',
      title: 'Календарь здоровья',
      icon: Calendar,
      color: 'bg-pink-500 hover:bg-pink-600',
      description: 'Планировать события'
    },
    {
      id: 'family-sharing',
      title: 'Семейные данные',
      icon: Users,
      color: 'bg-indigo-500 hover:bg-indigo-600',
      description: 'Поделиться с семьей'
    }
  ];

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-rose-100 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-rose-600">
          <Activity className="w-5 h-5" />
          Быстрые действия
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => {
            const IconComponent = action.icon;
            return (
              <Button
                key={action.id}
                variant="outline"
                className="h-auto p-3 flex flex-col items-center text-center border-gray-200 hover:border-rose-200"
                onClick={() => onActionClick(action.id)}
              >
                <div className={`w-8 h-8 rounded-full ${action.color} flex items-center justify-center text-white mb-2`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-800">{action.title}</p>
                  <p className="text-xs text-gray-500">{action.description}</p>
                </div>
              </Button>
            );
          })}
        </div>
        
        <div className="text-center pt-2">
          <button 
            className="text-rose-600 hover:text-rose-700 text-sm font-medium"
            onClick={() => onActionClick('view-all')}
          >
            Посмотреть все сервисы →
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
