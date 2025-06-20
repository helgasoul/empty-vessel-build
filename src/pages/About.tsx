import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Heart, Brain } from "lucide-react";
import FounderSection from '@/components/founder/FounderSection';
import BackButton from '@/components/ui/back-button';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-8">
          <BackButton className="mb-4" />
          
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            О платформе PREVENT
          </h1>
          
          <p className="text-xl text-gray-600 leading-relaxed">
            PREVENT — это персонализированная платформа женского здоровья, направленная на снижение рисков хронических заболеваний через осознанность, изменения образа жизни и доказательную превентивную медицину.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Shield className="w-8 h-8 text-purple-600" />
                <CardTitle className="text-purple-900">Превентивная медицина</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-purple-800">
                Основанная на доказательствах система оценки рисков и персонализированных рекомендаций
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Brain className="w-8 h-8 text-blue-600" />
                <CardTitle className="text-blue-900">Данные и ИИ</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-blue-800">
                Мультифакторная оценка рисков онкологии, сердечно-сосудистых и нейродегенеративных заболеваний
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Heart className="w-8 h-8 text-green-600" />
                <CardTitle className="text-green-900">Поддержка на всех этапах</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-green-800">
                Сопровождение женщин на всех этапах жизни с учетом возрастных особенностей и переходов
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Наша миссия</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Мы создаем технологические решения, которые помогают женщинам принимать осознанные решения о своем здоровье. 
              Наша платформа объединяет последние достижения в области превентивной медицины, искусственного интеллекта 
              и персонализированного подхода к здоровью.
            </p>
            <p className="text-gray-700">
              PREVENT не заменяет врача, а дополняет традиционную медицину, предоставляя инструменты для раннего 
              выявления рисков и формирования здоровых привычек.
            </p>
          </CardContent>
        </Card>

        {/* Founder Section */}
        <FounderSection />
      </div>
    </div>
  );
};

export default About;
