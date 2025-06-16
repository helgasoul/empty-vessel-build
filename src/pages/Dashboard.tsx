
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Shield, 
  Activity, 
  User, 
  Smartphone, 
  TrendingUp, 
  Calendar,
  Settings,
  Heart
} from "lucide-react";
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
import { useDevices } from '@/hooks/useDevices';
import { useHealthData } from '@/hooks/useHealthData';
import { useIsMobile } from '@/hooks/use-mobile';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { devices } = useDevices();
  const { getHealthMetrics } = useHealthData();
  const isMobile = useIsMobile();

  const metrics = getHealthMetrics();
  const connectedDevices = devices.filter(d => d.is_connected).length;

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
                <Button variant="ghost" size="icon" className="hover:bg-primary/10">
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

        {/* Stats Cards с улучшенным дизайном */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8 animate-slide-up">
          <Card className="prevent-card hover:shadow-lg transition-all duration-200">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-roboto text-gray-600">Общий риск</p>
                  <p className="text-lg md:text-2xl font-montserrat font-bold text-green-600">Низкий</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-green-500">Улучшается</span>
                  </div>
                </div>
                <div className="prevent-icon-container bg-green-100 w-8 h-8 md:w-12 md:h-12">
                  <Shield className="w-4 h-4 md:w-6 md:h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="prevent-card hover:shadow-lg transition-all duration-200">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-roboto text-gray-600">Устройства</p>
                  <p className="text-lg md:text-2xl font-montserrat font-bold text-blue-600">{connectedDevices}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-500">Активно</span>
                  </div>
                </div>
                <div className="prevent-icon-container bg-blue-100 w-8 h-8 md:w-12 md:h-12">
                  <Smartphone className="w-4 h-4 md:w-6 md:h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="prevent-card hover:shadow-lg transition-all duration-200">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-roboto text-gray-600">Шаги сегодня</p>
                  <p className="text-lg md:text-2xl font-montserrat font-bold text-purple-600">
                    {new Intl.NumberFormat('ru-RU').format(metrics.steps)}
                  </p>
                  <div className="flex items-center space-x-1 mt-1">
                    <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-purple-500 transition-all duration-300"
                        style={{ width: `${Math.min((metrics.steps / 10000) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">
                      {Math.round((metrics.steps / 10000) * 100)}%
                    </span>
                  </div>
                </div>
                <div className="prevent-icon-container bg-purple-100 w-8 h-8 md:w-12 md:h-12">
                  <Activity className="w-4 h-4 md:w-6 md:h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="prevent-card hover:shadow-lg transition-all duration-200">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-roboto text-gray-600">Пульс</p>
                  <p className="text-lg md:text-2xl font-montserrat font-bold text-pink-600">
                    {metrics.avgHeartRate || '--'}
                    {metrics.avgHeartRate && <span className="text-xs md:text-sm text-gray-500 ml-1">bpm</span>}
                  </p>
                  <div className="flex items-center space-x-1 mt-1">
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-500">В норме</span>
                  </div>
                </div>
                <div className="prevent-icon-container bg-pink-100 w-8 h-8 md:w-12 md:h-12">
                  <Heart className="w-4 h-4 md:w-6 md:h-6 text-pink-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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
