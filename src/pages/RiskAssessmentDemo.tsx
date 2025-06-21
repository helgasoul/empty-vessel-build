
import React from 'react';
import { TooltipProvider } from "@/components/ui/tooltip";
import BackButton from '@/components/ui/back-button';
import PageHeader from '@/components/risk-demo/PageHeader';
import AssessmentCard from '@/components/risk-demo/AssessmentCard';
import CTASection from '@/components/risk-demo/CTASection';
import { useRiskAssessmentDemo } from '@/components/risk-demo/useRiskAssessmentDemo';
import { assessmentTypes } from '@/components/risk-demo/assessmentData';

const RiskAssessmentDemo = () => {
  const { user, handleStartTest, handleFullAssessment } = useRiskAssessmentDemo();

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <BackButton className="mb-6" />
          
          <PageHeader />

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {assessmentTypes.map((assessment, index) => (
              <AssessmentCard
                key={index}
                assessment={assessment}
                onStartTest={handleStartTest}
              />
            ))}
          </div>

          <CTASection 
            user={user} 
            onFullAssessment={handleFullAssessment} 
          />
        </div>
      </div>
    </TooltipProvider>
  );
};

export default RiskAssessmentDemo;
