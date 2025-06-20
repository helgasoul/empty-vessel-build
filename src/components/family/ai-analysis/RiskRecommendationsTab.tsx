
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Shield } from "lucide-react";

interface RiskAnalysisResult {
  id: string;
  condition_name: string;
  risk_level: 'low' | 'moderate' | 'high' | 'very_high';
  recommendations: string[];
  screening_advice: string[];
  prevention_tips: string[];
}

interface RiskRecommendationsTabProps {
  riskAnalysis: RiskAnalysisResult[];
}

const RiskRecommendationsTab: React.FC<RiskRecommendationsTabProps> = ({ riskAnalysis }) => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default RiskRecommendationsTab;
