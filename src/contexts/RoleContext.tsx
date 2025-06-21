
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRoles, UserRole } from '@/hooks/useUserRoles';

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
  
  const roles: UserRole[] = userRoles?.map(r => r.role) || [];
  const primaryRole = roles.length > 0 ? roles[0] : null;

  const hasRole = (role: UserRole): boolean => {
    return roles.includes(role);
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
    isLoading
  };

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
};
