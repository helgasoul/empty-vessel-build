
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MessageCircle, Heart, Star, ArrowRight } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import BackButton from '@/components/ui/back-button';

const CommunityDemo = () => {
  const navigate = useNavigate();

  const communityFeatures = [
    {
      title: "Группы поддержки",
      description: "Общение с единомышленниками",
      icon: Users,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Форумы",
      description: "Обсуждение здоровья и опыта",
      icon: MessageCircle,
      color: "from-blue-500 to-purple-500"
    },
    {
      title: "Экспертные блоги",
      description: "Статьи от врачей и специалистов",
      icon: Star,
      color: "from-yellow-500 to-orange-500"
    },
    {
      title: "Поддержка 24/7",
      description: "Помощь и мотивация",
      icon: Heart,
      color: "from-red-500 to-pink-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <BackButton fallbackPath="/" className="mb-6" />
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Сообщество PREVENT
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Присоединяйтесь к сообществу женщин, которые заботятся о своем здоровье 
            и поддерживают друг друга
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {communityFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-none">
          <CardContent className="py-12 text-center">
            <h3 className="text-2xl font-bold mb-4">
              Станьте частью сообщества
            </h3>
            <p className="text-lg mb-8 opacity-90">
              Получите поддержку, делитесь опытом и вдохновляйте других женщин
            </p>
            <Button 
              size="lg" 
              variant="secondary" 
              className="text-purple-600 hover:text-purple-700"
              onClick={() => navigate('/auth')}
            >
              Присоединиться
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CommunityDemo;
