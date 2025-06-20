
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Heart, 
  AlertTriangle, 
  TrendingUp, 
  Shield, 
  Users,
  ChevronRight,
  Eye
} from "lucide-react";

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

interface RiskAnalysisCardProps {
  risk: RiskAnalysisResult;
}

const RiskAnalysisCard: React.FC<RiskAnalysisCardProps> = ({ risk }) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'text-green-700 bg-green-100 border-green-200';
      case 'moderate':
        return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'high':
        return 'text-orange-700 bg-orange-100 border-orange-200';
      case 'very_high':
        return 'text-red-700 bg-red-100 border-red-200';
      default:
        return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low':
        return Shield;
      case 'moderate':
        return TrendingUp;
      case 'high':
      case 'very_high':
        return AlertTriangle;
      default:
        return Heart;
    }
  };

  const getRiskLevelText = (level: string) => {
    switch (level) {
      case 'low':
        return 'Низкий';
      case 'moderate':
        return 'Умеренный';
      case 'high':
        return 'Высокий';
      case 'very_high':
        return 'Очень высокий';
      default:
        return 'Неизвестно';
    }
  };

  const RiskIcon = getRiskIcon(risk.risk_level);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-4">
            <div className={`p-3 rounded-lg ${getRiskColor(risk.risk_level)}`}>
              <RiskIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{risk.condition_name}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className={getRiskColor(risk.risk_level)}>
                  {getRiskLevelText(risk.risk_level)} риск
                </Badge>
                <span className="text-sm text-gray-600">
                  {risk.risk_percentage}% риск
                </span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Подробнее
          </Button>
        </div>

        <div className="space-y-4">
          {/* Факторы риска */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-medium text-gray-700">Генетический фактор</p>
              <Progress value={risk.genetic_factor} className="mt-1" />
              <span className="text-xs text-gray-600">{risk.genetic_factor}%</span>
            </div>
            <div>
              <p className="font-medium text-gray-700">Образ жизни</p>
              <Progress value={risk.lifestyle_factor} className="mt-1" />
              <span className="text-xs text-gray-600">{risk.lifestyle_factor}%</span>
            </div>
            <div>
              <p className="font-medium text-gray-700">Возрастной фактор</p>
              <Progress value={risk.age_factor} className="mt-1" />
              <span className="text-xs text-gray-600">{risk.age_factor}%</span>
            </div>
          </div>

          {/* Затронутые родственники */}
          {risk.affected_relatives.length > 0 && (
            <div>
              <p className="font-medium text-gray-700 mb-2">Затронутые родственники:</p>
              <div className="flex flex-wrap gap-2">
                {risk.affected_relatives.map((relative, index) => (
                  <Badge key={index} variant="outline">
                    <Users className="w-3 h-3 mr-1" />
                    {relative}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Краткие рекомендации */}
          {risk.recommendations.length > 0 && (
            <div>
              <p className="font-medium text-gray-700 mb-2">Основные рекомендации:</p>
              <ul className="text-sm text-gray-600 space-y-1">
                {risk.recommendations.slice(0, 3).map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <ChevronRight className="w-3 h-3 mr-1 mt-0.5 text-blue-500" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t">
            <span className="text-xs text-gray-500">
              Достоверность анализа: {risk.confidence_score}%
            </span>
            <span className="text-xs text-gray-500">
              Обновлено: {new Date(risk.last_updated).toLocaleDateString('ru-RU')}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskAnalysisCard;
