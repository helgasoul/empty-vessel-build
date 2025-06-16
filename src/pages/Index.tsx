
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Sparkles, Zap, Shield, Heart, Activity, Users, FileText } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  // Перенаправляем авторизованных пользователей на дашборд
  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-lg">Загрузка...</div>
      </div>
    );
  }

  // Если пользователь авторизован, показываем загрузку пока происходит перенаправление
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-lg">Перенаправление на панель управления...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="w-full px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">YTime</span>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/auth')}
            className="hover:bg-blue-50 transition-colors"
          >
            Войти
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Ваше здоровье под контролем</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Персонализированная 
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent block">
              Платформа Здоровья
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            YTime помогает женщинам управлять своим здоровьем через персонализированные рекомендации, 
            анализ рисков и интеграцию с современными медицинскими сервисами.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-3 text-lg group transition-all duration-200">
                Перейти к панели
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            ) : (
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-3 text-lg group transition-all duration-200"
              >
                Начать сейчас
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            )}
            <Button variant="outline" className="px-8 py-3 text-lg hover:bg-gray-50 transition-colors">
              Узнать больше
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 backdrop-blur">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Activity className="w-6 h-6 text-pink-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">Анализ рисков</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-gray-600 leading-relaxed">
                Персонализированная оценка рисков заболеваний на основе ваших данных и генетических анализов.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 backdrop-blur">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">Интеграция устройств</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-gray-600 leading-relaxed">
                Подключение Apple Watch, Oura Ring, Whoop и других устройств для полной картины здоровья.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 backdrop-blur">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">Медицинские сервисы</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-gray-600 leading-relaxed">
                Запись к врачам, анализы в лабораториях-партнерах и онлайн консультации.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Готовы начать заботиться о своем здоровье?</h2>
          <p className="text-pink-100 mb-8 text-lg">
            Присоединяйтесь к тысячам женщин, которые уже управляют своим здоровьем с YTime.
          </p>
          {user ? (
            <Button className="bg-white text-pink-600 hover:bg-gray-50 px-8 py-3 text-lg font-semibold transition-colors">
              Перейти в приложение
            </Button>
          ) : (
            <Button 
              onClick={() => navigate('/auth')}
              className="bg-white text-pink-600 hover:bg-gray-50 px-8 py-3 text-lg font-semibold transition-colors"
            >
              Создать аккаунт
            </Button>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t border-gray-200 bg-white/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-600 rounded flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <span className="text-gray-600">YTime Platform</span>
            </div>
            <p className="text-gray-500 text-sm">
              © 2024 YTime. Персонализированная платформа женского здоровья.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
