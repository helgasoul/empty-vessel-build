
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, Heart, Brain, Activity } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative px-4 md:px-6 py-20 lg:py-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 via-pink-50/30 to-blue-100/50" />
      <div className="absolute top-20 right-10 w-64 h-64 bg-purple-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-pink-200/30 rounded-full blur-2xl" />
      
      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200">
                🧬 Превентивная медицина нового поколения
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Управляйте своими
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent block">
                  рисками здоровья
                </span>
                до появления болезни
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                PREVENT — это персонализированная платформа женского здоровья, которая анализирует ваши данные, 
                оценивает риски и создает индивидуальный план превентивных мер для долгой и здоровой жизни.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 border border-purple-100">
                <Brain className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">ИИ-анализ рисков</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 border border-pink-100">
                <Heart className="w-4 h-4 text-pink-600" />
                <span className="text-sm font-medium text-gray-700">Персональный план</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 border border-blue-100">
                <Activity className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Интеграция с устройствами</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                onClick={() => navigate('/auth')}
              >
                Начать анализ рисков
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-purple-200 text-purple-700 hover:bg-purple-50"
                onClick={() => navigate('/about')}
              >
                Узнать больше
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-6 pt-8 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">Медицинская точность</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="text-sm text-gray-600">1000+ довольных пользователей</span>
              </div>
            </div>
          </div>

          {/* Right Content - Dashboard Preview */}
          <div className="relative">
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-purple-100 p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Ваш личный дашборд</h3>
                <Badge className="bg-green-100 text-green-800">Низкий риск</Badge>
              </div>
              
              {/* Risk Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <Heart className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="text-sm text-blue-800 font-medium">Сердечно-сосудистый риск</p>
                      <p className="text-2xl font-bold text-blue-900">12%</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-6 h-6 text-purple-600" />
                    <div>
                      <p className="text-sm text-purple-800 font-medium">Онкориск</p>
                      <p className="text-2xl font-bold text-purple-900">8%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Items */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-800">Рекомендации на сегодня:</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-800">Пройти маммографию до 15 мая</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-blue-800">Увеличить потребление омега-3</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-purple-500 rounded-full animate-bounce"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-pink-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
