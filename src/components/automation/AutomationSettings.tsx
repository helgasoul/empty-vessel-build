
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUpdateAutomationUserSettings } from '@/hooks/useAutomationWorkflows';
import { AutomationUserSettings } from '@/hooks/useAutomationWorkflows';
import { Bell, Clock, Smartphone, Mail, MessageSquare } from 'lucide-react';

interface AutomationSettingsProps {
  settings: AutomationUserSettings | null;
}

const AutomationSettings: React.FC<AutomationSettingsProps> = ({ settings }) => {
  const updateSettings = useUpdateAutomationUserSettings();

  const handleToggle = async (field: keyof AutomationUserSettings, value: boolean) => {
    await updateSettings.mutateAsync({ [field]: value });
  };

  const handleNotificationToggle = async (type: string, value: boolean) => {
    const currentPrefs = settings?.notification_preferences || {};
    await updateSettings.mutateAsync({
      notification_preferences: {
        ...currentPrefs,
        [type]: value
      }
    });
  };

  const handleCycleSettingChange = async (field: string, value: number) => {
    await updateSettings.mutateAsync({ [field]: value });
  };

  const handleTimeChange = async (field: string, value: string) => {
    await updateSettings.mutateAsync({ [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Общие настройки
          </CardTitle>
          <CardDescription>
            Основные параметры автоматизации
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Автоматизация включена</Label>
              <p className="text-sm text-gray-500">
                Включить/выключить все автоматизированные workflow
              </p>
            </div>
            <Switch
              checked={settings?.automation_enabled ?? true}
              onCheckedChange={(checked) => handleToggle('automation_enabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Отслеживание цикла</Label>
              <p className="text-sm text-gray-500">
                Автоматическое отслеживание менструального цикла
              </p>
            </div>
            <Switch
              checked={settings?.cycle_tracking_enabled ?? true}
              onCheckedChange={(checked) => handleToggle('cycle_tracking_enabled', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Cycle Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Настройки цикла</CardTitle>
          <CardDescription>
            Параметры менструального цикла для точной автоматизации
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cycle_length">Длина цикла (дни)</Label>
              <Input
                id="cycle_length"
                type="number"
                min="21"
                max="35"
                value={settings?.cycle_length || 28}
                onChange={(e) => handleCycleSettingChange('cycle_length', parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="period_length">Длина менструации (дни)</Label>
              <Input
                id="period_length"
                type="number"
                min="3"
                max="8"
                value={settings?.period_length || 5}
                onChange={(e) => handleCycleSettingChange('period_length', parseInt(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Уведомления
          </CardTitle>
          <CardDescription>
            Настройте способы получения уведомлений от автоматизации
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <div className="space-y-0.5">
                <Label>Email уведомления</Label>
                <p className="text-sm text-gray-500">Получать уведомления по email</p>
              </div>
            </div>
            <Switch
              checked={settings?.notification_preferences?.email ?? true}
              onCheckedChange={(checked) => handleNotificationToggle('email', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              <div className="space-y-0.5">
                <Label>Push уведомления</Label>
                <p className="text-sm text-gray-500">Уведомления в браузере</p>
              </div>
            </div>
            <Switch
              checked={settings?.notification_preferences?.push ?? true}
              onCheckedChange={(checked) => handleNotificationToggle('push', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <div className="space-y-0.5">
                <Label>SMS уведомления</Label>
                <p className="text-sm text-gray-500">Получать SMS сообщения</p>
              </div>
            </div>
            <Switch
              checked={settings?.notification_preferences?.sms ?? false}
              onCheckedChange={(checked) => handleNotificationToggle('sms', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Quiet Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Тихие часы
          </CardTitle>
          <CardDescription>
            Время, когда уведомления не будут отправляться
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quiet_start">Начало тихих часов</Label>
              <Input
                id="quiet_start"
                type="time"
                value={settings?.quiet_hours_start || '22:00'}
                onChange={(e) => handleTimeChange('quiet_hours_start', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quiet_end">Конец тихих часов</Label>
              <Input
                id="quiet_end"
                type="time"
                value={settings?.quiet_hours_end || '08:00'}
                onChange={(e) => handleTimeChange('quiet_hours_end', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Часовой пояс</Label>
            <Select
              value={settings?.timezone || 'Europe/Moscow'}
              onValueChange={(value) => updateSettings.mutateAsync({ timezone: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Europe/Moscow">Москва (UTC+3)</SelectItem>
                <SelectItem value="Europe/Samara">Самара (UTC+4)</SelectItem>
                <SelectItem value="Asia/Yekaterinburg">Екатеринбург (UTC+5)</SelectItem>
                <SelectItem value="Asia/Novosibirsk">Новосибирск (UTC+7)</SelectItem>
                <SelectItem value="Asia/Vladivostok">Владивосток (UTC+10)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button disabled={updateSettings.isPending}>
          {updateSettings.isPending ? 'Сохранение...' : 'Настройки сохраняются автоматически'}
        </Button>
      </div>
    </div>
  );
};

export default AutomationSettings;
