
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Heart, Target, Users, Award, ArrowLeft, Sparkles } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import FounderSection from '@/components/founder/FounderSection';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen prevent-gradient-bg">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate(-1)}
                className="hover:bg-primary/10"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="w-10 h-10 prevent-gradient-primary rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-montserrat font-bold text-gray-900">О нас</h1>
                <p className="text-xs md:text-sm text-gray-600 font-roboto">
                  Миссия и команда PREVENT
                </p>
              </div>
            </div>
            
            <Button 
              onClick={() => navigate('/dashboard')}
              className="prevent-gradient-primary text-white"
            >
              На главную
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Mission Section */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Target className="w-4 h-4" />
              <span>Наша миссия</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-montserrat font-bold text-gray-900 mb-6">
              Революционизируем <span className="prevent-gradient-primary bg-clip-text text-transparent">женское здоровье</span>
            </h2>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-roboto mb-12">
              PREVENT — это больше чем платформа. Это ваш личный гид в мире превентивной медицины, 
              созданный специально для современных женщин, которые ценят свое здоровье и время.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="prevent-card border-0 shadow-xl">
              <CardContent className="p-8">
                <div className="prevent-icon-container bg-primary/10 w-16 h-16 mb-6">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-montserrat font-bold text-gray-900 mb-4">
                  Персонализированный подход
                </h3>
                <p className="text-gray-600 font-roboto leading-relaxed">
                  Каждая женщина уникальна. Наши алгоритмы анализируют ваши индивидуальные данные, 
                  создавая персонализированные рекомендации по здоровью, основанные на последних 
                  научных исследованиях и медицинских стандартах.
                </p>
              </CardContent>
            </Card>

            <Card className="prevent-card border-0 shadow-xl">
              <CardContent className="p-8">
                <div className="prevent-icon-container bg-secondary/10 w-16 h-16 mb-6">
                  <Shield className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-2xl font-montserrat font-bold text-gray-900 mb-4">
                  Превентивная медицина
                </h3>
                <p className="text-gray-600 font-roboto leading-relaxed">
                  Предотвратить легче, чем лечить. Мы фокусируемся на раннем выявлении рисков 
                  и профилактике заболеваний, помогая вам оставаться здоровой на долгие годы 
                  через осознанные решения и регулярный мониторинг.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Values */}
          <div className="bg-white/80 rounded-3xl p-8 md:p-12 shadow-xl">
            <h3 className="text-3xl font-montserrat font-bold text-gray-900 text-center mb-12">
              Наши ценности
            </h3>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="prevent-icon-container bg-green-100 w-20 h-20 mx-auto mb-6">
                  <Target className="w-10 h-10 text-green-600" />
                </div>
                <h4 className="text-xl font-montserrat font-bold text-gray-900 mb-3">
                  Точность
                </h4>
                <p className="text-gray-600 font-roboto">
                  Используем только проверенные медицинские алгоритмы и данные из рецензируемых исследований
                </p>
              </div>

              <div className="text-center">
                <div className="prevent-icon-container bg-blue-100 w-20 h-20 mx-auto mb-6">
                  <Users className="w-10 h-10 text-blue-600" />
                </div>
                <h4 className="text-xl font-montserrat font-bold text-gray-900 mb-3">
                  Забота
                </h4>
                <p className="text-gray-600 font-roboto">
                  Каждая рекомендация создается с учетом ваших индивидуальных потребностей и обстоятельств
                </p>
              </div>

              <div className="text-center">
                <div className="prevent-icon-container bg-purple-100 w-20 h-20 mx-auto mb-6">
                  <Shield className="w-10 h-10 text-purple-600" />
                </div>
                <h4 className="text-xl font-montserrat font-bold text-gray-900 mb-3">
                  Безопасность
                </h4>
                <p className="text-gray-600 font-roboto">
                  Ваши данные защищены по стандартам GDPR и HIPAA с использованием современного шифрования
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Features */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              <span>Возможности платформы</span>
            </div>
            
            <h2 className="text-4xl font-montserrat font-bold text-gray-900 mb-6">
              Комплексная экосистема <span className="prevent-gradient-accent bg-clip-text text-transparent">здоровья</span>
            </h2>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-roboto">
              От анализа рисков до интеграции с носимыми устройствами — все инструменты для заботы о здоровье в одном месте
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Анализ рисков",
                description: "Оценка вероятности развития заболеваний на основе генетики и образа жизни",
                badge: "AI-powered"
              },
              {
                title: "Интеграции",
                description: "Синхронизация с Apple Health, Google Fit, Oura Ring и другими устройствами",
                badge: "20+ устройств"
              },
              {
                title: "Телемедицина",
                description: "Консультации с врачами-экспертами в области женского здоровья",
                badge: "24/7 доступ"
              },
              {
                title: "Экология здоровья",
                description: "Мониторинг влияния окружающей среды на ваше самочувствие",
                badge: "Уникально"
              }
            ].map((feature, index) => (
              <Card key={index} className="prevent-card border-0 shadow-lg hover:shadow-xl transition-all duration-200">
                <CardContent className="p-6">
                  <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary">
                    {feature.badge}
                  </Badge>
                  <h3 className="text-lg font-montserrat font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 font-roboto text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Founder Section */}
        <FounderSection />

        {/* CTA Section */}
        <section className="text-center py-20">
          <Card className="prevent-card border-0 shadow-2xl bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardContent className="p-12">
              <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-gray-900 mb-6">
                Готовы начать заботиться о своем здоровье?
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Присоединяйтесь к тысячам женщин, которые уже доверили свое здоровье PREVENT
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  onClick={() => navigate('/dashboard')}
                  className="prevent-gradient-primary text-white px-8 py-3 text-lg"
                >
                  Перейти в дашборд
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/risk-assessment')}
                  className="border-primary text-primary hover:bg-primary/10 px-8 py-3 text-lg"
                >
                  Пройти оценку рисков
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default About;
