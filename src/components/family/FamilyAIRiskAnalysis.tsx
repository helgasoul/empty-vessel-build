
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Heart, 
  AlertTriangle, 
  TrendingUp, 
  Shield, 
  Users,
  Zap,
  ChevronRight,
  Eye,
  Download,
  RefreshCw
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  gender?: string;
  date_of_birth?: string;
  medical_notes?: string;
  is_alive: boolean;
}

interface RiskAnalysisResult {
  id: string;
  condition_name: string;
  risk_level: 'low' | 'moderate' | 'high' | 'very_high';
  risk_percentage: number;
  genetic_factor: number;
  lifestyle_factor: number;
  age_factor: number;
  affected_relatives: string[];
  recommendations: string[];
  screening_advice: string[];
  prevention_tips: string[];
  confidence_score: number;
  last_updated: string;
}

// Type for the database record with proper JSON field handling
interface DatabaseRiskAnalysisRecord {
  id: string;
  family_group_id: string;
  analysis_results: any; // JSON field from database
  ai_recommendations: any; // JSON field from database
  confidence_score: number;
  analyzed_by: string;
  created_at: string;
  updated_at: string;
}

interface FamilyAIRiskAnalysisProps {
  familyGroupId: string;
  familyMembers: FamilyMember[];
}

const FamilyAIRiskAnalysis: React.FC<FamilyAIRiskAnalysisProps> = ({
  familyGroupId,
  familyMembers
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [riskAnalysis, setRiskAnalysis] = useState<RiskAnalysisResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [lastAnalysisDate, setLastAnalysisDate] = useState<string | null>(null);

  useEffect(() => {
    loadExistingAnalysis();
  }, [familyGroupId]);

  const loadExistingAnalysis = async () => {
    if (!familyGroupId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('family_risk_analysis')
        .select('*')
        .eq('family_group_id', familyGroupId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error loading risk analysis:', error);
        return;
      }

      if (data && data.length > 0) {
        const record = data[0] as DatabaseRiskAnalysisRecord;
        // Safely parse the JSON analysis_results
        const analysisResults = Array.isArray(record.analysis_results) 
          ? record.analysis_results as RiskAnalysisResult[]
          : [];
        
        setRiskAnalysis(analysisResults);
        setLastAnalysisDate(record.created_at);
      }
    } catch (error) {
      console.error('Error loading risk analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const runAIAnalysis = async () => {
    if (!user || familyMembers.length === 0) {
      toast({
        title: "Недостаточно данных",
        description: "Добавьте членов семьи для проведения анализа",
        variant: "destructive"
      });
      return;
    }

    setAnalyzing(true);
    try {
      // Собираем данные о семье для анализа
      const familyData = familyMembers.map(member => ({
        id: member.id,
        name: member.name,
        relationship: member.relationship,
        gender: member.gender,
        age: member.date_of_birth ? 
          new Date().getFullYear() - new Date(member.date_of_birth).getFullYear() : null,
        medical_notes: member.medical_notes,
        is_alive: member.is_alive
      }));

      // Получаем медицинскую историю семьи
      const { data: medicalHistory, error: historyError } = await supabase
        .from('family_medical_history')
        .select('*')
        .in('family_member_id', familyMembers.map(m => m.id));

      if (historyError) throw historyError;

      // Вызываем AI анализ
      const { data: analysisResult, error: analysisError } = await supabase.functions.invoke('analyze-family-risks', {
        body: {
          familyGroupId,
          familyData,
          medicalHistory: medicalHistory || []
        }
      });

      if (analysisError) throw analysisError;

      // Сохраняем результаты анализа
      try {
        const { data: savedAnalysis, error: saveError } = await supabase
          .from('family_risk_analysis')
          .insert({
            family_group_id: familyGroupId,
            analysis_results: analysisResult.risks,
            ai_recommendations: analysisResult.recommendations,
            confidence_score: analysisResult.confidenceScore,
            analyzed_by: user.id
          })
          .select()
          .single();

        if (saveError) throw saveError;

        setRiskAnalysis(analysisResult.risks);
        setLastAnalysisDate(savedAnalysis.created_at);
      } catch (saveError) {
        console.error('Error saving analysis:', saveError);
        // Even if save fails, we can still show the results
        setRiskAnalysis(analysisResult.risks);
        setLastAnalysisDate(new Date().toISOString());
      }

      toast({
        title: "Анализ завершен",
        description: "AI анализ рисков успешно проведен"
      });

    } catch (error) {
      console.error('Error running AI analysis:', error);
      toast({
        title: "Ошибка анализа",
        description: "Не удалось провести AI анализ рисков",
        variant: "destructive"
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'text-green-700 bg-green-100 border-green-200';
      case 'moderate':
        return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'high':
        return 'text-orange-700 bg-orange-100 border-orange-200';
      case 'very_high':
        return 'text-red-700 bg-red-100 border-red-200';
      default:
        return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low':
        return Shield;
      case 'moderate':
        return TrendingUp;
      case 'high':
      case 'very_high':
        return AlertTriangle;
      default:
        return Heart;
    }
  };

  const getRiskLevelText = (level: string) => {
    switch (level) {
      case 'low':
        return 'Низкий';
      case 'moderate':
        return 'Умеренный';
      case 'high':
        return 'Высокий';
      case 'very_high':
        return 'Очень высокий';
      default:
        return 'Неизвестно';
    }
  };

  return (
    <div className="space-y-6">
      {/* Заголовок и управление */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-blue-600" />
                <span>AI Анализ семейных рисков</span>
              </CardTitle>
              <CardDescription>
                Искусственный интеллект анализирует медицинскую историю семьи для выявления наследственных рисков
              </CardDescription>
              {lastAnalysisDate && (
                <p className="text-sm text-gray-600 mt-2">
                  Последний анализ: {new Date(lastAnalysisDate).toLocaleDateString('ru-RU')}
                </p>
              )}
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={runAIAnalysis}
                disabled={analyzing || familyMembers.length === 0}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {analyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Анализируем...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    {riskAnalysis.length > 0 ? 'Обновить анализ' : 'Запустить анализ'}
                  </>
                )}
              </Button>
              {riskAnalysis.length > 0 && (
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Экспорт
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {analyzing && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="animate-pulse">
                <Brain className="w-16 h-16 mx-auto text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium">AI анализирует данные вашей семьи</h3>
                <p className="text-gray-600">
                  Пожалуйста, подождите, пока искусственный интеллект обрабатывает медицинскую информацию...
                </p>
              </div>
              <Progress value={66} className="w-full max-w-md mx-auto" />
            </div>
          </CardContent>
        </Card>
      )}

      {riskAnalysis.length === 0 && !analyzing && !loading ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Brain className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              AI анализ не проводился
            </h3>
            <p className="text-gray-600 mb-4">
              Запустите анализ для выявления наследственных рисков и получения персонализированных рекомендаций
            </p>
            <Button 
              onClick={runAIAnalysis}
              disabled={familyMembers.length === 0}
              className="bg-gradient-to-r from-blue-600 to-purple-600"
            >
              <Zap className="w-4 h-4 mr-2" />
              Начать AI анализ
            </Button>
          </CardContent>
        </Card>
      ) : riskAnalysis.length > 0 && (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Обзор рисков</TabsTrigger>
            <TabsTrigger value="recommendations">Рекомендации</TabsTrigger>
            <TabsTrigger value="genetics">Генетика</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {riskAnalysis.map((risk) => {
              const RiskIcon = getRiskIcon(risk.risk_level);
              
              return (
                <Card key={risk.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-lg ${getRiskColor(risk.risk_level)}`}>
                          <RiskIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{risk.condition_name}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={getRiskColor(risk.risk_level)}>
                              {getRiskLevelText(risk.risk_level)} риск
                            </Badge>
                            <span className="text-sm text-gray-600">
                              {risk.risk_percentage}% риск
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Подробнее
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {/* Факторы риска */}
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-gray-700">Генетический фактор</p>
                          <Progress value={risk.genetic_factor} className="mt-1" />
                          <span className="text-xs text-gray-600">{risk.genetic_factor}%</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Образ жизни</p>
                          <Progress value={risk.lifestyle_factor} className="mt-1" />
                          <span className="text-xs text-gray-600">{risk.lifestyle_factor}%</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Возрастной фактор</p>
                          <Progress value={risk.age_factor} className="mt-1" />
                          <span className="text-xs text-gray-600">{risk.age_factor}%</span>
                        </div>
                      </div>

                      {/* Затронутые родственники */}
                      {risk.affected_relatives.length > 0 && (
                        <div>
                          <p className="font-medium text-gray-700 mb-2">Затронутые родственники:</p>
                          <div className="flex flex-wrap gap-2">
                            {risk.affected_relatives.map((relative, index) => (
                              <Badge key={index} variant="outline">
                                <Users className="w-3 h-3 mr-1" />
                                {relative}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Краткие рекомендации */}
                      {risk.recommendations.length > 0 && (
                        <div>
                          <p className="font-medium text-gray-700 mb-2">Основные рекомендации:</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {risk.recommendations.slice(0, 3).map((rec, index) => (
                              <li key={index} className="flex items-start">
                                <ChevronRight className="w-3 h-3 mr-1 mt-0.5 text-blue-500" />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-4 border-t">
                        <span className="text-xs text-gray-500">
                          Достоверность анализа: {risk.confidence_score}%
                        </span>
                        <span className="text-xs text-gray-500">
                          Обновлено: {new Date(risk.last_updated).toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4">
            {riskAnalysis.map((risk) => (
              <Card key={`rec-${risk.id}`}>
                <CardHeader>
                  <CardTitle className="text-lg">{risk.condition_name}</CardTitle>
                  <CardDescription>
                    Персонализированные рекомендации на основе AI анализа
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {risk.recommendations.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Общие рекомендации:</h4>
                      <ul className="space-y-2">
                        {risk.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start p-3 bg-blue-50 rounded-lg">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                              <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                            </div>
                            <span className="text-sm text-gray-700">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {risk.screening_advice.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Скрининг и обследования:</h4>
                      <ul className="space-y-2">
                        {risk.screening_advice.map((advice, index) => (
                          <li key={index} className="flex items-start p-3 bg-yellow-50 rounded-lg">
                            <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                              <Heart className="w-3 h-3 text-yellow-600" />
                            </div>
                            <span className="text-sm text-gray-700">{advice}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {risk.prevention_tips.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Профилактика:</h4>
                      <ul className="space-y-2">
                        {risk.prevention_tips.map((tip, index) => (
                          <li key={index} className="flex items-start p-3 bg-green-50 rounded-lg">
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                              <Shield className="w-3 h-3 text-green-600" />
                            </div>
                            <span className="text-sm text-gray-700">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="genetics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Генетический анализ семьи</CardTitle>
                <CardDescription>
                  Наследственные паттерны и генетические факторы риска
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {riskAnalysis.map((risk) => (
                    <div key={`gen-${risk.id}`} className="space-y-3">
                      <h4 className="font-medium">{risk.condition_name}</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Генетический вклад:</span>
                          <span className="font-medium">{risk.genetic_factor}%</span>
                        </div>
                        <Progress value={risk.genetic_factor} className="h-2" />
                      </div>
                      {risk.affected_relatives.length > 0 && (
                        <div className="text-sm text-gray-600">
                          <p>Семейная история: {risk.affected_relatives.join(', ')}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default FamilyAIRiskAnalysis;
