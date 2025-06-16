
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/landing/Navigation';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesGrid from '@/components/landing/FeaturesGrid';
import FounderSection from '@/components/founder/FounderSection';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';

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
      <Navigation />

      <main className="max-w-7xl mx-auto px-6 py-16">
        <HeroSection />
        <FeaturesGrid />
        <FounderSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
