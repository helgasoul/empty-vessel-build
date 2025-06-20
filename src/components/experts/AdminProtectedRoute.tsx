
import React from 'react';
import ProtectedRoute from '@/components/rbac/ProtectedRoute';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  return (
    <ProtectedRoute 
      requiredRole="admin"
      errorTitle="Недостаточно прав администратора"
      errorMessage="У вас нет прав администратора для доступа к управлению системой."
    >
      {children}
    </ProtectedRoute>
  );
};

export default AdminProtectedRoute;
