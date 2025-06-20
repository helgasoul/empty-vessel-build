
import React from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import Navigation from '@/components/landing/Navigation';
import HeroSection from '@/components/landing/HeroSection';
import TargetSegments from '@/components/landing/TargetSegments';
import FeaturesGrid from '@/components/landing/FeaturesGrid';
import SocialProofSection from '@/components/landing/SocialProofSection';
import Footer from '@/components/landing/Footer';
import PlatformMission from '@/components/landing/PlatformMission';

const Index = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="prevent-theme">
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <Navigation />
        <PlatformMission />
        <HeroSection />
        <TargetSegments />
        <FeaturesGrid />
        <SocialProofSection />
        <Footer />
      </div>
      <Toaster />
      <Sonner />
    </ThemeProvider>
  );
};

export default Index;
