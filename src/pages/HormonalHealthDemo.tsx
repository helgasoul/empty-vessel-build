
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import BackButton from '@/components/ui/back-button';
import HormonalHealthSection from '@/components/hormonal-health/HormonalHealthSection';

const HormonalHealthDemo = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleConsultationClick = () => {
    console.log('🔥 Кнопка консультации нажата');
    console.log('👤 Пользователь авторизован:', !!user);
    
    if (user) {
      console.log('✅ Переход к консультациям для авторизованного пользователя');
      navigate('/telemedicine-integrations');
    } else {
      console.log('🔐 Переход на авторизацию с редиректом');
      navigate('/auth', { 
        state: { redirectTo: '/telemedicine-integrations' } 
      });
    }
  };

  const handleTrackingClick = () => {
    console.log('🔥 Кнопка отслеживания нажата');
    console.log('👤 Пользователь авторизован:', !!user);
    
    if (user) {
      console.log('✅ Переход к трекеру для авторизованного пользователя');
      navigate('/womens-health');
    } else {
      console.log('🔐 Переход на авторизацию с редиректом');
      navigate('/auth', { 
        state: { redirectTo: '/womens-health' } 
      });
    }
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
