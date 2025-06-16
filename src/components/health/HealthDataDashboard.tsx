
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Heart, Moon, Footprints, RefreshCw } from "lucide-react";
import { useHealthData } from '@/hooks/useHealthData';

const HealthDataDashboard = () => {
  const { loading, getHealthMetrics, generateDailySummary, dailySummary } = useHealthData();
  const [updating, setUpdating] = React.useState(false);

  const metrics = getHealthMetrics();

  const handleUpdateSummary = async () => {
    setUpdating(true);
    try {
      await generateDailySummary();
    } finally {
      setUpdating(false);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Данные о здоровье</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-primary" />
              <span>Данные о здоровье</span>
            </CardTitle>
            <CardDescription>
              Сегодняшние показатели здоровья с ваших устройств
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleUpdateSummary}
            disabled={updating}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${updating ? 'animate-spin' : ''}`} />
            {updating ? 'Обновление...' : 'Обновить'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Шаги</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatNumber(dailySummary?.total_steps || metrics.steps)}
                </p>
              </div>
              <Footprints className="w-8 h-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Пульс</p>
                <p className="text-2xl font-bold text-red-600">
                  {dailySummary?.avg_heart_rate || metrics.avgHeartRate || '--'}
                  {(dailySummary?.avg_heart_rate || metrics.avgHeartRate) && (
                    <span className="text-sm text-gray-500 ml-1">bpm</span>
                  )}
                </p>
              </div>
              <Heart className="w-8 h-8 text-red-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Сон</p>
                <p className="text-2xl font-bold text-purple-600">
                  {dailySummary?.sleep_hours || metrics.sleepHours || '--'}
                  {(dailySummary?.sleep_hours || metrics.sleepHours) && (
                    <span className="text-sm text-gray-500 ml-1">ч</span>
                  )}
                </p>
              </div>
              <Moon className="w-8 h-8 text-purple-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Активность</p>
                <p className="text-2xl font-bold text-green-600">
                  {dailySummary?.active_minutes || Math.floor((metrics.steps || 0) / 100)}
                  <span className="text-sm text-gray-500 ml-1">мин</span>
                </p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </Card>
        </div>

        {dailySummary && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Дневная сводка</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              {dailySummary.max_heart_rate && (
                <div>
                  <span className="text-gray-600">Макс. пульс: </span>
                  <span className="font-medium">{dailySummary.max_heart_rate} bpm</span>
                </div>
              )}
              {dailySummary.min_heart_rate && (
                <div>
                  <span className="text-gray-600">Мин. пульс: </span>
                  <span className="font-medium">{dailySummary.min_heart_rate} bpm</span>
                </div>
              )}
              {dailySummary.calories_burned && (
                <div>
                  <span className="text-gray-600">Калории: </span>
                  <span className="font-medium">{dailySummary.calories_burned} ккал</span>
                </div>
              )}
              {dailySummary.distance_km && (
                <div>
                  <span className="text-gray-600">Дистанция: </span>
                  <span className="font-medium">{dailySummary.distance_km} км</span>
                </div>
              )}
              {dailySummary.sleep_quality && (
                <div>
                  <span className="text-gray-600">Качество сна: </span>
                  <span className="font-medium">{dailySummary.sleep_quality}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HealthDataDashboard;
