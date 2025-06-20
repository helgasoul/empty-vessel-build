
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Shield className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Расширенная панель администратора</h1>
          <p className="text-gray-600 mt-1">Полное управление платформой PREVENT</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">1,234</p>
                <p className="text-sm text-gray-600">Всего пользователей</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Building className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">89</p>
                <p className="text-sm text-gray-600">Организации</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">45</p>
                <p className="text-sm text-gray-600">Открытые тикеты</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-gray-600">Критические события</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Tabs */}
      <Tabs defaultValue="roles" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="roles" className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>Роли</span>
          </TabsTrigger>
          <TabsTrigger value="verifications" className="flex items-center space-x-2">
            <UserCheck className="w-4 h-4" />
            <span>Верификации</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span>Активность</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>Безопасность</span>
          </TabsTrigger>
          <TabsTrigger value="organizations" className="flex items-center space-x-2">
            <Building className="w-4 h-4" />
            <span>Организации</span>
          </TabsTrigger>
          <TabsTrigger value="support" className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4" />
            <span>Поддержка</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Настройки</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="roles">
          <RoleManagementPanel />
        </TabsContent>

        <TabsContent value="verifications">
          <AdminDoctorVerifications />
        </TabsContent>

        <TabsContent value="activity">
          <AdminActivityLogs />
        </TabsContent>

        <TabsContent value="security">
          <AdminSecuritySettings />
        </TabsContent>

        <TabsContent value="organizations">
          <AdminOrganizationManagement />
        </TabsContent>

        <TabsContent value="support">
          <AdminSupportTickets />
        </TabsContent>

        <TabsContent value="settings">
          <AdminSystemSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
