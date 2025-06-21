
import React from 'react';
import { AlertTriangle, TrendingUp } from 'lucide-react';
import { RiskFactors } from '@/types/patient';
import RiskCard from './risk-factors/RiskCard';
import CancerRiskCard from './risk-factors/CancerRiskCard';
import EmptyRiskState from './risk-factors/EmptyRiskState';
import LastUpdatedCard from './risk-factors/LastUpdatedCard';
import RiskFactorsHeader from './risk-factors/RiskFactorsHeader';

interface RiskFactorsSectionProps {
  data?: RiskFactors;
  onUpdate: (data: RiskFactors) => void;
}

export default function RiskFactorsSection({ data, onUpdate }: RiskFactorsSectionProps) {
  const handleRecalculate = () => {
    console.log('Recalculate risks');
    // TODO: Implement risk recalculation logic
  };

  const handleStartAssessment = () => {
    console.log('Start risk assessment');
    // TODO: Implement risk assessment start logic
  };

  return (
    <div className="space-y-6">
      <RiskFactorsHeader onRecalculate={handleRecalculate} />

      {data ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Сердечно-сосудистые риски */}
            <RiskCard
              title="Сердечно-сосудистые заболевания"
              icon={AlertTriangle}
              iconColor="text-rose-600"
              level={data.cardiovascular.level}
              score={data.cardiovascular.score}
              factors={data.cardiovascular.factors}
              recommendations={data.cardiovascular.recommendations}
            />

            {/* Онкологические риски */}
            <CancerRiskCard data={data.cancer} />

            {/* Диабет */}
            <RiskCard
              title="Диабет"
              icon={TrendingUp}
              iconColor="text-blue-600"
              level={data.diabetes.level}
              score={data.diabetes.score}
              factors={data.diabetes.factors}
              recommendations={data.diabetes.recommendations}
            />

            {/* Остеопороз */}
            <RiskCard
              title="Остеопороз"
              icon={AlertTriangle}
              iconColor="text-gray-600"
              level={data.osteoporosis.level}
              score={data.osteoporosis.score}
              factors={data.osteoporosis.factors}
              recommendations={data.osteoporosis.recommendations}
            />
          </div>

          <LastUpdatedCard lastUpdated={data.lastUpdated} />
        </>
      ) : (
        <EmptyRiskState onStartAssessment={handleStartAssessment} />
      )}
    </div>
  );
}
