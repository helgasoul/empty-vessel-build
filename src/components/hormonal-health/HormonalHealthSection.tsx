
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  TrendingUp, 
  Calendar, 
  MessageCircle, 
  CheckCircle, 
  AlertTriangle,
  Stethoscope,
  Heart,
  Brain,
  Zap,
  Smile,
  Moon
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface HormonalHealthSectionProps {
  onConsultationClick?: () => void;
  onTrackingClick?: () => void;
}

const HormonalHealthSection = ({ onConsultationClick, onTrackingClick }: HormonalHealthSectionProps) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30');

  // Демо данные для гормонов
  const hormoneData = [
    {
      name: 'Эстроген',
      current: 85,
      normal: { min: 70, max: 100 },
      status: 'normal',
      color: '#ec4899',
      unit: 'пг/мл',
      description: 'Влияет на настроение, кожу и репродуктивное здоровье'
    },
    {
      name: 'Прогестерон',
      current: 12,
      normal: { min: 5, max: 20 },
      status: 'normal',
      color: '#8b5cf6',
      unit: 'нг/мл',
      description: 'Поддерживает беременность и менструальный цикл'
    },
    {
      name: 'ТТГ',
      current: 4.2,
      normal: { min: 0.5, max: 4.0 },
      status: 'high',
      color: '#06b6d4',
      unit: 'мЕд/л',
      description: 'Регулирует функцию щитовидной железы'
    },
    {
      name: 'Кортизол',
      current: 15,
      normal: { min: 6, max: 23 },
      status: 'normal',
      color: '#10b981',
      unit: 'мкг/дл',
      description: 'Гормон стресса, влияет на энергию и метаболизм'
    },
    {
      name: 'Пролактин',
      current: 18,
      normal: { min: 4, max: 23 },
      status: 'normal',
      color: '#f59e0b',
      unit: 'нг/мл',
      description: 'Связан с лактацией и репродуктивной функцией'
    }
  ];

  // Демо данные для графиков динамики
  const dynamicsData = [
    { date: '15 дек', estrogen: 82, progesterone: 11, tsh: 4.5, cortisol: 16 },
    { date: '18 дек', estrogen: 85, progesterone: 12, tsh: 4.3, cortisol: 15 },
    { date: '20 дек', estrogen: 87, progesterone: 13, tsh: 4.2, cortisol: 14 },
    { date: '22 дек', estrogen: 85, progesterone: 12, tsh: 4.2, cortisol: 15 }
  ];

  // Демо данные для симптомов
  const symptoms = [
    { name: 'Настроение', value: 4, icon: Smile, color: '#ec4899' },
    { name: 'Энергия', value: 3, icon: Zap, color: '#f59e0b' },
    { name: 'Сон', value: 5, icon: Moon, color: '#8b5cf6' },
    { name: 'Либидо', value: 4, icon: Heart, color: '#ef4444' },
    { name: 'Концентрация', value: 3, icon: Brain, color: '#06b6d4' }
  ];

  // Рекомендации по образу жизни
  const recommendations = [
    {
      category: 'Питание',
      title: 'Поддержка печени',
      description: 'Включите в рацион крестоцветные овощи и зеленый чай',
      progress: 80,
      color: '#10b981'
    },
    {
      category: 'Активность',
      title: 'Йога и медитация',
      description: '20 минут в день для снижения кортизола',
      progress: 60,
      color: '#8b5cf6'
    },
    {
      category: 'Добавки',
      title: 'Омега-3 и магний',
      description: 'Поддержка гормонального баланса',
      progress: 40,
      color: '#06b6d4'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'high':
      case 'low':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'normal':
        return 'В норме';
      case 'high':
        return 'Выше нормы';
      case 'low':
        return 'Ниже нормы';
      default:
        return 'Неизвестно';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 min-h-screen">
      {/* Заголовок раздела */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Гормональное здоровье
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Комплексный мониторинг гормонального баланса для поддержания оптимального здоровья и благополучия
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Профиль
          </TabsTrigger>
          <TabsTrigger value="symptoms" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Симптомы
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Рекомендации
          </TabsTrigger>
          <TabsTrigger value="consultation" className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Консультации
          </TabsTrigger>
        </TabsList>

        {/* Профиль гормонального баланса */}
        <TabsContent value="profile" className="space-y-6">
          {/* Фильтр по времени */}
          <div className="flex gap-2 mb-6">
            {['7', '30', '90'].map((days) => (
              <Button
                key={days}
                variant={selectedTimeframe === days ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTimeframe(days)}
                className={selectedTimeframe === days ? "bg-purple-600 hover:bg-purple-700" : ""}
              >
                {days === '7' ? '7 дней' : days === '30' ? '30 дней' : '3 месяца'}
              </Button>
            ))}
          </div>

          {/* Текущие показатели гормонов */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {hormoneData.map((hormone, index) => (
              <Card key={index} className="border-2 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg" style={{ color: hormone.color }}>
                      {hormone.name}
                    </CardTitle>
                    {getStatusIcon(hormone.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold">{hormone.current}</span>
                      <span className="text-sm text-gray-600">{hormone.unit}</span>
                    </div>
                    
                    <div className="text-sm">
                      <span className="text-gray-600">Норма: </span>
                      <span>{hormone.normal.min} - {hormone.normal.max} {hormone.unit}</span>
                    </div>
                    
                    <Badge 
                      variant={hormone.status === 'normal' ? 'default' : 'secondary'}
                      className={hormone.status === 'normal' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}
                    >
                      {getStatusText(hormone.status)}
                    </Badge>
                    
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {hormone.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* График динамики */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                Динамика показателей
              </CardTitle>
              <CardDescription>
                Изменения уровня гормонов за выбранный период
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dynamicsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px' 
                      }} 
                    />
                    <Line type="monotone" dataKey="estrogen" stroke="#ec4899" strokeWidth={2} name="Эстроген" />
                    <Line type="monotone" dataKey="tsh" stroke="#06b6d4" strokeWidth={2} name="ТТГ" />
                    <Line type="monotone" dataKey="cortisol" stroke="#10b981" strokeWidth={2} name="Кортизол" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Мониторинг симптомов */}
        <TabsContent value="symptoms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-pink-600" />
                Ежедневный трекер симптомов
              </CardTitle>
              <CardDescription>
                Отслеживайте изменения самочувствия для выявления паттернов
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {symptoms.map((symptom, index) => {
                  const IconComponent = symptom.icon;
                  return (
                    <div key={index} className="p-4 border rounded-lg bg-white/50">
                      <div className="flex items-center gap-3 mb-3">
                        <div 
                          className="p-2 rounded-full"
                          style={{ backgroundColor: `${symptom.color}20` }}
                        >
                          <IconComponent className="w-5 h-5" style={{ color: symptom.color }} />
                        </div>
                        <span className="font-medium">{symptom.name}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Оценка</span>
                          <span className="font-semibold">{symptom.value}/5</span>
                        </div>
                        <Progress 
                          value={symptom.value * 20} 
                          className="h-2"
                          style={{ 
                            '--progress-background': symptom.color 
                          } as React.CSSProperties}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <Activity className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">Корреляция с гормонами</h4>
                    <p className="text-sm text-blue-800">
                      Снижение энергии может быть связано с повышенным уровнем ТТГ. 
                      Рекомендуем консультацию с эндокринологом.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Рекомендации по образу жизни */}
        <TabsContent value="recommendations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Карточки рекомендаций */}
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <Card key={index} className="border-l-4" style={{ borderLeftColor: rec.color }}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <Badge variant="secondary" className="mb-2">
                          {rec.category}
                        </Badge>
                        <h3 className="font-semibold text-lg">{rec.title}</h3>
                        <p className="text-gray-600 text-sm">{rec.description}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Прогресс выполнения</span>
                          <span className="font-medium">{rec.progress}%</span>
                        </div>
                        <Progress value={rec.progress} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Недельный план */}
            <Card>
              <CardHeader>
                <CardTitle className="text-purple-600">План на эту неделю</CardTitle>
                <CardDescription>
                  Персонализированные рекомендации для улучшения гормонального баланса
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-800">Выполнено: 4 из 5 рекомендаций</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Отличный прогресс! Продолжайте следовать рекомендациям для поддержания баланса.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Рекомендации на завтра:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      Добавьте льняное семя в завтрак
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      15 минут йоги или медитации
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      Принять магний перед сном
                    </li>
                  </ul>
                </div>

                <Button 
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  onClick={onTrackingClick}
                >
                  Начать отслеживание
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Секция консультаций */}
        <TabsContent value="consultation" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Быстрая консультация */}
            <Card className="border-2 border-purple-200">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <MessageCircle className="w-5 h-5" />
                  Задать вопрос специалисту
                </CardTitle>
                <CardDescription>
                  Получите ответ от эндокринолога в течение 24 часов
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-800">
                      💬 Анонимный чат с врачом
                      <br />
                      🔒 Полная конфиденциальность
                      <br />
                      ⚡ Быстрые ответы на вопросы
                    </p>
                  </div>
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={onConsultationClick}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Начать чат
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Запись на консультацию */}
            <Card className="border-2 border-cyan-200">
              <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50">
                <CardTitle className="flex items-center gap-2 text-cyan-700">
                  <Stethoscope className="w-5 h-5" />
                  Записаться на прием
                </CardTitle>
                <CardDescription>
                  Персональная консультация с врачом-эндокринологом
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 border rounded-lg text-center">
                      <div className="text-sm font-medium">Видеозвонок</div>
                      <div className="text-xs text-gray-600">45 мин</div>
                    </div>
                    <div className="p-3 border rounded-lg text-center">
                      <div className="text-sm font-medium">Телефон</div>
                      <div className="text-xs text-gray-600">30 мин</div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-cyan-50 rounded-lg">
                    <div className="text-sm text-cyan-800">
                      <strong>Следующий доступный слот:</strong>
                      <br />
                      Завтра, 14:30 - 15:15
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full border-cyan-600 text-cyan-600 hover:bg-cyan-50"
                    onClick={onConsultationClick}
                  >
                    Выбрать время
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* История консультаций */}
          <Card>
            <CardHeader>
              <CardTitle>История консультаций</CardTitle>
              <CardDescription>
                Ваши предыдущие обращения и рекомендации врачей
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">Консультация эндокринолога</div>
                    <div className="text-sm text-gray-600">15 декабря 2024</div>
                    <div className="text-sm text-gray-500">Обсуждение результатов анализов ТТГ</div>
                  </div>
                  <Button variant="outline" size="sm">
                    Открыть
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">Чат с врачом</div>
                    <div className="text-sm text-gray-600">10 декабря 2024</div>
                    <div className="text-sm text-gray-500">Вопросы по гормональной контрацепции</div>
                  </div>
                  <Button variant="outline" size="sm">
                    Открыть
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Блок приватности */}
      <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-none">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Ваши данные под защитой</span>
          </div>
          <p className="text-purple-100 text-sm">
            Все медицинские данные шифруются и хранятся в соответствии с международными стандартами безопасности. 
            Мы никогда не передаем ваши данные третьим лицам без вашего согласия.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default HormonalHealthSection;
