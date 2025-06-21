
import React from 'react';
import { Shield } from 'lucide-react';
import RiskCard from './RiskCard';
import { CancerRisk } from '@/types/patient';

interface CancerRiskCardProps {
  data: CancerRisk;
}

export default function CancerRiskCard({ data }: CancerRiskCardProps) {
  const geneticFactorsContent = data.geneticFactors.length > 0 && (
    <div>
      <h4 className="font-medium mb-2">Генетические факторы:</h4>
      <ul className="text-sm text-gray-600 space-y-1">
        {data.geneticFactors.map((factor, index) => (
          <li key={index} className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
            {factor}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <RiskCard
      title="Онкология"
      icon={Shield}
      iconColor="text-purple-600"
      level={data.level}
      score={data.score}
      factors={data.factors || []}
      recommendations={data.recommendations}
      additionalContent={geneticFactorsContent}
    />
  );
}
