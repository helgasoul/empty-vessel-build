
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Thermometer, 
  Moon, 
  Brain, 
  Smile, 
  Calendar, 
  Heart,
  TrendingUp,
  Star,
  CheckCircle,
  BookOpen,
  Video,
  MessageCircle,
  Stethoscope,
  Shield,
  Award,
  Eye,
  Coffee
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface MenopauseSectionProps {
  onConsultationClick?: () => void;
  onSpecialistClick?: () => void;
}

const MenopauseSection = ({ onConsultationClick, onSpecialistClick }: MenopauseSectionProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  // Данные симптомов
  const symptoms = [
    { 
      name: 'Приливы', 
      icon: Thermometer, 
      intensity: 3, 
      frequency: 4, 
      color: '#D2691E',
      description: 'Частота и интенсивность приливов'
    },
    { 
      name: 'Сон', 
      icon: Moon, 
      intensity: 2, 
      frequency: 5, 
      color: '#8B4F99',
      description: 'Качество и продолжительность сна'
    },
    { 
      name: 'Концентрация', 
      icon: Brain, 
      intensity: 4, 
      frequency: 3, 
      color: '#CD853F',
      description: 'Когнитивные функции и память'
    },
    { 
      name: 'Настроение', 
      icon: Smile, 
      intensity: 3, 
      frequency: 4, 
      color: '#BC8F8F',
      description: 'Эмоциональное состояние'
    }
  ];

  // Данные графика симптомов
  const symptomsData = [
    { day: 'Пн', hot_flashes: 3, sleep: 2, mood: 4, concentration: 3 },
    { day: 'Вт', hot_flashes: 4, sleep: 3, mood: 3, concentration: 4 },
    { day: 'Ср', hot_flashes: 2, sleep: 2, mood: 5, concentration: 2 },
    { day: 'Чт', hot_flashes: 5, sleep: 4, mood: 2, concentration: 5 },
    { day: 'Пт', hot_flashes: 3, sleep: 3, mood: 4, concentration: 3 },
    { day: 'Сб', hot_flashes: 2, sleep: 2, mood: 5, concentration: 2 },
    { day: 'Вс', hot_flashes: 3, sleep: 3, mood: 4, concentration: 3 }
  ];

  // Программы поддержки
  const supportPrograms = [
    {
      category: 'Питание',
      title: 'Поддержка костной ткани',
      description: 'Кальций, витамин D и продукты для здоровья костей',
      progress: 75,
      color: '#D2691E',
      isFavorite: true
    },
    {
      category: 'Добавки',
      title: 'Фитоэстрогены и магний',
      description: 'Натуральная поддержка гормонального баланса',
      progress: 60,
      color: '#8B4F99',
      isFavorite: false
    },
    {
      category: 'Активность',
      title: 'Йога и суставная гимнастика',
      description: 'Мягкие упражнения для поддержания гибкости',
      progress: 85,
      color: '#CD853F',
      isFavorite: true
    },
    {
      category: 'Ментальное здоровье',
      title: 'Дыхательные практики',
      description: 'Техники релаксации и управления стрессом',
      progress: 45,
      color: '#BC8F8F',
      isFavorite: false
    }
  ];

  // Образовательный контент
  const educationalContent = [
    {
      title: 'Что такое менопауза и как к ней готовиться',
      type: 'article',
      badge: '🔍 Научно',
      duration: '15 мин',
      isPopular: true
    },
    {
      title: 'Мифы о ЗГТ: разбираем с экспертом',
      type: 'video',
      badge: '💬 Опыт врача',
      duration: '25 мин',
      isPopular: true
    },
    {
      title: 'Питание для здоровья костей после 45',
      type: 'webinar',
      badge: '📽 Видео',
      duration: '40 мин',
      isPopular: false
    },
    {
      title: 'Секс и либидо в период менопаузы',
      type: 'podcast',
      badge: '💬 Опыт врача',
      duration: '30 мин',
      isPopular: true
    }
  ];

  // Специалисты
  const specialists = [
    {
      name: 'Анна Петровна Иванова',
      specialty: 'Гинеколог-эндокринолог',
      experience: '15 лет',
      rating: 4.9,
      topics: ['ЗГТ', 'приливы', 'метаболизм'],
      available: 'Завтра, 14:00'
    },
    {
      name: 'Мария Сергеевна Козлова',
      specialty: 'Психолог',
      experience: '12 лет',
      rating: 4.8,
      topics: ['настроение', 'стресс', 'сон'],
      available: 'Сегодня, 18:30'
    }
  ];

  const getIntensityColor = (intensity: number) => {
    if (intensity <= 2) return '#7BC4A4';
    if (intensity <= 3) return '#E8B87A';
    return '#E8A07A';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50 min-h-screen">
      {/* Заголовок раздела */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-semibold text-amber-800 mb-4">
          Поддержка в период менопаузы
        </h2>
        <p className="text-lg text-amber-700 max-w-2xl mx-auto leading-relaxed">
          Теплое и экспертное сопровождение на важном этапе жизни. Без стыда, без давления — только забота и поддержка
        </p>
      </div>

      <Tabs defaultValue="monitoring" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8 bg-amber-100">
          <TabsTrigger value="monitoring" className="flex items-center gap-2 data-[state=active]:bg-amber-200">
            <Calendar className="w-4 h-4" />
            Мониторинг
          </TabsTrigger>
          <TabsTrigger value="support" className="flex items-center gap-2 data-[state=active]:bg-amber-200">
            <Heart className="w-4 h-4" />
            Поддержка
          </TabsTrigger>
          <TabsTrigger value="education" className="flex items-center gap-2 data-[state=active]:bg-amber-200">
            <BookOpen className="w-4 h-4" />
            Образование
          </TabsTrigger>
          <TabsTrigger value="specialists" className="flex items-center gap-2 data-[state=active]:bg-amber-200">
            <Stethoscope className="w-4 h-4" />
            Специалисты
          </TabsTrigger>
        </TabsList>

        {/* Персональный мониторинг симптомов */}
        <TabsContent value="monitoring" className="space-y-6">
          {/* Фильтр по периоду */}
          <div className="flex gap-2 mb-6">
            {['day', 'week', 'month'].map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
                className={selectedPeriod === period ? "bg-amber-600 hover:bg-amber-700" : "border-amber-300 text-amber-700"}
              >
                {period === 'day' ? 'День' : period === 'week' ? 'Неделя' : 'Месяц'}
              </Button>
            ))}
          </div>

          {/* Карточки симптомов */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {symptoms.map((symptom, index) => {
              const IconComponent = symptom.icon;
              return (
                <Card key={index} className="border-2 hover:shadow-lg transition-shadow" style={{ borderColor: `${symptom.color}40` }}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div 
                        className="p-3 rounded-full"
                        style={{ backgroundColor: `${symptom.color}20` }}
                      >
                        <IconComponent className="w-6 h-6" style={{ color: symptom.color }} />
                      </div>
                      <Badge 
                        variant="secondary" 
                        style={{ backgroundColor: getIntensityColor(symptom.intensity), color: 'white' }}
                      >
                        {symptom.intensity}/5
                      </Badge>
                    </div>
                    <CardTitle className="text-lg" style={{ color: symptom.color }}>
                      {symptom.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">{symptom.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Интенсивность</span>
                          <span className="font-medium">{symptom.intensity}/5</span>
                        </div>
                        <Progress 
                          value={symptom.intensity * 20} 
                          className="h-2"
                          style={{ 
                            backgroundColor: `${symptom.color}20`
                          }}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Частота</span>
                          <span className="font-medium">{symptom.frequency} раз</span>
                        </div>
                        <Progress 
                          value={symptom.frequency * 20} 
                          className="h-2"
                          style={{ 
                            backgroundColor: `${symptom.color}20`
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* График динамики симптомов */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-800">
                <TrendingUp className="w-5 h-5" />
                Динамика симптомов за неделю
              </CardTitle>
              <CardDescription>
                Отслеживание изменений для выявления паттернов
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={symptomsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px' 
                      }} 
                    />
                    <Line type="monotone" dataKey="hot_flashes" stroke="#D2691E" strokeWidth={2} name="Приливы" />
                    <Line type="monotone" dataKey="sleep" stroke="#8B4F99" strokeWidth={2} name="Сон" />
                    <Line type="monotone" dataKey="mood" stroke="#BC8F8F" strokeWidth={2} name="Настроение" />
                    <Line type="monotone" dataKey="concentration" stroke="#CD853F" strokeWidth={2} name="Концентрация" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Инсайт недели */}
          <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Eye className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-900 mb-1">Инсайт недели</h4>
                  <p className="text-sm text-amber-800">
                    Приливы усиливаются в середине недели. Рекомендуем добавить дыхательные практики 
                    и ограничить кофеин в эти дни.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Программа поддержки */}
        <TabsContent value="support" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Карточки программ */}
            <div className="space-y-4">
              {supportPrograms.map((program, index) => (
                <Card key={index} className="border-l-4 hover:shadow-lg transition-shadow" style={{ borderLeftColor: program.color }}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" style={{ backgroundColor: `${program.color}20`, color: program.color }}>
                              {program.category}
                            </Badge>
                            {program.isFavorite && <Star className="w-4 h-4 text-amber-500 fill-current" />}
                          </div>
                          <h3 className="font-semibold text-lg mb-1">{program.title}</h3>
                          <p className="text-gray-600 text-sm">{program.description}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Прогресс выполнения</span>
                          <span className="font-medium">{program.progress}%</span>
                        </div>
                        <Progress value={program.progress} className="h-2" />
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          {program.isFavorite ? 'В избранном' : 'В избранное'}
                        </Button>
                        <Button size="sm" className="flex-1" style={{ backgroundColor: program.color }}>
                          Выполнено
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* План фокуса недели */}
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-amber-100 to-orange-100 border-amber-200">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Coffee className="w-5 h-5 text-amber-700" />
                    <CardTitle className="text-amber-800">План-фокус: "Неделя качественного сна"</CardTitle>
                  </div>
                  <CardDescription className="text-amber-700">
                    Специальная программа для улучшения сна в период менопаузы
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-green-800">Выполнено: 5 из 7 рекомендаций</span>
                    </div>
                    <p className="text-sm text-green-700">
                      Отличные результаты! Продолжайте следовать режиму сна.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-amber-800">Рекомендации на завтра:</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        Магний за 2 часа до сна
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        Прохладная спальня (18-20°C)
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        Дыхательная практика 4-7-8
                      </li>
                    </ul>
                  </div>

                  <Button className="w-full bg-amber-600 hover:bg-amber-700">
                    Продолжить программу
                  </Button>
                </CardContent>
              </Card>

              {/* Мотивация */}
              <Card className="border-2 border-orange-200">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Award className="w-6 h-6 text-orange-600" />
                    <span className="font-semibold text-orange-800">3 недели с заботой о себе</span>
                  </div>
                  <p className="text-sm text-orange-700 mb-4">
                    Вы заботитесь о себе уже 21 день подряд! Это отличный результат.
                  </p>
                  <div className="flex items-center justify-center gap-1">
                    {[...Array(7)].map((_, i) => (
                      <div key={i} className={`w-3 h-3 rounded-full ${i < 5 ? 'bg-orange-400' : 'bg-orange-200'}`} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Образование и поддержка */}
        <TabsContent value="education" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {educationalContent.map((content, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-2 border-orange-100">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {content.type === 'video' && <Video className="w-4 h-4 text-orange-600" />}
                      {content.type === 'article' && <BookOpen className="w-4 h-4 text-orange-600" />}
                      {content.type === 'webinar' && <Video className="w-4 h-4 text-orange-600" />}
                      {content.type === 'podcast' && <MessageCircle className="w-4 h-4 text-orange-600" />}
                      <Badge variant="secondary" className="text-xs">
                        {content.badge}
                      </Badge>
                    </div>
                    {content.isPopular && (
                      <Badge className="bg-orange-500 text-white">
                        Популярно
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg text-orange-800 leading-tight">
                    {content.title}
                  </CardTitle>
                  <CardDescription className="text-orange-600">
                    {content.duration}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 border-orange-300 text-orange-700">
                      Сохранить
                    </Button>
                    <Button size="sm" className="flex-1 bg-orange-600 hover:bg-orange-700">
                      Читать
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-orange-800 mb-2">
                Еженедельная подборка
              </h3>
              <p className="text-orange-700 mb-4">
                Получайте персонализированные статьи и видео на email каждую неделю
              </p>
              <Button className="bg-orange-600 hover:bg-orange-700">
                Подписаться на рассылку
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Запись к специалисту */}
        <TabsContent value="specialists" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {specialists.map((specialist, index) => (
              <Card key={index} className="border-2 border-amber-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-amber-800">{specialist.name}</CardTitle>
                      <CardDescription className="text-amber-700">
                        {specialist.specialty} • {specialist.experience}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{specialist.rating}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-amber-800 mb-2">Специализация:</h4>
                    <div className="flex flex-wrap gap-1">
                      {specialist.topics.map((topic, topicIndex) => (
                        <Badge key={topicIndex} variant="secondary" className="bg-amber-100 text-amber-800">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-sm text-green-800">
                      <strong>Ближайший слот:</strong>
                      <br />
                      {specialist.available}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="border-amber-300 text-amber-700">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Чат
                    </Button>
                    <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                      <Video className="w-4 h-4 mr-1" />
                      Видео
                    </Button>
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                    onClick={onSpecialistClick}
                  >
                    Записаться на прием
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Быстрая запись */}
          <Card className="bg-gradient-to-r from-amber-100 to-orange-100 border-amber-200">
            <CardHeader>
              <CardTitle className="text-amber-800">Быстрая запись</CardTitle>
              <CardDescription className="text-amber-700">
                Выберите тему консультации для быстрого подбора специалиста
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Начать ЗГТ', 'Проблемы со сном', 'Приливы', 'Настроение'].map((topic, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-16 flex-col border-amber-300 text-amber-700 hover:bg-amber-50"
                    onClick={onConsultationClick}
                  >
                    <span className="text-sm text-center">{topic}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Блок безопасности и поддержки */}
      <Card className="bg-gradient-to-r from-amber-600 to-orange-600 text-white border-none">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Shield className="w-6 h-6" />
              <span className="font-semibold text-lg">Ваш комфорт — наш приоритет</span>
            </div>
            <p className="text-amber-100 text-sm max-w-2xl mx-auto leading-relaxed">
              Мы понимаем, что менопауза — это не болезнь, а естественный этап жизни. 
              Все ваши данные надежно защищены и используются только для вашего благополучия. 
              Никакого давления, никакого стыда — только теплая поддержка и экспертная помощь.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-amber-100 mt-4">
              <span>🔒 Полная конфиденциальность</span>
              <span>❤️ Эмпатичный подход</span>
              <span>📱 Удобная навигация</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MenopauseSection;
