
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, TrendingUp, Calendar, FileText, Smartphone, Users } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const PatientDashboard = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Женское здоровье',
      description: 'Мониторинг и рекомендации',
      icon: Heart,
      action: () => navigate('/womens-health'),
      color: 'bg-pink-500'
    },
    {
      title: 'Оценка рисков',
      description: 'Анализ здоровья и рисков',
      icon: TrendingUp,
      action: () => navigate('/risk-assessment'),
      color: 'bg-blue-500'
    },
    {
      title: 'Мой календарь',
      description: 'Записи и напоминания',
      icon: Calendar,
      action: () => navigate('/medical-calendar'),
      color: 'bg-green-500'
    },
    {
      title: 'Медицинские записи',
      description: 'История болезней',
      icon: FileText,
      action: () => navigate('/medical-records'),
      color: 'bg-purple-500'
    },
    {
      title: 'Устройства',
      description: 'Подключенные гаджеты',
      icon: Smartphone,
      action: () => navigate('/medical-integrations'),
      color: 'bg-orange-500'
    },
    {
      title: 'Семейные данные',
      description: 'История семьи',
      icon: Users,
      action: () => navigate('/family-data'),
      color: 'bg-indigo-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Добро пожаловать в PREVENT
          </h1>
          <p className="text-gray-600">
            Ваша персональная платформа превентивной медицины
          </p>
        </div>

        {/* Статистика здоровья */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Общий риск</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Низкий</div>
              <p className="text-xs text-muted-foreground">15% от среднего</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Последний анализ</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3 дня</div>
              <p className="text-xs text-muted-foreground">назад</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Активность</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12,450</div>
              <p className="text-xs text-muted-foreground">шагов сегодня</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Следующая запись</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">25 дек</div>
              <p className="text-xs text-muted-foreground">Гинеколог</p>
            </CardContent>
          </Card>
        </div>

        {/* Быстрые действия */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-4`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={action.action} className="w-full">
                  Открыть
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Рекомендации */}
        <Card>
          <CardHeader>
            <CardTitle>Персональные рекомендации</CardTitle>
            <CardDescription>На основе вашего профиля здоровья</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Рекомендуется пройти скрининг на рак молочной железы</p>
                  <p className="text-xs text-gray-500">Возраст 35+, последний раз проходили 2 года назад</p>
                </div>
                <Button size="sm">
                  Записаться
                </Button>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Отличная активность! Продолжайте в том же духе</p>
                  <p className="text-xs text-gray-500">Ваша активность на 20% выше среднего</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Обновите данные о семейной истории</p>
                  <p className="text-xs text-gray-500">Это поможет улучшить точность анализа рисков</p>
                </div>
                <Button size="sm" variant="outline">
                  Обновить
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientDashboard;
