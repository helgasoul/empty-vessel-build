
/**
 * AI Analysis Dashboard
 * Main interface for health data analysis
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/design-system/components';
import { Badge } from '@/design-system/components';
import { 
  Brain,
  Activity,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  Clock,
  Play,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import { useAIAnalysis } from '@/hooks/useAIAnalysis';
import { AnalysisConfigForm } from './AnalysisConfigForm';
import { AnalysisResults } from './AnalysisResults';
import { AnalysisHistory } from './AnalysisHistory';

export const AIAnalysisDashboard: React.FC = () => {
  const {
    isAnalyzing,
    currentAnalysis,
    analysisHistory,
    error,
    startAnalysis,
    clearCurrentAnalysis
  } = useAIAnalysis();

  const [showConfigForm, setShowConfigForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');

  const handleStartAnalysis = async (config: any) => {
    const sessionId = await startAnalysis(config);
    if (sessionId) {
      setShowConfigForm(false);
    }
  };

  const latestAnalysis = analysisHistory[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-lg blur opacity-20"></div>
          <Card className="relative bg-white/80 backdrop-blur-sm border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl">
                    <Brain className="h-8 w-8 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-h2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                      ИИ Анализ Здоровья
                    </CardTitle>
                    <CardDescription className="text-body-large">
                      Многомодальный анализ ваших данных о здоровье с персонализированными инсайтами
                    </CardDescription>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {!isAnalyzing && !showConfigForm && (
                    <Button
                      variant="gradient"
                      onClick={() => setShowConfigForm(true)}
                      icon={Play}
                    >
                      Начать анализ
                    </Button>
                  )}
                  
                  {isAnalyzing && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span className="text-body font-medium">Анализируем...</span>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-medium">{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analysis Configuration Form */}
        {showConfigForm && (
          <AnalysisConfigForm
            onSubmit={handleStartAnalysis}
            onCancel={() => setShowConfigForm(false)}
            isLoading={isAnalyzing}
          />
        )}

        {/* Quick Stats */}
        {!showConfigForm && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-body-small text-text-secondary font-medium">Всего анализов</p>
                    <p className="text-h3 text-text-primary font-bold">{analysisHistory.length}</p>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-body-small text-text-secondary font-medium">Паттернов найдено</p>
                    <p className="text-h3 text-text-primary font-bold">
                      {latestAnalysis?.patterns_detected?.length || 0}
                    </p>
                  </div>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Activity className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-body-small text-text-secondary font-medium">Корреляций</p>
                    <p className="text-h3 text-text-primary font-bold">
                      {latestAnalysis?.correlations_found?.length || 0}
                    </p>
                  </div>
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-body-small text-text-secondary font-medium">Последний анализ</p>
                    <p className="text-body text-text-primary font-medium">
                      {latestAnalysis ? 
                        new Date(latestAnalysis.created_at).toLocaleDateString('ru-RU') : 
                        'Нет данных'
                      }
                    </p>
                  </div>
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Clock className="h-5 w-5 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Analysis Status */}
        {isAnalyzing && (
          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-center space-y-4 flex-col">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Brain className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-h4 text-text-primary font-semibold mb-2">
                    Анализируем ваши данные
                  </h3>
                  <p className="text-body text-text-secondary">
                    ИИ обрабатывает ваши данные о здоровье и ищет паттерны, корреляции и аномалии.
                    Это может занять несколько минут.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        {!showConfigForm && !isAnalyzing && (
          <>
            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-white/60 backdrop-blur-sm p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('current')}
                className={`flex-1 py-2 px-4 rounded-md text-body font-medium transition-colors ${
                  activeTab === 'current'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Результаты анализа
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 py-2 px-4 rounded-md text-body font-medium transition-colors ${
                  activeTab === 'history'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                История анализов
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'current' && (
              currentAnalysis ? (
                <AnalysisResults 
                  results={currentAnalysis} 
                  onClose={clearCurrentAnalysis}
                />
              ) : (
                <Card className="border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-12">
                    <div className="text-center">
                      <Brain className="h-16 w-16 text-text-tertiary mx-auto mb-4" />
                      <h3 className="text-h4 text-text-primary font-semibold mb-2">
                        Нет активных анализов
                      </h3>
                      <p className="text-body text-text-secondary mb-6">
                        Запустите анализ ИИ, чтобы получить персонализированные инсайты о вашем здоровье
                      </p>
                      <Button
                        variant="gradient"
                        onClick={() => setShowConfigForm(true)}
                        icon={Play}
                      >
                        Начать первый анализ
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            )}

            {activeTab === 'history' && (
              <AnalysisHistory 
                sessions={analysisHistory}
                onSelectSession={(session) => {
                  // Load selected session results
                }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};
