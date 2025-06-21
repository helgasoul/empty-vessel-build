
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CTASectionProps {
  onJoinClick: () => void;
}

const CTASection = ({ onJoinClick }: CTASectionProps) => {
  return (
    <Card className="bg-gradient-to-r from-pink-600 to-purple-600 text-white border-none shadow-2xl mt-12">
      <CardContent className="py-12 text-center">
        <h3 className="text-3xl font-bold mb-4">
          Присоединяйтесь к PREVENT
        </h3>
        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
          Получите персонализированные рекомендации и профессиональную поддержку в заботе о своем здоровье на каждом этапе жизни
        </p>
        <Button 
          size="lg" 
          variant="secondary" 
          className="text-pink-600 hover:text-pink-700 font-semibold px-8 py-4 text-lg hover:scale-105 transition-all duration-300 shadow-lg"
          onClick={onJoinClick}
        >
          Начать заботу о здоровье
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default CTASection;
