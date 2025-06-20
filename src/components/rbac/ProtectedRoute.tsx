
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, Loader2 } from "lucide-react";
import { useHasRole, AppRole } from '@/hooks/useUserRoles';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: AppRole;
  fallbackPath?: string;
  errorTitle?: string;
  errorMessage?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole, 
  fallbackPath = '/dashboard',
  errorTitle = "Недостаточно прав",
  errorMessage = "У вас нет необходимых прав для доступа к этой странице."
}) => {
  const { user } = useAuth();
  const { hasRole, isLoading } = useHasRole(requiredRole);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-lg">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Проверка прав доступа...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-6 h-6 text-amber-500" />
              <span>Требуется авторизация</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Для доступа к этой странице необходимо войти в систему.
            </p>
            <Button onClick={() => navigate('/auth')}>
              Войти в систему
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!hasRole) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-red-500" />
              <span>{errorTitle}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              {errorMessage}
            </p>
            <Button onClick={() => navigate(fallbackPath)}>
              Вернуться на главную
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
