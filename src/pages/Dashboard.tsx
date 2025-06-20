
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import NavigationDropdown from '@/components/navigation/NavigationDropdown';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
      {/* Header с улучшенной навигацией */}
      <header className="bg-white/95 backdrop-blur-md border-b border-purple-200/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <MobileNavigation />
              <Logo size={isMobile ? 'sm' : 'md'} />
            </div>
            
            {/* Центральная секция с выпадающим меню */}
            <div className="flex-1 flex justify-center max-w-md mx-8">
              <NavigationDropdown />
            </div>
            
            <div className="flex items-center space-x-2 md:space-x-4">
              <ThemeToggle />
              <NotificationCenter />
              
              <Button 
                variant="outline" 
                onClick={signOut}
                className="hover:bg-red-50 hover:border-red-200 transition-colors font-medium text-sm border-purple-200 shadow-sm"
              >
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 w-full">
        {/* Персонализированное приветствие */}
        <div className="mb-6 md:mb-8 animate-fade-in">
          <PersonalizedWelcome />
        </div>

        {/* Health Metrics Cards */}
        <div className="mb-6 md:mb-8 animate-slide-up">
          <HealthMetricsCards />
        </div>

        {/* Health Data Dashboard */}
        <div className="mb-6 md:mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <HealthDataDashboard />
        </div>

        {/* Main Grid Layout */}
        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* Left Column - Profile & Devices */}
          <div className="lg:col-span-1 space-y-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <ProfileSection />
            <DeviceIntegration />
            <DataSync />
          </div>

          {/* Right Column - Progress, Risk Assessment & Actions */}
          <div className="lg:col-span-2 space-y-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <ProgressIndicators />
            <RiskAssessment />
            <QuickActions />
            <ActivityMonitor />
          </div>
        </div>
      </main>

      {/* Footer для дополнительной информации */}
      <footer className="border-t border-gray-200/50 bg-white/30 backdrop-blur-sm mt-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4 mb-2 md:mb-0">
              <span>© 2024 PREVENT Platform</span>
              <span className="hidden md:inline">•</span>
              <span className="text-xs bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-medium">
                Ваше здоровье — наш приоритет
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-xs">Последнее обновление: {new Date().toLocaleTimeString('ru-RU')}</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs">Онлайн</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
