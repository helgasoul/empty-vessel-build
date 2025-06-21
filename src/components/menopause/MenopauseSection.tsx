
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Heart, 
  BookOpen, 
  Stethoscope,
  Shield,
  Video,
  MessageCircle,
  Coffee,
  CheckCircle,
  Award
} from "lucide-react";
import MonitoringTab from './components/MonitoringTab';
import SupportProgramCard from './components/SupportProgramCard';
import SpecialistCard from './components/SpecialistCard';

interface MenopauseSectionProps {
  onConsultationClick?: () => void;
  onSupportClick?: () => void;
  onSpecialistClick?: () => void;
}

const MenopauseSection = ({ onConsultationClick, onSupportClick, onSpecialistClick }: MenopauseSectionProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

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
        <TabsContent value="monitoring">
          <MonitoringTab 
            selectedPeriod={selectedPeriod} 
            setSelectedPeriod={setSelectedPeriod} 
          />
        </TabsContent>

        {/* Программа поддержки */}
        <TabsContent value="support" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Карточки программ */}
            <div className="space-y-4">
              {supportPrograms.map((program, index) => (
                <SupportProgramCard 
                  key={index} 
                  {...program} 
                  onSupportClick={onSupportClick} 
                />
              ))}
            </div>

            {/* План фокуса недели */}
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-amber-100 to-orange-100 border-amber-200">
                <Card className="bg-gradient-to-br from-amber-100 to-orange-100 border-amber-200">
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Coffee className="w-5 h-5 text-amber-700" />
                      <h3 className="text-lg font-semibold text-amber-800">План-фокус: "Неделя качественного сна"</h3>
                    </div>
                    <p className="text-amber-700 mb-4">
                      Специальная программа для улучшения сна в период менопаузы
                    </p>
                    
                    <div className="space-y-4">
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

                      <Button 
                        className="w-full bg-amber-600 hover:bg-amber-700"
                        onClick={onSupportClick}
                      >
                        Продолжить программу
                      </Button>
                    </div>
                  </div>
                </Card>
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
                <div className="p-6">
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
                  <h3 className="text-lg text-orange-800 leading-tight mb-2">
                    {content.title}
                  </h3>
                  <p className="text-orange-600 mb-4">
                    {content.duration}
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 border-orange-300 text-orange-700">
                      Сохранить
                    </Button>
                    <Button size="sm" className="flex-1 bg-orange-600 hover:bg-orange-700">
                      Читать
                    </Button>
                  </div>
                </div>
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
              <SpecialistCard 
                key={index} 
                {...specialist} 
                onSpecialistClick={onSpecialistClick} 
              />
            ))}
          </div>

          {/* Быстрая запись */}
          <Card className="bg-gradient-to-r from-amber-100 to-orange-100 border-amber-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-amber-800 mb-2">Быстрая запись</h3>
              <p className="text-amber-700 mb-4">
                Выберите тему консультации для быстрого подбора специалиста
              </p>
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
            </div>
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
