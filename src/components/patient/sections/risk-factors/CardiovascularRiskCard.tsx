
import React from 'react';
import { Heart } from 'lucide-react';
import RiskCard from './RiskCard';
import { CardiovascularRisk } from '@/types/patient';

interface CardiovascularRiskCardProps {
  data: CardiovascularRisk;
}

export default function CardiovascularRiskCard({ data }: CardiovascularRiskCardProps) {
  const additionalContent = data.calculatedScores && (
    <div>
      <h4 className="font-medium mb-2">Расчетные индексы:</h4>
      <div className="text-sm text-gray-600 space-y-1">
        {data.calculatedScores.framinghamScore && (
          <div className="flex justify-between">
            <span>Framingham риск:</span>
            <span className="font-medium">{data.calculatedScores.framinghamScore}%</span>
          </div>
        )}
        {data.calculatedScores.reynoldsScore && (
          <div className="flex justify-between">
            <span>Reynolds риск:</span>
            <span className="font-medium">{data.calculatedScores.reynoldsScore}%</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <RiskCard
      title="Сердечно-сосудистые заболевания"
      icon={Heart}
      iconColor="text-red-600"
      level={data.level}
      score={data.score}
      factors={data.factors || []}
      recommendations={data.recommendations}
      additionalContent={additionalContent}
    />
  );
}
