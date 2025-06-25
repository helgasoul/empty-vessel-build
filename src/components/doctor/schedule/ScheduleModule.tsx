
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Users, Phone, Video, MapPin } from "lucide-react";

const ScheduleModule = () => {
  const todayAppointments = [
    {
      time: "09:00",
      patient: "Анна Петрова",
      type: "Консультация",
      duration: 30,
      status: "confirmed",
      format: "office"
    },
    {
      time: "10:30",
      patient: "Мария Иванова",
      type: "Повторный прием",
      duration: 20,
      status: "confirmed",
      format: "video"
    },
    {
      time: "11:00",
      patient: "Елена Сидорова",
      type: "Разбор анализов",
      duration: 45,
      status: "pending",
      format: "office"
    },
    {
      time: "14:00",
      patient: "Ольга Козлова",
      type: "Первичная консультация",
      duration: 60,
      status: "confirmed",
      format: "office"
    },
    {
      time: "15:30",
      patient: "Татьяна Морозова",
      type: "Профилактический осмотр",
      duration: 30,
      status: "confirmed",
      format: "office"
    }
  ];

  const weekStats = {
    totalAppointments: 28,
    confirmed: 24,
    pending: 3,
    cancelled: 1,
    videoConsultations: 8,
    officeVisits: 16
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Подтвержден';
      case 'pending': return 'Ожидает';
      case 'cancelled': return 'Отменен';
      default: return 'Неизвестно';
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'phone': return <Phone className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Расписание приемов</h2>
        <p className="text-gray-600 mt-1">
          Управление расписанием и консультациями
        </p>
      </div>

      {/* Статистика недели */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего приемов</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weekStats.totalAppointments}</div>
            <p className="text-xs text-muted-foreground">на эту неделю</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Подтверждено</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{weekStats.confirmed}</div>
            <p className="text-xs text-muted-foreground">приемов</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ожидает</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{weekStats.pending}</div>
            <p className="text-xs text-muted-foreground">подтверждения</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Отменено</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{weekStats.cancelled}</div>
            <p className="text-xs text-muted-foreground">приемов</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Онлайн</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{weekStats.videoConsultations}</div>
            <p className="text-xs text-muted-foreground">консультаций</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">В офисе</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{weekStats.officeVisits}</div>
            <p className="text-xs text-muted-foreground">визитов</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="today" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="today">Сегодня</TabsTrigger>
          <TabsTrigger value="week">Неделя</TabsTrigger>
          <TabsTrigger value="settings">Настройки</TabsTrigger>
        </TabsList>

        <TabsContent value="today">
          <Card>
            <CardHeader>
              <CardTitle>Расписание на сегодня</CardTitle>
              <CardDescription>
                {todayAppointments.length} приемов запланировано
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayAppointments.map((appointment, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="text-lg font-semibold text-blue-600">
                          {appointment.time}
                        </div>
                        <div>
                          <h3 className="font-medium">{appointment.patient}</h3>
                          <p className="text-sm text-gray-500">{appointment.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getStatusColor(appointment.status) as any}>
                          {getStatusText(appointment.status)}
                        </Badge>
                        <div className="flex items-center space-x-1 text-gray-500">
                          {getFormatIcon(appointment.format)}
                          <span className="text-sm">{appointment.duration}м</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        Перенести
                      </Button>
                      <Button size="sm" variant="outline">
                        Отменить
                      </Button>
                      {appointment.format === 'video' && (
                        <Button size="sm">
                          <Video className="w-4 h-4 mr-2" />
                          Присоединиться
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="week">
          <Card>
            <CardHeader>
              <CardTitle>Расписание на неделю</CardTitle>
              <CardDescription>
                Обзор всех приемов на текущую неделю
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Здесь будет календарное представление расписания на неделю
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Настройки расписания</CardTitle>
              <CardDescription>
                Управление рабочими часами и типами приемов
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Рабочие часы</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Настройте ваши стандартные рабочие часы
                  </p>
                  <Button variant="outline">
                    Изменить рабочие часы
                  </Button>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Типы консультаций</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Управление доступными типами приемов
                  </p>
                  <Button variant="outline">
                    Настроить типы приемов
                  </Button>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Уведомления</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Настройте напоминания о приемах
                  </p>
                  <Button variant="outline">
                    Настроить уведомления
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScheduleModule;
