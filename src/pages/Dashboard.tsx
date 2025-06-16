
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Settings
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

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleSettingsClick = () => {
    navigate('/medical-integrations');
  };

  return (
    <div className="min-h-screen prevent-gradient-bg">
      {/* Header с улучшенной навигацией */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <MobileNavigation />
              <div className="w-10 h-10 prevent-gradient-primary rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-montserrat font-bold text-gray-900">PREVENT</h1>
                <p className="text-xs md:text-sm text-gray-600 font-roboto">
                  Персонализированная медицина для женщин
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 md:space-x-4">
              <ThemeToggle />
              <NotificationCenter />
              {!isMobile && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="hover:bg-primary/10"
                  onClick={handleSettingsClick}
                >
                  <Settings className="w-5 h-5" />
                </Button>
              )}
              <Button 
                variant="outline" 
                onClick={signOut}
                className="hover:bg-red-50 hover:border-red-200 transition-colors font-medium text-sm"
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
