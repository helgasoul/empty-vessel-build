
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  Home, 
  Car, 
  Leaf, 
  Droplets, 
  Sun, 
  Wind,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin
} from "lucide-react";

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

interface ProtectionRecommendationsProps {
  airQualityData: AirQualityData | null;
  weatherData: WeatherData | null;
}

const ProtectionRecommendations: React.FC<ProtectionRecommendationsProps> = ({
  airQualityData,
  weatherData
}) => {
  const getImmediateActions = () => {
    const actions = [];
    
    if (!airQualityData) return actions;

    if (airQualityData.aqi > 100) {
      actions.push({
        title: 'Используйте защитную маску',
        description: 'При выходе на улицу надевайте маску класса N95 или выше',
        priority: 'high',
        icon: Shield,
        urgent: airQualityData.aqi > 200
      });
    }

    if (airQualityData.aqi > 150) {
      actions.push({
        title: 'Ограничьте время на улице',
        description: 'Сократите прогулки и физические нагрузки на открытом воздухе',
        priority: 'high',
        icon: Clock,
        urgent: true
      });
    }

    if (airQualityData.pm25 > 35) {
      actions.push({
        title: 'Закройте окна',
        description: 'Держите окна закрытыми и используйте очистители воздуха',
        priority: 'medium',
        icon: Home,
        urgent: false
      });
    }

    if (weatherData?.uvIndex && weatherData.uvIndex > 8) {
      actions.push({
        title: 'Защитите кожу от UV',
        description: 'Используйте солнцезащитный крем SPF 30+ и защитную одежду',
        priority: 'medium',
        icon: Sun,
        urgent: false
      });
    }

    if (airQualityData.ozone > 180) {
      actions.push({
        title: 'Избегайте физических нагрузок',
        description: 'Перенесите тренировки в помещение или на более позднее время',
        priority: 'high',
        icon: Wind,
        urgent: true
      });
    }

    return actions;
  };

  const getHomeProtectionTips = () => {
    return [
      {
        title: 'Очистители воздуха',
        description: 'Используйте HEPA-фильтры в спальне и гостиной',
        icon: Leaf,
        effectiveness: 85
      },
      {
        title: 'Герметизация помещений',
        description: 'Устраните щели в окнах и дверях',
        icon: Home,
        effectiveness: 70
      },
      {
        title: 'Увлажнители воздуха',
        description: 'Поддерживайте влажность 40-60% для здоровья дыхательных путей',
        icon: Droplets,
        effectiveness: 60
      },
      {
        title: 'Вентиляция в безопасное время',
        description: 'Проветривайте утром когда AQI ниже',
        icon: Wind,
        effectiveness: 75
      }
    ];
  };

  const getTransportAdvice = () => {
    const advice = [];

    if (!airQualityData) return advice;

    if (airQualityData.aqi > 100) {
      advice.push({
        title: 'Предпочтите общественный транспорт',
        description: 'Метро и автобусы с кондиционированием лучше пеших прогулок',
        icon: Car
      });
    }

    if (airQualityData.aqi > 150) {
      advice.push({
        title: 'Планируйте поездки заранее',
        description: 'Объединяйте поездки чтобы меньше времени проводить на улице',
        icon: MapPin
      });
    }

    advice.push({
      title: 'Фильтры в автомобиле',
      description: 'Регулярно меняйте салонный фильтр и держите окна закрытыми',
      icon: Shield
    });

    return advice;
  };

  const getPersonalCareRecommendations = () => {
    const recommendations = [];

    if (!airQualityData) return recommendations;

    if (airQualityData.aqi > 100) {
      recommendations.push({
        title: 'Защитные маски',
        products: ['Маска N95', 'Маска FFP2', 'Многоразовые маски с фильтрами'],
        description: 'Эффективно фильтруют мелкие частицы PM2.5 и PM10'
      });
    }

    recommendations.push({
      title: 'Средства для носа и горла',
      products: ['Солевые растворы для промывания', 'Спреи для горла', 'Увлажняющие капли'],
      description: 'Помогают очистить дыхательные пути от загрязнений'
    });

    if (weatherData?.uvIndex && weatherData.uvIndex > 6) {
      recommendations.push({
        title: 'Солнцезащитные средства',
        products: ['Солнцезащитный крем SPF 30+', 'Защитные очки', 'Шляпы с широкими полями'],
        description: 'Защита от вредного УФ-излучения'
      });
    }

    return recommendations;
  };

  const immediateActions = getImmediateActions();
  const homeProtectionTips = getHomeProtectionTips();
  const transportAdvice = getTransportAdvice();
  const personalCareRecommendations = getPersonalCareRecommendations();

  if (!airQualityData && !weatherData) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Рекомендации недоступны
            </h3>
            <p className="text-gray-600">
              Для составления рекомендаций необходимы данные о качестве воздуха
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Immediate Actions */}
      {immediateActions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <span>Немедленные действия</span>
            </CardTitle>
            <CardDescription>
              Первоочередные меры защиты при текущих условиях
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {immediateActions.map((action, index) => (
                <Alert key={index} variant={action.urgent ? "destructive" : "default"}>
                  <action.icon className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium">{action.title}</div>
                        <div className="text-sm mt-1">{action.description}</div>
                      </div>
                      <Badge variant={action.priority === 'high' ? "destructive" : "secondary"}>
                        {action.priority === 'high' ? 'Высокий' : 'Средний'} приоритет
                      </Badge>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Home Protection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Home className="w-5 h-5 text-blue-500" />
            <span>Защита дома</span>
          </CardTitle>
          <CardDescription>
            Способы улучшить качество воздуха в помещении
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {homeProtectionTips.map((tip, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    <tip.icon className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{tip.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{tip.description}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-xs text-gray-500">Эффективность:</span>
                      <Badge variant="secondary">{tip.effectiveness}%</Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transport Advice */}
      {transportAdvice.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Car className="w-5 h-5 text-green-500" />
              <span>Транспорт и передвижение</span>
            </CardTitle>
            <CardDescription>
              Рекомендации по безопасному передвижению
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transportAdvice.map((advice, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <advice.icon className="w-5 h-5 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-medium">{advice.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{advice.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Personal Care Products */}
      {personalCareRecommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-purple-500" />
              <span>Средства личной защиты</span>
            </CardTitle>
            <CardDescription>
              Рекомендуемые продукты для защиты здоровья
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {personalCareRecommendations.map((category, index) => (
                <div key={index} className="space-y-3">
                  <h4 className="font-medium flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{category.title}</span>
                  </h4>
                  <p className="text-sm text-gray-600">{category.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {category.products.map((product, productIndex) => (
                      <Badge key={productIndex} variant="outline">
                        {product}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Быстрые действия</CardTitle>
          <CardDescription>
            Полезные ресурсы и инструменты
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <MapPin className="w-6 h-6 text-blue-500" />
              <span className="text-sm">Найти ближайшую аптеку</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Leaf className="w-6 h-6 text-green-500" />
              <span className="text-sm">Купить очиститель воздуха</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Shield className="w-6 h-6 text-purple-500" />
              <span className="text-sm">Заказать защитные маски</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProtectionRecommendations;
