
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, FileText, Settings, Activity, Building, MessageSquare, AlertTriangle, UserCheck } from "lucide-react";
import RoleManagementPanel from '@/components/rbac/RoleManagementPanel';
import AdminActivityLogs from './AdminActivityLogs';
import AdminSecuritySettings from './AdminSecuritySettings';
import AdminOrganizationManagement from './AdminOrganizationManagement';
import AdminSupportTickets from './AdminSupportTickets';
import AdminSystemSettings from './AdminSystemSettings';
import AdminDoctorVerifications from './AdminDoctorVerifications';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header */}
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-200/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-slate-600 to-indigo-600 w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Панель администратора</h1>
                <p className="text-slate-600 font-medium mt-1">Полное управление платформой PREVENT</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Система работает
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Enhanced Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl border-0 hover:shadow-2xl transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-blue-100 text-sm font-medium">Всего пользователей</div>
                  <div className="text-3xl font-bold">12,847</div>
                  <div className="text-blue-200 text-xs">+8.2% за месяц</div>
                </div>
                <div className="bg-white/20 rounded-full p-3 group-hover:scale-110 transition-transform duration-200">
                  <Users className="w-8 h-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-xl border-0 hover:shadow-2xl transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-green-100 text-sm font-medium">Организации</div>
                  <div className="text-3xl font-bold">127</div>
                  <div className="text-green-200 text-xs">Активных: 89</div>
                </div>
                <div className="bg-white/20 rounded-full p-3 group-hover:scale-110 transition-transform duration-200">
                  <Building className="w-8 h-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl border-0 hover:shadow-2xl transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-purple-100 text-sm font-medium">Открытые тикеты</div>
                  <div className="text-3xl font-bold">45</div>
                  <div className="text-purple-200 text-xs">Среднее время: 2.1 ч</div>
                </div>
                <div className="bg-white/20 rounded-full p-3 group-hover:scale-110 transition-transform duration-200">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-xl border-0 hover:shadow-2xl transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-orange-100 text-sm font-medium">Критические события</div>
                  <div className="text-3xl font-bold">3</div>
                  <div className="text-orange-200 text-xs">Требуют внимания</div>
                </div>
                <div className="bg-white/20 rounded-full p-3 group-hover:scale-110 transition-transform duration-200">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Admin Tabs */}
        <Tabs defaultValue="roles" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 bg-white/95 backdrop-blur-sm shadow-lg border border-slate-200/30 rounded-xl p-1">
            <TabsTrigger value="roles" className="flex items-center space-x-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Роли</span>
            </TabsTrigger>
            <TabsTrigger value="verifications" className="flex items-center space-x-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white">
              <UserCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Верификации</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center space-x-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white">
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Активность</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center space-x-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-orange-500 data-[state=active]:text-white">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Безопасность</span>
            </TabsTrigger>
            <TabsTrigger value="organizations" className="flex items-center space-x-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              <Building className="w-4 h-4" />
              <span className="hidden sm:inline">Организации</span>
            </TabsTrigger>
            <TabsTrigger value="support" className="flex items-center space-x-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Поддержка</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-500 data-[state=active]:to-slate-500 data-[state=active]:text-white">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Настройки</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="roles" className="space-y-6">
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg border-b">
                <CardTitle className="flex items-center text-gray-900">
                  <Shield className="w-5 h-5 mr-2 text-purple-600" />
                  Управление ролями и правами доступа
                </CardTitle>
                <CardDescription>
                  Назначение и изменение ролей пользователей платформы
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <RoleManagementPanel />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verifications" className="space-y-6">
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-lg border-b">
                <CardTitle className="flex items-center text-gray-900">
                  <UserCheck className="w-5 h-5 mr-2 text-blue-600" />
                  Верификация специалистов
                </CardTitle>
                <CardDescription>
                  Проверка и подтверждение квалификации врачей
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <AdminDoctorVerifications />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg border-b">
                <CardTitle className="flex items-center text-gray-900">
                  <Activity className="w-5 h-5 mr-2 text-green-600" />
                  Журнал активности
                </CardTitle>
                <CardDescription>
                  Мониторинг действий пользователей и системных событий
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <AdminActivityLogs />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 rounded-t-lg border-b">
                <CardTitle className="flex items-center text-gray-900">
                  <Shield className="w-5 h-5 mr-2 text-red-600" />
                  Настройки безопасности
                </CardTitle>
                <CardDescription>
                  Конфигурация параметров безопасности платформы
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <AdminSecuritySettings />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="organizations" className="space-y-6">
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-lg border-b">
                <CardTitle className="flex items-center text-gray-900">
                  <Building className="w-5 h-5 mr-2 text-indigo-600" />
                  Управление организациями
                </CardTitle>
                <CardDescription>
                  Настройка партнерских клиник и лабораторий
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <AdminOrganizationManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support" className="space-y-6">
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-t-lg border-b">
                <CardTitle className="flex items-center text-gray-900">
                  <MessageSquare className="w-5 h-5 mr-2 text-yellow-600" />
                  Тикеты поддержки
                </CardTitle>
                <CardDescription>
                  Обработка обращений пользователей
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <AdminSupportTickets />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-t-lg border-b">
                <CardTitle className="flex items-center text-gray-900">
                  <Settings className="w-5 h-5 mr-2 text-gray-600" />
                  Системные настройки
                </CardTitle>
                <CardDescription>
                  Конфигурация параметров платформы
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <AdminSystemSettings />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
