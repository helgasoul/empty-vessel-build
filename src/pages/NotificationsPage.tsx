
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RemindersManager from '@/components/reminders/RemindersManager';
import DataExportsManager from '@/components/exports/DataExportsManager';
import { Bell, Download, Calendar, Settings } from 'lucide-react';

const NotificationsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-montserrat text-text-primary mb-2">
          Уведомления и данные
        </h1>
        <p className="text-text-secondary">
          Управляйте напоминаниями, экспортируйте данные и настраивайте уведомления
        </p>
      </div>

      <Tabs defaultValue="reminders" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="reminders" className="gap-2">
            <Bell className="w-4 h-4" />
            Напоминания
          </TabsTrigger>
          <TabsTrigger value="exports" className="gap-2">
            <Download className="w-4 h-4" />
            Экспорт данных
          </TabsTrigger>
          <TabsTrigger value="calendar" className="gap-2">
            <Calendar className="w-4 h-4" />
            Календарь
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="w-4 h-4" />
            Настройки
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reminders">
          <RemindersManager />
        </TabsContent>

        <TabsContent value="exports">
          <DataExportsManager />
        </TabsContent>

        <TabsContent value="calendar">
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Календарь интеграций</h3>
            <p className="text-gray-500">Функция календарных интеграций будет доступна в следующем обновлении</p>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="text-center py-12">
            <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Настройки уведомлений</h3>
            <p className="text-gray-500">Настройки уведомлений будут доступны в следующем обновлении</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationsPage;
