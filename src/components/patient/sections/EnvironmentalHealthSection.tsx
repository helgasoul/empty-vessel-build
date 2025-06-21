
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Leaf, 
  Wind, 
  Thermometer, 
  Droplets, 
  Eye, 
  MapPin, 
  Building, 
  Home,
  Factory,
  AlertTriangle,
  Info
} from 'lucide-react';
import { EnvironmentalHealth } from '@/types/patient';
import EnvironmentalHealthDashboard from '@/components/environmental/EnvironmentalHealthDashboard';

interface EnvironmentalHealthSectionProps {
  data?: EnvironmentalHealth;
  onUpdate: (data: Partial<EnvironmentalHealth>) => void;
}

export default function EnvironmentalHealthSection({ 
  data, 
  onUpdate 
}: EnvironmentalHealthSectionProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const getEnvironmentalScore = () => {
    if (!data) return null;
    
    // Рассчитываем общий экологический индекс на основе доступных данных
    let totalScore = 0;
    let factors = 0;

    if (data.livingEnvironment) {
      // Оценка жилой среды
      let livingScore = 50; // базовая оценка
      
      if (data.livingEnvironment.proximityToIndustrial === 'far') livingScore += 15;
      else if (data.livingEnvironment.proximityToIndustrial === 'very_close') livingScore -= 20;
      
      if (data.livingEnvironment.greenSpaceAccess === 'abundant') livingScore += 15;
      else if (data.livingEnvironment.greenSpaceAccess === 'none') livingScore -= 15;
      
      totalScore += Math.max(0, Math.min(100, livingScore));
      factors++;
    }

    if (data.workEnvironment) {
      // Оценка рабочей среды
      let workScore = 50;
      
      if (!data.workEnvironment.chemicalExposure) workScore += 20;
      if (!data.workEnvironment.radiationExposure) workScore += 10;
      if (data.workEnvironment.stressLevel <= 3) workScore += 10;
      else if (data.workEnvironment.stressLevel >= 8) workScore -= 15;
      
      totalScore += Math.max(0, Math.min(100, workScore));
      factors++;
    }

    return factors > 0 ? Math.round(totalScore / factors) : null;
  };

  const environmentalScore = getEnvironmentalScore();

  const getScoreColor = (score: number | null) => {
    if (!score) return 'gray';
    if (score >= 80) return 'green';
    if (score >= 60) return 'yellow';
    if (score >= 40) return 'orange';
    return 'red';
  };

  const getScoreLabel = (score: number | null) => {
    if (!score) return 'Не оценено';
    if (score >= 80) return 'Отличная экология';
    if (score >= 60) return 'Хорошая экология';
    if (score >= 40) return 'Умеренные риски';
    return 'Высокие риски';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl text-gray-800">
                  Экологическое здоровье
                </CardTitle>
                <p className="text-gray-600">
                  Влияние окружающей среды на ваше здоровье
                </p>
              </div>
            </div>
            
            <div className="text-right">
              {environmentalScore !== null ? (
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-green-600">
                    {environmentalScore}/100
                  </div>
                  <Badge 
                    variant="secondary"
                    className={`${
                      getScoreColor(environmentalScore) === 'green' ? 'bg-green-100 text-green-800' :
                      getScoreColor(environmentalScore) === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                      getScoreColor(environmentalScore) === 'orange' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}
                  >
                    {getScoreLabel(environmentalScore)}
                  </Badge>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-gray-400 text-lg">—</div>
                  <Badge variant="outline">Не оценено</Badge>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 lg:grid-cols-6 h-auto p-1">
          <TabsTrigger value="overview" className="flex items-center space-x-2 p-3">
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Обзор</span>
          </TabsTrigger>
          <TabsTrigger value="living" className="flex items-center space-x-2 p-3">
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Дом</span>
          </TabsTrigger>
          <TabsTrigger value="work" className="flex items-center space-x-2 p-3">
            <Building className="w-4 h-4" />
            <span className="hidden sm:inline">Работа</span>
          </TabsTrigger>
          <TabsTrigger value="exposures" className="flex items-center space-x-2 p-3">
            <AlertTriangle className="w-4 h-4" />
            <span className="hidden sm:inline">Риски</span>
          </TabsTrigger>
          <TabsTrigger value="air-quality" className="flex items-center space-x-2 p-3">
            <Wind className="w-4 h-4" />
            <span className="hidden sm:inline">Воздух</span>
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center space-x-2 p-3">
            <MapPin className="w-4 h-4" />
            <span className="hidden sm:inline">Мониторинг</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Environmental Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Living Environment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Home className="w-5 h-5 text-blue-600" />
                  <span>Место жительства</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data?.livingEnvironment ? (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Тип жилья:</span>
                      <span className="text-sm font-medium">
                        {data.livingEnvironment.housingType === 'apartment' ? 'Квартира' :
                         data.livingEnvironment.housingType === 'house' ? 'Дом' : 'Другое'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Промышленность:</span>
                      <Badge variant={
                        data.livingEnvironment.proximityToIndustrial === 'far' ? 'default' :
                        data.livingEnvironment.proximityToIndustrial === 'very_close' ? 'destructive' : 'secondary'
                      }>
                        {data.livingEnvironment.proximityToIndustrial === 'far' ? 'Далеко' :
                         data.livingEnvironment.proximityToIndustrial === 'very_close' ? 'Очень близко' : 'Близко'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Зеленые зоны:</span>
                      <Badge variant={
                        data.livingEnvironment.greenSpaceAccess === 'abundant' ? 'default' :
                        data.livingEnvironment.greenSpaceAccess === 'none' ? 'destructive' : 'secondary'
                      }>
                        {data.livingEnvironment.greenSpaceAccess === 'abundant' ? 'Много' :
                         data.livingEnvironment.greenSpaceAccess === 'none' ? 'Нет' : 'Умеренно'}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500 text-sm">Данные не заполнены</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => setActiveTab('living')}
                    >
                      Заполнить
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Work Environment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="w-5 h-5 text-purple-600" />
                  <span>Рабочая среда</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data?.workEnvironment ? (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Тип работы:</span>
                      <span className="text-sm font-medium">
                        {data.workEnvironment.type === 'office' ? 'Офис' :
                         data.workEnvironment.type === 'industrial' ? 'Промышленность' :
                         data.workEnvironment.type === 'outdoor' ? 'На улице' : 'Другое'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Химвоздействие:</span>
                      <Badge variant={data.workEnvironment.chemicalExposure ? 'destructive' : 'default'}>
                        {data.workEnvironment.chemicalExposure ? 'Есть' : 'Нет'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Часов в день:</span>
                      <span className="text-sm font-medium">{data.workEnvironment.workHours}ч</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Стресс:</span>
                      <Badge variant={
                        data.workEnvironment.stressLevel >= 8 ? 'destructive' :
                        data.workEnvironment.stressLevel >= 5 ? 'secondary' : 'default'
                      }>
                        {data.workEnvironment.stressLevel}/10
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500 text-sm">Данные не заполнены</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => setActiveTab('work')}
                    >
                      Заполнить
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Environmental Exposures */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <span>Воздействия</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data?.exposures && data.exposures.length > 0 ? (
                  <div className="space-y-2">
                    {data.exposures.slice(0, 3).map((exposure, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-sm text-gray-600 truncate">
                          {exposure.substance}
                        </span>
                        <Badge variant={
                          exposure.exposureLevel === 'high' ? 'destructive' :
                          exposure.exposureLevel === 'moderate' ? 'secondary' : 'default'
                        }>
                          {exposure.exposureLevel === 'high' ? 'Высокий' :
                           exposure.exposureLevel === 'moderate' ? 'Средний' : 'Низкий'}
                        </Badge>
                      </div>
                    ))}
                    {data.exposures.length > 3 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{data.exposures.length - 3} еще
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500 text-sm">Воздействия не выявлены</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => setActiveTab('exposures')}
                    >
                      Добавить
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          {environmentalScore !== null && environmentalScore < 70 && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <div className="font-medium">Рекомендации по улучшению экологической обстановки:</div>
                  <ul className="text-sm list-disc list-inside space-y-1">
                    {environmentalScore < 50 && (
                      <>
                        <li>Рассмотрите возможность смены места жительства или работы</li>
                        <li>Используйте очистители воздуха в помещении</li>
                      </>
                    )}
                    {environmentalScore < 70 && (
                      <>
                        <li>Увеличьте время пребывания в зеленых зонах</li>
                        <li>Регулярно проветривайте помещения</li>
                        <li>Используйте фильтры для воды</li>
                      </>
                    )}
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="living">
          <Card>
            <CardHeader>
              <CardTitle>Жилая среда</CardTitle>
              <p className="text-sm text-gray-600">
                Информация о вашем месте жительства и его влиянии на здоровье
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Home className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Анкета жилой среды
                </h3>
                <p className="text-gray-600 mb-4">
                  Заполните анкету для оценки влияния вашего дома на здоровье
                </p>
                <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                  Заполнить анкету
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="work">
          <Card>
            <CardHeader>
              <CardTitle>Рабочая среда</CardTitle>
              <p className="text-sm text-gray-600">
                Информация о вашем рабочем месте и профессиональных рисках
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Building className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Анкета рабочей среды
                </h3>
                <p className="text-gray-600 mb-4">
                  Оцените профессиональные риски для вашего здоровья
                </p>
                <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
                  Заполнить анкету
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exposures">
          <Card>
            <CardHeader>
              <CardTitle>Экологические воздействия</CardTitle>
              <p className="text-sm text-gray-600">
                Потенциальные воздействия окружающей среды на ваше здоровье
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Оценка воздействий
                </h3>
                <p className="text-gray-600 mb-4">
                  Добавьте информацию о потенциальных экологических рисках
                </p>
                <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                  Добавить воздействие
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="air-quality">
          <Card>
            <CardHeader>
              <CardTitle>Качество воздуха</CardTitle>
              <p className="text-sm text-gray-600">
                Мониторинг качества воздуха в вашем регионе
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Wind className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Мониторинг воздуха
                </h3>
                <p className="text-gray-600 mb-4">
                  Отслеживайте качество воздуха в режиме реального времени
                </p>
                <Button className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700">
                  Включить мониторинг
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring">
          <Card>
            <CardHeader>
              <CardTitle>Экологический мониторинг</CardTitle>
              <p className="text-sm text-gray-600">
                Полный мониторинг экологической обстановки
              </p>
            </CardHeader>
            <CardContent>
              {/* Встроенный компонент мониторинга */}
              <EnvironmentalHealthDashboard />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
