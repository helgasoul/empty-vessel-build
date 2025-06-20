
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Globe, Mail, Bell, Database, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminSystemSettings = () => {
  const { toast } = useToast();
  const [hasChanges, setHasChanges] = useState(false);

  // Настройки платформы
  const [platformSettings, setPlatformSettings] = useState({
    supported_languages: ['ru', 'en'],
    default_language: 'ru',
    platform_name: 'PREVENT',
    platform_description: 'Платформа превентивной медицины',
    maintenance_mode: false,
    registration_enabled: true,
    api_rate_limit: 1000
  });

  // Email настройки
  const [emailSettings, setEmailSettings] = useState({
    smtp_host: 'smtp.gmail.com',
    smtp_port: 587,
    smtp_username: '',
    smtp_password: '',
    from_email: 'noreply@prevent.com',
    from_name: 'PREVENT Platform',
    welcome_template: 'Добро пожаловать на платформу PREVENT!',
    password_reset_template: 'Ссылка для сброса пароля'
  });

  // Настройки уведомлений
  const [notificationSettings, setNotificationSettings] = useState({
    email_notifications: true,
    sms_notifications: false,
    push_notifications: true,
    admin_alerts: true,
    user_registration_alert: true,
    critical_error_alert: true,
    daily_report: true
  });

  // Настройки базы данных
  const [databaseSettings, setDatabaseSettings] = useState({
    backup_frequency: 'daily',
    backup_retention_days: 30,
    auto_cleanup: true,
    performance_monitoring: true,
    query_timeout: 30,
    connection_pool_size: 20
  });

  const handleSaveSettings = () => {
    // Здесь будет логика сохранения настроек
    toast({
      title: "Настройки сохранены",
      description: "Системные настройки успешно обновлены",
    });
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Системные настройки</h2>
          <p className="text-gray-600">Конфигурация платформы и интеграций</p>
        </div>
        <Button 
          onClick={handleSaveSettings}
          disabled={!hasChanges}
          className="flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Сохранить изменения</span>
        </Button>
      </div>

      <Tabs defaultValue="platform" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="platform" className="flex items-center space-x-2">
            <Globe className="w-4 h-4" />
            <span>Платформа</span>
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center space-x-2">
            <Mail className="w-4 h-4" />
            <span>Email</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="w-4 h-4" />
            <span>Уведомления</span>
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center space-x-2">
            <Database className="w-4 h-4" />
            <span>База данных</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="platform">
          <Card>
            <CardHeader>
              <CardTitle>Настройки платформы</CardTitle>
              <CardDescription>
                Основные параметры и конфигурация платформы
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="platform_name">Название платформы</Label>
                  <Input
                    id="platform_name"
                    value={platformSettings.platform_name}
                    onChange={(e) => {
                      setPlatformSettings({...platformSettings, platform_name: e.target.value});
                      setHasChanges(true);
                    }}
                  />
                </div>
                
                <div>
                  <Label htmlFor="default_language">Язык по умолчанию</Label>
                  <select
                    id="default_language"
                    value={platformSettings.default_language}
                    onChange={(e) => {
                      setPlatformSettings({...platformSettings, default_language: e.target.value});
                      setHasChanges(true);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="ru">Русский</option>
                    <option value="en">English</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="api_rate_limit">Лимит API запросов (в час)</Label>
                  <Input
                    id="api_rate_limit"
                    type="number"
                    value={platformSettings.api_rate_limit}
                    onChange={(e) => {
                      setPlatformSettings({...platformSettings, api_rate_limit: parseInt(e.target.value)});
                      setHasChanges(true);
                    }}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="platform_description">Описание платформы</Label>
                <Textarea
                  id="platform_description"
                  value={platformSettings.platform_description}
                  onChange={(e) => {
                    setPlatformSettings({...platformSettings, platform_description: e.target.value});
                    setHasChanges(true);
                  }}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="maintenance_mode">Режим технического обслуживания</Label>
                  <Switch
                    id="maintenance_mode"
                    checked={platformSettings.maintenance_mode}
                    onCheckedChange={(checked) => {
                      setPlatformSettings({...platformSettings, maintenance_mode: checked});
                      setHasChanges(true);
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="registration_enabled">Разрешить регистрацию новых пользователей</Label>
                  <Switch
                    id="registration_enabled"
                    checked={platformSettings.registration_enabled}
                    onCheckedChange={(checked) => {
                      setPlatformSettings({...platformSettings, registration_enabled: checked});
                      setHasChanges(true);
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Настройки Email</CardTitle>
              <CardDescription>
                Конфигурация SMTP и шаблонов электронной почты
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="smtp_host">SMTP хост</Label>
                  <Input
                    id="smtp_host"
                    value={emailSettings.smtp_host}
                    onChange={(e) => {
                      setEmailSettings({...emailSettings, smtp_host: e.target.value});
                      setHasChanges(true);
                    }}
                  />
                </div>
                
                <div>
                  <Label htmlFor="smtp_port">SMTP порт</Label>
                  <Input
                    id="smtp_port"
                    type="number"
                    value={emailSettings.smtp_port}
                    onChange={(e) => {
                      setEmailSettings({...emailSettings, smtp_port: parseInt(e.target.value)});
                      setHasChanges(true);
                    }}
                  />
                </div>
                
                <div>
                  <Label htmlFor="smtp_username">SMTP пользователь</Label>
                  <Input
                    id="smtp_username"
                    value={emailSettings.smtp_username}
                    onChange={(e) => {
                      setEmailSettings({...emailSettings, smtp_username: e.target.value});
                      setHasChanges(true);
                    }}
                  />
                </div>
                
                <div>
                  <Label htmlFor="smtp_password">SMTP пароль</Label>
                  <Input
                    id="smtp_password"
                    type="password"
                    value={emailSettings.smtp_password}
                    onChange={(e) => {
                      setEmailSettings({...emailSettings, smtp_password: e.target.value});
                      setHasChanges(true);
                    }}
                  />
                </div>
                
                <div>
                  <Label htmlFor="from_email">Email отправителя</Label>
                  <Input
                    id="from_email"
                    type="email"
                    value={emailSettings.from_email}
                    onChange={(e) => {
                      setEmailSettings({...emailSettings, from_email: e.target.value});
                      setHasChanges(true);
                    }}
                  />
                </div>
                
                <div>
                  <Label htmlFor="from_name">Имя отправителя</Label>
                  <Input
                    id="from_name"
                    value={emailSettings.from_name}
                    onChange={(e) => {
                      setEmailSettings({...emailSettings, from_name: e.target.value});
                      setHasChanges(true);
                    }}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="welcome_template">Шаблон приветственного письма</Label>
                <Textarea
                  id="welcome_template"
                  value={emailSettings.welcome_template}
                  onChange={(e) => {
                    setEmailSettings({...emailSettings, welcome_template: e.target.value});
                    setHasChanges(true);
                  }}
                />
              </div>

              <div>
                <Label htmlFor="password_reset_template">Шаблон сброса пароля</Label>
                <Textarea
                  id="password_reset_template"
                  value={emailSettings.password_reset_template}
                  onChange={(e) => {
                    setEmailSettings({...emailSettings, password_reset_template: e.target.value});
                    setHasChanges(true);
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Настройки уведомлений</CardTitle>
              <CardDescription>
                Управление типами и параметрами уведомлений
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email_notifications">Email уведомления</Label>
                  <Switch
                    id="email_notifications"
                    checked={notificationSettings.email_notifications}
                    onCheckedChange={(checked) => {
                      setNotificationSettings({...notificationSettings, email_notifications: checked});
                      setHasChanges(true);
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="sms_notifications">SMS уведомления</Label>
                  <Switch
                    id="sms_notifications"
                    checked={notificationSettings.sms_notifications}
                    onCheckedChange={(checked) => {
                      setNotificationSettings({...notificationSettings, sms_notifications: checked});
                      setHasChanges(true);
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="push_notifications">Push уведомления</Label>
                  <Switch
                    id="push_notifications"
                    checked={notificationSettings.push_notifications}
                    onCheckedChange={(checked) => {
                      setNotificationSettings({...notificationSettings, push_notifications: checked});
                      setHasChanges(true);
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="admin_alerts">Уведомления администраторам</Label>
                  <Switch
                    id="admin_alerts"
                    checked={notificationSettings.admin_alerts}
                    onCheckedChange={(checked) => {
                      setNotificationSettings({...notificationSettings, admin_alerts: checked});
                      setHasChanges(true);
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="user_registration_alert">Уведомления о регистрации</Label>
                  <Switch
                    id="user_registration_alert"
                    checked={notificationSettings.user_registration_alert}
                    onCheckedChange={(checked) => {
                      setNotificationSettings({...notificationSettings, user_registration_alert: checked});
                      setHasChanges(true);
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="critical_error_alert">Уведомления о критических ошибках</Label>
                  <Switch
                    id="critical_error_alert"
                    checked={notificationSettings.critical_error_alert}
                    onCheckedChange={(checked) => {
                      setNotificationSettings({...notificationSettings, critical_error_alert: checked});
                      setHasChanges(true);
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="daily_report">Ежедневные отчеты</Label>
                  <Switch
                    id="daily_report"
                    checked={notificationSettings.daily_report}
                    onCheckedChange={(checked) => {
                      setNotificationSettings({...notificationSettings, daily_report: checked});
                      setHasChanges(true);
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle>Настройки базы данных</CardTitle>
              <CardDescription>
                Параметры резервного копирования и производительности
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="backup_frequency">Частота резервного копирования</Label>
                  <select
                    id="backup_frequency"
                    value={databaseSettings.backup_frequency}
                    onChange={(e) => {
                      setDatabaseSettings({...databaseSettings, backup_frequency: e.target.value});
                      setHasChanges(true);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="hourly">Каждый час</option>
                    <option value="daily">Ежедневно</option>
                    <option value="weekly">Еженедельно</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="backup_retention">Срок хранения бэкапов (дни)</Label>
                  <Input
                    id="backup_retention"
                    type="number"
                    value={databaseSettings.backup_retention_days}
                    onChange={(e) => {
                      setDatabaseSettings({...databaseSettings, backup_retention_days: parseInt(e.target.value)});
                      setHasChanges(true);
                    }}
                  />
                </div>
                
                <div>
                  <Label htmlFor="query_timeout">Тайм-аут запросов (секунды)</Label>
                  <Input
                    id="query_timeout"
                    type="number"
                    value={databaseSettings.query_timeout}
                    onChange={(e) => {
                      setDatabaseSettings({...databaseSettings, query_timeout: parseInt(e.target.value)});
                      setHasChanges(true);
                    }}
                  />
                </div>
                
                <div>
                  <Label htmlFor="connection_pool">Размер пула соединений</Label>
                  <Input
                    id="connection_pool"
                    type="number"
                    value={databaseSettings.connection_pool_size}
                    onChange={(e) => {
                      setDatabaseSettings({...databaseSettings, connection_pool_size: parseInt(e.target.value)});
                      setHasChanges(true);
                    }}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto_cleanup">Автоматическая очистка старых данных</Label>
                  <Switch
                    id="auto_cleanup"
                    checked={databaseSettings.auto_cleanup}
                    onCheckedChange={(checked) => {
                      setDatabaseSettings({...databaseSettings, auto_cleanup: checked});
                      setHasChanges(true);
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="performance_monitoring">Мониторинг производительности</Label>
                  <Switch
                    id="performance_monitoring"
                    checked={databaseSettings.performance_monitoring}
                    onCheckedChange={(checked) => {
                      setDatabaseSettings({...databaseSettings, performance_monitoring: checked});
                      setHasChanges(true);
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSystemSettings;
