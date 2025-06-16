
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, Wind, Thermometer, Droplets, Eye, MapPin } from "lucide-react";
import AirQualityMonitor from './AirQualityMonitor';
import EnvironmentalImpactAnalysis from './EnvironmentalImpactAnalysis';
import ProtectionRecommendations from './ProtectionRecommendations';
import useEnvironmentalData from '@/hooks/useEnvironmentalData';
import { Badge } from "@/components/ui/badge";

const EnvironmentalHealthDashboard = () => {
  const { location, airQualityData, weatherData, isLoading, error } = useEnvironmentalData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Загрузка экологических данных...</span>
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
            {location && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>
                  {location.city || `${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}`}
                </span>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Current Conditions Overview */}
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

      {error && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-4">
              <p className="text-red-600">Ошибка загрузки данных: {error.toString()}</p>
              <p className="text-gray-600 text-sm mt-2">
                Попробуйте разрешить доступ к геолокации или обновить страницу
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
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
