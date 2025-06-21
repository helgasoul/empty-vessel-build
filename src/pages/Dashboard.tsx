
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
import { Button, Badge, HealthCard } from '@/design-system/components';

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-coral-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-body text-text-secondary">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const features = [
    {
      title: 'Оценка рисков здоровья',
      description: 'Персонализированный анализ рисков заболеваний на основе ваших данных',
      icon: Heart,
      href: '/risk-assessment',
      status: 'medium' as const,
      value: 'Требуется',
      actionLabel: 'Начать оценку'
    },
    {
      title: 'Медицинское хранилище',
      description: 'Безопасное хранение и управление вашими медицинскими документами',
      icon: Database,
      href: '/health-vault',
      status: 'low' as const,
      value: '0 файлов',
      actionLabel: 'Загрузить'
    },
    {
      title: 'Экологическое здоровье',
      description: 'Мониторинг влияния окружающей среды на ваше здоровье',
      icon: Leaf,
      href: '/environmental-health',
      status: 'low' as const,
      value: 'Хорошо',
      actionLabel: 'Подробнее'
    },
    {
      title: 'Семейная история',
      description: 'Отслеживание наследственных рисков и семейной медицинской истории',
      icon: Users,
      href: '/family-history',
      status: 'medium' as const,
      value: 'Заполнить',
      actionLabel: 'Настроить',
      comingSoon: true
    },
    {
      title: 'Интеграции с устройствами',
      description: 'Подключение носимых устройств и мониторинг показателей здоровья',
      icon: Activity,
      href: '/device-integrations',
      status: 'low' as const,
      value: 'Нет подключений',
      actionLabel: 'Подключить',
      comingSoon: true
    },
    {
      title: 'Медицинский календарь',
      description: 'Планирование консультаций, анализов и медицинских процедур',
      icon: Calendar,
      href: '/medical-calendar',
      status: 'low' as const,
      value: '0 событий',
      actionLabel: 'Добавить',
      comingSoon: true
    }
  ];

  const quickStats = [
    {
      title: 'Последняя оценка рисков',
      value: 'Не проводилась',
      icon: <TrendingUp className="h-5 w-5" />,
      href: '/risk-assessment',
      status: 'warning' as const
    },
    {
      title: 'Документов в хранилище',
      value: '0',
      icon: <FileText className="h-5 w-5" />,
      href: '/health-vault',
      status: 'info' as const
    },
    {
      title: 'Предстоящих событий',
      value: '0',
      icon: <Calendar className="h-5 w-5" />,
      href: '/medical-calendar',
      status: 'info' as const
    },
    {
      title: 'Уведомлений',
      value: '0',
      icon: <Bell className="h-5 w-5" />,
      href: '/notifications',
      status: 'success' as const
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 animate-fade-in">
          <div>
            <h1 className="text-h1 text-text-primary">
              Добро пожаловать в PREVENT
            </h1>
            <p className="text-body-large text-text-secondary mt-2">
              Ваша персональная платформа превентивной медицины
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="tertiary" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Настройки
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 animate-slide-up">
          {quickStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer bg-background-secondary border-border-light">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-body-small text-text-secondary">{stat.title}</p>
                    <p className="text-h3 text-text-primary font-medium">{stat.value}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-sage-500">
                      {stat.icon}
                    </div>
                    <Badge variant={stat.status} size="sm">
                      {stat.status === 'warning' ? 'Требуется' : 
                       stat.status === 'info' ? 'Норма' : 
                       stat.status === 'success' ? 'Хорошо' : 'Внимание'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Grid */}
        <div className="mb-8">
          <h2 className="text-h2 text-text-primary mb-6">Основные функции</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="relative">
                <HealthCard
                  title={feature.title}
                  icon={feature.icon}
                  status={feature.status}
                  value={feature.value}
                  subtitle={feature.description}
                  actionLabel={feature.comingSoon ? 'В разработке' : feature.actionLabel}
                  onAction={feature.comingSoon ? undefined : () => window.location.href = feature.href}
                  className={feature.comingSoon ? 'opacity-75' : ''}
                />
                {feature.comingSoon && (
                  <div className="absolute top-3 right-3">
                    <Badge variant="warning" size="sm">
                      Скоро
                    </Badge>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Security Notice */}
        <Card className="bg-background-secondary border-border-light animate-fade-in">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Shield className="h-6 w-6 text-sage-600 mt-1" />
              <div>
                <h3 className="text-h4 text-text-primary mb-2">
                  Безопасность ваших данных
                </h3>
                <p className="text-body text-text-secondary">
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
