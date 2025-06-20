
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Brain, RefreshCw, Zap, Download } from "lucide-react";

interface RiskAnalysisHeaderProps {
  analyzing: boolean;
  familyMembersCount: number;
  riskAnalysisCount: number;
  lastAnalysisDate: string | null;
  onRunAnalysis: () => void;
}

const RiskAnalysisHeader: React.FC<RiskAnalysisHeaderProps> = ({
  analyzing,
  familyMembersCount,
  riskAnalysisCount,
  lastAnalysisDate,
  onRunAnalysis
}) => {
  return (
    <>
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
                onClick={onRunAnalysis}
                disabled={analyzing || familyMembersCount === 0}
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
                    {riskAnalysisCount > 0 ? 'Обновить анализ' : 'Запустить анализ'}
                  </>
                )}
              </Button>
              {riskAnalysisCount > 0 && (
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
    </>
  );
};

export default RiskAnalysisHeader;
