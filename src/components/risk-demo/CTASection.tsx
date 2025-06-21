
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CTASectionProps {
  user: any;
  onFullAssessment: () => void;
}

const CTASection: React.FC<CTASectionProps> = ({ user, onFullAssessment }) => {
  return (
    <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-none shadow-2xl">
      <CardContent className="py-12 text-center">
        <h3 className="text-3xl font-bold mb-4">
          Готовы узнать свои риски?
        </h3>
        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
          {user 
            ? "Перейдите к полной оценке рисков здоровья на основе ведущих международных алгоритмов"
            : "Зарегистрируйтесь и получите доступ к полной оценке рисков здоровья на основе ведущих международных алгоритмов"
          }
        </p>
        <Button 
          size="lg" 
          variant="secondary" 
          className="text-purple-600 hover:text-purple-700 font-semibold px-8 py-4 text-lg hover:scale-105 transition-all duration-300 shadow-lg"
          onClick={onFullAssessment}
        >
          {user ? "Перейти к полной оценке" : "Начать полную оценку"}
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default CTASection;
