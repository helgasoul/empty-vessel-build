
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Building, TestTube, Shield, BarChart3, Settings } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const adminActions = [
    {
      title: 'Управление пользователями',
      description: 'Просмотр и управление пользователями',
      icon: Users,
      action: () => navigate('/admin/users'),
      color: 'bg-blue-500'
    },
    {
      title: 'Клиники',
      description: 'Управление клиниками-партнерами',
      icon: Building,
      action: () => navigate('/admin/clinics'),
      color: 'bg-green-500'
    },
    {
      title: 'Лаборатории',
      description: 'Управление лабораториями',
      icon: TestTube,
      action: () => navigate('/admin/laboratories'),
      color: 'bg-purple-500'
    },
    {
      title: 'Безопасность',
      description: 'Настройки безопасности системы',
      icon: Shield,
      action: () => navigate('/admin/security'),
      color: 'bg-red-500'
    },
    {
      title: 'Аналитика',
      description: 'Статистика и отчеты',
      icon: BarChart3,
      action: () => navigate('/admin/analytics'),
      color: 'bg-indigo-500'
    },
    {
      title: 'Настройки системы',
      description: 'Общие настройки платформы',
      icon: Settings,
      action: () => navigate('/admin/settings'),
      color: 'bg-gray-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Панель администратора
          </h1>
          <p className="text-gray-600">
            Управление платформой PREVENT
          </p>
        </div>

        {/* Статистика системы */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Всего пользователей</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground">+12% за месяц</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Врачи</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">+3 новых</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Клиники</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">Партнеры</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Лаборатории</CardTitle>
              <TestTube className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <p className="text-xs text-muted-foreground">Активные</p>
            </CardContent>
          </Card>
        </div>

        {/* Административные действия */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {adminActions.map((action, index) => (
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

        {/* Системные уведомления */}
        <Card>
          <CardHeader>
            <CardTitle>Системные уведомления</CardTitle>
            <CardDescription>Важные события в системе</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Требуется верификация нового врача</p>
                  <p className="text-xs text-gray-500">Др. Иванов И.И. ожидает подтверждения</p>
                </div>
                <Button size="sm" variant="outline">
                  Проверить
                </Button>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Новая заявка от клиники</p>
                  <p className="text-xs text-gray-500">Медицинский центр "Здоровье+"</p>
                </div>
                <Button size="sm" variant="outline">
                  Рассмотреть
                </Button>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Системное обновление завершено</p>
                  <p className="text-xs text-gray-500">Версия 2.1.0 успешно установлена</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
