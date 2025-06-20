
import React from 'react';
import FamilyDataBank from '@/components/family/FamilyDataBank';
import BackButton from '@/components/ui/back-button';

const FamilyDataBankPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <BackButton fallbackPath="/dashboard" className="mb-4" />
        <FamilyDataBank />
      </div>
    </div>
  );
};

export default FamilyDataBankPage;
