
import React from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '@/components/ui/back-button';
import HormonalHealthSection from '@/components/hormonal-health/HormonalHealthSection';

const HormonalHealthDemo = () => {
  const navigate = useNavigate();

  const handleConsultationClick = () => {
    navigate('/auth', { 
      state: { redirectTo: '/hormonal-health-demo' } 
    });
  };

  const handleTrackingClick = () => {
    navigate('/auth', { 
      state: { redirectTo: '/hormonal-health-demo' } 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <BackButton fallbackPath="/womens-health-demo" className="mb-6" />
        
        <HormonalHealthSection 
          onConsultationClick={handleConsultationClick}
          onTrackingClick={handleTrackingClick}
        />
      </div>
    </div>
  );
};

export default HormonalHealthDemo;
