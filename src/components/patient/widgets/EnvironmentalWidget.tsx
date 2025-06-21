
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Leaf, 
  Wind, 
  Home, 
  Building, 
  AlertTriangle,
  TrendingUp,
  Navigation
} from 'lucide-react';
import { EnvironmentalHealth } from '@/types/patient';
import { useNavigate } from 'react-router-dom';

interface EnvironmentalWidgetProps {
  data?: EnvironmentalHealth;
}

export default function EnvironmentalWidget({ data }: EnvironmentalWidgetProps) {
  const navigate = useNavigate();

  const getEnvironmentalScore = () => {
    if (!data) return null;
    
    // Простой расчет экологического индекса
    let totalScore = 0;
    let factors = 0;

    if (data.livingEnvironment) {
      let livingScore = 50;
      if (data.livingEnvironment.proximityToIndustrial === 'far') livingScore += 15;
      else if (data.livingEnvironment.proximityToIndustrial === 'very_close') livingScore -= 20;
      
      if (data.livingEnvironment.greenSpaceAccess === 'abundant') livingScore += 15;
      else if (data.livingEnvironment.greenSpaceAccess === 'none') livingScore -= 15;
      
      totalScore += Math.max(0, Math.min(100, livingScore));
      factors++;
    }

    if (data.workEnvironment) {
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

  const getRiskLevel = (score: number | null) => {
    if (!score) return { level: 'unknown', color: 'gray', label: 'Не оценено' };
    if (score >= 80) return { level: 'low', color: 'green', label: 'Низкий риск' };
    if (score >= 60) return { level: 'medium', color: 'yellow', label: 'Средний риск' };
    if (score >= 40) return { level: 'moderate', color: 'orange', label: 'Умеренный риск' };
    return { level: 'high', color: 'red', label: 'Высокий риск' };
  };

  const riskLevel = getRiskLevel(environmentalScore);

  const handleNavigateToSection = () => {
    // Используем hash navigation для переключения на environmental секцию
    window.location.hash = 'environmental';
    window.location.reload();
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-green-100 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg text-gray-800">Экология</CardTitle>
              <p className="text-sm text-gray-600">Влияние среды</p>
            </div>
          </div>
          
          <Badge 
            variant="secondary"
            className={`${
              riskLevel.color === 'green' ? 'bg-green-100 text-green-800' :
              riskLevel.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
              riskLevel.color === 'orange' ? 'bg-orange-100 text-orange-800' :
              riskLevel.color === 'red' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}
          >
            {riskLevel.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        {environmentalScore !== null ? (
          <div className="space-y-4">
            {/* Environmental Score */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Экологический индекс</span>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-green-600">
                  {environmentalScore}
                </span>
                <span className="text-sm text-gray-500">/100</span>
              </div>
            </div>

            {/* Environmental Factors */}
            <div className="space-y-2">
              {data?.livingEnvironment && (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Home className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-600">Дом</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {data.livingEnvironment.greenSpaceAccess === 'abundant' ? 'Хорошо' :
                     data.livingEnvironment.greenSpaceAccess === 'none' ? 'Плохо' : 'Средне'}
                  </Badge>
                </div>
              )}

              {data?.workEnvironment && (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Building className="w-4 h-4 text-purple-500" />
                    <span className="text-gray-600">Работа</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {!data.workEnvironment.chemicalExposure ? 'Безопасно' : 'Риски'}
                  </Badge>
                </div>
              )}

              {data?.airQuality && (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Wind className="w-4 h-4 text-cyan-500" />
                    <span className="text-gray-600">Воздух</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    AQI {data.airQuality.aqi}
                  </Badge>
                </div>
              )}

              {data?.exposures && data.exposures.length > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    <span className="text-gray-600">Воздействия</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {data.exposures.length} факторов
                  </Badge>
                </div>
              )}
            </div>

            {/* Environmental Trend */}
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <div className="text-sm">
                  <div className="font-medium text-green-800">Тренд</div>
                  <div className="text-green-700 text-xs">
                    {environmentalScore >= 70 ? 'Стабильно хорошо' :
                     environmentalScore >= 50 ? 'Требует внимания' : 'Нужны изменения'}
                  </div>
                </div>
              </div>
            </div>

            {/* Alerts */}
            {environmentalScore < 50 && (
              <div className="bg-red-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <div className="text-sm">
                    <div className="font-medium text-red-800">Внимание</div>
                    <div className="text-red-700 text-xs">
                      Высокие экологические риски
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="text-4xl mb-3">🌱</div>
            <p className="text-gray-600 mb-4 text-sm">
              Оцените влияние окружающей среды на ваше здоровье
            </p>
            <Button
              onClick={handleNavigateToSection}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-200 text-sm"
            >
              Начать оценку
            </Button>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-4 pt-4 border-t border-green-100">
          <Button
            variant="ghost"
            onClick={handleNavigateToSection}
            className="w-full text-green-600 hover:text-green-700 hover:bg-green-50"
          >
            <span className="flex items-center space-x-2">
              <span>Подробнее</span>
              <Navigation className="w-4 h-4" />
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
