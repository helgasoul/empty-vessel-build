
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Eye, TrendingUp, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RiskAssessment {
  id: string;
  assessment_type: string;
  risk_percentage: number;
  risk_level: string;
  created_at: string;
  recommendations: string[];
}

interface HealthRecommendation {
  id: string;
  category: string;
  title: string;
  description: string;
  priority: number;
  completed: boolean;
  risk_assessment_id: string;
}

const RiskAssessmentHistory = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [assessments, setAssessments] = useState<RiskAssessment[]>([]);
  const [recommendations, setRecommendations] = useState<HealthRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssessment, setSelectedAssessment] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadAssessments();
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
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить историю оценок",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadRecommendations = async (assessmentId: string) => {
    try {
      const { data, error } = await supabase
        .from('health_recommendations')
        .select('*')
        .eq('risk_assessment_id', assessmentId)
        .order('priority', { ascending: false });

      if (error) throw error;
      setRecommendations(data || []);
    } catch (error) {
      console.error('Error loading recommendations:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить рекомендации",
        variant: "destructive",
      });
    }
  };

  const toggleRecommendationCompleted = async (recommendationId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('health_recommendations')
        .update({ completed })
        .eq('id', recommendationId);

      if (error) throw error;

      setRecommendations(prev => 
        prev.map(rec => 
          rec.id === recommendationId ? { ...rec, completed } : rec
        )
      );

      toast({
        title: completed ? "Рекомендация выполнена" : "Рекомендация отмечена как невыполненная",
        description: "Статус обновлен",
      });
    } catch (error) {
      console.error('Error updating recommendation:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить статус рекомендации",
        variant: "destructive",
      });
    }
  };

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskLevelText = (level: string) => {
    switch (level) {
      case 'low':
        return 'Низкий';
      case 'medium':
        return 'Средний';
      case 'high':
        return 'Высокий';
      default:
        return 'Неизвестно';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'lifestyle':
        return '🏃‍♀️';
      case 'medical':
        return '🏥';
      case 'nutrition':
        return '🥗';
      case 'exercise':
        return '💪';
      default:
        return '📋';
    }
  };

  const handleViewDetails = (assessmentId: string) => {
    setSelectedAssessment(assessmentId);
    loadRecommendations(assessmentId);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <Clock className="w-8 h-8 animate-spin mx-auto mb-2 text-gray-500" />
            <p>Загрузка истории оценок...</p>
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
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <span>История оценок рисков</span>
          </CardTitle>
          <CardDescription>
            Просмотр всех проведенных оценок и рекомендаций по здоровью
          </CardDescription>
        </CardHeader>
        <CardContent>
          {assessments.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Нет проведенных оценок
              </h3>
              <p className="text-gray-600">
                Заполните форму оценки рисков, чтобы увидеть результаты здесь
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Дата</TableHead>
                  <TableHead>Тип оценки</TableHead>
                  <TableHead>Риск (%)</TableHead>
                  <TableHead>Уровень</TableHead>
                  <TableHead>Рекомендации</TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assessments.map((assessment) => (
                  <TableRow key={assessment.id}>
                    <TableCell>
                      {format(new Date(assessment.created_at), 'dd.MM.yyyy HH:mm', { locale: ru })}
                    </TableCell>
                    <TableCell className="font-medium">
                      {assessment.assessment_type.toUpperCase()}
                    </TableCell>
                    <TableCell>{assessment.risk_percentage}%</TableCell>
                    <TableCell>
                      <Badge className={getRiskBadgeColor(assessment.risk_level)}>
                        {getRiskLevelText(assessment.risk_level)}
                      </Badge>
                    </TableCell>
                    <TableCell>{assessment.recommendations?.length || 0}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(assessment.id)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Детали
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {selectedAssessment && (
        <Card>
          <CardHeader>
            <CardTitle>Рекомендации по здоровью</CardTitle>
            <CardDescription>
              Персонализированные рекомендации на основе вашей оценки рисков
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recommendations.length === 0 ? (
              <p className="text-gray-600 text-center py-4">
                Нет рекомендаций для данной оценки
              </p>
            ) : (
              <div className="space-y-4">
                {recommendations.map((recommendation) => (
                  <div
                    key={recommendation.id}
                    className={`p-4 border rounded-lg ${
                      recommendation.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg">
                            {getCategoryIcon(recommendation.category)}
                          </span>
                          <h4 className="font-medium text-gray-900">
                            {recommendation.title}
                          </h4>
                          <Badge variant="outline">
                            Приоритет: {recommendation.priority}
                          </Badge>
                        </div>
                        <p className="text-gray-700">{recommendation.description}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => 
                          toggleRecommendationCompleted(
                            recommendation.id, 
                            !recommendation.completed
                          )
                        }
                      >
                        {recommendation.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RiskAssessmentHistory;
