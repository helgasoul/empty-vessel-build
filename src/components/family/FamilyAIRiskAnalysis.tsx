
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import RiskAnalysisHeader from "./ai-analysis/RiskAnalysisHeader";
import RiskAnalysisCard from "./ai-analysis/RiskAnalysisCard";
import RiskRecommendationsTab from "./ai-analysis/RiskRecommendationsTab";
import RiskGeneticsTab from "./ai-analysis/RiskGeneticsTab";
import EmptyAnalysisState from "./ai-analysis/EmptyAnalysisState";

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

  return (
    <div className="space-y-6">
      <RiskAnalysisHeader
        analyzing={analyzing}
        familyMembersCount={familyMembers.length}
        riskAnalysisCount={riskAnalysis.length}
        lastAnalysisDate={lastAnalysisDate}
        onRunAnalysis={runAIAnalysis}
      />

      {riskAnalysis.length === 0 && !analyzing && !loading ? (
        <EmptyAnalysisState
          familyMembersCount={familyMembers.length}
          onRunAnalysis={runAIAnalysis}
        />
      ) : riskAnalysis.length > 0 && (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Обзор рисков</TabsTrigger>
            <TabsTrigger value="recommendations">Рекомендации</TabsTrigger>
            <TabsTrigger value="genetics">Генетика</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {riskAnalysis.map((risk) => (
              <RiskAnalysisCard key={risk.id} risk={risk} />
            ))}
          </TabsContent>

          <TabsContent value="recommendations">
            <RiskRecommendationsTab riskAnalysis={riskAnalysis} />
          </TabsContent>

          <TabsContent value="genetics">
            <RiskGeneticsTab riskAnalysis={riskAnalysis} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default FamilyAIRiskAnalysis;
