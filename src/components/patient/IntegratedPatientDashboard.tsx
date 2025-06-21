
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PatientDataManager } from '@/services/PatientDataManager';
import { PatientProfile } from '@/types/patient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Activity, 
  Brain, 
  FileText, 
  Users, 
  Calendar,
  AlertTriangle,
  TrendingUp,
  Shield,
  Stethoscope,
  Plus,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

// Импорт виджетов
import RiskAssessmentWidget from './widgets/RiskAssessmentWidget';
import HealthStatusWidget from './widgets/HealthStatusWidget';
import LabResultsWidget from './widgets/LabResultsWidget';
import AIRecommendationsWidget from './widgets/AIRecommendationsWidget';
import QuickActionsWidget from './widgets/QuickActionsWidget';

// Импорт секций
import HealthAssessmentSection from './sections/HealthAssessmentSection';
import RiskFactorsSection from './sections/RiskFactorsSection';
import LabResultsSection from './sections/LabResultsSection';
import AIRecommendationsSection from './sections/AIRecommendationsSection';

export default function IntegratedPatientDashboard() {
  const { user } = useAuth();
  const [patientData, setPatientData] = useState<PatientProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [dataManager] = useState(() => new PatientDataManager());

  useEffect(() => {
    if (user?.id) {
      loadPatientData();
    }
  }, [user]);

  const loadPatientData = async () => {
    try {
      setIsLoading(true);
      const data = await dataManager.loadPatientData(user!.id);
      setPatientData(data);
    } catch (error) {
      console.error('Error loading patient data:', error);
      toast.error('Не удалось загрузить данные пациента');
    } finally {
      setIsLoading(false);
    }
  };

  const sections = [
    { id: 'overview', name: 'Обзор', icon: TrendingUp },
    { id: 'health-assessment', name: 'Оценка здоровья', icon: Heart },
    { id: 'risk-factors', name: 'Факторы риска', icon: AlertTriangle },
    { id: 'lab-results', name: 'Анализы', icon: FileText },
    { id: 'ai-recommendations', name: 'Рекомендации ИИ', icon: Brain },
    { id: 'family-history', name: 'Семейная история', icon: Users },
    { id: 'doctors', name: 'Мои врачи', icon: Stethoscope }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">YTime PREVENT</h2>
          <p className="text-gray-600">Загрузка ваших данных...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-rose-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full flex items-center justify-center text-white text-2xl">
                👩‍💼
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Добро пожаловать, {patientData?.personalInfo.name}!
                </h1>
                <p className="text-gray-600">Ваш персональный кабинет здоровья</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600">
                <Plus className="w-4 h-4 mr-2" />
                Добавить данные
              </Button>
              <Button variant="outline" className="border-rose-200 text-rose-600 hover:bg-rose-50">
                <Stethoscope className="w-4 h-4 mr-2" />
                Связаться с врачом
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white/50 backdrop-blur-sm border-b border-rose-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-1 overflow-x-auto">
            {sections.map((section) => {
              const IconComponent = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-t-lg transition-all duration-200 whitespace-nowrap ${
                    activeSection === section.id
                      ? 'bg-white border-rose-500 text-rose-600 shadow-sm border-b-2'
                      : 'text-gray-600 hover:text-rose-600 hover:bg-white/50'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="font-medium">{section.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeSection === 'overview' && (
          <div className="space-y-8">
            {/* Краткая сводка */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Общий риск</p>
                      <p className="text-2xl font-bold">Низкий</p>
                    </div>
                    <Shield className="w-8 h-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100">Анализы</p>
                      <p className="text-2xl font-bold">{patientData?.labResults.length || 0}</p>
                    </div>
                    <FileText className="w-8 h-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100">Рекомендации</p>
                      <p className="text-2xl font-bold">{patientData?.aiRecommendations.filter(r => r.status === 'new').length || 0}</p>
                    </div>
                    <Brain className="w-8 h-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100">Активность</p>
                      <p className="text-2xl font-bold">8,450</p>
                    </div>
                    <Activity className="w-8 h-8 text-orange-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Основные виджеты */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <RiskAssessmentWidget data={patientData?.riskFactors} />
              <HealthStatusWidget data={patientData?.healthAssessment} />
              <LabResultsWidget data={patientData?.labResults} />
              <AIRecommendationsWidget data={patientData?.aiRecommendations} />
              <QuickActionsWidget onActionClick={(action) => console.log('Quick action:', action)} />
              
              {/* Календарь активности */}
              <Card className="bg-white/80 backdrop-blur-sm border border-rose-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Активность
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Сегодня</span>
                      <Badge variant="secondary">8,450 шагов</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Сон</span>
                      <Badge variant="secondary">7ч 30м</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Пульс</span>
                      <Badge variant="secondary">72 уд/мин</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Последние обновления */}
            <Card className="bg-white/80 backdrop-blur-sm border border-rose-100">
              <CardHeader>
                <CardTitle>Последние обновления</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Добавлены результаты анализов</p>
                      <p className="text-sm text-gray-600">Общий анализ крови • 2 часа назад</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Новая рекомендация ИИ</p>
                      <p className="text-sm text-gray-600">Увеличить потребление витамина D • 1 день назад</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Обновлена оценка рисков</p>
                      <p className="text-sm text-gray-600">Сердечно-сосудистые заболевания • 3 дня назад</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeSection === 'health-assessment' && (
          <HealthAssessmentSection 
            data={patientData?.healthAssessment}
            onUpdate={(data) => dataManager.saveHealthAssessment(data)}
          />
        )}

        {activeSection === 'risk-factors' && (
          <RiskFactorsSection 
            data={patientData?.riskFactors}
            onUpdate={(data) => console.log('Update risk factors:', data)}
          />
        )}

        {activeSection === 'lab-results' && (
          <LabResultsSection 
            data={patientData?.labResults || []}
            onUpload={(result) => dataManager.saveLabResults(result)}
          />
        )}

        {activeSection === 'ai-recommendations' && (
          <AIRecommendationsSection 
            data={patientData?.aiRecommendations || []}
            onAction={(recommendationId, action) => 
              dataManager.handleRecommendationAction(recommendationId, action)
            }
          />
        )}

        {activeSection === 'family-history' && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Семейная история</h3>
            <p className="text-gray-600 mb-6">Добавьте информацию о здоровье ваших родственников</p>
            <Button className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600">
              Добавить семейную историю
            </Button>
          </div>
        )}

        {activeSection === 'doctors' && (
          <div className="text-center py-12">
            <Stethoscope className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Мои врачи</h3>
            <p className="text-gray-600 mb-6">Управляйте доступом к вашим медицинским данным</p>
            <Button className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600">
              Предоставить доступ врачу
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
