
import React from 'react';
import { Brain } from 'lucide-react';
import RiskCard from './RiskCard';
import { MentalHealthRisk } from '@/types/patient';

interface NeurodegenerativeRiskCardProps {
  data: MentalHealthRisk;
}

export default function NeurodegenerativeRiskCard({ data }: NeurodegenerativeRiskCardProps) {
  const additionalContent = (
    <div>
      <h4 className="font-medium mb-2">Показатели когнитивного здоровья:</h4>
      <div className="text-sm text-gray-600 space-y-1">
        <div className="flex justify-between">
          <span>Уровень стресса:</span>
          <span className="font-medium">{data.stressScore}/10</span>
        </div>
        <div className="flex justify-between">
          <span>Депрессия:</span>
          <span className="font-medium">{data.depressionScore}/10</span>
        </div>
        <div className="flex justify-between">
          <span>Тревожность:</span>
          <span className="font-medium">{data.anxietyScore}/10</span>
        </div>
      </div>
    </div>
  );

  return (
    <RiskCard
      title="Нейродегенеративные заболевания"
      icon={Brain}
      iconColor="text-purple-600"
      level={data.level}
      score={(data.stressScore + data.depressionScore + data.anxietyScore) / 3}
      factors={data.factors || []}
      recommendations={data.recommendations}
      additionalContent={additionalContent}
    />
  );
}
