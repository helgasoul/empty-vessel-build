
import React from 'react';
import { UserRole } from '@/types/user';

interface DebugInfoSectionProps {
  isLogin: boolean;
  selectedRole: UserRole;
  adminCode: string;
}

const DebugInfoSection = ({ isLogin, selectedRole, adminCode }: DebugInfoSectionProps) => {
  const roleOptions = ['patient', 'doctor', 'admin', 'clinic', 'laboratory'];
  
  return (
    <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-600">
      <div><strong>Debug info:</strong></div>
      <div>Режим: {isLogin ? 'Вход' : 'Регистрация'}</div>
      <div>Выбранная роль: {selectedRole}</div>
      <div>Доступные роли: {roleOptions.join(', ')}</div>
      {selectedRole === 'admin' && (
        <div>Код админа введен: {adminCode ? 'Да' : 'Нет'}</div>
      )}
    </div>
  );
};

export default DebugInfoSection;
