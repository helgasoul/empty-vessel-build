
import React from 'react';
import ResearchFileUpload from '@/components/medical/ResearchFileUpload';
import BackButton from '@/components/ui/back-button';

const ResearchFiles = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <BackButton fallbackPath="/dashboard" className="mb-4" />
        <ResearchFileUpload />
      </div>
    </div>
  );
};

export default ResearchFiles;
