
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { HealthInsight } from '../types/aiTypes';
import InsightCard from './InsightCard';

interface InsightsViewProps {
  healthInsights: HealthInsight[];
}

const InsightsView: React.FC<InsightsViewProps> = ({ healthInsights }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Персональные инсайты</h3>
    {healthInsights.length > 0 ? (
      healthInsights.map(insight => (
        <InsightCard key={insight.id} insight={insight} />
      ))
    ) : (
      <Card>
        <CardContent className="p-6 text-center">
          <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            Собираем данные для генерации персональных инсайтов...
          </p>
        </CardContent>
      </Card>
    )}
  </div>
);

export default InsightsView;
