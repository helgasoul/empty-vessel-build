
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, Bell, Plus, MapPin } from "lucide-react";

interface Appointment {
  id: string;
  patientName: string;
  time: string;
  type: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  duration: number;
  location?: string;
  notes?: string;
}

interface Reminder {
  id: string;
  patientName: string;
  type: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
}

const ScheduleModule = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');

  const mockAppointments: Appointment[] = [
    {
      id: '1',
      patientName: 'Анна Петрова',
      time: '09:00',
      type: 'Консультация',
      status: 'confirmed',
      duration: 30,
      location: 'Кабинет 201',
      notes: 'Контроль после лечения'
    },
    {
      id: '2',
      patientName: 'Мария Иванова',
      time: '10:30',
      type: 'Профосмотр',
      status: 'scheduled',
      duration: 45,
      location: 'Кабинет 201'
    },
    {
      id: '3',
      patientName: 'Елена Сидорова',
      time: '14:00',
      type: 'Телемедицина',
      status: 'confirmed',
      duration: 30,
      location: 'Онлайн'
    }
  ];

  const mockReminders: Reminder[] = [
    {
      id: '1',
      patientName: 'Анна Петрова',
      type: 'Повторный анализ',
      dueDate: '2025-06-25',
      priority: 'high'
    },
    {
      id: '2',
      patientName: 'Мария Иванова',
      type: 'Маммография',
      dueDate: '2025-06-30',
      priority: 'medium'
    },
    {
      id: '3',
      patientName: 'Елена Сидорова',
      type: 'Контрольный осмотр',
      dueDate: '2025-07-05',
      priority: 'low'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Подтверждено';
      case 'scheduled': return 'Запланировано';
      case 'completed': return 'Завершено';
      case 'cancelled': return 'Отменено';
      default: return 'Неизвестно';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Статистика расписания */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">8</p>
                <p className="text-sm text-gray-600">Сегодня приемов</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">6.5ч</p>
                <p className="text-sm text-gray-600">Занято времени</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">23</p>
                <p className="text-sm text-gray-600">На этой неделе</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">5</p>
                <p className="text-sm text-gray-600">Напоминаний</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="schedule" className="space-y-4">
        <TabsList>
          <TabsTrigger value="schedule">Расписание</TabsTrigger>
          <TabsTrigger value="appointments">Записи</TabsTrigger>
          <TabsTrigger value="reminders">Напоминания</TabsTrigger>
          <TabsTrigger value="availability">Доступность</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Расписание консультаций</span>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Новая запись
                  </Button>
                  <select 
                    value={viewMode} 
                    onChange={(e) => setViewMode(e.target.value as 'day' | 'week' | 'month')}
                    className="px-3 py-1 border rounded text-sm"
                  >
                    <option value="day">День</option>
                    <option value="week">Неделя</option>
                    <option value="month">Месяц</option>
                  </select>
                </div>
              </CardTitle>
              <CardDescription>
                Управление консультациями и профилактическими осмотрами
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 mb-4">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-3 py-2 border rounded"
                  />
                  <span className="text-sm text-gray-600">
                    {new Date(selectedDate).toLocaleDateString('ru-RU', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>

                <div className="space-y-3">
                  {mockAppointments.map((appointment) => (
                    <div key={appointment.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className="font-medium text-lg">{appointment.time}</span>
                          <div>
                            <p className="font-medium">{appointment.patientName}</p>
                            <p className="text-sm text-gray-600">{appointment.type}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(appointment.status)}>
                            {getStatusText(appointment.status)}
                          </Badge>
                          <span className="text-sm text-gray-600">{appointment.duration} мин</span>
                        </div>
                      </div>

                      {appointment.location && (
                        <div className="flex items-center space-x-1 text-sm text-gray-600 mb-2">
                          <MapPin className="w-4 h-4" />
                          <span>{appointment.location}</span>
                        </div>
                      )}

                      {appointment.notes && (
                        <p className="text-sm text-gray-700 mb-2">{appointment.notes}</p>
                      )}

                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Изменить
                        </Button>
                        <Button variant="outline" size="sm">
                          Отменить
                        </Button>
                        <Button size="sm">
                          Начать прием
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle>Управление записями</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-medium mb-2">Сегодня</h3>
                      <p className="text-2xl font-bold">8</p>
                      <p className="text-sm text-gray-600">Запланировано приемов</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-medium mb-2">Завтра</h3>
                      <p className="text-2xl font-bold">6</p>
                      <p className="text-sm text-gray-600">Запланировано приемов</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-medium mb-2">На неделе</h3>
                      <p className="text-2xl font-bold">23</p>
                      <p className="text-sm text-gray-600">Всего приемов</p>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h3 className="font-medium mb-4">Типы консультаций</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { type: 'Первичная консультация', count: 12, duration: '45 мин' },
                      { type: 'Повторная консультация', count: 18, duration: '30 мин' },
                      { type: 'Профилактический осмотр', count: 8, duration: '60 мин' },
                      { type: 'Телемедицина', count: 6, duration: '30 мин' }
                    ].map((item, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{item.type}</h4>
                            <p className="text-sm text-gray-600">Длительность: {item.duration}</p>
                          </div>
                          <span className="text-lg font-bold">{item.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reminders">
          <Card>
            <CardHeader>
              <CardTitle>Напоминания и уведомления</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">3</p>
                    <p className="text-sm text-gray-600">Высокий приоритет</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-600">7</p>
                    <p className="text-sm text-gray-600">Средний приоритет</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">12</p>
                    <p className="text-sm text-gray-600">Низкий приоритет</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {mockReminders.map((reminder) => (
                    <div key={reminder.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{reminder.patientName}</h3>
                        <p className="text-sm text-gray-600">{reminder.type}</p>
                        <p className="text-sm text-gray-500">Срок: {reminder.dueDate}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={getPriorityColor(reminder.priority)}>
                          {reminder.priority === 'high' ? 'Высокий' :
                           reminder.priority === 'medium' ? 'Средний' : 'Низкий'}
                        </Badge>
                        <Button variant="outline" size="sm">
                          Выполнено
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="availability">
          <Card>
            <CardHeader>
              <CardTitle>Настройка доступности</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-4">Рабочие часы</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { day: 'Понедельник', start: '09:00', end: '17:00', active: true },
                      { day: 'Вторник', start: '09:00', end: '17:00', active: true },
                      { day: 'Среда', start: '09:00', end: '17:00', active: true },
                      { day: 'Четверг', start: '09:00', end: '17:00', active: true },
                      { day: 'Пятница', start: '09:00', end: '16:00', active: true },
                      { day: 'Суббота', start: '10:00', end: '14:00', active: false },
                      { day: 'Воскресенье', start: '-', end: '-', active: false }
                    ].map((schedule, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="font-medium">{schedule.day}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">
                            {schedule.active ? `${schedule.start} - ${schedule.end}` : 'Выходной'}
                          </span>
                          <input 
                            type="checkbox" 
                            checked={schedule.active}
                            className="rounded"
                            readOnly
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-4">Настройки записи</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Минимальное время записи заранее:</span>
                      <select className="px-3 py-1 border rounded">
                        <option>2 часа</option>
                        <option>1 день</option>
                        <option>2 дня</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Максимальное время записи заранее:</span>
                      <select className="px-3 py-1 border rounded">
                        <option>1 месяц</option>
                        <option>2 месяца</option>
                        <option>3 месяца</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Длительность слота по умолчанию:</span>
                      <select className="px-3 py-1 border rounded">
                        <option>30 минут</option>
                        <option>45 минут</option>
                        <option>60 минут</option>
                      </select>
                    </div>
                  </div>
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
