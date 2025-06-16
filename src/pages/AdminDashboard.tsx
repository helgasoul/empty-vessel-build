
import React from 'react';
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, FileText, Settings } from "lucide-react";
import AdminProtectedRoute from '@/components/experts/AdminProtectedRoute';
import AdminPanel from '@/components/experts/AdminPanel';
import ExpertManagement from './ExpertManagement';

const AdminDashboard = () => {
  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { href: "/", label: "Главная" },
              { label: "Панель администратора" }
            ]}
            className="mb-6"
          />

          {/* Header */}
          <div className="flex items-center space-x-3 mb-8">
            <Shield className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Панель администратора</h1>
              <p className="text-gray-600 mt-1">Управление платформой YTime</p>
            </div>
          </div>

          {/* Admin Tabs */}
          <Tabs defaultValue="roles" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="roles" className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Роли</span>
              </TabsTrigger>
              <TabsTrigger value="experts" className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Эксперты</span>
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Контент</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Настройки</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="roles">
              <AdminPanel />
            </TabsContent>

            <TabsContent value="experts">
              <div className="space-y-6">
                {/* Здесь будет компонент управления экспертами без AdminProtectedRoute обертки */}
                <div>Expert management will be rendered here</div>
              </div>
            </TabsContent>

            <TabsContent value="content">
              <div className="text-center py-12">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Управление контентом
                </h3>
                <p className="text-gray-600">
                  Функционал будет добавлен в следующих обновлениях
                </p>
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <div className="text-center py-12">
                <Settings className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Системные настройки
                </h3>
                <p className="text-gray-600">
                  Функционал будет добавлен в следующих обновлениях
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminProtectedRoute>
  );
};

export default AdminDashboard;
