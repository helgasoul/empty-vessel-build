
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
  Bell,
  Brain,
  Heart
} from "lucide-react";
import ProfileSection from '@/components/dashboard/ProfileSection';
import DeviceIntegration from '@/components/dashboard/DeviceIntegration';
import RiskAssessment from '@/components/dashboard/RiskAssessment';
import QuickActions from '@/components/dashboard/QuickActions';
import HealthDataDashboard from '@/components/health/HealthDataDashboard';
import { useDevices } from '@/hooks/useDevices';
import { useHealthData } from '@/hooks/useHealthData';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { devices } = useDevices();
  const { getHealthMetrics } = useHealthData();

  const metrics = getHealthMetrics();
  const connectedDevices = devices.filter(d => d.is_connected).length;

  return (
    <div className="min-h-screen prevent-gradient-bg">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 prevent-gradient-primary rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-montserrat font-bold text-gray-900">PREVENT</h1>
                <p className="text-sm text-gray-600 font-roboto">Панель управления здоровьем</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                <Settings className="w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                onClick={signOut}
                className="hover:bg-red-50 hover:border-red-200 transition-colors font-medium"
              >
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <h2 className="text-4xl font-montserrat font-bold text-gray-900 mb-3">
            Добро пожаловать, {user?.user_metadata?.full_name || 'пользователь'}!
          </h2>
          <p className="text-gray-600 text-lg font-roboto">
            Управляйте своим здоровьем с помощью персонализированных рекомендаций и анализа данных.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-slide-up">
          <Card className="prevent-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-roboto text-gray-600">Общий риск</p>
                  <p className="text-2xl font-montserrat font-bold text-green-600">Низкий</p>
                </div>
                <div className="prevent-icon-container bg-green-100">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="prevent-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-roboto text-gray-600">Устройства</p>
                  <p className="text-2xl font-montserrat font-bold text-blue-600">{connectedDevices}</p>
                </div>
                <div className="prevent-icon-container bg-blue-100">
                  <Smartphone className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="prevent-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-roboto text-gray-600">Шаги сегодня</p>
                  <p className="text-2xl font-montserrat font-bold text-purple-600">
                    {new Intl.NumberFormat('ru-RU').format(metrics.steps)}
                  </p>
                </div>
                <div className="prevent-icon-container bg-purple-100">
                  <Brain className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="prevent-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-roboto text-gray-600">Пульс</p>
                  <p className="text-2xl font-montserrat font-bold text-pink-600">
                    {metrics.avgHeartRate || '--'}
                    {metrics.avgHeartRate && <span className="text-sm text-gray-500 ml-1">bpm</span>}
                  </p>
                </div>
                <div className="prevent-icon-container bg-pink-100">
                  <Heart className="w-6 h-6 text-pink-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Health Data Dashboard */}
        <div className="mb-8">
          <HealthDataDashboard />
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile & Devices */}
          <div className="lg:col-span-1 space-y-6">
            <ProfileSection />
            <DeviceIntegration />
          </div>

          {/* Right Column - Risk Assessment & Actions */}
          <div className="lg:col-span-2 space-y-6">
            <RiskAssessment />
            <QuickActions />
          </div>
        </div>

        {/* Bottom Section - Recent Activity */}
        <div className="mt-8">
          <Card className="prevent-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 font-montserrat">
                <Activity className="w-5 h-5 text-primary" />
                <span>Последняя активность</span>
              </CardTitle>
              <CardDescription className="font-roboto">
                Ваши недавние действия и обновления данных
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-slow"></div>
                  <span className="text-sm text-gray-700 font-roboto">
                    {connectedDevices > 0 
                      ? `${connectedDevices} устройств синхронизировано` 
                      : 'Нет подключенных устройств'
                    } - {new Date().toLocaleTimeString('ru-RU')}
                  </span>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-700 font-roboto">
                    {metrics.steps > 0 
                      ? `Пройдено ${new Intl.NumberFormat('ru-RU').format(metrics.steps)} шагов` 
                      : 'Данные о шагах отсутствуют'
                    } - сегодня
                  </span>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-xl">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-700 font-roboto">Профиль обновлен - 3 дня назад</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
