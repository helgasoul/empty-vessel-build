
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  HeartPulse, 
  Pill, 
  FileText,
  BookOpen,
  Users,
  Microscope
} from "lucide-react";
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Записать симптомы",
      description: "Отследить настроение и симптомы",
      icon: HeartPulse,
      onClick: () => navigate('/womens-health'),
      color: "text-red-500"
    },
    {
      title: "Персональные рекомендации",
      description: "Рекомендации по возрасту",
      icon: BookOpen,
      onClick: () => navigate('/recommendations'),
      color: "text-blue-500"
    },
    {
      title: "Медицинский календарь",
      description: "Запланировать визиты",
      icon: Calendar,
      onClick: () => navigate('/medical-calendar'),
      color: "text-green-500"
    },
    {
      title: "Лекарства",
      description: "Напоминания о приеме",
      icon: Pill,
      onClick: () => navigate('/medications'),
      color: "text-purple-500"
    },
    {
      title: "Семейная история",
      description: "Медицинские данные семьи",
      icon: Users,
      onClick: () => navigate('/family-data'),
      color: "text-orange-500"
    },
    {
      title: "Анализ рисков",
      description: "Оценка здоровья",
      icon: Microscope,
      onClick: () => navigate('/risk-assessment'),
      color: "text-teal-500"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Быстрые действия</CardTitle>
        <CardDescription>
          Часто используемые функции для управления здоровьем
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center space-y-2 hover:shadow-md transition-shadow"
              onClick={action.onClick}
            >
              <action.icon className={`w-8 h-8 ${action.color}`} />
              <div className="text-center">
                <div className="font-medium text-sm">{action.title}</div>
                <div className="text-xs text-gray-500 mt-1">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
