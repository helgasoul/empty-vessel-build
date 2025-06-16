
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center prevent-gradient-accent rounded-3xl p-16 text-white animate-fade-in">
      <h2 className="text-4xl font-montserrat font-bold mb-6">
        Превентивная медицина начинается сегодня
      </h2>
      <p className="text-accent-foreground/90 mb-10 text-xl max-w-2xl mx-auto font-roboto leading-relaxed">
        Присоединяйтесь к революции в персонализированной медицине. 
        Получите научно обоснованные рекомендации для вашего здоровья.
      </p>
      <Button 
        onClick={() => navigate('/auth')}
        className="bg-white text-primary hover:bg-gray-50 px-10 py-4 text-lg font-semibold transition-all duration-200 hover:scale-105 rounded-xl"
      >
        Создать профиль здоровья
      </Button>
    </div>
  );
};

export default CTASection;
