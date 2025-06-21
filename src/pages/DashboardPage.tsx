
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import PatientDashboard from '@/components/dashboards/PatientDashboard';
import DoctorDashboard from '@/components/dashboards/DoctorDashboard';  
import AdminDashboard from '@/components/dashboards/AdminDashboard';

const DashboardPage = () => {
  const { user, hasRole, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Загрузка дашборда...</p>
        </div>
      </div>
    );
  }

  if (hasRole('patient')) {
    return <PatientDashboard />;
  }
  
  if (hasRole('doctor')) {
    return <DoctorDashboard />;
  }
  
  if (hasRole('admin')) {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Неопределенная роль пользователя</h1>
        <p className="text-gray-600 mb-4">Пользователь: {user?.email}</p>
        <p className="text-gray-600">Обратитесь к администратору для назначения роли</p>
      </div>
    </div>
  );
};

export default DashboardPage;
