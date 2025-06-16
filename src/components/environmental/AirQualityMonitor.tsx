
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Wind, Thermometer, Droplets, Eye, Gauge } from "lucide-react";

interface AirQualityData {
  pm25: number;
  pm10: number;
  ozone: number;
  no2: number;
  so2: number;
  co: number;
  aqi: number;
  category: string;
}

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  pressure: number;
}

interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
}

interface AirQualityMonitorProps {
  airQualityData: AirQualityData | null;
  weatherData: WeatherData | null;
  location: LocationData | null;
}

const AirQualityMonitor: React.FC<AirQualityMonitorProps> = ({
  airQualityData,
  weatherData,
  location
}) => {
  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return 'text-green-600 bg-green-100';
    if (aqi <= 100) return 'text-yellow-600 bg-yellow-100';
    if (aqi <= 150) return 'text-orange-600 bg-orange-100';
    if (aqi <= 200) return 'text-red-600 bg-red-100';
    if (aqi <= 300) return 'text-purple-600 bg-purple-100';
    return 'text-red-800 bg-red-200';
  };

  const getAQIDescription = (aqi: number) => {
    if (aqi <= 50) return 'Отличное качество воздуха';
    if (aqi <= 100) return 'Умеренное качество воздуха';
    if (aqi <= 150) return 'Вредно для чувствительных групп';
    if (aqi <= 200) return 'Вредно для здоровья';
    if (aqi <= 300) return 'Очень вредно для здоровья';
    return 'Опасно для здоровья';
  };

  const pollutants = [
    { name: 'PM2.5', value: airQualityData?.pm25 || 0, unit: 'μg/m³', limit: 25, icon: Wind },
    { name: 'PM10', value: airQualityData?.pm10 || 0, unit: 'μg/m³', limit: 50, icon: Wind },
    { name: 'Озон', value: airQualityData?.ozone || 0, unit: 'μg/m³', limit: 180, icon: Eye },
    { name: 'NO₂', value: airQualityData?.no2 || 0, unit: 'μg/m³', limit: 200, icon: AlertTriangle },
    { name: 'SO₂', value: airQualityData?.so2 || 0, unit: 'μg/m³', limit: 350, icon: AlertTriangle },
    { name: 'CO', value: airQualityData?.co || 0, unit: 'mg/m³', limit: 30, icon: AlertTriangle }
  ];

  if (!airQualityData && !weatherData) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Wind className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Данные недоступны
            </h3>
            <p className="text-gray-600">
              Не удалось загрузить данные о качестве воздуха и погоде
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main AQI Display */}
      {airQualityData && (
        <Card>
          <CardHeader>
            <CardTitle>Индекс качества воздуха (AQI)</CardTitle>
            <CardDescription>
              Общая оценка качества воздуха в вашем регионе
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className={`rounded-full p-4 ${getAQIColor(airQualityData.aqi)}`}>
                  <Gauge className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-3xl font-bold">{airQualityData.aqi}</div>
                  <div className="text-sm text-gray-600">{getAQIDescription(airQualityData.aqi)}</div>
                </div>
              </div>
              <Badge className={getAQIColor(airQualityData.aqi)}>
                {airQualityData.category === 'good' ? 'Хорошо' :
                 airQualityData.category === 'moderate' ? 'Умеренно' :
                 airQualityData.category === 'unhealthy_for_sensitive' ? 'Вредно для чувствительных' :
                 airQualityData.category === 'unhealthy' ? 'Вредно' :
                 airQualityData.category === 'very_unhealthy' ? 'Очень вредно' : 'Опасно'}
              </Badge>
            </div>
            
            <Progress value={Math.min((airQualityData.aqi / 500) * 100, 100)} className="h-3" />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>0 (Отлично)</span>
              <span>500 (Опасно)</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Pollutant Levels */}
      {airQualityData && (
        <Card>
          <CardHeader>
            <CardTitle>Детальный анализ загрязнителей</CardTitle>
            <CardDescription>
              Концентрация основных загрязняющих веществ в воздухе
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pollutants.map((pollutant) => {
                const percentage = Math.min((pollutant.value / pollutant.limit) * 100, 100);
                const isExceeded = pollutant.value > pollutant.limit;
                
                return (
                  <div key={pollutant.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <pollutant.icon className="w-4 h-4 text-gray-600" />
                        <span className="font-medium">{pollutant.name}</span>
                      </div>
                      <Badge variant={isExceeded ? "destructive" : "secondary"}>
                        {pollutant.value.toFixed(1)} {pollutant.unit}
                      </Badge>
                    </div>
                    <Progress 
                      value={percentage} 
                      className={`h-2 ${isExceeded ? 'bg-red-100' : ''}`}
                    />
                    <div className="text-xs text-gray-500">
                      Лимит: {pollutant.limit} {pollutant.unit}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weather Conditions */}
      {weatherData && (
        <Card>
          <CardHeader>
            <CardTitle>Метеорологические условия</CardTitle>
            <CardDescription>
              Погодные факторы, влияющие на качество воздуха
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg">
                <Thermometer className="w-6 h-6 text-orange-500" />
                <div>
                  <div className="font-semibold">{weatherData.temperature.toFixed(1)}°C</div>
                  <div className="text-sm text-gray-600">Температура</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                <Droplets className="w-6 h-6 text-blue-500" />
                <div>
                  <div className="font-semibold">{weatherData.humidity.toFixed(0)}%</div>
                  <div className="text-sm text-gray-600">Влажность</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <Wind className="w-6 h-6 text-gray-500" />
                <div>
                  <div className="font-semibold">{weatherData.windSpeed.toFixed(1)} м/с</div>
                  <div className="text-sm text-gray-600">Ветер</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg">
                <Eye className="w-6 h-6 text-yellow-500" />
                <div>
                  <div className="font-semibold">{weatherData.uvIndex.toFixed(1)}</div>
                  <div className="text-sm text-gray-600">УФ-индекс</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
                <Gauge className="w-6 h-6 text-purple-500" />
                <div>
                  <div className="font-semibold">{weatherData.pressure.toFixed(0)} гПа</div>
                  <div className="text-sm text-gray-600">Давление</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AirQualityMonitor;
