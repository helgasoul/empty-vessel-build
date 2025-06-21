
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRoles } from '@/hooks/useUserRoles';
import { UserRole } from '@/types/user';

interface RoleContextType {
  roles: UserRole[];
  primaryRole: UserRole | null;
  hasRole: (role: UserRole) => boolean;
  isAdmin: boolean;
  isDoctor: boolean;
  isPatient: boolean;
  isClinic: boolean;
  isLaboratory: boolean;
  isLoading: boolean;
  setUserRole: (role: UserRole) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const useRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { data: userRoles, isLoading } = useUserRoles();
  const [localRole, setLocalRole] = useState<UserRole | null>(null);
  
  const roles: UserRole[] = userRoles?.map(r => r.role) || [];
  const primaryRole = roles.length > 0 ? roles[0] : localRole;

  // Load role from localStorage for demo purposes
  useEffect(() => {
    const savedRole = localStorage.getItem('userRole') as UserRole;
    if (savedRole && !user) {
      setLocalRole(savedRole);
      console.log('🔄 Загружена роль из localStorage:', savedRole);
    }
  }, [user]);

  const hasRole = (role: UserRole): boolean => {
    return roles.includes(role) || localRole === role;
  };

  const setUserRole = (role: UserRole) => {
    setLocalRole(role);
    localStorage.setItem('userRole', role);
    console.log('🔄 Роль пользователя обновлена:', role);
  };

  const isAdmin = hasRole('admin');
  const isDoctor = hasRole('doctor');
  const isPatient = hasRole('patient');
  const isClinic = hasRole('clinic');
  const isLaboratory = hasRole('laboratory');

  const value: RoleContextType = {
    roles,
    primaryRole,
    hasRole,
    isAdmin,
    isDoctor,
    isPatient,
    isClinic,
    isLaboratory,
    isLoading,
    setUserRole
  };

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
};
