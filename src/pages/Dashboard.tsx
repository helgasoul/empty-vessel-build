
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { 
  Settings,
  BookOpen
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import ProfileSection from '@/components/dashboard/ProfileSection';
import DeviceIntegration from '@/components/dashboard/DeviceIntegration';
import RiskAssessment from '@/components/dashboard/RiskAssessment';
import QuickActions from '@/components/dashboard/QuickActions';
import HealthDataDashboard from '@/components/health/HealthDataDashboard';
import PersonalizedWelcome from '@/components/dashboard/PersonalizedWelcome';
import ProgressIndicators from '@/components/dashboard/ProgressIndicators';
import NotificationCenter from '@/components/notifications/NotificationCenter';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { MobileNavigation } from '@/components/navigation/MobileNavigation';
import { DataSync } from '@/components/sync/DataSync';
import { ActivityMonitor } from '@/components/activity/ActivityMonitor';
import HealthMetricsCards from '@/components/dashboard/HealthMetricsCards';
import { useIsMobile } from '@/hooks/use-mobile';
import { Logo } from '@/components/ui/logo';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleSettingsClick = () => {
    navigate('/medical-integrations');
  };

  const handleRecommendationsClick = () => {
    navigate('/recommendations');
  };

  return (
    <div className="min-h-screen prevent-gradient-bg">
      {/* Header с улучшенной навигацией */}
      <header className="bg-white/95 backdrop-blur-md border-b border-purple-200/30">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <MobileNavigation />
              <Logo size={isMobile ? 'sm' : 'md'} />
            </div>
            
            <div className="flex items-center space-x-2 md:space-x-4">
              <ThemeToggle />
              <NotificationCenter />
              {!isMobile && (
                <>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="hover:bg-purple-100/50"
                    onClick={handleRecommendationsClick}
                    title="Персонализированные рекомендации"
                  >
                    <BookOpen className="w-5 h-5 text-gray-600" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="hover:bg-purple-100/50"
                    onClick={handleSettingsClick}
                  >
                    <Settings className="w-5 h-5 text-gray-600" />
                  </Button>
                </>
              )}
              <Button 
                variant="outline" 
                onClick={signOut}
                className="hover:bg-red-50 hover:border-red-200 transition-colors font-medium text-sm border-purple-200"
              >
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Персонализированное приветствие */}
        <div className="mb-6 md:mb-8 animate-fade-in">
          <PersonalizedWelcome />
        </div>

        {/* Health Metrics Cards */}
        <HealthMetricsCards />

        {/* Health Data Dashboard */}
        <div className="mb-6 md:mb-8">
          <HealthDataDashboard />
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* Left Column - Profile & Devices */}
          <div className="lg:col-span-1 space-y-6">
            <ProfileSection />
            <DeviceIntegration />
            <DataSync />
          </div>

          {/* Right Column - Progress, Risk Assessment & Actions */}
          <div className="lg:col-span-2 space-y-6">
            <ProgressIndicators />
            <RiskAssessment />
            <QuickActions />
            <ActivityMonitor />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
