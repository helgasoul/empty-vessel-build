
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, FileText, Settings, Stethoscope, Clock, Heart, Award, TrendingUp, MessageSquare, Activity, Video } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const DoctorDashboard = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Мои пациенты',
      description: 'Просмотр списка пациентов',
      icon: Users,
      action: () => navigate('/doctor/patients'),
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Расписание',
      description: 'Управление расписанием приемов',
      icon: Calendar,
      action: () => navigate('/doctor/schedule'),
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Консультации',
      description: 'Онлайн консультации',
      icon: Stethoscope,
      action: () => navigate('/doctor/consultations'),
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Медицинские записи',
      description: 'Создание и просмотр записей',
      icon: FileText,
      action: () => navigate('/doctor/records'),
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const todayAppointments = [
    { time: "14:00", patient: "Анна Иванова", type: "Консультация", status: "active" },
    { time: "15:30", patient: "Мария Петрова", type: "Планирование беременности", status: "upcoming" },
    { time: "16:00", patient: "Екатерина Смирнова", type: "Результаты анализов", status: "upcoming" },
    { time: "17:00", patient: "Ольга Козлова", type: "Профилактический осмотр", status: "upcoming" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-md border-b border-green-200/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 w-12 h-12 rounded-full flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Панель врача</h1>
                <p className="text-green-600 font-medium">Доктор Ольга Пучкова • Маммолог</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-100 text-green-800 px-3 py-1">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Онлайн
              </Badge>
              <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white">
                <Video className="w-4 h-4 mr-2" />
                Начать консультацию
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-blue-100 text-sm font-medium">Активные пациенты</div>
                  <div className="text-3xl font-bold">124</div>
                  <div className="text-blue-200 text-xs">+12 за неделю</div>
                </div>
                <div className="bg-white/20 rounded-full p-3">
                  <Users className="w-8 h-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-green-100 text-sm font-medium">Консультаций сегодня</div>
                  <div className="text-3xl font-bold">8</div>
                  <div className="text-green-200 text-xs">из 12 запланированных</div>
                </div>
                <div className="bg-white/20 rounded-full p-3">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-purple-100 text-sm font-medium">Рейтинг врача</div>
                  <div className="text-3xl font-bold">4.9</div>
                  <div className="text-purple-200 text-xs">234 отзыва</div>
                </div>
                <div className="bg-white/20 rounded-full p-3">
                  <Award className="w-8 h-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-orange-100 text-sm font-medium">Доход в месяц</div>
                  <div className="text-3xl font-bold">₽280K</div>
                  <div className="text-orange-200 text-xs">+18% к прошлому</div>
                </div>
                <div className="bg-white/20 rounded-full p-3">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Schedule */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 rounded-t-lg border-b">
                <CardTitle className="flex items-center text-gray-900">
                  <Calendar className="w-5 h-5 mr-2 text-green-600" />
                  Расписание на сегодня
                </CardTitle>
                <CardDescription>
                  {todayAppointments.length} приемов запланировано
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {todayAppointments.map((appointment, index) => (
                    <div key={index} className={`p-4 rounded-lg border-l-4 transition-all duration-200 hover:shadow-md ${
                      appointment.status === 'active' 
                        ? 'bg-green-50 border-green-500 shadow-sm' 
                        : 'bg-gray-50 border-gray-300'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            appointment.status === 'active' 
                              ? 'bg-green-500' 
                              : 'bg-gray-400'
                          }`}>
                            <Heart className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{appointment.patient}</div>
                            <div className="text-sm text-gray-600">{appointment.type}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-900 text-lg">{appointment.time}</div>
                          {appointment.status === 'active' && (
                            <Badge className="bg-green-500 text-white">
                              <Activity className="w-3 h-3 mr-1" />
                              Сейчас
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {quickActions.map((action, index) => (
                <Card key={index} className="shadow-xl border-0 bg-white/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group cursor-pointer" onClick={action.action}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg text-gray-900 group-hover:text-purple-600 transition-colors duration-200">
                          {action.title}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {action.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg border-b">
                <CardTitle className="text-gray-900">Быстрые действия</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                <Button className="w-full justify-start bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Ответить на вопросы (5)
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Создать запись
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Настройки профиля
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Недавняя активность</CardTitle>
                <CardDescription>Последние действия в системе</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Консультация с пациентом Анна С.</p>
                      <p className="text-xs text-gray-500">2 часа назад</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Обновлено расписание на завтра</p>
                      <p className="text-xs text-gray-500">4 часа назад</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Новый запрос на консультацию</p>
                      <p className="text-xs text-gray-500">6 часов назад</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
