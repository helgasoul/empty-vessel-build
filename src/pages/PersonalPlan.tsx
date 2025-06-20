
import React from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import Navigation from '@/components/landing/Navigation';
import PersonalPlan from '@/components/landing/PersonalPlan';
import Footer from '@/components/landing/Footer';
import BackButton from '@/components/ui/back-button';

const PersonalPlanPage = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="prevent-theme">
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <Navigation />
        
        {/* Header Section */}
        <div className="px-4 md:px-6 py-8">
          <div className="max-w-6xl mx-auto">
            <BackButton 
              fallbackPath="/" 
              className="mb-6 text-gray-600 hover:text-purple-600"
            />
            
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Персональный план заботы о здоровье
              </h1>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Твой индивидуальный план, созданный специально для тебя на основе данных о здоровье и целях
              </p>
            </div>
          </div>
        </div>

        <PersonalPlan />
        <Footer />
      </div>
      <Toaster />
      <Sonner />
    </ThemeProvider>
  );
};

export default PersonalPlanPage;
