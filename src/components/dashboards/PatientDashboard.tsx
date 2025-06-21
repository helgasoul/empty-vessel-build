
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RoleSwitcher from '@/components/debug/RoleSwitcher';

const PatientDashboard = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <header className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">👩‍💼 Дашборд Пациента</h1>
            <p className="text-gray-600">Добро пожаловать, {user?.name}!</p>
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
              <CardTitle>🩺 Мое здоровье</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Отслеживайте свои показатели здоровья</p>
              <Button className="mt-4 w-full">Открыть профиль</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📅 Записи к врачам</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Управляйте записями на приемы</p>
              <Button className="mt-4 w-full">Записаться к врачу</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📊 Анализы</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Просматривайте результаты анализов</p>
              <Button className="mt-4 w-full">Мои анализы</Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <RoleSwitcher />
    </div>
  );
};

export default PatientDashboard;
