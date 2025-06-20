
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { 
  Baby, 
  Heart, 
  Calendar as CalendarIcon,
  FileText,
  BookOpen,
  Video,
  CheckCircle,
  Clock,
  Upload,
  Stethoscope,
  Apple,
  Activity,
  Flower2,
  Shield
} from 'lucide-react';
import BackButton from '@/components/ui/back-button';
import { format, addDays, isSameDay } from 'date-fns';
import { ru } from 'date-fns/locale';

const PregnancyPlanningPage = () => {
  const { user, loading } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [planningStatus, setPlanningStatus] = useState<'preparing' | 'active' | 'consultation'>('active');

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Загрузка...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Моковые данные для фертильного календаря
  const getFertilityInfo = (date: Date) => {
    const day = date.getDate();
    if (day >= 12 && day <= 16) return { type: 'fertile', label: 'Фертильные дни' };
    if (day === 14) return { type: 'ovulation', label: 'Овуляция' };
    if (day >= 10 && day <= 18) return { type: 'window', label: 'Окно зачатия' };
    return { type: 'normal', label: 'Обычный день' };
  };

  const requiredTests = [
    { id: 1, name: 'Гормональный профиль', category: 'Гормоны', completed: true, uploadedAt: '2024-06-15' },
    { id: 2, name: 'УЗИ органов малого таза', category: 'УЗИ', completed: true, uploadedAt: '2024-06-10' },
    { id: 3, name: 'Анализ на инфекции TORCH', category: 'Инфекции', completed: false },
    { id: 4, name: 'Генетическое консультирование', category: 'Генетика', completed: false },
    { id: 5, name: 'Общий и биохимический анализ крови', category: 'Кровь', completed: true, uploadedAt: '2024-06-12' },
    { id: 6, name: 'Анализ на витамины и микроэлементы', category: 'Витамины', completed: false },
  ];

  const completedTests = requiredTests.filter(test => test.completed).length;
  const progressPercentage = Math.round((completedTests / requiredTests.length) * 100);

  const educationalContent = [
    {
      id: 1,
      title: 'Питание до зачатия',
      description: 'Оптимальная диета для подготовки к беременности',
      duration: '8 мин',
      verified: true,
      category: 'Питание'
    },
    {
      id: 2,
      title: 'Фолиевая кислота и витамины',
      description: 'Важность витаминов в планировании беременности',
      duration: '6 мин',
      verified: true,
      category: 'Витамины'
    },
    {
      id: 3,
      title: 'Физическая активность при планировании',
      description: 'Безопасные упражнения и их влияние на фертильность',
      duration: '10 мин',
      verified: true,
      category: 'Спорт'
    },
    {
      id: 4,
      title: 'Стресс и зачатие',
      description: 'Управление стрессом для повышения шансов зачатия',
      duration: '7 мин',
      verified: true,
      category: 'Психология'
    }
  ];

  const getStatusInfo = () => {
    switch (planningStatus) {
      case 'preparing':
        return { 
          color: 'bg-amber-100 text-amber-800', 
          icon: '🟠', 
          label: 'Подготовка',
          description: 'Собираем информацию и проходим обследования'
        };
      case 'active':
        return { 
          color: 'bg-green-100 text-green-800', 
          icon: '🟢', 
          label: 'Активное планирование',
          description: 'Отслеживаем циклы и оптимальные дни для зачатия'
        };
      case 'consultation':
        return { 
          color: 'bg-blue-100 text-blue-800', 
          icon: '🔵', 
          label: 'Консультация',
          description: 'Работаем со специалистом для решения вопросов'
        };
      default:
        return { 
          color: 'bg-gray-100 text-gray-800', 
          icon: '⚪', 
          label: 'Не определен',
          description: ''
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <BackButton fallbackPath="/womens-health-demo" className="mb-6" />
        
        <div className="max-w-6xl mx-auto">
          {/* Заголовок и статус */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full">
                <Baby className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800">Планирование беременности</h1>
            </div>
            
            <Badge className={`${statusInfo.color} text-lg px-4 py-2 mb-2`}>
              {statusInfo.icon} {statusInfo.label}
            </Badge>
            <p className="text-gray-600 max-w-2xl mx-auto">{statusInfo.description}</p>
          </div>

          <Tabs defaultValue="status" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="status" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Статус
              </TabsTrigger>
              <TabsTrigger value="tests" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Анализы
              </TabsTrigger>
              <TabsTrigger value="education" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Обучение
              </TabsTrigger>
              <TabsTrigger value="consultation" className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                Консультации
              </TabsTrigger>
            </TabsList>

            <TabsContent value="status" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Календарь фертильности */}
                <Card className="border-2 border-blue-200">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                    <CardTitle className="flex items-center gap-2 text-blue-700">
                      <CalendarIcon className="w-5 h-5" />
                      Календарь фертильности
                    </CardTitle>
                    <CardDescription>
                      Оптимальные дни для зачатия в этом цикле
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      locale={ru}
                      className="w-full"
                      modifiers={{
                        fertile: (date) => {
                          const day = date.getDate();
                          return day >= 12 && day <= 16;
                        },
                        ovulation: (date) => date.getDate() === 14,
                      }}
                      modifiersStyles={{
                        fertile: { 
                          backgroundColor: '#dbeafe', 
                          color: '#1e40af',
                          fontWeight: 'bold'
                        },
                        ovulation: { 
                          backgroundColor: '#fef3c7', 
                          color: '#d97706',
                          fontWeight: 'bold'
                        }
                      }}
                    />
                    {selectedDate && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-blue-800">
                          {format(selectedDate, 'dd MMMM yyyy', { locale: ru })}
                        </p>
                        <p className="text-sm text-blue-600">
                          {getFertilityInfo(selectedDate).label}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Рекомендации на сегодня */}
                <Card className="border-2 border-purple-200">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                    <CardTitle className="flex items-center gap-2 text-purple-700">
                      <Heart className="w-5 h-5" />
                      Рекомендации на сегодня
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <Apple className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-800">Принять фолиевую кислоту</p>
                        <p className="text-sm text-green-600">400 мкг утром</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Activity className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-800">Умеренная физическая активность</p>
                        <p className="text-sm text-blue-600">30 минут ходьбы или йоги</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <Flower2 className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="font-medium text-purple-800">Практика релаксации</p>
                        <p className="text-sm text-purple-600">Медитация или дыхательные упражнения</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="tests" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Прогресс анализов
                  </CardTitle>
                  <CardDescription>
                    Выполнено {completedTests} из {requiredTests.length} обследований
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-6">
                    <Progress value={progressPercentage} className="flex-1" />
                    <span className="font-bold text-lg text-blue-600">{progressPercentage}%</span>
                  </div>
                  
                  <div className="grid gap-4">
                    {requiredTests.map((test) => (
                      <div key={test.id} className={`p-4 rounded-lg border-2 ${
                        test.completed 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-gray-50 border-gray-200'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {test.completed ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <Clock className="w-5 h-5 text-gray-400" />
                            )}
                            <div>
                              <h4 className="font-medium">{test.name}</h4>
                              <p className="text-sm text-gray-600">{test.category}</p>
                              {test.uploadedAt && (
                                <p className="text-xs text-green-600">
                                  Загружено {format(new Date(test.uploadedAt), 'dd.MM.yyyy')}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          {!test.completed && (
                            <Button size="sm" variant="outline" className="gap-2">
                              <Upload className="w-4 h-4" />
                              Загрузить
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="education" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {educationalContent.map((content) => (
                  <Card key={content.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{content.title}</CardTitle>
                        {content.verified && (
                          <Badge className="bg-green-100 text-green-800">
                            <Shield className="w-3 h-3 mr-1" />
                            Проверено врачом
                          </Badge>
                        )}
                      </div>
                      <CardDescription>{content.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          {content.duration}
                          <Badge variant="outline">{content.category}</Badge>
                        </div>
                        <Button size="sm">Читать</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="consultation" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { 
                    type: 'Гинекология', 
                    icon: '👩‍⚕️', 
                    description: 'Консультация гинеколога по планированию беременности',
                    available: true
                  },
                  { 
                    type: 'Генетика', 
                    icon: '🧬', 
                    description: 'Генетическое консультирование и анализ рисков',
                    available: true
                  },
                  { 
                    type: 'Психологическая поддержка', 
                    icon: '🤱', 
                    description: 'Работа с психологом по подготовке к родительству',
                    available: false
                  }
                ].map((consultation, index) => (
                  <Card key={index} className={`${
                    consultation.available 
                      ? 'border-green-200 hover:shadow-lg' 
                      : 'border-gray-200 opacity-75'
                  } transition-all`}>
                    <CardHeader className="text-center">
                      <div className="text-4xl mb-2">{consultation.icon}</div>
                      <CardTitle className="text-lg">{consultation.type}</CardTitle>
                      <CardDescription>{consultation.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <Button 
                        className="w-full" 
                        disabled={!consultation.available}
                        variant={consultation.available ? "default" : "secondary"}
                      >
                        {consultation.available ? 'Записаться' : 'Скоро доступно'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Stethoscope className="w-8 h-8 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-blue-800">Следующая консультация</h3>
                      <p className="text-blue-600">Запланирована на 25 июня в 14:00 с гинекологом</p>
                      <p className="text-sm text-blue-500">Онлайн консультация через видеозвонок</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PregnancyPlanningPage;
