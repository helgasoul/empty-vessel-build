
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Heart, TrendingUp, Calendar, Download, Filter, CalendarCheck, BarChart3, FileText, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import RiskVisualization from "./RiskVisualization";
import AnnualCheckupRecommendations from "./AnnualCheckupRecommendations";

interface RiskAssessmentData {
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
  const [assessments, setAssessments] = useState<RiskAssessmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      loadAssessments();
      loadUserProfile();
    }
  }, [user]);

  const loadAssessments = async () => {
    try {
      const { data, error } = await supabase
        .from('risk_assessments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssessments(data || []);
    } catch (error) {
      console.error('Error loading assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('age, gender, date_of_birth')
        .eq('id', user?.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading profile:', error);
      } else if (data) {
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'text-green-700 bg-green-100 border-green-200';
      case 'intermediate':
      case 'medium':
      case 'moderate':
        return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'high':
        return 'text-red-700 bg-red-100 border-red-200';
      case 'very_high':
        return 'text-red-800 bg-red-200 border-red-300';
      default:
        return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getProgressColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-green-500';
      case 'intermediate':
      case 'medium':
      case 'moderate':
        return 'bg-yellow-500';
      case 'high':
        return 'bg-red-500';
      case 'very_high':
        return 'bg-red-600';
      default:
        return 'bg-gray-500';
    }
  };

  const getRiskLevelText = (level: string) => {
    switch (level) {
      case 'low':
        return 'Низкий';
      case 'intermediate':
      case 'medium':
      case 'moderate':
        return 'Средний';
      case 'high':
        return 'Высокий';
      case 'very_high':
        return 'Очень высокий';
      default:
        return 'Неизвестно';
    }
  };

  const getAssessmentName = (type: string) => {
    switch (type.toLowerCase()) {
      case 'qrisk3':
        return 'QRISK3 (Сердечно-сосудистые риски)';
      case 'framingham_alzheimer':
        return 'Framingham (Болезнь Альцгеймера)';
      case 'demport':
        return 'DemPoRT (Риск деменции)';
      case 'cancer_risk':
        return 'Cancer Risk Calculator';
      case 'rais_chemical':
        return 'RAIS Chemical Risk';
      case 'crc_pro':
        return 'CRC-PRO (Колоректальный рак)';
      case 'bcsc':
        return 'BCSC v3 (Рак молочной железы)';
      case 'brca':
        return 'BRCA (Генетические риски)';
      case 'gail':
        return 'Gail Model (Рак молочной железы)';
      default:
        return type.toUpperCase();
    }
  };

  const calculateUserAge = () => {
    if (userProfile?.age) return userProfile.age;
    if (userProfile?.date_of_birth) {
      const birthDate = new Date(userProfile.date_of_birth);
      const today = new Date();
      return today.getFullYear() - birthDate.getFullYear();
    }
    return 30; // значение по умолчанию
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-2 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span>История оценок рисков</span>
          </CardTitle>
          <CardDescription>
            Все проведенные оценки рисков и персонализированные рекомендации
          </CardDescription>
        </CardHeader>
      </Card>

      {assessments.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Heart className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Нет проведенных оценок
            </h3>
            <p className="text-gray-600 mb-4">
              Пройдите оценку рисков для получения персонализированных рекомендаций
            </p>
            <Button onClick={() => window.location.href = '/risk-assessment'}>
              Начать оценку
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Обзор</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>История</span>
            </TabsTrigger>
            <TabsTrigger value="checkups" className="flex items-center space-x-2">
              <CalendarCheck className="w-4 h-4" />
              <span>Обследования</span>
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Рекомендации</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <RiskVisualization riskData={assessments} />
          </TabsContent>

          <TabsContent value="history">
            <div className="grid gap-6">
              {assessments.map((assessment) => (
                <Card key={assessment.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {getAssessmentName(assessment.assessment_type)}
                        </CardTitle>
                        <CardDescription>
                          Проведено {format(new Date(assessment.created_at), 'dd MMMM yyyy', { locale: ru })}
                        </CardDescription>
                      </div>
                      <Badge className={getRiskColor(assessment.risk_level)}>
                        {getRiskLevelText(assessment.risk_level)} риск
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          Риск: {assessment.risk_percentage}%
                        </span>
                        <span className="text-gray-900 font-medium">
                          {assessment.risk_percentage}/100
                        </span>
                      </div>
                      <div className="relative">
                        <Progress value={assessment.risk_percentage} className="h-2" />
                        <div 
                          className={`absolute top-0 left-0 h-2 rounded-full transition-all ${getProgressColor(assessment.risk_level)}`}
                          style={{ width: `${assessment.risk_percentage}%` }}
                        />
                      </div>
                    </div>

                    {assessment.recommendations && assessment.recommendations.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Рекомендации:</h4>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          {assessment.recommendations.slice(0, 3).map((rec, index) => (
                            <li key={index}>{rec}</li>
                          ))}
                          {assessment.recommendations.length > 3 && (
                            <li className="text-gray-500">
                              +{assessment.recommendations.length - 3} дополнительных рекомендаций
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="checkups">
            <AnnualCheckupRecommendations 
              riskAssessments={assessments}
              userAge={calculateUserAge()}
              userGender={userProfile?.gender || 'female'}
            />
          </TabsContent>

          <TabsContent value="recommendations">
            <div className="grid gap-6">
              {assessments.map((assessment) => (
                <Card key={assessment.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Рекомендации: {getAssessmentName(assessment.assessment_type)}
                      </CardTitle>
                      <Badge className={getRiskColor(assessment.risk_level)}>
                        {getRiskLevelText(assessment.risk_level)} риск
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {assessment.recommendations && assessment.recommendations.length > 0 ? (
                      <div className="space-y-3">
                        {assessment.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                            </div>
                            <p className="text-sm text-gray-700">{rec}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        Нет доступных рекомендаций для данной оценки
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default EnhancedRiskHistory;
