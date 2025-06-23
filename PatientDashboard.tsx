import React, { useState } from 'react';
import { 
  Heart, 
  Calendar, 
  Activity, 
  FileText, 
  Settings, 
  Bell,
  TrendingUp,
  TrendingDown,
  Minus,
  Shield,
  ChevronRight,
  Upload,
  MessageCircle,
  MapPin,
  Info,
  Users
} from 'lucide-react';

interface HealthMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'excellent' | 'good' | 'attention' | 'concern';
  trend: 'improving' | 'stable' | 'declining';
  targetRange?: { min: number; max: number };
}

interface RiskAssessment {
  breastCancer5y: number;
  cardiovascular10y: number;
  overallHealthScore: number;
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: 'screening' | 'nutrition' | 'exercise' | 'lifestyle' | 'medical';
  priority: 'critical' | 'high' | 'medium' | 'low';
  dueDate?: Date;
  completed: boolean;
  source: 'ai' | 'doctor' | 'guidelines';
  evidence?: string;
}

interface Appointment {
  id: string;
  doctorName: string;
  specialization: string;
  date: Date;
  time: string;
  clinic: string;
  status: 'scheduled' | 'confirmed' | 'completed';
}

export const PatientDashboard: React.FC = () => {
  const [currentUser] = useState({ 
    firstName: 'Анна', 
    lastName: 'Петрова',
    age: 38,
    role: 'patient' 
  });

  const [healthMetrics] = useState<HealthMetric[]>([
    { 
      id: '1', 
      name: 'ИМТ', 
      value: 22.5, 
      unit: 'кг/м²', 
      status: 'good', 
      trend: 'stable',
      targetRange: { min: 18.5, max: 24.9 }
    },
    { 
      id: '2', 
      name: 'Артериальное давление', 
      value: 120, 
      unit: '/80 мм рт.ст.', 
      status: 'excellent', 
      trend: 'stable'
    },
    { 
      id: '3', 
      name: 'Пульс покоя', 
      value: 68, 
      unit: 'уд/мин', 
      status: 'good', 
      trend: 'improving',
      targetRange: { min: 60, max: 80 }
    },
    { 
      id: '4', 
      name: 'Уровень стресса', 
      value: 6, 
      unit: '/10', 
      status: 'attention', 
      trend: 'declining',
      targetRange: { min: 1, max: 4 }
    }
  ]);

  const [riskAssessment] = useState<RiskAssessment>({
    breastCancer5y: 2.3,
    cardiovascular10y: 8.7,
    overallHealthScore: 85
  });

  const [recommendations] = useState<Recommendation[]>([
    {
      id: '1',
      title: 'Пройти маммографию',
      description: 'Рекомендуется ежегодная маммография для вашей возрастной группы',
      category: 'screening',
      priority: 'high',
      dueDate: new Date('2025-07-15'),
      completed: false,
      source: 'guidelines',
      evidence: 'Рекомендации Российского общества онкомаммологов'
    },
    {
      id: '2',
      title: 'Увеличить потребление омега-3',
      description: 'Добавьте в рацион рыбу жирных сортов 2-3 раза в неделю',
      category: 'nutrition',
      priority: 'medium',
      completed: false,
      source: 'ai',
      evidence: 'Анализ на основе ваших показателей холестерина'
    },
    {
      id: '3',
      title: 'Практики для снижения стресса',
      description: 'Рекомендуем медитацию, йогу или дыхательные практики',
      category: 'lifestyle',
      priority: 'high',
      completed: false,
      source: 'ai'
    }
  ]);

  const [upcomingAppointments] = useState<Appointment[]>([
    {
      id: '1',
      doctorName: 'Др. Смирнова Е.В.',
      specialization: 'Гинеколог-эндокринолог',
      date: new Date('2025-06-28'),
      time: '14:30',
      clinic: 'Клиника Чайка',
      status: 'confirmed'
    },
    {
      id: '2',
      doctorName: 'Др. Кузнецов А.И.',
      specialization: 'Кардиолог',
      date: new Date('2025-07-05'),
      time: '10:00',
      clinic: 'Ильинская больница',
      status: 'scheduled'
    }
  ]);

  const getStatusColor = (status: HealthMetric['status']) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-50 border-green-200';
      case 'good': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'attention': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'concern': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusLabel = (status: HealthMetric['status']) => {
    switch (status) {
      case 'excellent': return 'Отлично';
      case 'good': return 'Норма';
      case 'attention': return 'Внимание';
      case 'concern': return 'Требует контроля';
      default: return 'Неизвестно';
    }
  };

  const getPriorityColor = (priority: Recommendation['priority']) => {
    switch (priority) {
      case 'critical': return 'border-l-red-600 bg-red-50';
      case 'high': return 'border-l-orange-500 bg-orange-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getTrendIcon = (trend: HealthMetric['trend']) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'declining': return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'stable': return <Minus className="w-4 h-4 text-gray-400" />;
      default: return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getCategoryIcon = (category: Recommendation['category']) => {
    switch (category) {
      case 'screening': return <Shield className="w-4 h-4" />;
      case 'nutrition': return <Heart className="w-4 h-4" />;
      case 'exercise': return <Activity className="w-4 h-4" />;
      case 'lifestyle': return <Users className="w-4 h-4" />;
      case 'medical': return <FileText className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getCategoryLabel = (category: Recommendation['category']) => {
    switch (category) {
      case 'screening': return 'Обследование';
      case 'nutrition': return 'Питание';
      case 'exercise': return 'Активность';
      case 'lifestyle': return 'Образ жизни';
      case 'medical': return 'Медицинское';
      default: return 'Общее';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      weekday: 'long'
    }).format(date);
  };

  const quickActions = [
    {
      id: 'book-appointment',
      title: 'Записаться к врачу',
      icon: <Calendar className="w-5 h-5" />,
      color: 'from-rose-500 to-pink-600'
    },
    {
      id: 'upload-results',
      title: 'Загрузить анализы',
      icon: <Upload className="w-5 h-5" />,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'ai-consultation',
      title: 'ИИ-консультация',
      icon: <MessageCircle className="w-5 h-5" />,
      color: 'from-purple-500 to-violet-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-rose-400 to-pink-500 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  Добро пожаловать, {currentUser.firstName}!
                </h1>
                <p className="text-gray-600 text-sm">
                  Ваша персональная панель здоровья
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {currentUser.firstName[0]}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Health Score Overview */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Индекс здоровья</h2>
                <span className="text-sm text-gray-500">Обновлено сегодня</span>
              </div>
              
              <div className="flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-8">
                {/* Circular Progress */}
                <div className="relative">
                  <div className="w-32 h-32">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                      <circle 
                        cx="60" 
                        cy="60" 
                        r="54" 
                        stroke="#f3f4f6" 
                        strokeWidth="8" 
                        fill="none"
                      />
                      <circle 
                        cx="60" 
                        cy="60" 
                        r="54" 
                        stroke="url(#gradient)" 
                        strokeWidth="8" 
                        fill="none"
                        strokeDasharray={`${(riskAssessment.overallHealthScore / 100) * 339.292} 339.292`}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#f43f5e" />
                          <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-3xl font-bold text-gray-800">
                          {riskAssessment.overallHealthScore}
                        </span>
                        <p className="text-xs text-gray-500">из 100</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Risk Breakdown */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  <div className="text-center p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border border-rose-100">
                    <div className="text-sm text-gray-600 mb-1">Риск рака груди</div>
                    <div className="text-lg font-semibold text-rose-600">
                      {riskAssessment.breastCancer5y}%
                    </div>
                    <div className="text-xs text-gray-500">в течение 5 лет</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <div className="text-sm text-gray-600 mb-1">Сердечно-сосудистый риск</div>
                    <div className="text-lg font-semibold text-blue-600">
                      {riskAssessment.cardiovascular10y}%
                    </div>
                    <div className="text-xs text-gray-500">в течение 10 лет</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Health Metrics */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Ключевые показатели</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {healthMetrics.map((metric) => (
                  <div 
                    key={metric.id} 
                    className="p-4 border border-gray-200 rounded-xl hover:border-rose-300 transition-all duration-300 hover:shadow-md cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-700">{metric.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(metric.status)}`}>
                        {getStatusLabel(metric.status)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-gray-800">
                          {metric.value}
                        </span>
                        <span className="text-sm font-normal text-gray-500 ml-1">
                          {metric.unit}
                        </span>
                        {metric.targetRange && (
                          <div className="text-xs text-gray-400 mt-1">
                            Норма: {metric.targetRange.min}-{metric.targetRange.max}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {getTrendIcon(metric.trend)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Персональные рекомендации</h2>
                <button className="text-rose-600 hover:text-rose-700 font-medium text-sm transition-colors">
                  Все рекомендации
                </button>
              </div>
              
              <div className="space-y-4">
                {recommendations.map((rec) => (
                  <div 
                    key={rec.id} 
                    className={`border-l-4 p-4 rounded-r-xl transition-all duration-300 hover:shadow-md cursor-pointer ${getPriorityColor(rec.priority)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {getCategoryIcon(rec.category)}
                          <h3 className="font-semibold text-gray-800">{rec.title}</h3>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{rec.description}</p>
                        <div className="flex items-center space-x-3">
                          <span className="px-2 py-1 bg-white rounded-full text-xs font-medium text-gray-600 border border-gray-200">
                            {getCategoryLabel(rec.category)}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            rec.priority === 'high' ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                            rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                            'bg-green-100 text-green-700 border border-green-200'
                          }`}>
                            {rec.priority === 'high' ? 'Высокий' : 
                             rec.priority === 'medium' ? 'Средний' : 'Низкий'} приоритет
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 ml-4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Быстрые действия</h3>
              
              <div className="space-y-3">
                {quickActions.map((action) => (
                  <button 
                    key={action.id}
                    className={`w-full flex items-center space-x-3 p-3 bg-gradient-to-r ${action.color} text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
                  >
                    {action.icon}
                    <span className="font-medium">{action.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Ближайшие приемы</h3>
              
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="p-4 border border-gray-200 rounded-xl hover:border-rose-300 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-800 text-sm">{appointment.doctorName}</h4>
                        <p className="text-gray-600 text-xs">{appointment.specialization}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        appointment.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {appointment.status === 'confirmed' ? 'Подтверждено' : 'Запланировано'}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="w-4 h-4 text-rose-500" />
                        <span className="text-gray-700">
                          {formatDate(appointment.date)} в {appointment.time}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="w-4 h-4 text-rose-500" />
                        <span className="text-gray-700">{appointment.clinic}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 text-rose-600 hover:text-rose-700 font-medium text-sm transition-colors">
                Все записи
              </button>
            </div>

            {/* Health Tip */}
            <div className="bg-gradient-to-r from-rose-500 to-pink-600 rounded-2xl p-6 text-white">
              <div className="flex items-center space-x-3 mb-4">
                <Heart className="w-6 h-6" />
                <h3 className="text-lg font-bold">Совет дня</h3>
              </div>
              <p className="text-sm opacity-90 mb-4">
                Регулярные прогулки на свежем воздухе по 30 минут в день снижают риск 
                сердечно-сосудистых заболеваний на 35% и улучшают общее самочувствие.
              </p>
              <button className="text-sm font-medium underline hover:no-underline transition-all">
                Больше советов →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};