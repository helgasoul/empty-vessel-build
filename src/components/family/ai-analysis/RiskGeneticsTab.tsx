
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface RiskAnalysisResult {
  id: string;
  condition_name: string;
  genetic_factor: number;
  affected_relatives: string[];
}

interface RiskGeneticsTabProps {
  riskAnalysis: RiskAnalysisResult[];
}

const RiskGeneticsTab: React.FC<RiskGeneticsTabProps> = ({ riskAnalysis }) => {
  return (
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
  );
};

export default RiskGeneticsTab;
