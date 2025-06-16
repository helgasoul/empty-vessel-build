
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Sparkles, Activity, Shield, Heart, TrendingUp, Users, FlaskConical, Brain } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Перенаправляем авторизованных пользователей на дашборд
  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen prevent-gradient-bg flex items-center justify-center">
        <div className="text-lg font-roboto">Загрузка...</div>
      </div>
    );
  }

  // Если пользователь авторизован, показываем загрузку пока происходит перенаправление
  if (user) {
    return (
      <div className="min-h-screen prevent-gradient-bg flex items-center justify-center">
        <div className="text-lg font-roboto">Перенаправление на панель управления...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen prevent-gradient-bg">
      {/* Navigation */}
      <nav className="w-full px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 prevent-gradient-primary rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-montserrat font-bold text-gray-900">PREVENT</span>
              <p className="text-xs text-gray-600 font-roboto">Персонализированная медицина</p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/auth')}
            className="hover:bg-primary/10 hover:border-primary transition-all duration-200 font-medium"
          >
            Войти
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-16">
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
            Революционная платформа персонализированной медицины с анализом генетических рисков, 
            интеграцией носимых устройств и научно обоснованными рекомендациями для женского здоровья.
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

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20 animate-slide-up">
          <Card className="prevent-card group">
            <CardHeader className="text-center pb-4">
              <div className="prevent-icon-container bg-primary/10 mx-auto mb-4 group-hover:bg-primary/20">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-xl text-gray-900 font-montserrat">Оценка рисков QRISK3</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-gray-600 leading-relaxed font-roboto">
                Научно обоснованный анализ сердечно-сосудистых рисков с учетом ваших индивидуальных параметров и образа жизни.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="prevent-card group">
            <CardHeader className="text-center pb-4">
              <div className="prevent-icon-container bg-secondary/10 mx-auto mb-4 group-hover:bg-secondary/20">
                <Brain className="w-6 h-6 text-secondary" />
              </div>
              <CardTitle className="text-xl text-gray-900 font-montserrat">Нейродегенеративные риски</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-gray-600 leading-relaxed font-roboto">
                Анализ рисков деменции и болезни Альцгеймера с использованием алгоритмов Framingham и DemPoRT.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="prevent-card group">
            <CardHeader className="text-center pb-4">
              <div className="prevent-icon-container bg-accent/10 mx-auto mb-4 group-hover:bg-accent/20">
                <FlaskConical className="w-6 h-6 text-accent" />
              </div>
              <CardTitle className="text-xl text-gray-900 font-montserrat">Экологические риски</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-gray-600 leading-relaxed font-roboto">
                RAIS анализ воздействия химических веществ и загрязнителей окружающей среды на ваше здоровье.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="prevent-card group">
            <CardHeader className="text-center pb-4">
              <div className="prevent-icon-container bg-green-100 mx-auto mb-4 group-hover:bg-green-200">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-xl text-gray-900 font-montserrat">Онкологические риски</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-gray-600 leading-relaxed font-roboto">
                Комплексная оценка рисков рака молочной железы с использованием моделей BRCA, Gail и BCSC.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="prevent-card group">
            <CardHeader className="text-center pb-4">
              <div className="prevent-icon-container bg-purple-100 mx-auto mb-4 group-hover:bg-purple-200">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-xl text-gray-900 font-montserrat">Интеграция устройств</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-gray-600 leading-relaxed font-roboto">
                Apple Watch, Oura Ring, Whoop, Libra - полная интеграция с носимыми устройствами для мониторинга здоровья.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="prevent-card group">
            <CardHeader className="text-center pb-4">
              <div className="prevent-icon-container bg-blue-100 mx-auto mb-4 group-hover:bg-blue-200">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl text-gray-900 font-montserrat">Медицинские сервисы</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-gray-600 leading-relaxed font-roboto">
                Запись к врачам, анализы в лабораториях-партнерах, онлайн консультации и персонализированные программы.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center prevent-gradient-accent rounded-3xl p-16 text-white animate-fade-in">
          <h2 className="text-4xl font-montserrat font-bold mb-6">
            Превентивная медицина начинается сегодня
          </h2>
          <p className="text-accent-foreground/90 mb-10 text-xl max-w-2xl mx-auto font-roboto leading-relaxed">
            Присоединяйтесь к революции в персонализированной медицине. 
            Получите научно обоснованные рекомендации для вашего здоровья.
          </p>
          <Button 
            onClick={() => navigate('/auth')}
            className="bg-white text-primary hover:bg-gray-50 px-10 py-4 text-lg font-semibold transition-all duration-200 hover:scale-105 rounded-xl"
          >
            Создать профиль здоровья
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-32 border-t border-gray-200/50 bg-white/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <div className="w-8 h-8 prevent-gradient-primary rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-gray-800 font-montserrat font-semibold">PREVENT Platform</span>
                <p className="text-xs text-gray-500 font-roboto">Персонализированная медицина</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm font-roboto">
              © 2024 PREVENT. Революционная платформа превентивной медицины.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
