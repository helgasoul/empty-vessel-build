
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Activity, Heart, Moon } from "lucide-react";
import { ComprehensiveHealthContext } from '../types/aiTypes';

interface TrendsViewProps {
  healthContext: ComprehensiveHealthContext;
}

const TrendsView: React.FC<TrendsViewProps> = ({ healthContext }) => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5" />
          <span>Анализ трендов</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {healthContext.healthMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Activity className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-medium">Активность</h4>
              <p className="text-2xl font-bold">{healthContext.healthMetrics.steps}</p>
              <p className="text-sm text-gray-600">
                {healthContext.healthMetrics.stepstrend === 'increasing' ? '📈 Растет' :
                 healthContext.healthMetrics.stepstrend === 'decreasing' ? '📉 Снижается' : '➡️ Стабильно'}
              </p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Heart className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-medium">Пульс</h4>
              <p className="text-2xl font-bold">{healthContext.healthMetrics.heartRate || 'н/д'}</p>
              <p className="text-sm text-gray-600">уд/мин</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Moon className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-medium">Сон</h4>
              <p className="text-2xl font-bold">{healthContext.healthMetrics.sleep || 'н/д'}</p>
              <p className="text-sm text-gray-600">
                {healthContext.healthMetrics.sleepTrend === 'improving' ? '📈 Улучшается' :
                 healthContext.healthMetrics.sleepTrend === 'declining' ? '📉 Ухудшается' : '➡️ Стабильно'}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  </div>
);

export default TrendsView;
