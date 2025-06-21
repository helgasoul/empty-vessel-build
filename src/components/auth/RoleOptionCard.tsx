
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroupItem } from '@/components/ui/radio-group';
import { CheckCircle, LucideIcon } from 'lucide-react';
import { UserRole } from '@/types/user';

interface RoleOption {
  value: UserRole;
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
  hoverColor: string;
  textColor: string;
  borderColor: string;
  bgGradient: string;
  iconBg: string;
  iconColor: string;
  requiresCode?: boolean;
}

interface RoleOptionCardProps {
  option: RoleOption;
  selectedRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const RoleOptionCard = ({ option, selectedRole, onRoleChange }: RoleOptionCardProps) => {
  const isSelected = selectedRole === option.value;

  return (
    <div className="relative">
      <RadioGroupItem 
        value={option.value} 
        id={option.value} 
        className="sr-only"
      />
      <Label 
        htmlFor={option.value} 
        className={`
          group flex flex-col items-center p-6 rounded-xl border-2 cursor-pointer transition-all duration-300
          ${isSelected 
            ? `${option.borderColor} bg-gradient-to-br ${option.bgGradient} shadow-lg scale-105` 
            : 'border-gray-200 hover:border-gray-300 hover:shadow-md hover:scale-102'
          }
        `}
        onClick={() => onRoleChange(option.value)}
      >
        <div className={`
          w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300
          ${isSelected 
            ? `${option.color} ${option.textColor} shadow-lg` 
            : `${option.iconBg} group-hover:scale-110`
          }
        `}>
          <option.icon className={`
            w-8 h-8 transition-all duration-300
            ${isSelected 
              ? option.textColor 
              : option.iconColor
            }
          `} />
        </div>
        
        <div className="text-center">
          <div className={`
            font-bold text-lg mb-2 transition-colors duration-300
            ${isSelected 
              ? 'text-gray-900' 
              : 'text-gray-700 group-hover:text-gray-900'
            }
          `}>
            {option.label}
          </div>
          <div className="text-sm text-gray-600 mb-3">
            {option.description}
          </div>
        </div>
        
        {isSelected && (
          <div className="absolute -top-2 -right-2">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center
              ${option.color} ${option.textColor} shadow-lg animate-scale-in
            `}>
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
        )}
        
        {option.requiresCode && (
          <div className="absolute top-2 left-2">
            <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow">
              Код доступа
            </div>
          </div>
        )}
      </Label>
    </div>
  );
};

export default RoleOptionCard;
