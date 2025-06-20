
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';

const MainPageRouter = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (user) {
    // Dashboard уже содержит всю необходимую структуру (NavigationMenu, MobileNavigation, etc.)
    return <Dashboard />;
  }

  // Для неавторизованных пользователей показываем лендинг
  return <Index />;
};

export default MainPageRouter;
