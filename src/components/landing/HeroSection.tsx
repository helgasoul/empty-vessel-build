
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center mb-20 animate-fade-in">
      <div className="inline-flex items-center space-x-2 bg-accent/20 text-accent-foreground px-4 py-2 rounded-full text-sm font-medium mb-8">
        <Sparkles className="w-4 h-4" />
        <span>Превентивная медицина будущего</span>
      </div>
      
      <h1 className="text-6xl md:text-7xl font-montserrat font-bold text-gray-900 mb-8 leading-tight">
        <span className="prevent-gradient-primary bg-clip-text text-transparent">
          PREVENT
        </span>
        <br />
        <span className="text-gray-700 text-4xl md:text-5xl">
          Ваше здоровье под контролем
        </span>
      </h1>
      
      <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed font-roboto">
        Ваш персональный помощник в мире женского здоровья. Мы здесь чтобы поддержать вас на каждом этапе жизни.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-6 justify-center">
        <Button 
          onClick={() => navigate('/auth')}
          className="prevent-button-primary text-lg px-8 py-4 group"
        >
          Начать анализ рисков
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
        <Button 
          variant="outline" 
          className="px-8 py-4 text-lg hover:bg-secondary/10 hover:border-secondary transition-all duration-200 font-medium"
        >
          Узнать больше
        </Button>
      </div>
    </div>
  );
};

export default HeroSection;
