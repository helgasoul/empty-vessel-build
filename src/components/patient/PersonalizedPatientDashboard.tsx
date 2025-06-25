
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Activity, 
  Brain, 
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Plus,
  Sparkles,
  Leaf,
  Users,
  FileText,
  Clock,
  Target,
  Award,
  Bell
} from 'lucide-react';

// Simplified badge component to avoid import errors
const Badge = ({ children, variant = 'default', className = '' }: { 
  children: React.ReactNode; 
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'secondary';
  className?: string;
}) => {
  const variants = {
    default: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    destructive: 'bg-red-100 text-red-800',
    secondary: 'bg-gray-100 text-gray-800'
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

interface HealthMetric {
  name: string;
  value: string | number;
  unit?: string;
  status: 'excellent' | 'good' | 'attention' | 'concern';
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  actionRequired: boolean;
  dueDate?: string;
}

interface UpcomingEvent {
  id: string;
  title: string;
  type: 'appointment' | 'test' | 'screening' | 'medication';
  date: Date;
  time: string;
  provider?: string;
  location?: string;
}

const PersonalizedPatientDashboard = () => {
  const { user } = useAuth();
  const [healthScore, setHealthScore] = useState(85);
  const [isLoading, setIsLoading] = useState(true);

  // Sample data - in real app this would come from API
  const [healthMetrics] = useState<HealthMetric[]>([
    {
      name: 'ИМТ',
      value: 22.5,
      unit: 'кг/м²',
      status: 'good',
      trend: 'stable',
      lastUpdated: '2 дня назад'
    },
    {
      name: 'Артериальное давление',
      value: '120/80',
      unit: 'мм рт.ст.',
      status: 'excellent',
      trend: 'stable',
      lastUpdated: '1 день назад'
    },
    {
      name: 'Пульс покоя',
      value: 68,
      unit: 'уд/мин',
      status: 'good',
      trend: 'up',
      lastUpdated: 'Сегодня'
    },
    {
      name: 'Уровень стресса',
      value: 6,
      unit: '/10',
      status: 'attention',
      trend: 'down',
      lastUpdated: 'Сегодня'
    }
  ]);

  const [recommendations] = useState<Recommendation[]>([
    {
      id: '1',
      title: 'Маммография',
      description: 'Рекомендуется пройти маммографию для скрининга рака молочной железы',
      priority: 'high',
      category: 'Скрининг',
      actionRequired: true,
      dueDate: '2025-02-15'
    },
    {
      id: '2',
      title: 'Увеличить потребление Омега-3',
      description: 'Добавить в рацион продукты богатые Омега-3 жирными кислотами',
      priority: 'medium',
      category: 'Питание',
      actionRequired: false
    },
    {
      id: '3',
      title: 'Техники снижения стресса',
      description: 'Попробуйте медитацию или йогу для снижения уровня стресса',
      priority: 'high',
      category: 'Ментальное здоровье',
      actionRequired: true
    }
  ]);

  const [upcomingEvents] = useState<UpcomingEvent[]>([
    {
      id: '1',
      title: 'Консультация гинеколога',
      type: 'appointment',
      date: new Date('2025-01-28'),
      time: '14:30',
      provider: 'Др. Смирнова',
      location: 'Клиника "Здоровье"'
    },
    {
      id: '2',
      title: 'Кардиологическое обследование',
      type: 'appointment',
      date: new Date('2025-02-05'),
      time: '10:00',
      provider: 'Др. Кузнецов',
      location: 'Медцентр "Сердце"'
    }
  ]);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-50';
      case 'good': return 'text-blue-600 bg-blue-50';
      case 'attention': return 'text-yellow-600 bg-yellow-50';
      case 'concern': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      case 'stable': return <div className="h-4 w-4 rounded-full bg-gray-400" />;
      default: return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">PREVENT</h2>
          <p className="text-gray-600">Загружаем ваш персональный дашборд...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-rose-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xl font-bold">
                P
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Привет, {user?.email?.split('@')[0] || 'Анна'}! 👋
                </h1>
                <p className="text-gray-600">Ваше здоровье сегодня</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" className="border-rose-200 text-rose-600 hover:bg-rose-50">
                <Bell className="w-4 h-4 mr-2" />
                Уведомления
              </Button>
              <Button className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600">
                <Plus className="w-4 h-4 mr-2" />
                Добавить данные
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Health Score Overview */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white border-0 overflow-hidden relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <CardContent className="p-8 relative">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Индекс здоровья</h2>
                  <p className="text-purple-100 mb-4">Общая оценка вашего состояния</p>
                  <div className="flex items-center space-x-4">
                    <div className="text-5xl font-bold">{healthScore}</div>
                    <div>
                      <div className="text-sm text-purple-100">из 100</div>
                      <Badge variant="success" className="mt-1">Хорошо</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="w-32 h-32 relative">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="none"
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="8"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="none"
                        stroke="white"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${healthScore * 3.14} 314`}
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {healthMetrics.map((metric, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-700">{metric.name}</h3>
                  {getTrendIcon(metric.trend)}
                </div>
                <div className="mb-2">
                  <span className="text-2xl font-bold text-gray-800">
                    {metric.value}
                  </span>
                  {metric.unit && (
                    <span className="text-sm text-gray-500 ml-1">{metric.unit}</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant={metric.status === 'excellent' ? 'success' : 
                                 metric.status === 'good' ? 'default' :
                                 metric.status === 'attention' ? 'warning' : 'destructive'}>
                    {metric.status === 'excellent' ? 'Отлично' :
                     metric.status === 'good' ? 'Норма' :
                     metric.status === 'attention' ? 'Внимание' : 'Требует контроля'}
                  </Badge>
                  <span className="text-xs text-gray-500">{metric.lastUpdated}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Risk Assessment Summary */}
            <Card className="bg-white/80 backdrop-blur-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-rose-500" />
                  Оценка рисков
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-green-800">Рак молочной железы</h4>
                      <p className="text-sm text-green-600">Риск за 5 лет: 2.3%</p>
                    </div>
                    <Badge variant="success">Низкий риск</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-yellow-800">Сердечно-сосудистые заболевания</h4>
                      <p className="text-sm text-yellow-600">Риск за 10 лет: 8.7%</p>
                    </div>
                    <Badge variant="warning">Средний риск</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-blue-800">Остеопороз</h4>
                      <p className="text-sm text-blue-600">Риск перелома: 5.1%</p>
                    </div>
                    <Badge variant="default">Низкий риск</Badge>
                  </div>
                </div>
                
                <Button className="w-full mt-4 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600">
                  Пройти полную оценку рисков
                </Button>
              </CardContent>
            </Card>

            {/* AI Recommendations */}
            <Card className="bg-white/80 backdrop-blur-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-500" />
                  Персональные рекомендации ИИ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recommendations.map((rec) => (
                    <div key={rec.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className={`w-3 h-3 rounded-full mt-2 ${getPriorityColor(rec.priority)}`}></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-800">{rec.title}</h4>
                          <Badge variant={rec.priority === 'high' ? 'destructive' : 
                                        rec.priority === 'medium' ? 'warning' : 'default'}>
                            {rec.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                        {rec.dueDate && (
                          <p className="text-xs text-gray-500 mt-1">
                            До: {new Date(rec.dueDate).toLocaleDateString('ru-RU')}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Health Journey Progress */}
            <Card className="bg-white/80 backdrop-blur-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-orange-500" />
                  Прогресс здоровья
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Цель по весу</span>
                      <span className="text-sm text-gray-500">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Физическая активность</span>
                      <span className="text-sm text-gray-500">72%</span>
                    </div>
                    <Progress value={72} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Качество сна</span>
                      <span className="text-sm text-gray-500">90%</span>
                    </div>
                    <Progress value={90} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <Card className="bg-white/80 backdrop-blur-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  Ближайшие события
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm">{event.title}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {event.date.toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' })}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">{event.time}</p>
                      {event.provider && (
                        <p className="text-xs text-gray-500">{event.provider}</p>
                      )}
                    </div>
                  ))}
                </div>
                
                <Button variant="outline" className="w-full mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить событие
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/80 backdrop-blur-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-500" />
                  Быстрые действия
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button className="w-full justify-start bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                    <Heart className="w-4 h-4 mr-2" />
                    Записаться к врачу
                  </Button>
                  
                  <Button className="w-full justify-start bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                    <FileText className="w-4 h-4 mr-2" />
                    Загрузить анализы
                  </Button>
                  
                  <Button className="w-full justify-start bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
                    <Brain className="w-4 h-4 mr-2" />
                    ИИ-консультация
                  </Button>
                  
                  <Button className="w-full justify-start bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                    <Leaf className="w-4 h-4 mr-2" />
                    Экология здоровья
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Daily Tip */}
            <Card className="bg-gradient-to-r from-yellow-100 to-orange-100 border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <Sparkles className="w-5 h-5" />
                  Совет дня
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-orange-700 mb-3">
                  Попробуйте 5-минутную медитацию каждое утро. Это поможет снизить уровень стресса и улучшить концентрацию на весь день.
                </p>
                <Button variant="outline" size="sm" className="border-orange-300 text-orange-700 hover:bg-orange-50">
                  Больше советов
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedPatientDashboard;
