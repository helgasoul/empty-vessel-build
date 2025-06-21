
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RoleSwitcher from '@/components/debug/RoleSwitcher';

const DoctorDashboard = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <header className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">👩‍⚕️ Дашборд Врача</h1>
            <p className="text-gray-600">Добро пожаловать, Dr. {user?.name}!</p>
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
              <CardTitle>👥 Мои пациенты</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Список ваших пациентов</p>
              <Button className="mt-4 w-full">Управление пациентами</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📅 Расписание</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Управляйте вашим расписанием</p>
              <Button className="mt-4 w-full">Настроить расписание</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🧮 Калькуляторы</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Медицинские калькуляторы</p>
              <Button className="mt-4 w-full">Открыть калькуляторы</Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <RoleSwitcher />
    </div>
  );
};

export default DoctorDashboard;
