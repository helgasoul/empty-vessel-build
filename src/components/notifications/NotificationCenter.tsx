
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, Check, X, Clock, Heart, Activity, Brain } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'reminder' | 'achievement' | 'health' | 'appointment';
  isRead: boolean;
  timestamp: Date;
  actionLabel?: string;
  actionUrl?: string;
}

const NotificationCenter = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  
  // Mock notifications - в реальном приложении это будет из Supabase
  const mockNotifications: Notification[] = [
    {
      id: '1',
      title: 'Время принять витамины',
      message: 'Не забудьте принять ваши ежедневные витамины',
      type: 'reminder',
      isRead: false,
      timestamp: new Date(),
      actionLabel: 'Отметить как выполнено'
    },
    {
      id: '2',
      title: 'Новое достижение!',
      message: 'Вы достигли цели в 10,000 шагов 3 дня подряд!',
      type: 'achievement',
      isRead: false,
      timestamp: new Date(Date.now() - 3600000),
      actionLabel: 'Посмотреть достижения',
      actionUrl: '/gamification'
    },
    {
      id: '3',
      title: 'Пора записаться на обследование',
      message: 'Рекомендуется пройти ежегодное обследование',
      type: 'health',
      isRead: true,
      timestamp: new Date(Date.now() - 86400000),
      actionLabel: 'Записаться',
      actionUrl: '/medical-integrations'
    }
  ];

  const { data: notifications = mockNotifications } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      // Здесь будет запрос к Supabase
      return mockNotifications;
    },
    enabled: !!user?.id,
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'reminder':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'achievement':
        return <Brain className="w-4 h-4 text-purple-500" />;
      case 'health':
        return <Heart className="w-4 h-4 text-red-500" />;
      case 'appointment':
        return <Activity className="w-4 h-4 text-green-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'reminder':
        return 'Напоминание';
      case 'achievement':
        return 'Достижение';
      case 'health':
        return 'Здоровье';
      case 'appointment':
        return 'Прием';
      default:
        return 'Уведомление';
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} мин назад`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} ч назад`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} дн назад`;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hover:bg-primary/10">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-montserrat">Уведомления</CardTitle>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {unreadCount} новых
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="max-h-96">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="font-roboto">Нет новых уведомлений</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors ${
                        !notification.isRead ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium text-gray-900 font-montserrat">
                              {notification.title}
                            </p>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 font-roboto mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs">
                              {getTypeLabel(notification.type)}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {formatTime(notification.timestamp)}
                            </span>
                          </div>
                          {notification.actionLabel && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2 h-7 text-xs"
                              onClick={() => {
                                if (notification.actionUrl) {
                                  window.location.href = notification.actionUrl;
                                }
                                setOpen(false);
                              }}
                            >
                              {notification.actionLabel}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
