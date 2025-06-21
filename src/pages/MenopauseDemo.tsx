
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import BackButton from '@/components/ui/back-button';
import MenopauseSection from '@/components/menopause/MenopauseSection';

const MenopauseDemo = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSupportClick = () => {
    console.log('🔥 Кнопка поддержки менопаузы нажата');
    console.log('👤 Пользователь авторизован:', !!user);
    
    if (user) {
      console.log('✅ Переход к поддержке для авторизованного пользователя');
      navigate('/womens-health');
    } else {
      console.log('🔐 Переход на авторизацию с редиректом');
      navigate('/auth', { 
        state: { redirectTo: '/womens-health' } 
      });
    }
  };

  const handleConsultationClick = () => {
    console.log('🔥 Кнопка консультации по менопаузе нажата');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <BackButton fallbackPath="/womens-health-demo" className="mb-6" />
        
        <MenopauseSection 
          onSupportClick={handleSupportClick}
          onConsultationClick={handleConsultationClick}
        />
      </div>
    </div>
  );
};

export default MenopauseDemo;
