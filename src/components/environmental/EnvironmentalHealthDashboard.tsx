
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Leaf, Wind, Thermometer, Droplets, Eye, MapPin, Navigation, AlertTriangle, Loader2, RefreshCw, Info, Settings, HelpCircle } from "lucide-react";
import AirQualityMonitor from './AirQualityMonitor';
import EnvironmentalImpactAnalysis from './EnvironmentalImpactAnalysis';
import ProtectionRecommendations from './ProtectionRecommendations';
import useEnvironmentalData from '@/hooks/useEnvironmentalData';
import { Badge } from "@/components/ui/badge";

const EnvironmentalHealthDashboard = () => {
  const { 
    location, 
    airQualityData, 
    weatherData, 
    isLoading, 
    error, 
    locationError,
    isRequestingLocation,
    geolocationSupported,
    hasUserDeniedPermission,
    requestGeolocation 
  } = useEnvironmentalData();

  const handleGeolocationRequest = () => {
    console.log('🔄 Пользователь нажал кнопку повторного запроса геолокации');
    requestGeolocation();
  };

  const openBrowserSettings = () => {
    // Открываем общую страницу настроек браузера
    if (navigator.userAgent.includes('Chrome')) {
      window.open('chrome://settings/content/location', '_blank');
    } else if (navigator.userAgent.includes('Firefox')) {
      window.open('about:preferences#privacy', '_blank');
    } else if (navigator.userAgent.includes('Safari')) {
      alert('Откройте Safari → Настройки → Веб-сайты → Местоположение');
    } else {
      alert('Откройте настройки браузера и найдите раздел "Местоположение" или "Геолокация"');
    }
  };

  // Показываем загрузку только если нет локации
  if (isLoading && !location) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="animate-spin h-8 w-8 mx-auto text-green-600" />
          <div className="space-y-2">
            <p className="font-medium">
              {isRequestingLocation ? 'Получение местоположения...' : 'Загрузка экологических данных...'}
            </p>
            <p className="text-sm text-gray-600">
              {isRequestingLocation 
                ? 'Разрешите доступ к геолокации в браузере'
                : 'Загружаем информацию о качестве воздуха и погоде'
              }
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Leaf className="w-6 h-6 text-green-600" />
                <span>Экологическое здоровье</span>
              </CardTitle>
              <CardDescription>
                Мониторинг качества воздуха и анализ влияния экологии на здоровье
              </CardDescription>
            </div>
            <div className="flex items-center space-x-4">
              {location && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {location.city || `${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}`}
                  </span>
                </div>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleGeolocationRequest}
                disabled={isRequestingLocation}
              >
                {isRequestingLocation ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Обновление...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Обновить локацию
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Демо режим уведомление */}
      {(airQualityData || weatherData) && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <div className="font-medium">Демонстрационный режим</div>
              <div className="text-sm">
                Отображаются образцы экологических данных для демонстрации функциональности. 
                В реальной версии будут использоваться актуальные данные с внешних API.
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Геолокация не поддерживается */}
      {!geolocationSupported && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <div className="font-medium">Геолокация не поддерживается</div>
              <div className="text-sm">
                Ваш браузер не поддерживает геолокацию. Используются данные для Москвы.
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Ошибка геолокации с улучшенными инструкциями */}
      {locationError && geolocationSupported && (
        <Alert variant={hasUserDeniedPermission ? "destructive" : "default"}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-4">
              <div>
                <div className="font-medium">
                  {hasUserDeniedPermission ? "Доступ к геолокации запрещен" : "Проблема с геолокацией"}
                </div>
                <div className="text-sm mt-1">{locationError}</div>
              </div>

              {hasUserDeniedPermission && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <HelpCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="space-y-3">
                      <div className="font-medium text-red-800">Как разрешить доступ к геолокации:</div>
                      <div className="text-sm text-red-700 space-y-2">
                        <div className="font-medium">В адресной строке браузера:</div>
                        <ol className="list-decimal list-inside space-y-1 pl-2">
                          <li>Найдите иконку замка 🔒 или информации ⓘ слева от адреса</li>
                          <li>Нажмите на неё</li>
                          <li>Найдите пункт "Местоположение" или "Геолокация"</li>
                          <li>Выберите "Разрешить" вместо "Блокировать"</li>
                          <li>Обновите страницу</li>
                        </ol>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={openBrowserSettings}
                          className="bg-white hover:bg-red-50 border-red-300"
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Настройки браузера
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-sm text-gray-600">
                Используются данные для Москвы как альтернатива.
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleGeolocationRequest}
                  disabled={isRequestingLocation}
                  className="bg-white hover:bg-gray-50"
                >
                  {isRequestingLocation ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Повтор...
                    </>
                  ) : (
                    <>
                      <Navigation className="w-4 h-4 mr-2" />
                      Повторить
                    </>
                  )}
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Текущие условия */}
      {(airQualityData || weatherData) && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {airQualityData && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Качество воздуха</p>
                    <p className="text-2xl font-bold">AQI {airQualityData.aqi}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <Wind className="w-6 h-6 text-blue-500 mb-2" />
                    <Badge 
                      variant={airQualityData.category === 'good' ? 'default' : 
                              airQualityData.category === 'moderate' ? 'secondary' : 'destructive'}
                    >
                      {airQualityData.category === 'good' ? 'Хорошо' :
                       airQualityData.category === 'moderate' ? 'Умеренно' :
                       airQualityData.category === 'unhealthy_for_sensitive' ? 'Вредно для чувствительных' :
                       airQualityData.category === 'unhealthy' ? 'Вредно' :
                       airQualityData.category === 'very_unhealthy' ? 'Очень вредно' : 'Опасно'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {weatherData && (
            <>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Температура</p>
                      <p className="text-2xl font-bold">{weatherData.temperature.toFixed(1)}°C</p>
                    </div>
                    <Thermometer className="w-6 h-6 text-orange-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Влажность</p>
                      <p className="text-2xl font-bold">{weatherData.humidity.toFixed(0)}%</p>
                    </div>
                    <Droplets className="w-6 h-6 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">УФ-индекс</p>
                      <p className="text-2xl font-bold">{weatherData.uvIndex.toFixed(1)}</p>
                    </div>
                    <Eye className="w-6 h-6 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )}

      {/* Индикатор загрузки данных */}
      {isLoading && location && (
        <Alert>
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertDescription>
            Загружаем экологические данные для вашего местоположения...
          </AlertDescription>
        </Alert>
      )}

      {/* Основной контент */}
      <Tabs defaultValue="monitor" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="monitor" className="flex items-center space-x-2">
            <Wind className="w-4 h-4" />
            <span>Мониторинг</span>
          </TabsTrigger>
          <TabsTrigger value="impact" className="flex items-center space-x-2">
            <Eye className="w-4 h-4" />
            <span>Влияние</span>
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center space-x-2">
            <Leaf className="w-4 h-4" />
            <span>Рекомендации</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="monitor">
          <AirQualityMonitor 
            airQualityData={airQualityData} 
            weatherData={weatherData}
            location={location}
          />
        </TabsContent>

        <TabsContent value="impact">
          <EnvironmentalImpactAnalysis 
            airQualityData={airQualityData}
            weatherData={weatherData}
          />
        </TabsContent>

        <TabsContent value="recommendations">
          <ProtectionRecommendations 
            airQualityData={airQualityData}
            weatherData={weatherData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnvironmentalHealthDashboard;
