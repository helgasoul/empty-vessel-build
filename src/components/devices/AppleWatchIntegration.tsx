
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Watch, 
  Heart, 
  Activity, 
  Moon, 
  Footprints,
  Battery,
  CheckCircle,
  AlertCircle,
  Smartphone,
  TrendingUp,
  Calendar,
  Timer
} from 'lucide-react';
import { useAppleWatch } from '@/hooks/useAppleWatch';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const AppleWatchIntegration = () => {
  const { 
    isConnected, 
    connectionStatus, 
    healthData, 
    workoutData,
    batteryLevel,
    lastSync,
    connectToAppleWatch,
    syncHealthData,
    isLoading 
  } = useAppleWatch();

  const [activeTab, setActiveTab] = useState('overview');

  const getStatusBadge = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800">Подключены</Badge>;
      case 'syncing':
        return <Badge className="bg-blue-100 text-blue-800">Синхронизация</Badge>;
      case 'error':
        return <Badge variant="destructive">Ошибка подключения</Badge>;
      default:
        return <Badge variant="outline">Не подключены</Badge>;
    }
  };

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'syncing':
        return <Activity className="w-5 h-5 text-blue-500 animate-pulse" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Watch className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Watch className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <span>Apple Watch</span>
                  {getConnectionStatusIcon()}
                </CardTitle>
                <CardDescription>
                  Синхронизация данных о здоровье и активности
                </CardDescription>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {getStatusBadge()}
              {batteryLevel && (
                <div className="flex items-center space-x-2">
                  <Battery className="w-4 h-4 text-gray-500" />
                  <Progress value={batteryLevel} className="w-16" />
                  <span className="text-sm text-gray-600">{batteryLevel}%</span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {!isConnected ? (
        /* Connection Setup */
        <Card>
          <CardContent className="text-center py-12">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Watch className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Подключить Apple Watch</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Синхронизируйте данные о здоровье, активности, сне и тренировках с вашего Apple Watch
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-center space-x-3 text-sm text-gray-600">
                <Heart className="w-4 h-4 text-red-500" />
                <span>Пульс и вариабельность</span>
              </div>
              <div className="flex items-center justify-center space-x-3 text-sm text-gray-600">
                <Activity className="w-4 h-4 text-green-500" />
                <span>Активность и тренировки</span>
              </div>
              <div className="flex items-center justify-center space-x-3 text-sm text-gray-600">
                <Moon className="w-4 h-4 text-purple-500" />
                <span>Анализ сна</span>
              </div>
              <div className="flex items-center justify-center space-x-3 text-sm text-gray-600">
                <Footprints className="w-4 h-4 text-blue-500" />
                <span>Шаги и калории</span>
              </div>
            </div>

            <Button 
              onClick={connectToAppleWatch}
              disabled={isLoading}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <Activity className="w-4 h-4 mr-2 animate-spin" />
                  Подключение...
                </>
              ) : (
                <>
                  <Smartphone className="w-4 h-4 mr-2" />
                  Подключить через Health App
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Connected View */
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Обзор</TabsTrigger>
            <TabsTrigger value="health">Здоровье</TabsTrigger>
            <TabsTrigger value="activity">Активность</TabsTrigger>
            <TabsTrigger value="workouts">Тренировки</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Пульс</p>
                      <p className="text-2xl font-bold text-red-600">
                        {healthData?.currentHeartRate || '--'}
                        <span className="text-sm text-gray-500 ml-1">bpm</span>
                      </p>
                    </div>
                    <Heart className="w-8 h-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Шаги</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {healthData?.todaySteps?.toLocaleString('ru-RU') || '--'}
                      </p>
                    </div>
                    <Footprints className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Активность</p>
                      <p className="text-2xl font-bold text-green-600">
                        {healthData?.activeMinutes || '--'}
                        <span className="text-sm text-gray-500 ml-1">мин</span>
                      </p>
                    </div>
                    <Activity className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Сон</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {healthData?.lastNightSleep || '--'}
                        <span className="text-sm text-gray-500 ml-1">ч</span>
                      </p>
                    </div>
                    <Moon className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {lastSync && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Последняя синхронизация: {format(new Date(lastSync), 'dd.MM.yyyy в HH:mm', { locale: ru })}
                      </span>
                    </div>
                    <Button variant="outline" size="sm" onClick={syncHealthData}>
                      Синхронизировать
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="health">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Показатели здоровья</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Пульс</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Текущий</span>
                          <span className="font-medium">{healthData?.currentHeartRate || '--'} bpm</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Покой</span>
                          <span className="font-medium">{healthData?.restingHeartRate || '--'} bpm</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Макс. за день</span>
                          <span className="font-medium">{healthData?.maxHeartRate || '--'} bpm</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Вариабельность пульса</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">HRV сегодня</span>
                          <span className="font-medium">{healthData?.hrv || '--'} мс</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Средний за неделю</span>
                          <span className="font-medium">{healthData?.avgHrv || '--'} мс</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Активность за сегодня</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-2 relative">
                        <Progress 
                          value={(healthData?.todaySteps || 0) / 100} 
                          className="w-full h-full rounded-full"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Footprints className="w-8 h-8 text-blue-500" />
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">Шаги</p>
                      <p className="text-lg font-semibold">{healthData?.todaySteps?.toLocaleString('ru-RU') || 0}</p>
                      <p className="text-xs text-gray-500">из 10,000</p>
                    </div>

                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-2 relative">
                        <Progress 
                          value={(healthData?.activeMinutes || 0) * 100 / 30} 
                          className="w-full h-full rounded-full"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Activity className="w-8 h-8 text-green-500" />
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">Активность</p>
                      <p className="text-lg font-semibold">{healthData?.activeMinutes || 0} мин</p>
                      <p className="text-xs text-gray-500">из 30 мин</p>
                    </div>

                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-2 relative">
                        <Progress 
                          value={(healthData?.caloriesBurned || 0) * 100 / 500} 
                          className="w-full h-full rounded-full"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <TrendingUp className="w-8 h-8 text-orange-500" />
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">Калории</p>
                      <p className="text-lg font-semibold">{healthData?.caloriesBurned || 0}</p>
                      <p className="text-xs text-gray-500">из 500 ккал</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="workouts">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Последние тренировки</CardTitle>
                </CardHeader>
                <CardContent>
                  {workoutData && workoutData.length > 0 ? (
                    <div className="space-y-3">
                      {workoutData.slice(0, 5).map((workout, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Timer className="w-5 h-5 text-blue-500" />
                            <div>
                              <p className="font-medium">{workout.name}</p>
                              <p className="text-sm text-gray-600">
                                {format(new Date(workout.date), 'dd.MM.yyyy', { locale: ru })}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{workout.duration} мин</p>
                            <p className="text-sm text-gray-600">{workout.calories} ккал</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Timer className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">Нет данных о тренировках</p>
                      <p className="text-sm text-gray-500">Начните тренировку на Apple Watch</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default AppleWatchIntegration;
