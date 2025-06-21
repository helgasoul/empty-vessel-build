
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RoleSwitcher from '@/components/debug/RoleSwitcher';

const AdminDashboard = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <header className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">⚙️ Дашборд Администратора</h1>
            <p className="text-gray-600">Добро пожаловать, Admin {user?.name}!</p>
          </div>
          <Button onClick={signOut} variant="outline">
            Выйти
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>👥 Управление пользователями</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Администрирование пользователей</p>
              <Button className="mt-4 w-full">Управление пользователями</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🏥 Управление клиниками</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Администрирование медучреждений</p>
              <Button className="mt-4 w-full">Управление клиниками</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📊 Аналитика</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Статистика и отчеты</p>
              <Button className="mt-4 w-full">Просмотр аналитики</Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <RoleSwitcher />
    </div>
  );
};

export default AdminDashboard;
