
import React from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '@/components/ui/back-button';
import MenopauseSection from '@/components/menopause/MenopauseSection';

const MenopauseDemo = () => {
  const navigate = useNavigate();

  const handleConsultationClick = () => {
    navigate('/auth', { 
      state: { redirectTo: '/menopause-demo' } 
    });
  };

  const handleSpecialistClick = () => {
    navigate('/auth', { 
      state: { redirectTo: '/menopause-demo' } 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <BackButton fallbackPath="/womens-health-demo" className="mb-6" />
        
        <MenopauseSection 
          onConsultationClick={handleConsultationClick}
          onSpecialistClick={handleSpecialistClick}
        />
      </div>
    </div>
  );
};

export default MenopauseDemo;
