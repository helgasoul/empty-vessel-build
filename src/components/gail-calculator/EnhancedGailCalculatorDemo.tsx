
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator, 
  DNA, 
  Smartphone, 
  Heart,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react';
import { 
  useGailCalculator, 
  useGeneticData, 
  useWearableSync, 
  usePersonalizedRecommendations 
} from '@/hooks';
import type { GailCalculatorInput } from '@/types/gail-calculator';

export const EnhancedGailCalculatorDemo: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<'calculator' | 'genetic' | 'wearable' | 'recommendations'>('calculator');

  // Initialize all hooks
  const gailCalculator = useGailCalculator({
    autoSaveHistory: true,
    enableEnhancedAnalysis: true,
    onProgress: (progress) => console.log('Gail Calculator Progress:', progress),
    onCalculationComplete: (result) => console.log('Calculation Complete:', result),
  });

  const geneticData = useGeneticData();
  const wearableSync = useWearableSync('demo-user-id');
  const recommendations = usePersonalizedRecommendations();

  // Demo data
  const demoPatientData: GailCalculatorInput = {
    personalInfo: {
      age: 45,
      race: 'caucasian',
    },
    medicalHistory: {
      ageAtMenarche: 12,
      ageAtFirstBirth: 28,
      numberOfBiopsies: 1,
      atypicalHyperplasia: false,
    },
    familyHistory: {
      breastCancerRelatives: 1,
    },
  };

  const handleCalculateRisk = async () => {
    await gailCalculator.calculateRisk(demoPatientData);
  };

  const handleEnhancedCalculation = async () => {
    const geneticFactors = {
      brca1: 'negative' as const,
      brca2: 'negative' as const,
      polygeneticScore: 0.6,
    };

    const environmentalFactors = {
      airQuality: {
        aqi: 45,
        mainPollutant: 'PM2.5',
      },
    };

    await gailCalculator.calculateEnhancedRisk(demoPatientData, geneticFactors, environmentalFactors);
  };

  const handleConnectDevice = async () => {
    await wearableSync.connectDevice('apple_health', 'iPhone 15 Pro');
  };

  const renderCalculatorDemo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Базовый расчет
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleCalculateRisk} 
              disabled={gailCalculator.isCalculating}
              className="w-full"
            >
              {gailCalculator.isCalculating ? 'Расчет...' : 'Рассчитать риск'}
            </Button>
            
            {gailCalculator.progress && (
              <div className="mt-4">
                <Progress 
                  value={(gailCalculator.progress.current / gailCalculator.progress.total) * 100} 
                />
                <p className="text-sm text-gray-600 mt-2">
                  {gailCalculator.progress.message}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Расширенный анализ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleEnhancedCalculation} 
              disabled={gailCalculator.isCalculating}
              variant="outline"
              className="w-full"
            >
              Расширенный анализ
            </Button>
          </CardContent>
        </Card>
      </div>

      {gailCalculator.currentResult && (
        <Card>
          <CardHeader>
            <CardTitle>Результаты расчета</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {gailCalculator.utils.formatRiskPercentage(gailCalculator.currentResult.fiveYearRisk)}
                </p>
                <p className="text-sm text-gray-600">5-летний риск</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {gailCalculator.utils.formatRiskPercentage(gailCalculator.currentResult.lifetimeRisk)}
                </p>
                <p className="text-sm text-gray-600">Пожизненный риск</p>
              </div>
              <div className="text-center">
                <Badge 
                  style={{ 
                    backgroundColor: gailCalculator.utils.getRiskLevelColor(gailCalculator.currentResult.riskCategory),
                    color: 'white'
                  }}
                >
                  {gailCalculator.utils.getRiskLevelText(gailCalculator.currentResult.riskCategory)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderGeneticDemo = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DNA className="h-5 w-5" />
            Генетические данные
          </CardTitle>
          <CardDescription>
            Поддерживаемые форматы: {geneticData.utils.getSupportedFormats().join(', ')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <DNA className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Перетащите файл с генетическими данными сюда</p>
              <p className="text-sm text-gray-500 mt-2">
                Поддерживаемые лаборатории: {geneticData.utils.getSupportedLaboratories().join(', ')}
              </p>
            </div>

            {geneticData.isUploading && (
              <div>
                <Progress value={geneticData.uploadProgress} />
                <p className="text-sm text-gray-600 mt-2">
                  Загрузка: {geneticData.uploadProgress}%
                </p>
              </div>
            )}

            {geneticData.currentAnalysis && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Анализ завершен</h4>
                <p className="text-sm text-green-700">
                  Найдено {geneticData.currentAnalysis.riskVariants.length} факторов риска
                  и {geneticData.currentAnalysis.protectiveVariants.length} защитных факторов
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderWearableDemo = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Носимые устройства
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wearableSync.utils.getSupportedDevices().map((device) => (
              <div key={device.type} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{device.icon}</span>
                    <span className="font-medium">{device.name}</span>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={handleConnectDevice}
                    disabled={wearableSync.isSyncing}
                  >
                    Подключить
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {wearableSync.connectedDevices.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold mb-4">Подключенные устройства</h4>
              {wearableSync.connectedDevices.map((device) => (
                <div key={device.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>{device.deviceName}</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {device.lastSyncAt ? wearableSync.utils.formatLastSync(device.lastSyncAt) : 'Не синхронизировано'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderRecommendationsDemo = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Персональные рекомендации
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{recommendations.stats.total}</p>
              <p className="text-sm text-gray-600">Всего рекомендаций</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{recommendations.stats.completed}</p>
              <p className="text-sm text-gray-600">Выполнено</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{recommendations.stats.high_priority}</p>
              <p className="text-sm text-gray-600">Высокий приоритет</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{recommendations.stats.completion_rate.toFixed(0)}%</p>
              <p className="text-sm text-gray-600">Процент выполнения</p>
            </div>
          </div>

          <div className="space-y-4">
            {recommendations.recommendations.slice(0, 3).map((recommendation) => (
              <div key={recommendation.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="text-2xl">
                      {recommendations.utils.getTypeIcon(recommendation.type)}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{recommendation.title}</h4>
                        <Badge 
                          style={{ 
                            backgroundColor: recommendations.utils.getPriorityColor(recommendation.priority),
                            color: 'white'
                          }}
                          className="text-xs"
                        >
                          {recommendation.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{recommendation.description}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>{recommendation.timeline}</span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => recommendations.markAsCompleted(recommendation.id)}
                  >
                    Выполнено
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Enhanced Gail Calculator Demo
          </h1>
          <p className="text-xl text-gray-600">
            Демонстрация React хуков для платформы женского здоровья
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-1 bg-white/60 backdrop-blur-sm p-1 rounded-lg">
            {[
              { key: 'calculator', label: 'Калькулятор', icon: Calculator },
              { key: 'genetic', label: 'Генетика', icon: DNA },
              { key: 'wearable', label: 'Устройства', icon: Smartphone },
              { key: 'recommendations', label: 'Рекомендации', icon: Heart },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveDemo(key as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeDemo === key
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Demo Content */}
        {activeDemo === 'calculator' && renderCalculatorDemo()}
        {activeDemo === 'genetic' && renderGeneticDemo()}
        {activeDemo === 'wearable' && renderWearableDemo()}
        {activeDemo === 'recommendations' && renderRecommendationsDemo()}

        {/* Error Display */}
        {(gailCalculator.error || geneticData.error || wearableSync.error || recommendations.error) && (
          <Card className="mt-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-medium">
                  {gailCalculator.error || geneticData.error || wearableSync.error || recommendations.error}
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EnhancedGailCalculatorDemo;
