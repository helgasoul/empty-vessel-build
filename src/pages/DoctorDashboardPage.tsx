
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useIsDoctor } from '@/hooks/useUserRoles';
import DoctorDashboard from '@/components/doctor/DoctorDashboard';
import ProtectedRoute from '@/components/rbac/ProtectedRoute';

const DoctorDashboardPage = () => {
  return (
    <ProtectedRoute 
      requiredRole="doctor"
      errorTitle="Доступ только для врачей"
      errorMessage="У вас нет прав врача для доступа к этой панели. Обратитесь к администратору для назначения роли врача."
    >
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <DoctorDashboard />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default DoctorDashboardPage;
