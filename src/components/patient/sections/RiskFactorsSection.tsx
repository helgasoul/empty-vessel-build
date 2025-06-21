
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RiskFactors } from '@/types/patient';
import CardiovascularRiskCard from './risk-factors/CardiovascularRiskCard';
import CancerRiskCard from './risk-factors/CancerRiskCard';
import BreastCancerRiskCard from './risk-factors/BreastCancerRiskCard';
import NeurodegenerativeRiskCard from './risk-factors/NeurodegenerativeRiskCard';
import RiskCard from './risk-factors/RiskCard';
import EmptyRiskState from './risk-factors/EmptyRiskState';
import LastUpdatedCard from './risk-factors/LastUpdatedCard';
import RiskFactorsHeader from './risk-factors/RiskFactorsHeader';
import RiskSummaryCard from './risk-factors/RiskSummaryCard';
import RiskAssessmentActions from './risk-factors/RiskAssessmentActions';
import { TrendingUp } from 'lucide-react';

interface RiskFactorsSectionProps {
  data?: RiskFactors;
  onUpdate: (data: RiskFactors) => void;
}

export default function RiskFactorsSection({ data, onUpdate }: RiskFactorsSectionProps) {
  const navigate = useNavigate();

  const handleRecalculate = () => {
    navigate('/risk-assessment');
  };

  const handleStartAssessment = () => {
    navigate('/risk-assessment');
  };

  const handleViewHistory = () => {
    navigate('/risk-assessment', { state: { activeTab: 'history' } });
  };

  const handleBookConsultation = () => {
    // TODO: Navigate to doctor consultation booking
    console.log('Book consultation');
  };

  const handleShareWithFamily = () => {
    // TODO: Navigate to family sharing
    console.log('Share with family');
  };

  const getBreastCancerRisk = () => {
    return data?.cancer.types.find(type => 
      type.type.toLowerCase().includes('breast') || 
      type.type.toLowerCase().includes('молочной')
    );
  };

  return (
    <div className="space-y-6">
      <RiskFactorsHeader onRecalculate={handleRecalculate} />

      {data ? (
        <>
          {/* Общий анализ рисков */}
          <RiskSummaryCard data={data} />

          {/* Основные карточки рисков */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Сердечно-сосудистые риски */}
            <CardiovascularRiskCard data={data.cardiovascular} />

            {/* Онкологические риски */}
            <CancerRiskCard data={data.cancer} />

            {/* Рак молочной железы (если есть данные) */}
            {getBreastCancerRisk() && (
              <BreastCancerRiskCard data={getBreastCancerRisk()!} />
            )}

            {/* Нейродегенеративные заболевания */}
            <NeurodegenerativeRiskCard data={data.mentalHealth} />

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
              icon={TrendingUp}
              iconColor="text-gray-600"
              level={data.osteoporosis.level}
              score={data.osteoporosis.score}
              factors={data.osteoporosis.factors}
              recommendations={data.osteoporosis.recommendations}
            />
          </div>

          {/* Действия с оценкой рисков */}
          <RiskAssessmentActions
            onStartNewAssessment={handleStartAssessment}
            onViewHistory={handleViewHistory}
            onBookConsultation={handleBookConsultation}
            onShareWithFamily={handleShareWithFamily}
          />

          {/* Информация о последнем обновлении */}
          <LastUpdatedCard lastUpdated={data.lastUpdated} />
        </>
      ) : (
        <EmptyRiskState onStartAssessment={handleStartAssessment} />
      )}
    </div>
  );
}
