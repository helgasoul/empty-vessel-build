
import React from 'react';
import { Heart } from 'lucide-react';
import RiskCard from './RiskCard';
import { CancerTypeRisk } from '@/types/patient';

interface BreastCancerRiskCardProps {
  data: CancerTypeRisk;
}

export default function BreastCancerRiskCard({ data }: BreastCancerRiskCardProps) {
  const additionalContent = (
    <div>
      <h4 className="font-medium mb-2">Специфические факторы рака молочной железы:</h4>
      <ul className="text-sm text-gray-600 space-y-1">
        {data.specificFactors.map((factor, index) => (
          <li key={index} className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-pink-400 rounded-full"></div>
            {factor}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <RiskCard
      title="Рак молочной железы"
      icon={Heart}
      iconColor="text-pink-600"
      level={data.level}
      score={data.score}
      factors={data.specificFactors || []}
      recommendations={[]}
      additionalContent={additionalContent}
    />
  );
}
