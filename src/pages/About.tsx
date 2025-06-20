
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Heart, Brain, ArrowRight } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import FounderSection from '@/components/founder/FounderSection';
import BackButton from '@/components/ui/back-button';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-8">
          <BackButton className="mb-4" />
          
          <h1 className="text-4xl font-semibold text-gray-900 mb-6 animate-fade-in">
            О платформе PREVENT
          </h1>
          
          <p className="text-xl text-gray-700 leading-relaxed font-medium">
            PREVENT — это персонализированная платформа женского здоровья, направленная на снижение рисков хронических заболеваний через осознанность, изменения образа жизни и доказательную превентивную медицину.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 transition-all duration-300 hover:scale-105 hover:shadow-lg group">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Shield className="w-10 h-10 text-purple-600 group-hover:scale-110 transition-transform duration-200" />
                <CardTitle className="text-purple-900 font-semibold">Превентивная медицина</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-purple-800 font-medium leading-relaxed">
                Основанная на доказательствах система оценки рисков и персонализированных рекомендаций
              </p>
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-purple-700 border-purple-300 hover:bg-purple-100 transition-colors"
                  onClick={() => navigate('/risk-assessment-demo')}
                >
                  Попробовать оценку рисков
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 transition-all duration-300 hover:scale-105 hover:shadow-lg group">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Brain className="w-10 h-10 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
                <CardTitle className="text-blue-900 font-semibold">Данные и ИИ</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-blue-800 font-medium leading-relaxed">
                Мультифакторная оценка рисков онкологии, сердечно-сосудистых и нейродегенеративных заболеваний
              </p>
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-blue-700 border-blue-300 hover:bg-blue-100 transition-colors"
                  onClick={() => navigate('/ai-analysis')}
                >
                  Узнать об ИИ-анализе
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 transition-all duration-300 hover:scale-105 hover:shadow-lg group">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Heart className="w-10 h-10 text-green-600 group-hover:scale-110 transition-transform duration-200" />
                <CardTitle className="text-green-900 font-semibold">Поддержка на всех этапах</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-green-800 font-medium leading-relaxed">
                Сопровождение женщин на всех этапах жизни с учетом возрастных особенностей и переходов
              </p>
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-green-700 border-green-300 hover:bg-green-100 transition-colors"
                  onClick={() => navigate('/womens-health-demo')}
                >
                  Женское здоровье
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-12 hover:shadow-md transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-gray-900 text-2xl font-semibold">Наша миссия</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-800 font-medium leading-relaxed">
              Мы создаем технологические решения, которые помогают женщинам принимать осознанные решения о своем здоровье. 
              Наша платформа объединяет последние достижения в области превентивной медицины, искусственного интеллекта 
              и персонализированного подхода к здоровью.
            </p>
            <p className="text-gray-800 font-medium leading-relaxed">
              PREVENT не заменяет врача, а дополняет традиционную медицину, предоставляя инструменты для раннего 
              выявления рисков и формирования здоровых привычек.
            </p>
          </CardContent>
        </Card>

        {/* Call to Action Section */}
        <div className="text-center mb-12 p-8 bg-white rounded-xl shadow-md border border-purple-100">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Готовы начать заботиться о своем здоровье?
          </h3>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Присоединяйтесь к тысячам женщин, которые уже используют PREVENT для улучшения качества жизни
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium px-8 py-3 transition-all duration-300 hover:scale-105"
              onClick={() => navigate('/auth')}
            >
              Начать пользоваться
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-purple-300 text-purple-700 hover:bg-purple-50 font-medium px-8 py-3 transition-all duration-300 hover:scale-105"
              onClick={() => navigate('/personal-plan')}
            >
              Узнать больше о планах
            </Button>
          </div>
        </div>

        {/* Founder Section */}
        <FounderSection />
      </div>
    </div>
  );
};

export default About;
