
import React from 'react';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';
import BackButton from '@/components/ui/back-button';

const OnboardingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <BackButton fallbackPath="/dashboard" className="mb-4" />
        <OnboardingWizard />
      </div>
    </div>
  );
};

export default OnboardingPage;
