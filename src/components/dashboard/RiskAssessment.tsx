import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Heart, Brain, Zap, RefreshCw, Calculator, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface RiskAssessmentData {
  id: string;
  assessment_type: string;
  risk_percentage: number;
  risk_level: string;
  created_at: string;
  recommendations: string[];
}

const RiskAssessment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState<RiskAssessmentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadLatestAssessments();
    }
  }, [user]);

  const loadLatestAssessments = async () => {
    try {
      const { data, error } = await supabase
        .from('risk_assessments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setAssessments(data || []);
    } catch (error) {
      console.error('Error loading assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'text-green-700 bg-green-100';
      case 'intermediate':
      case 'medium':
      case 'moderate':
        return 'text-yellow-700 bg-yellow-100';
      case 'high':
        return 'text-red-700 bg-red-100';
      case 'very_high':
        return 'text-red-800 bg-red-200';
      default:
        return 'text-gray-700 bg-gray-100';
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

  const getCategoryIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'qrisk3':
      case 'framingham':
        return Heart;
      case 'framingham_alzheimer':
        return Brain;
      case 'demport':
        return Zap;
      case 'cancer_risk':
        return Shield;
      case 'bcsc':
      case 'brca':
      case 'gail':
        return Heart;
      default:
        return TrendingUp;
    }
  };

  const getAssessmentName = (type: string) => {
    switch (type.toLowerCase()) {
      case 'qrisk3':
        return 'QRISK3';
      case 'framingham_alzheimer':
        return 'Framingham (Альцгеймер)';
      case 'demport':
        return 'DemPoRT';
      case 'cancer_risk':
        return 'Cancer Risk Calculator';
      case 'bcsc':
        return 'BCSC v3';
      case 'brca':
        return 'BRCA';
      case 'gail':
        return 'Gail Model';
      default:
        return type.toUpperCase();
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span>Оценка рисков</span>
          </CardTitle>
          <CardDescription>Загрузка данных...</CardDescription>
        </CardHeader>
        <CardContent>
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span>Оценка рисков</span>
            </CardTitle>
            <CardDescription>
              Персонализированный анализ рисков здоровья
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/risk-assessment')}>
            <Calculator className="w-4 h-4 mr-2" />
            Новая оценка
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {assessments.length === 0 ? (
          <div className="text-center py-8">
            <Heart className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Нет проведенных оценок
            </h3>
            <p className="text-gray-600 mb-4">
              Заполните форму оценки рисков для получения персонализированных рекомендаций
            </p>
            <Button onClick={() => navigate('/risk-assessment')}>
              <Calculator className="w-4 h-4 mr-2" />
              Начать оценку
            </Button>
          </div>
        ) : (
          <>
            {assessments.map((assessment, index) => {
              const IconComponent = getCategoryIcon(assessment.assessment_type);
              return (
                <div key={assessment.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <IconComponent className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {getAssessmentName(assessment.assessment_type)}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {assessment.recommendations?.length || 0} рекомендаций
                        </p>
                      </div>
                    </div>
                    <Badge className={getRiskColor(assessment.risk_level)}>
                      {getRiskLevelText(assessment.risk_level)} риск
                    </Badge>
                  </div>
                  
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
                </div>
              );
            })}

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Последнее обновление:</span>
                <span className="text-gray-900">
                  {assessments.length > 0 
                    ? format(new Date(assessments[0].created_at), 'dd.MM.yyyy', { locale: ru })
                    : 'Нет данных'
                  }
                </span>
              </div>
              <Button 
                className="w-full mt-4" 
                variant="outline"
                onClick={() => navigate('/risk-assessment')}
              >
                Посмотреть детальный анализ
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default RiskAssessment;
