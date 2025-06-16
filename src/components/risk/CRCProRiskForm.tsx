
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle, FileText, Calculator } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CRCProPersonalInfo } from "./crc/CRCProPersonalInfo";
import { CRCProFamilyHistory } from "./crc/CRCProFamilyHistory";
import { CRCProMedicalHistory } from "./crc/CRCProMedicalHistory";
import { CRCProLifestyleFactors } from "./crc/CRCProLifestyleFactors";
import { useCRCProRisk } from "./crc/useCRCProRisk";
import { CRCProFormData } from "./crc/types";

interface CRCProRiskFormProps {
  onComplete?: () => void;
}

const CRCProRiskForm: React.FC<CRCProRiskFormProps> = ({ onComplete }) => {
  const { calculateRisk, loading, result } = useCRCProRisk();
  const [currentTab, setCurrentTab] = useState("personal");
  const [formData, setFormData] = useState<CRCProFormData>({
    age: 50,
    gender: 'female',
    family_history_crc: false,
    family_history_polyps: false,
    family_history_ibd: false,
    number_affected_relatives: 0,
    personal_history_polyps: false,
    personal_history_ibd: false,
    diabetes_type2: false,
    previous_colonoscopy: false,
    nsaid_use: false,
    calcium_supplements: false,
    multivitamin_use: false
  });

  const updateFormData = (updates: Partial<CRCProFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await calculateRisk(formData);
      onComplete?.();
    } catch (error) {
      console.error('Ошибка при расчете риска:', error);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-700 bg-green-100';
      case 'moderate': return 'text-yellow-700 bg-yellow-100';
      case 'high': return 'text-red-700 bg-red-100';
      case 'very_high': return 'text-red-800 bg-red-200';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getRiskLevelText = (level: string) => {
    switch (level) {
      case 'low': return 'Низкий';
      case 'moderate': return 'Умеренный';
      case 'high': return 'Высокий';
      case 'very_high': return 'Очень высокий';
      default: return 'Неизвестно';
    }
  };

  if (result) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <span>Результаты оценки CRC-PRO</span>
          </CardTitle>
          <CardDescription>
            Персонализированная оценка риска колоректального рака
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="mb-4">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {result.risk_percentage}%
              </div>
              <Badge className={getRiskColor(result.risk_level)}>
                {getRiskLevelText(result.risk_level)} риск
              </Badge>
            </div>
            
            <Progress value={result.risk_percentage} className="mb-4" />
            
            <p className="text-gray-600 mb-6">
              {result.explanation}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Рекомендации</span>
            </h3>
            <div className="space-y-2">
              {result.recommendations.map((recommendation, index) => (
                <Alert key={index}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{recommendation}</AlertDescription>
                </Alert>
              ))}
            </div>
          </div>

          <div className="flex space-x-3">
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
              className="flex-1"
            >
              Новая оценка
            </Button>
            <Button 
              onClick={() => window.open('/risk-assessment', '_blank')}
              className="flex-1"
            >
              Просмотреть историю
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calculator className="w-6 h-6 text-blue-600" />
          <span>CRC-PRO Калькулятор риска</span>
        </CardTitle>
        <CardDescription>
          Комплексная оценка риска колоректального рака на основе персональных факторов
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Личные данные</TabsTrigger>
              <TabsTrigger value="family">Семейная история</TabsTrigger>
              <TabsTrigger value="medical">Мед. история</TabsTrigger>
              <TabsTrigger value="lifestyle">Образ жизни</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <CRCProPersonalInfo 
                data={formData} 
                updateData={updateFormData}
              />
            </TabsContent>

            <TabsContent value="family">
              <CRCProFamilyHistory 
                data={formData} 
                updateData={updateFormData}
              />
            </TabsContent>

            <TabsContent value="medical">
              <CRCProMedicalHistory 
                data={formData} 
                updateData={updateFormData}
              />
            </TabsContent>

            <TabsContent value="lifestyle">
              <CRCProLifestyleFactors 
                data={formData} 
                updateData={updateFormData}
              />
            </TabsContent>
          </Tabs>

          <div className="flex justify-between mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const tabs = ["personal", "family", "medical", "lifestyle"];
                const currentIndex = tabs.indexOf(currentTab);
                if (currentIndex > 0) {
                  setCurrentTab(tabs[currentIndex - 1]);
                }
              }}
              disabled={currentTab === "personal"}
            >
              Назад
            </Button>
            
            {currentTab === "lifestyle" ? (
              <Button
                type="submit"
                disabled={loading}
                className="px-8"
              >
                {loading ? "Расчет..." : "Рассчитать риск"}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => {
                  const tabs = ["personal", "family", "medical", "lifestyle"];
                  const currentIndex = tabs.indexOf(currentTab);
                  if (currentIndex < tabs.length - 1) {
                    setCurrentTab(tabs[currentIndex + 1]);
                  }
                }}
              >
                Далее
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CRCProRiskForm;
