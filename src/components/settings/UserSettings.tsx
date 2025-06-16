
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Settings, User, Bell, Palette, Smartphone } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export const UserSettings = () => {
  const { preferences, updatePreferences, toggleCompactMode } = useTheme();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palette className="w-5 h-5 text-primary" />
            <span>Внешний вид</span>
          </CardTitle>
          <CardDescription>
            Настройте тему и отображение интерфейса
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="theme-toggle">Тема оформления</Label>
            <ThemeToggle />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="compact-mode">Компактный режим</Label>
              <p className="text-sm text-muted-foreground">
                Уменьшает отступы и размеры элементов
              </p>
            </div>
            <Switch
              id="compact-mode"
              checked={preferences.compactMode}
              onCheckedChange={toggleCompactMode}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <Label htmlFor="language">Язык интерфейса</Label>
            <Select
              value={preferences.language}
              onValueChange={(value: 'ru' | 'en') => updatePreferences({ language: value })}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ru">Русский</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-primary" />
            <span>Уведомления</span>
          </CardTitle>
          <CardDescription>
            Управляйте настройками уведомлений
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Email уведомления</Label>
              <p className="text-sm text-muted-foreground">
                Получать уведомления на электронную почту
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={preferences.notifications.email}
              onCheckedChange={(checked) =>
                updatePreferences({
                  notifications: { ...preferences.notifications, email: checked }
                })
              }
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push-notifications">Push уведомления</Label>
              <p className="text-sm text-muted-foreground">
                Получать уведомления в браузере
              </p>
            </div>
            <Switch
              id="push-notifications"
              checked={preferences.notifications.push}
              onCheckedChange={(checked) =>
                updatePreferences({
                  notifications: { ...preferences.notifications, push: checked }
                })
              }
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="reminders">Напоминания</Label>
              <p className="text-sm text-muted-foreground">
                Напоминания о приеме лекарств и анализах
              </p>
            </div>
            <Switch
              id="reminders"
              checked={preferences.notifications.reminders}
              onCheckedChange={(checked) =>
                updatePreferences({
                  notifications: { ...preferences.notifications, reminders: checked }
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Smartphone className="w-5 h-5 text-primary" />
            <span>Мобильные настройки</span>
          </CardTitle>
          <CardDescription>
            Оптимизация для мобильных устройств
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Интерфейс автоматически адаптируется под размер экрана. 
            Для лучшего опыта на мобильных устройствах рекомендуется включить компактный режим.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
