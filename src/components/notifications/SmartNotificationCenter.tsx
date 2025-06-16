
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Bell, Brain, Calendar, Heart, Activity, Sparkles, X, Clock } from "lucide-react";
import { useSmartNotifications } from "@/hooks/useSmartNotifications";
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const SmartNotificationCenter = () => {
  const [open, setOpen] = useState(false);
  const { notifications, loading, markAsRead, snoozeNotification } = useSmartNotifications();
  
  const unreadCount = notifications.length;

  const getIcon = (type: string, category: string) => {
    if (type === 'prediction') return <Brain className="w-4 h-4 text-purple-500" />;
    if (category === 'menstrual' || category === 'fertility') return <Heart className="w-4 h-4 text-pink-500" />;
    if (category === 'wellness') return <Activity className="w-4 h-4 text-green-500" />;
    return <Bell className="w-4 h-4 text-blue-500" />;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      'menstrual': 'Цикл',
      'fertility': 'Фертильность',
      'symptoms': 'Симптомы',
      'wellness': 'Самочувствие',
      'medical': 'Медицина'
    };
    return labels[category] || category;
  };

  const getPriorityLabel = (priority: string) => {
    const labels: { [key: string]: string } = {
      'critical': 'Критично',
      'high': 'Высокий',
      'medium': 'Средний',
      'low': 'Низкий'
    };
    return labels[priority] || priority;
  };

  const handleSnooze = (notificationId: string, hours: number) => {
    snoozeNotification(notificationId, hours);
  };

  if (loading) {
    return (
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="w-5 h-5 animate-pulse" />
      </Button>
    );
  }

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
      <PopoverContent className="w-96 p-0" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-montserrat flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>Умные уведомления</span>
                </CardTitle>
                <CardDescription>
                  Персонализированные рекомендации и прогнозы
                </CardDescription>
              </div>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  {unreadCount} новых
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="max-h-96">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="font-roboto">Все уведомления прочитаны</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Новые рекомендации появятся на основе ваших данных
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors ${
                        notification.isPersonalized ? 'bg-purple-50/30' : ''
                      }`}
                    >
                      <div className="space-y-3">
                        {/* Заголовок уведомления */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <div className="flex-shrink-0 mt-0.5">
                              {getIcon(notification.type, notification.category)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="text-sm font-medium text-gray-900 font-montserrat">
                                  {notification.title}
                                </h4>
                                {notification.isPersonalized && (
                                  <Badge variant="outline" className="text-xs bg-purple-50 border-purple-200 text-purple-700">
                                    <Brain className="w-3 h-3 mr-1" />
                                    ИИ
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 font-roboto">
                                {notification.message}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="h-6 w-6 p-0 ml-2"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>

                        {/* Метаданные */}
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {getCategoryLabel(notification.category)}
                            </Badge>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getPriorityColor(notification.priority)}`}
                            >
                              {getPriorityLabel(notification.priority)}
                            </Badge>
                            {notification.type === 'prediction' && (
                              <Badge variant="outline" className="text-xs bg-purple-50 border-purple-200 text-purple-700">
                                Прогноз
                              </Badge>
                            )}
                          </div>
                          <span className="text-gray-500">
                            {format(notification.scheduledFor, 'HH:mm')}
                          </span>
                        </div>

                        {/* Действия */}
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-2">
                            {notification.actionRequired && notification.actionLabel && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs"
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
                          
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 text-xs px-2"
                              onClick={() => handleSnooze(notification.id, 1)}
                            >
                              <Clock className="w-3 h-3 mr-1" />
                              1ч
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 text-xs px-2"
                              onClick={() => handleSnooze(notification.id, 24)}
                            >
                              1д
                            </Button>
                          </div>
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

export default SmartNotificationCenter;
