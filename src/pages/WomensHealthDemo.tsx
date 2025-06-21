
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import BackButton from '@/components/ui/back-button';
import HealthAreaCard from '@/components/womens-health/HealthAreaCard';
import BenefitsSection from '@/components/womens-health/BenefitsSection';
import CTASection from '@/components/womens-health/CTASection';
import { healthAreas } from '@/components/womens-health/healthAreasData';

const WomensHealthDemo = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleAreaAction = (area: typeof healthAreas[0]) => {
    // Если это демо-страницы гормонального здоровья или менопаузы, переходим напрямую
    if (area.route === "/hormonal-health-demo" || area.route === "/menopause-demo") {
      navigate(area.route);
      return;
    }

    // Если это трекер менструального цикла или планирование беременности, проверяем аутентификацию
    if (area.route === "/menstrual-cycle-tracker" || area.route === "/pregnancy-planning") {
      if (user) {
        navigate(area.route);
      } else {
        // Если пользователь не авторизован, перенаправляем на страницу авторизации
        navigate("/auth", { 
          state: { redirectTo: area.route } 
        });
      }
    } else {
      navigate(area.route);
    }
  };

  const handleDetailsClick = () => {
    navigate('/womens-health');
  };

  const handleJoinClick = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <BackButton fallbackPath="/" className="mb-6" />
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            Женское здоровье
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Комплексный подход к заботе о женском здоровье на всех этапах жизни с персонализированными решениями и научным подходом
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
          {healthAreas.map((area, index) => (
            <HealthAreaCard
              key={index}
              {...area}
              onAreaAction={() => handleAreaAction(area)}
              onDetailsClick={handleDetailsClick}
            />
          ))}
        </div>

        <BenefitsSection />

        <CTASection onJoinClick={handleJoinClick} />
      </div>
    </div>
  );
};

export default WomensHealthDemo;
