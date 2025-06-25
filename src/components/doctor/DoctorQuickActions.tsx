
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  UserPlus, 
  Calendar, 
  Calculator, 
  FileText, 
  Bell, 
  MessageSquare,
  Activity,
  Heart
} from "lucide-react";

const DoctorQuickActions = () => {
  const quickStats = {
    newPatients: 3,
    pendingResults: 8,
    todayAppointments: 5,
    unreadMessages: 12
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {/* Статистика */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Новые пациенты</CardTitle>
          <UserPlus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{quickStats.newPatients}</div>
          <p className="text-xs text-muted-foreground">за эту неделю</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Консультации сегодня</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{quickStats.todayAppointments}</div>
          <p className="text-xs text-muted-foreground">запланировано</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Новые анализы</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{quickStats.pendingResults}</div>
          <p className="text-xs text-muted-foreground">
            требуют внимания
            {quickStats.pendingResults > 5 && (
              <Badge variant="destructive" className="ml-2">Высокий</Badge>
            )}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Сообщения</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{quickStats.unreadMessages}</div>
          <p className="text-xs text-muted-foreground">непрочитанных</p>
        </CardContent>
      </Card>

      {/* Быстрые действия */}
      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle>Быстрые действия</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <Calculator className="w-4 h-4" />
              <span>Калькулятор рисков</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <UserPlus className="w-4 h-4" />
              <span>Добавить пациента</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Расписание</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Просмотр анализов</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>Мониторинг пациентов</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <Heart className="w-4 h-4" />
              <span>Профилактика</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorQuickActions;
