
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Heart, 
  FileText, 
  Calendar,
  BarChart3,
  Smartphone,
  Target,
  Stethoscope,
  Leaf,
  Users,
  ExternalLink,
  Trophy,
  User
} from "lucide-react";
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Оценка рисков",
      description: "Пройдите новую оценку рисков здоровья",
      icon: Shield,
      color: "bg-blue-500 hover:bg-blue-600",
      action: () => navigate('/risk-assessment')
    },
    {
      title: "Женское здоровье",
      description: "Трекер цикла и здоровья",
      icon: Heart,
      color: "bg-pink-500 hover:bg-pink-600",
      action: () => navigate('/womens-health')
    },
    {
      title: "Эксперты",
      description: "Консультации со специалистами",
      icon: User,
      color: "bg-teal-500 hover:bg-teal-600",
      action: () => navigate('/experts')
    },
    {
      title: "Достижения",
      description: "Привычки и система наград",
      icon: Trophy,
      color: "bg-yellow-500 hover:bg-yellow-600",
      action: () => navigate('/gamification')
    },
    {
      title: "Сообщество",
      description: "Анонимное общение и поддержка",
      icon: Users,
      color: "bg-purple-500 hover:bg-purple-600",
      action: () => navigate('/community')
    },
    {
      title: "Медицинские записи",
      description: "Управление медкартой и записями",
      icon: FileText,
      color: "bg-green-500 hover:bg-green-600",
      action: () => navigate('/medical-integrations')
    },
    {
      title: "Аналитика здоровья",
      description: "Детальный анализ и тренды",
      icon: BarChart3,
      color: "bg-indigo-500 hover:bg-indigo-600",
      action: () => navigate('/health-analytics')
    },
    {
      title: "Экологическое здоровье",
      description: "Качество воздуха и экология",
      icon: Leaf,
      color: "bg-emerald-500 hover:bg-emerald-600",
      action: () => navigate('/environmental-health')
    },
    {
      title: "Внешние интеграции",
      description: "Магазины, фитнес, питание",
      icon: ExternalLink,
      color: "bg-orange-500 hover:bg-orange-600",
      action: () => navigate('/external-integrations')
    }
  ];

  return (
    <Card className="prevent-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 font-montserrat">
          <Target className="w-5 h-5 text-primary" />
          <span>Быстрые действия</span>
        </CardTitle>
        <CardDescription className="font-roboto">
          Основные функции платформы
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className={`h-auto p-4 flex flex-col items-start space-y-2 hover:shadow-md transition-all duration-200 ${action.color} text-white border-none`}
              onClick={action.action}
            >
              <action.icon className="w-6 h-6 mb-2" />
              <div className="text-left">
                <div className="font-medium">{action.title}</div>
                <div className="text-xs opacity-90 font-roboto">
                  {action.description}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
