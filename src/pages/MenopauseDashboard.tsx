
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Thermometer, 
  Moon, 
  Brain, 
  Heart,
  TrendingUp,
  Calendar,
  Stethoscope,
  Users,
  BookOpen,
  Settings
} from 'lucide-react';
import MenopauseSection from '@/components/menopause/MenopauseSection';

const MenopauseDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for dashboard
  const todaySymptoms = {
    hotFlashes: 3,
    sleepQuality: 6,
    moodRating: 7,
    energyLevel: 5
  };

  const weeklyTrends = {
    hotFlashesAvg: 2.5,
    sleepHoursAvg: 6.2,
    moodAvg: 6.8,
    energyAvg: 5.4
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Личный кабинет</h1>
            <p className="text-gray-600 mt-2">Добро пожаловать в вашу персональную систему поддержки</p>
          </div>
          <Badge className="bg-orange-100 text-orange-800">
            Активная поддержка
          </Badge>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6 mb-8 bg-white border border-orange-200">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Обзор
            </TabsTrigger>
            <TabsTrigger value="symptoms" className="flex items-center gap-2">
              <Thermometer className="w-4 h-4" />
              Симптомы
            </TabsTrigger>
            <TabsTrigger value="health" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Здоровье
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Сообщество
            </TabsTrigger>
            <TabsTrigger value="education" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Обучение
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Настройки
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Today's Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-orange-100 to-red-100 border-orange-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-orange-800">
                    <Thermometer className="w-5 h-5" />
                    Приливы сегодня
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-900 mb-2">
                    {todaySymptoms.hotFlashes}
                  </div>
                  <p className="text-sm text-orange-700">
                    В пределах нормы для вас
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-100 to-blue-100 border-purple-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-purple-800">
                    <Moon className="w-5 h-5" />
                    Качество сна
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-900 mb-2">
                    {todaySymptoms.sleepQuality}/10
                  </div>
                  <p className="text-sm text-purple-700">
                    Хорошее качество
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-100 to-emerald-100 border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <Brain className="w-5 h-5" />
                    Настроение
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-900 mb-2">
                    {todaySymptoms.moodRating}/10
                  </div>
                  <p className="text-sm text-green-700">
                    Стабильное
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-100 to-orange-100 border-yellow-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-yellow-800">
                    <Heart className="w-5 h-5" />
                    Энергия
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-900 mb-2">
                    {todaySymptoms.energyLevel}/10
                  </div>
                  <p className="text-sm text-yellow-700">
                    Умеренная
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Быстрые действия</CardTitle>
                <CardDescription>
                  Часто используемые функции для ежедневного отслеживания
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col border-orange-200 hover:bg-orange-50"
                    onClick={() => setActiveTab('symptoms')}
                  >
                    <Thermometer className="w-6 h-6 mb-2 text-orange-600" />
                    <span className="text-xs">Отметить приливы</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col border-purple-200 hover:bg-purple-50"
                    onClick={() => setActiveTab('symptoms')}
                  >
                    <Moon className="w-6 h-6 mb-2 text-purple-600" />
                    <span className="text-xs">Качество сна</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col border-green-200 hover:bg-green-50"
                    onClick={() => setActiveTab('symptoms')}
                  >
                    <Brain className="w-6 h-6 mb-2 text-green-600" />
                    <span className="text-xs">Настроение</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col border-blue-200 hover:bg-blue-50"
                    onClick={() => setActiveTab('health')}
                  >
                    <Stethoscope className="w-6 h-6 mb-2 text-blue-600" />
                    <span className="text-xs">Консультация</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Insights */}
            <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-800">
                  <TrendingUp className="w-5 h-5" />
                  Инсайты недели
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-100 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-900 mb-2">Положительная динамика</h4>
                    <p className="text-sm text-green-800">
                      Качество сна улучшилось на 15% по сравнению с прошлой неделей. 
                      Продолжайте следовать рекомендациям по гигиене сна.
                    </p>
                  </div>
                  <div className="p-4 bg-yellow-100 rounded-lg border border-yellow-200">
                    <h4 className="font-medium text-yellow-900 mb-2">Рекомендация</h4>
                    <p className="text-sm text-yellow-800">
                      Приливы чаще происходят во второй половине дня. Рассмотрите возможность 
                      корректировки питания и добавления дыхательных практик.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="symptoms">
            <MenopauseSection />
          </TabsContent>

          <TabsContent value="health">
            <Card>
              <CardHeader>
                <CardTitle>Здоровье и медицинская поддержка</CardTitle>
                <CardDescription>
                  Мониторинг показателей здоровья и доступ к специалистам
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Stethoscope className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    Раздел медицинской поддержки в разработке
                  </p>
                  <Button variant="outline">
                    Записаться на консультацию
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="community">
            <Card>
              <CardHeader>
                <CardTitle>Сообщество поддержки</CardTitle>
                <CardDescription>
                  Общение с женщинами, проходящими похожий путь
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    Сообщество в разработке
                  </p>
                  <Button variant="outline">
                    Присоединиться к бета-тестированию
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="education">
            <Card>
              <CardHeader>
                <CardTitle>Образовательные материалы</CardTitle>
                <CardDescription>
                  Научно обоснованная информация о менопаузе
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    Образовательная библиотека в разработке
                  </p>
                  <Button variant="outline">
                    Предложить тему
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Настройки</CardTitle>
                <CardDescription>
                  Персонализация вашего опыта использования платформы
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    Настройки в разработке
                  </p>
                  <Button variant="outline">
                    Обратиться в поддержку
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MenopauseDashboard;
