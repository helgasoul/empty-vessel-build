
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Wind, 
  Eye, 
  AlertTriangle, 
  Activity, 
  Brain,
  Shield,
  TrendingUp
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

interface EnvironmentalImpactAnalysisProps {
  airQualityData: AirQualityData | null;
  weatherData: WeatherData | null;
}

const EnvironmentalImpactAnalysis: React.FC<EnvironmentalImpactAnalysisProps> = ({
  airQualityData,
  weatherData
}) => {
  // Calculate health risk scores
  const getHealthRisks = () => {
    if (!airQualityData) return null;

    const risks = {
      respiratory: 0,
      cardiovascular: 0,
      allergic: 0,
      chronic: 0
    };

    // Calculate based on AQI
    if (airQualityData.aqi > 100) {
      risks.respiratory += 30;
      risks.cardiovascular += 20;
    }
    if (airQualityData.aqi > 150) {
      risks.respiratory += 40;
      risks.cardiovascular += 30;
      risks.allergic += 25;
    }
    if (airQualityData.aqi > 200) {
      risks.respiratory += 30;
      risks.cardiovascular += 40;
      risks.allergic += 35;
      risks.chronic += 50;
    }

    // Additional factors
    if (airQualityData.pm25 > 35) {
      risks.respiratory += 25;
      risks.cardiovascular += 20;
    }
    if (airQualityData.ozone > 180) {
      risks.respiratory += 30;
      risks.allergic += 20;
    }

    // Weather impact
    if (weatherData) {
      if (weatherData.humidity > 80) {
        risks.allergic += 15;
      }
      if (weatherData.uvIndex > 8) {
        risks.chronic += 20;
      }
    }

    // Normalize scores (0-100)
    Object.keys(risks).forEach(key => {
      risks[key as keyof typeof risks] = Math.min(risks[key as keyof typeof risks], 100);
    });

    return risks;
  };

  const healthRisks = getHealthRisks();

  const getRiskLevel = (score: number) => {
    if (score <= 25) return { level: 'Низкий', color: 'bg-green-500', variant: 'default' as const };
    if (score <= 50) return { level: 'Умеренный', color: 'bg-yellow-500', variant: 'secondary' as const };
    if (score <= 75) return { level: 'Высокий', color: 'bg-orange-500', variant: 'destructive' as const };
    return { level: 'Критический', color: 'bg-red-500', variant: 'destructive' as const };
  };

  const getVulnerableGroupAlerts = () => {
    const alerts = [];
    
    if (!airQualityData) return alerts;

    if (airQualityData.aqi > 100) {
      alerts.push({
        group: 'Дети и пожилые люди',
        message: 'Рекомендуется ограничить время на улице',
        severity: 'warning' as const
      });
    }

    if (airQualityData.aqi > 150) {
      alerts.push({
        group: 'Люди с заболеваниями дыхательных путей',
        message: 'Избегайте физических нагрузок на открытом воздухе',
        severity: 'destructive' as const
      });
    }

    if (airQualityData.pm25 > 35) {
      alerts.push({
        group: 'Беременные женщины',
        message: 'Используйте защитные маски при выходе на улицу',
        severity: 'warning' as const
      });
    }

    if (weatherData?.uvIndex && weatherData.uvIndex > 8) {
      alerts.push({
        group: 'Все группы населения',
        message: 'Высокий УФ-индекс - используйте солнцезащитные средства',
        severity: 'default' as const
      });
    }

    return alerts;
  };

  const vulnerableGroupAlerts = getVulnerableGroupAlerts();

  const getSymptomPredictions = () => {
    if (!airQualityData) return [];

    const symptoms = [];

    if (airQualityData.aqi > 100) {
      symptoms.push({
        symptom: 'Раздражение глаз и горла',
        probability: Math.min(airQualityData.aqi / 2, 90),
        icon: Eye
      });
    }

    if (airQualityData.pm25 > 25) {
      symptoms.push({
        symptom: 'Кашель и одышка',
        probability: Math.min((airQualityData.pm25 / 50) * 80, 90),
        icon: Wind
      });
    }

    if (airQualityData.ozone > 160) {
      symptoms.push({
        symptom: 'Усталость и головная боль',
        probability: Math.min((airQualityData.ozone / 200) * 70, 85),
        icon: Brain
      });
    }

    if (airQualityData.aqi > 150) {
      symptoms.push({
        symptom: 'Обострение аллергии',
        probability: Math.min(airQualityData.aqi / 3, 80),
        icon: AlertTriangle
      });
    }

    return symptoms;
  };

  const symptomPredictions = getSymptomPredictions();

  if (!airQualityData && !weatherData) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Activity className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Анализ недоступен
            </h3>
            <p className="text-gray-600">
              Для анализа влияния экологии необходимы данные о качестве воздуха
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Health Risk Assessment */}
      {healthRisks && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-red-500" />
              <span>Оценка рисков для здоровья</span>
            </CardTitle>
            <CardDescription>
              Влияние текущих экологических условий на различные аспекты здоровья
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Wind className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">Дыхательная система</span>
                    </div>
                    <Badge variant={getRiskLevel(healthRisks.respiratory).variant}>
                      {getRiskLevel(healthRisks.respiratory).level}
                    </Badge>
                  </div>
                  <Progress value={healthRisks.respiratory} className="h-2" />
                  <p className="text-sm text-gray-600">Риск развития респираторных заболеваний</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span className="font-medium">Сердечно-сосудистая система</span>
                    </div>
                    <Badge variant={getRiskLevel(healthRisks.cardiovascular).variant}>
                      {getRiskLevel(healthRisks.cardiovascular).level}
                    </Badge>
                  </div>
                  <Progress value={healthRisks.cardiovascular} className="h-2" />
                  <p className="text-sm text-gray-600">Риск сердечно-сосудистых осложнений</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4 text-orange-500" />
                      <span className="font-medium">Аллергические реакции</span>
                    </div>
                    <Badge variant={getRiskLevel(healthRisks.allergic).variant}>
                      {getRiskLevel(healthRisks.allergic).level}
                    </Badge>
                  </div>
                  <Progress value={healthRisks.allergic} className="h-2" />
                  <p className="text-sm text-gray-600">Вероятность обострения аллергии</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-purple-500" />
                      <span className="font-medium">Хронические заболевания</span>
                    </div>
                    <Badge variant={getRiskLevel(healthRisks.chronic).variant}>
                      {getRiskLevel(healthRisks.chronic).level}
                    </Badge>
                  </div>
                  <Progress value={healthRisks.chronic} className="h-2" />
                  <p className="text-sm text-gray-600">Риск обострения хронических состояний</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vulnerable Groups Alerts */}
      {vulnerableGroupAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <span>Предупреждения для уязвимых групп</span>
            </CardTitle>
            <CardDescription>
              Специальные рекомендации для людей повышенного риска
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {vulnerableGroupAlerts.map((alert, index) => (
                <Alert key={index} variant={alert.severity}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <span className="font-medium">{alert.group}:</span> {alert.message}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Symptom Predictions */}
      {symptomPredictions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <span>Прогноз симптомов</span>
            </CardTitle>
            <CardDescription>
              Вероятность развития симптомов при текущих условиях
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {symptomPredictions.map((symptom, index) => (
                <div key={index} className="space-y-2 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <symptom.icon className="w-4 h-4 text-gray-600" />
                      <span className="font-medium">{symptom.symptom}</span>
                    </div>
                    <Badge variant={symptom.probability > 50 ? "destructive" : "secondary"}>
                      {symptom.probability.toFixed(0)}%
                    </Badge>
                  </div>
                  <Progress value={symptom.probability} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnvironmentalImpactAnalysis;
