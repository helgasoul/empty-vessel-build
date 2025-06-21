
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';
import { useUserRoles } from '@/hooks/useUserRoles';
import LandingPage from '@/pages/LandingPage';
import PatientDashboard from '@/components/dashboards/PatientDashboard';
import DoctorDashboard from '@/components/dashboards/DoctorDashboard';
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import RoleSelectionModal from '@/components/auth/RoleSelectionModal';
import { Loader2 } from 'lucide-react';

const MainPageRouter = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { data: userRoles, isLoading: rolesLoading } = useUserRoles();
  const { primaryRole, isLoading: roleContextLoading } = useRole();

  // Показываем лендинг, если пользователь не авторизован
  if (!user || authLoading) {
    return <LandingPage />;
  }

  // Показываем загрузку, пока проверяем роли
  if (rolesLoading || roleContextLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-lg">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Загрузка профиля...</span>
        </div>
      </div>
    );
  }

  // Если у пользователя нет ролей, показываем модал выбора роли
  if (!userRoles || userRoles.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <RoleSelectionModal 
          isOpen={true} 
          onClose={() => {}} 
          userId={user.id} 
        />
      </div>
    );
  }

  // Рендерим дашборд в зависимости от основной роли пользователя
  switch (primaryRole) {
    case 'admin':
      return <AdminDashboard />;
    case 'doctor':
      return <DoctorDashboard />;
    case 'clinic':
      return <PatientDashboard />; // Временно используем пациентский дашборд
    case 'laboratory':
      return <PatientDashboard />; // Временно используем пациентский дашборд
    case 'patient':
    default:
      return <PatientDashboard />;
  }
};

export default MainPageRouter;
