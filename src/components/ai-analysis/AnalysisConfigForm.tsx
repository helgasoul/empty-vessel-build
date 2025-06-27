
/**
 * Analysis Configuration Form
 * Form for configuring AI analysis parameters
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Settings,
  Calendar,
  Database,
  Target,
  ArrowLeft,
  Play
} from 'lucide-react';
import { AnalysisScope, AnalysisTimeframe } from '@/services/aiAnalysisService';

interface AnalysisConfigFormProps {
  onSubmit: (config: {
    sessionType: string;
    scope: AnalysisScope;
    timeframe: AnalysisTimeframe;
  }) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export const AnalysisConfigForm: React.FC<AnalysisConfigFormProps> = ({
  onSubmit,
  onCancel,
  isLoading
}) => {
  const [sessionType, setSessionType] = useState<'full_analysis' | 'targeted_analysis' | 'pattern_detection'>('full_analysis');
  const [timeframePeriod, setTimeframePeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [scope, setScope] = useState<AnalysisScope>({
    includeWearableData: true,
    includeLabResults: false,
    includeMenstrualCycle: true,
    includeSymptoms: true,
    includeMedications: false,
  });

  const handleSubmit = () => {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date();
    
    switch (timeframePeriod) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }

    const timeframe: AnalysisTimeframe = {
      startDate: startDate.toISOString().split('T')[0],
      endDate,
      period: timeframePeriod
    };

    onSubmit({
      sessionType,
      scope,
      timeframe
    });
  };

  const sessionTypes = [
    {
      id: 'full_analysis',
      name: 'Полный анализ',
      description: 'Комплексный анализ всех доступных данных с поиском паттернов, корреляций и аномалий',
      icon: Database
    },
    {
      id: 'targeted_analysis',
      name: 'Целевой анализ',
      description: 'Фокусируется на конкретных аспектах здоровья и метриках',
      icon: Target
    },
    {
      id: 'pattern_detection',
      name: 'Поиск паттернов',
      description: 'Специализированный поиск повторяющихся паттернов в данных',
      icon: Settings
    }
  ];

  const timeframes = [
    { id: 'week', name: 'Последняя неделя', description: '7 дней' },
    { id: 'month', name: 'Последний месяц', description: '30 дней' },
    { id: 'quarter', name: 'Последние 3 месяца', description: '90 дней' },
    { id: 'year', name: 'Последний год', description: '365 дней' }
  ];

  return (
    <Card className="border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <CardTitle className="text-h3 text-text-primary">
              Настройка анализа
            </CardTitle>
            <CardDescription>
              Выберите параметры для персонализированного анализа ваших данных
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Session Type Selection */}
        <div>
          <h3 className="text-h4 text-text-primary font-semibold mb-4 flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Тип анализа
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sessionTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setSessionType(type.id as any)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    sessionType === type.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-border-light bg-white hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      sessionType === type.id ? 'bg-purple-100' : 'bg-background-secondary'
                    }`}>
                      <Icon className={`h-5 w-5 ${
                        sessionType === type.id ? 'text-purple-600' : 'text-text-secondary'
                      }`} />
                    </div>
                    <div>
                      <h4 className="text-body font-semibold text-text-primary mb-1">
                        {type.name}
                      </h4>
                      <p className="text-body-small text-text-secondary">
                        {type.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Timeframe Selection */}
        <div>
          <h3 className="text-h4 text-text-primary font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Временной период
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {timeframes.map((timeframe) => (
              <button
                key={timeframe.id}
                onClick={() => setTimeframePeriod(timeframe.id as any)}
                className={`p-3 rounded-lg border-2 text-center transition-all ${
                  timeframePeriod === timeframe.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-border-light bg-white hover:border-purple-300'
                }`}
              >
                <div className="text-body font-semibold text-text-primary">
                  {timeframe.name}
                </div>
                <div className="text-body-small text-text-secondary">
                  {timeframe.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Data Sources */}
        <div>
          <h3 className="text-h4 text-text-primary font-semibold mb-4 flex items-center gap-2">
            <Database className="h-5 w-5" />
            Источники данных
          </h3>
          <div className="space-y-3">
            {[
              { key: 'includeWearableData', label: 'Данные с носимых устройств', desc: 'Шаги, пульс, сон, активность' },
              { key: 'includeMenstrualCycle', label: 'Менструальный цикл', desc: 'Данные о цикле и симптомах' },
              { key: 'includeSymptoms', label: 'Симптомы и настроение', desc: 'Ежедневные записи о самочувствии' },
              { key: 'includeLabResults', label: 'Результаты анализов', desc: 'Лабораторные исследования' },
              { key: 'includeMedications', label: 'Медикаменты', desc: 'Принимаемые препараты' }
            ].map((item) => (
              <label
                key={item.key}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-background-secondary cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={scope[item.key as keyof AnalysisScope] as boolean}
                  onChange={(e) => setScope({
                    ...scope,
                    [item.key]: e.target.checked
                  })}
                  className="mt-1 w-4 h-4 text-purple-600 border-border-medium rounded focus:ring-purple-500"
                />
                <div>
                  <div className="text-body font-medium text-text-primary">
                    {item.label}
                  </div>
                  <div className="text-body-small text-text-secondary">
                    {item.desc}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4 border-t border-border-light">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Отмена
          </Button>
          
          <Button
            variant="gradient"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            <Play className="w-4 h-4 mr-2" />
            {isLoading ? 'Запускаем анализ...' : 'Начать анализ'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
