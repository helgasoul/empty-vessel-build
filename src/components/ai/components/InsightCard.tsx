
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";
import { HealthInsight } from '../types/aiTypes';

interface InsightCardProps {
  insight: HealthInsight;
}

const InsightCard: React.FC<InsightCardProps> = ({ insight }) => (
  <Card className="mb-4">
    <CardContent className="p-4">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-sm">{insight.title}</h4>
        <Badge variant={insight.type === 'trend' ? 'default' : insight.type === 'correlation' ? 'secondary' : 'outline'}>
          {insight.type === 'trend' ? 'Тренд' :
           insight.type === 'correlation' ? 'Связь' :
           insight.type === 'prediction' ? 'Прогноз' : 'Совет'}
        </Badge>
      </div>
      <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500">Точность: {insight.confidence}%</span>
        {insight.actionable && (
          <Badge variant="outline" className="text-xs">
            <Zap className="w-3 h-3 mr-1" />
            Действие
          </Badge>
        )}
      </div>
    </CardContent>
  </Card>
);

export default InsightCard;
