
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Search, Calendar, User, Shield, AlertTriangle } from "lucide-react";

interface ActivityLog {
  id: string;
  user_id: string;
  action_type: string;
  action_description: string;
  ip_address: string;
  user_agent: string;
  resource_type: string;
  resource_id: string;
  created_at: string;
  metadata: any;
}

const AdminActivityLogs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Mock data - в реальном приложении это будет загружаться из базы данных
  const mockLogs: ActivityLog[] = [
    {
      id: '1',
      user_id: 'user1',
      action_type: 'LOGIN',
      action_description: 'Пользователь вошел в систему',
      ip_address: '192.168.1.1',
      user_agent: 'Mozilla/5.0...',
      resource_type: 'authentication',
      resource_id: 'auth1',
      created_at: '2025-06-20T10:30:00Z',
      metadata: { login_method: 'email' }
    },
    {
      id: '2',
      user_id: 'admin1',
      action_type: 'ROLE_ASSIGN',
      action_description: 'Назначена роль врача пользователю',
      ip_address: '192.168.1.2',
      user_agent: 'Mozilla/5.0...',
      resource_type: 'user_role',
      resource_id: 'role1',
      created_at: '2025-06-20T11:15:00Z',
      metadata: { assigned_role: 'doctor', target_user: 'user2' }
    }
  ];

  const getActionTypeColor = (type: string) => {
    switch (type) {
      case 'LOGIN': return 'bg-green-100 text-green-800';
      case 'LOGOUT': return 'bg-gray-100 text-gray-800';
      case 'ROLE_ASSIGN': return 'bg-blue-100 text-blue-800';
      case 'DATA_ACCESS': return 'bg-purple-100 text-purple-800';
      case 'SECURITY_VIOLATION': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredLogs = mockLogs.filter(log => {
    const matchesSearch = log.action_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || log.action_type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Логи активности</h2>
          <p className="text-gray-600">Мониторинг действий пользователей в системе</p>
        </div>
        <Button variant="outline">
          <Calendar className="w-4 h-4 mr-2" />
          Экспорт отчета
        </Button>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">1,234</p>
                <p className="text-sm text-gray-600">Всего действий</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">89</p>
                <p className="text-sm text-gray-600">Активных пользователей</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-gray-600">Админ действий</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-gray-600">Предупреждения</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Фильтры */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Поиск в логах</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Поиск по описанию или пользователю..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="filter">Тип действия</Label>
              <select
                id="filter"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">Все типы</option>
                <option value="LOGIN">Вход в систему</option>
                <option value="LOGOUT">Выход</option>
                <option value="ROLE_ASSIGN">Назначение ролей</option>
                <option value="DATA_ACCESS">Доступ к данным</option>
                <option value="SECURITY_VIOLATION">Нарушения безопасности</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Список логов */}
      <Card>
        <CardHeader>
          <CardTitle>Журнал активности</CardTitle>
          <CardDescription>
            Найдено записей: {filteredLogs.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <div key={log.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-3">
                    <Badge className={getActionTypeColor(log.action_type)}>
                      {log.action_type}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {new Date(log.created_at).toLocaleString('ru-RU')}
                    </span>
                    <span className="text-sm text-gray-500">IP: {log.ip_address}</span>
                  </div>
                  <p className="text-sm font-medium">{log.action_description}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Пользователь: {log.user_id}</span>
                    <span>Ресурс: {log.resource_type}</span>
                    {log.metadata && Object.keys(log.metadata).length > 0 && (
                      <details className="cursor-pointer">
                        <summary>Подробности</summary>
                        <pre className="mt-1 text-xs bg-gray-50 p-2 rounded">
                          {JSON.stringify(log.metadata, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminActivityLogs;
