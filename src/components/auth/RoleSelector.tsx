
import React from 'react';
import { UserRole } from '@/types/auth';

interface RoleSelectorProps {
  selectedRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  isLoading?: boolean;
}

const RoleSelector = ({ selectedRole, onRoleChange, isLoading }: RoleSelectorProps) => {
  const roles = [
    {
      value: 'patient' as UserRole,
      icon: '👩‍💼',
      title: 'Пациент',
      description: 'Хочу следить за своим здоровьем'
    },
    {
      value: 'doctor' as UserRole,
      icon: '👩‍⚕️',
      title: 'Врач',
      description: 'Хочу работать с пациентами на платформе'
    },
    {
      value: 'admin' as UserRole,
      icon: '⚙️',
      title: 'Администратор',
      description: 'Управление платформой и пользователями'
    }
  ];

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700">
        Выберите роль:
      </label>
      <div className="grid grid-cols-1 gap-3">
        {roles.map((role) => (
          <button
            key={role.value}
            type="button"
            disabled={isLoading}
            onClick={() => onRoleChange(role.value)}
            className={`p-4 border rounded-lg text-left transition-colors disabled:opacity-50 ${
              selectedRole === role.value 
                ? 'border-purple-500 bg-purple-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="font-medium">{role.icon} {role.title}</div>
            <div className="text-sm text-gray-500">
              {role.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RoleSelector;
