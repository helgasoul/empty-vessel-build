
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Shield, UserCheck, Activity, Building, MessageSquare, Settings } from 'lucide-react';
import RoleManagementPanel from '@/components/rbac/RoleManagementPanel';
import AdminActivityLogs from './AdminActivityLogs';
import AdminSecuritySettings from './AdminSecuritySettings';
import AdminOrganizationManagement from './AdminOrganizationManagement';
import AdminSupportTickets from './AdminSupportTickets';
import AdminSystemSettings from './AdminSystemSettings';
import AdminDoctorVerifications from './AdminDoctorVerifications';

const AdminTabContent = () => {
  const tabConfigs = [
    {
      value: "roles",
      icon: Shield,
      title: "Управление ролями и правами доступа",
      description: "Назначение и изменение ролей пользователей платформы",
      gradient: "from-purple-50 to-pink-50",
      iconColor: "text-purple-600",
      component: <RoleManagementPanel />
    },
    {
      value: "verifications",
      icon: UserCheck,
      title: "Верификация специалистов",
      description: "Проверка и подтверждение квалификации врачей",
      gradient: "from-blue-50 to-cyan-50",
      iconColor: "text-blue-600",
      component: <AdminDoctorVerifications />
    },
    {
      value: "activity",
      icon: Activity,
      title: "Журнал активности",
      description: "Мониторинг действий пользователей и системных событий",
      gradient: "from-green-50 to-emerald-50",
      iconColor: "text-green-600",
      component: <AdminActivityLogs />
    },
    {
      value: "security",
      icon: Shield,
      title: "Настройки безопасности",
      description: "Конфигурация параметров безопасности платформы",
      gradient: "from-red-50 to-orange-50",
      iconColor: "text-red-600",
      component: <AdminSecuritySettings />
    },
    {
      value: "organizations",
      icon: Building,
      title: "Управление организациями",
      description: "Настройка партнерских клиник и лабораторий",
      gradient: "from-indigo-50 to-purple-50",
      iconColor: "text-indigo-600",
      component: <AdminOrganizationManagement />
    },
    {
      value: "support",
      icon: MessageSquare,
      title: "Тикеты поддержки",
      description: "Обработка обращений пользователей",
      gradient: "from-yellow-50 to-orange-50",
      iconColor: "text-yellow-600",
      component: <AdminSupportTickets />
    },
    {
      value: "settings",
      icon: Settings,
      title: "Системные настройки",
      description: "Конфигурация параметров платформы",
      gradient: "from-gray-50 to-slate-50",
      iconColor: "text-gray-600",
      component: <AdminSystemSettings />
    }
  ];

  return (
    <>
      {tabConfigs.map((config) => (
        <TabsContent key={config.value} value={config.value} className="space-y-6">
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
            <CardHeader className={`bg-gradient-to-r ${config.gradient} rounded-t-lg border-b`}>
              <CardTitle className="flex items-center text-gray-900">
                <config.icon className={`w-5 h-5 mr-2 ${config.iconColor}`} />
                {config.title}
              </CardTitle>
              <CardDescription>
                {config.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {config.component}
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </>
  );
};

export default AdminTabContent;
