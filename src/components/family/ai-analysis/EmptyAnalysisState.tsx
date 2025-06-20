
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Zap } from "lucide-react";

interface EmptyAnalysisStateProps {
  familyMembersCount: number;
  onRunAnalysis: () => void;
}

const EmptyAnalysisState: React.FC<EmptyAnalysisStateProps> = ({
  familyMembersCount,
  onRunAnalysis
}) => {
  return (
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
          onClick={onRunAnalysis}
          disabled={familyMembersCount === 0}
          className="bg-gradient-to-r from-blue-600 to-purple-600"
        >
          <Zap className="w-4 h-4 mr-2" />
          Начать AI анализ
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyAnalysisState;
