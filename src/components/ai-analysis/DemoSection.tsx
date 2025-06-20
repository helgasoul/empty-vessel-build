
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, ArrowRight } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const DemoSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 px-4 md:px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Пример анализа</h2>
          <p className="text-lg text-gray-700 mb-8">Посмотрите, как работает наш ИИ</p>
        </div>
        
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-8 text-center">
            <Brain className="w-16 h-16 text-purple-600 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-gray-900 mb-4">Интерактивная демонстрация</h3>
            <p className="text-gray-700 mb-6">
              Посмотрите анонимизированный пример анализа рисков для женщины 35 лет
            </p>
            <Button 
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              onClick={() => navigate('/risk-assessment-demo')}
            >
              Посмотреть демо
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default DemoSection;
