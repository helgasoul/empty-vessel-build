
import React from 'react';
import { RadioGroup } from '@/components/ui/radio-group';
import { UserRole } from '@/types/user';
import RoleSelectorHeader from './RoleSelectorHeader';
import RoleOptionCard from './RoleOptionCard';
import AdminCodeInput from './AdminCodeInput';
import { roleOptions } from './roleOptions';

interface RoleSelectorProps {
  selectedRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  adminCode: string;
  onAdminCodeChange: (code: string) => void;
  isLoading: boolean;
}

const RoleSelector = ({ selectedRole, onRoleChange, adminCode, onAdminCodeChange, isLoading }: RoleSelectorProps) => {
  return (
    <div className="space-y-4">
      <RoleSelectorHeader />
      
      <RadioGroup 
        value={selectedRole} 
        onValueChange={(value) => onRoleChange(value as UserRole)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {roleOptions.map((option) => (
          <RoleOptionCard
            key={option.value}
            option={option}
            selectedRole={selectedRole}
            onRoleChange={onRoleChange}
          />
        ))}
      </RadioGroup>

      {selectedRole === 'admin' && (
        <AdminCodeInput
          adminCode={adminCode}
          onAdminCodeChange={onAdminCodeChange}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default RoleSelector;
