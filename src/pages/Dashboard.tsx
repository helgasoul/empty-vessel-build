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
  Bell,
  Sparkles
} from 'lucide-react';
import { Button, Badge, HealthCard } from '@/design-system/components';

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
      status: 'warning' as const,
      bgGradient: 'from-orange-100 to-orange-200',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    {
      title: 'Документов в хранилище',
      value: '0',
      icon: <FileText className="h-5 w-5" />,
      href: '/health-vault',
      status: 'info' as const,
      bgGradient: 'from-blue-100 to-blue-200',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Предстоящих событий',
      value: '0',
      icon: <Calendar className="h-5 w-5" />,
      href: '/medical-calendar',
      status: 'info' as const,
      bgGradient: 'from-purple-100 to-purple-200',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Уведомлений',
      value: '0',
      icon: <Bell className="h-5 w-5" />,
      href: '/notifications',
      status: 'success' as const,
      bgGradient: 'from-green-100 to-green-200',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header with gradient accent */}
        <div className="flex justify-between items-center mb-8 animate-fade-in">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-lg blur opacity-20"></div>
            <div className="relative bg-white rounded-lg p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="h-6 w-6 text-purple-600" />
                <h1 className="text-h1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent font-bold">
                  Добро пожаловать в PREVENT
                </h1>
              </div>
              <p className="text-body-large text-text-secondary">
                Ваша персональная платформа превентивной медицины
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-purple-200 text-purple-700 hover:bg-purple-50">
              <Settings className="h-4 w-4 mr-2" />
              Настройки
            </Button>
          </div>
        </div>

        {/* Quick Stats with brand gradients */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 animate-slide-up">
          {quickStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 cursor-pointer border-0 overflow-hidden relative group">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50`}></div>
              <CardContent className="p-4 relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-body-small text-text-secondary font-medium">{stat.title}</p>
                    <p className="text-h3 text-text-primary font-bold">{stat.value}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className={`p-2 rounded-lg ${stat.iconBg} group-hover:scale-110 transition-transform`}>
                      <div className={stat.iconColor}>
                        {stat.icon}
                      </div>
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

        {/* Features Grid with enhanced visual design */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
            <h2 className="text-h2 text-text-primary font-bold">Основные функции</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <HealthCard
                  title={feature.title}
                  icon={feature.icon}
                  status={riskLevel === 'low' ? 'normal' : riskLevel === 'high' ? 'critical' : 'warning'}
                  value={feature.value}
                  subtitle={feature.description}
                  actionLabel={feature.comingSoon ? 'В разработке' : feature.actionLabel}
                  onAction={feature.comingSoon ? undefined : () => window.location.href = feature.href}
                  className={`relative bg-white/80 backdrop-blur-sm border-0 ${feature.comingSoon ? 'opacity-75' : ''}`}
                />
                {feature.comingSoon && (
                  <div className="absolute top-3 right-3">
                    <Badge variant="warning" size="sm" className="bg-gradient-to-r from-orange-400 to-orange-500 text-white border-0">
                      Скоро
                    </Badge>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Security Notice with brand styling */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg animate-fade-in overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"></div>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-h4 text-text-primary mb-2 font-semibold">
                  Безопасность ваших данных
                </h3>
                <p className="text-body text-text-secondary leading-relaxed">
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
