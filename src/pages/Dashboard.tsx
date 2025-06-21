import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  FileText, 
  Heart, 
  Calendar,
  TrendingUp,
  Shield,
  Database,
  Leaf,
  Users,
  Settings,
  Bell
} from 'lucide-react';

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Загрузка...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const features = [
    {
      title: 'Оценка рисков здоровья',
      description: 'Персонализированный анализ рисков заболеваний на основе ваших данных',
      icon: <Heart className="h-6 w-6" />,
      href: '/risk-assessment',
      color: 'bg-red-50 border-red-200',
      iconColor: 'text-red-600'
    },
    {
      title: 'Медицинское хранилище',
      description: 'Безопасное хранение и управление вашими медицинскими документами',
      icon: <Database className="h-6 w-6" />,
      href: '/health-vault',
      color: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Экологическое здоровье',
      description: 'Мониторинг влияния окружающей среды на ваше здоровье',
      icon: <Leaf className="h-6 w-6" />,
      href: '/environmental-health',
      color: 'bg-green-50 border-green-200',
      iconColor: 'text-green-600'
    },
    {
      title: 'Семейная история',
      description: 'Отслеживание наследственных рисков и семейной медицинской истории',
      icon: <Users className="h-6 w-6" />,
      href: '/family-history',
      color: 'bg-purple-50 border-purple-200',
      iconColor: 'text-purple-600',
      comingSoon: true
    },
    {
      title: 'Интеграции с устройствами',
      description: 'Подключение носимых устройств и мониторинг показателей здоровья',
      icon: <Activity className="h-6 w-6" />,
      href: '/device-integrations',
      color: 'bg-orange-50 border-orange-200',
      iconColor: 'text-orange-600',
      comingSoon: true
    },
    {
      title: 'Медицинский календарь',
      description: 'Планирование консультаций, анализов и медицинских процедур',
      icon: <Calendar className="h-6 w-6" />,
      href: '/medical-calendar',
      color: 'bg-indigo-50 border-indigo-200',
      iconColor: 'text-indigo-600',
      comingSoon: true
    }
  ];

  const quickStats = [
    {
      title: 'Последняя оценка рисков',
      value: 'Не проводилась',
      icon: <TrendingUp className="h-5 w-5" />,
      href: '/risk-assessment'
    },
    {
      title: 'Документов в хранилище',
      value: '0',
      icon: <FileText className="h-5 w-5" />,
      href: '/health-vault'
    },
    {
      title: 'Предстоящих событий',
      value: '0',
      icon: <Calendar className="h-5 w-5" />,
      href: '/medical-calendar'
    },
    {
      title: 'Уведомлений',
      value: '0',
      icon: <Bell className="h-5 w-5" />,
      href: '/notifications'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Добро пожаловать в PREVENT
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              Ваша персональная платформа превентивной медицины
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Настройки
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {quickStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className="text-gray-400">
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Основные функции</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className={`${feature.color} hover:shadow-lg transition-all duration-300 cursor-pointer relative overflow-hidden ${feature.comingSoon ? 'opacity-75' : ''}`}
                onClick={() => !feature.comingSoon && (window.location.href = feature.href)}
              >
                {feature.comingSoon && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                    Скоро
                  </div>
                )}
                <CardHeader>
                  <div className={`${feature.iconColor} mb-2`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    disabled={feature.comingSoon}
                    className="w-full justify-start"
                  >
                    {feature.comingSoon ? 'В разработке' : 'Открыть →'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Security Notice */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Shield className="h-6 w-6 text-yellow-600 mt-1" />
              <div>
                <h3 className="font-semibold text-yellow-800 mb-2">
                  Безопасность ваших данных
                </h3>
                <p className="text-sm text-yellow-700">
                  Все ваши медицинские данные зашифрованы и хранятся в соответствии с международными 
                  стандартами безопасности GDPR и HIPAA. Мы никогда не передаем ваши данные третьим лицам 
                  без вашего явного согласия.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
