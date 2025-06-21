
import React, { useState } from 'react';
import { UserRole } from '@/types/user';

interface AuthStateManagerProps {
  children: (state: {
    isLogin: boolean;
    selectedRole: UserRole;
    adminCode: string;
    formData: {
      email: string;
      password: string;
      fullName: string;
      confirmPassword: string;
    };
    setIsLogin: (value: boolean) => void;
    setSelectedRole: (role: UserRole) => void;
    setAdminCode: (code: string) => void;
    setFormData: React.Dispatch<React.SetStateAction<{
      email: string;
      password: string;
      fullName: string;
      confirmPassword: string;
    }>>;
    handleModeToggle: () => void;
  }) => React.ReactNode;
}

const AuthStateManager = ({ children }: AuthStateManagerProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  const [adminCode, setAdminCode] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: ''
  });

  const handleModeToggle = () => {
    setIsLogin(!isLogin);
    setSelectedRole('patient');
    setAdminCode('');
    setFormData({
      email: '',
      password: '',
      fullName: '',
      confirmPassword: ''
    });
  };

  return (
    <>
      {children({
        isLogin,
        selectedRole,
        adminCode,
        formData,
        setIsLogin,
        setSelectedRole,
        setAdminCode,
        setFormData,
        handleModeToggle
      })}
    </>
  );
};

export default AuthStateManager;
