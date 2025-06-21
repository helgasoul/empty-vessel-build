
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { ThyroidResult } from './thyroidCalculations';

interface ThyroidResultsDisplayProps {
  result: ThyroidResult;
}

export const ThyroidResultsDisplay: React.FC<ThyroidResultsDisplayProps> = ({ result }) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskText = (level: string) => {
    switch (level) {
      case 'low': return 'Низкий риск';
      case 'moderate': return 'Умеренный риск';
      case 'high': return 'Высокий риск';
      default: return 'Неопределенный риск';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span>Результаты расчета</span>
          <Badge className={getRiskColor(result.riskLevel)}>
            {getRiskText(result.riskLevel)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Соотношение T4/T3</p>
            <p className="text-lg font-bold">{result.t4ToT3Ratio.toFixed(2)}</p>
            <p className="text-xs text-gray-600">Норма: 0.2-0.4</p>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <p className="text-sm text-purple-600 font-medium">Индекс свободных андрогенов</p>
            <p className="text-lg font-bold">{result.freeAndroogenIndex.toFixed(1)}</p>
            <p className="text-xs text-gray-600">Норма: &lt;5</p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Интерпретация:</h4>
          <p className="text-sm text-gray-700">{result.interpretation}</p>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-2 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-1 text-orange-500" />
            Рекомендации:
          </h4>
          <ul className="space-y-1">
            {result.recommendations.map((rec, index) => (
              <li key={index} className="text-sm text-gray-700 flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
