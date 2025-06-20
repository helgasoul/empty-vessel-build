
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4 md:px-6 bg-gradient-to-r from-purple-500 to-pink-500">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Готовы получить свой ИИ-анализ рисков?
        </h2>
        <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
          Присоединяйтесь к тысячам женщин, которые уже управляют своими рисками здоровья с помощью ИИ
        </p>
        <Button 
          size="lg"
          variant="secondary"
          className="text-purple-600 hover:text-purple-700 font-semibold hover:scale-105 transition-all duration-200"
          onClick={() => navigate('/auth')}
        >
          Получить свой ИИ-анализ рисков
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </section>
  );
};

export default CTASection;
