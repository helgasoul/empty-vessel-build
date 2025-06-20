
import { useAuth } from '@/contexts/AuthContext';
import { useUserRoles } from '@/hooks/useUserRoles';

export const useAdminCheck = () => {
  const { user } = useAuth();
  const { data: userRoles, isLoading } = useUserRoles();

  const isAdmin = userRoles?.some(role => role.role === 'admin') || false;

  return {
    isAdmin,
    isLoading,
    user
  };
};
