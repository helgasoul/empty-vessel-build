
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { History, BarChart3, FileText, RefreshCw, Download, Eye } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import RiskVisualization from "./RiskVisualization";
import { toast } from "sonner";

interface RiskAssessment {
  id: string;
  assessment_type: string;
  risk_percentage: number;
  risk_level: string;
  created_at: string;
  recommendations: string[];
  assessment_data: any;
  results_data: any;
}

const EnhancedRiskHistory: React.FC = () => {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState<RiskAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssessment, setSelectedAssessment] = useState<RiskAssessment | null>(null);

  useEffect(() => {
    if (user) {
      loadAssessments();
    }
  }, [user]);

  const loadAssessments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('risk_assessments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssessments(data || []);
    } catch (error) {
      console.error('Error loading assessments:', error);
      toast.error('Ошибка при загрузке истории оценок');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate':
      case 'medium':
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'very_high': return 'bg-red-200 text-red-900 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskLevelText = (level: string) => {
    switch (level) {
      case 'low': return 'Низкий';
      case 'intermediate':
      case 'medium':
      case 'moderate': return 'Средний';
      case 'high': return 'Высокий';
      case 'very_high': return 'Очень высокий';
      default: return 'Неизвестно';
    }
  };

  const getAssessmentName = (type: string) => {
    switch (type.toLowerCase()) {
      case 'qrisk3': return 'QRISK3 - Сердечно-сосудистые риски';
      case 'framingham_alzheimer': return 'Framingham - Риск болезни Альцгеймера';
      case 'demport': return 'DemPoRT - Популяционный риск деменции';
      case 'cancer_risk': return 'Cancer Risk Calculator';
      case 'bcsc': return 'BCSC v3 - Риск рака молочной железы';
      case 'brca': return 'BRCA - Генетические риски рака';
      case 'gail': return 'Gail Model - Риск рака молочной железы';
      case 'rais_chemical': return 'RAIS - Химические риски';
      default: return type.toUpperCase();
    }
  };

  const exportToJSON = () => {
    const dataStr = JSON.stringify(assessments, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `risk_assessments_${format(new Date(), 'yyyy-MM-dd')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Данные экспортированы');
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin mr-2" />
            <span>Загрузка истории оценок...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <History className="w-5 h-5" />
                <span>История оценок рисков</span>
              </CardTitle>
              <CardDescription>
                Просмотр и анализ проведенных оценок рисков здоровья
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={loadAssessments}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Обновить
              </Button>
              {assessments.length > 0 && (
                <Button variant="outline" size="sm" onClick={exportToJSON}>
                  <Download className="w-4 h-4 mr-2" />
                  Экспорт
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {assessments.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                История оценок пуста
              </h3>
              <p className="text-gray-600">
                Пройдите первую оценку рисков для просмотра результатов здесь
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="visualization" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="visualization" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Визуализация</span>
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Список оценок</span>
            </TabsTrigger>
            <TabsTrigger value="details" className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>Детали</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="visualization">
            <RiskVisualization riskData={assessments} />
          </TabsContent>

          <TabsContent value="list">
            <div className="space-y-4">
              {assessments.map((assessment) => (
                <Card key={assessment.id} className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedAssessment(assessment)}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">
                          {getAssessmentName(assessment.assessment_type)}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          Дата: {format(new Date(assessment.created_at), 'dd MMMM yyyy, HH:mm', { locale: ru })}
                        </p>
                        <div className="flex items-center space-x-4">
                          <span className="text-lg font-semibold">
                            Риск: {assessment.risk_percentage}%
                          </span>
                          <Badge className={getRiskColor(assessment.risk_level)}>
                            {getRiskLevelText(assessment.risk_level)}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500 mb-1">
                          Рекомендаций: {assessment.recommendations?.length || 0}
                        </p>
                        <Button variant="outline" size="sm">
                          Подробнее
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="details">
            {selectedAssessment ? (
              <Card>
                <CardHeader>
                  <CardTitle>{getAssessmentName(selectedAssessment.assessment_type)}</CardTitle>
                  <CardDescription>
                    Дата: {format(new Date(selectedAssessment.created_at), 'dd MMMM yyyy, HH:mm', { locale: ru })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-1">Риск</h4>
                      <p className="text-2xl font-bold text-blue-700">
                        {selectedAssessment.risk_percentage}%
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-1">Уровень</h4>
                      <Badge className={getRiskColor(selectedAssessment.risk_level)}>
                        {getRiskLevelText(selectedAssessment.risk_level)}
                      </Badge>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-1">Рекомендации</h4>
                      <p className="text-2xl font-bold text-green-700">
                        {selectedAssessment.recommendations?.length || 0}
                      </p>
                    </div>
                  </div>

                  {selectedAssessment.recommendations && selectedAssessment.recommendations.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Рекомендации:</h4>
                      <div className="space-y-2">
                        {selectedAssessment.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-sm text-gray-700">{rec}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedAssessment.results_data && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Результаты анализа:</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                          {JSON.stringify(selectedAssessment.results_data, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Eye className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Выберите оценку для просмотра деталей
                    </h3>
                    <p className="text-gray-600">
                      Нажмите на любую оценку в списке для просмотра подробной информации
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default EnhancedRiskHistory;
