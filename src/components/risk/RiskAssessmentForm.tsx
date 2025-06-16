
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import QRISK3Form from "./QRISK3Form";
import BRCARiskForm from "./BRCARiskForm";
import BCSCRiskForm from "./BCSCRiskForm";
import GailRiskForm from "./GailRiskForm";
import { Heart, Dna, Calculator, CheckCircle, Activity } from "lucide-react";
import { toast } from "sonner";

const RiskAssessmentForm = () => {
  const { user, loading } = useAuth();
  const [completedAssessments, setCompletedAssessments] = useState<string[]>([]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Calculator className="w-8 h-8 animate-spin mx-auto mb-2 text-gray-500" />
          <p>Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleAssessmentComplete = (assessmentType: string) => {
    setCompletedAssessments(prev => [...prev, assessmentType]);
    toast.success(`Оценка ${assessmentType} завершена!`);
  };

  const assessmentTabs = [
    {
      id: 'qrisk3',
      label: 'QRISK3',
      icon: Heart,
      description: 'Сердечно-сосудистые риски',
      component: <QRISK3Form onComplete={() => handleAssessmentComplete('QRISK3')} />
    },
    {
      id: 'bcsc',
      label: 'BCSC v3',
      icon: Activity,
      description: 'Риск рака молочной железы',
      component: <BCSCRiskForm onComplete={() => handleAssessmentComplete('BCSC')} />
    },
    {
      id: 'brca',
      label: 'BRCA',
      icon: Dna,
      description: 'Генетические риски рака',
      component: <BRCARiskForm onComplete={() => handleAssessmentComplete('BRCA')} />
    },
    {
      id: 'gail',
      label: 'Gail Model',
      icon: Heart,
      description: 'Риск рака молочной железы',
      component: <GailRiskForm onComplete={() => handleAssessmentComplete('Gail')} />
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Выберите тип оценки риска</CardTitle>
          <CardDescription>
            Пройдите одну или несколько оценок для получения персонализированных рекомендаций
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="qrisk3" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          {assessmentTabs.map((tab) => {
            const IconComponent = tab.icon;
            const isCompleted = completedAssessments.includes(tab.id.toUpperCase());
            
            return (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id} 
                className="flex items-center space-x-2 relative"
              >
                {isCompleted && (
                  <CheckCircle className="w-4 h-4 text-green-600 absolute -top-1 -right-1" />
                )}
                <IconComponent className="w-4 h-4" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{tab.label}</span>
                  <span className="text-xs text-gray-500">{tab.description}</span>
                </div>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {assessmentTabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id}>
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>

      {completedAssessments.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Завершенные оценки: {completedAssessments.length}
              </h3>
              <p className="text-gray-600">
                Перейдите на вкладку "История" для просмотра результатов и рекомендаций
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RiskAssessmentForm;
