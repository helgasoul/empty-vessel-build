
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { User, Stethoscope, Crown, Building2, FlaskConical, CheckCircle } from 'lucide-react';
import { UserRole } from '@/types/user';

interface RoleSelectorProps {
  selectedRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  adminCode: string;
  onAdminCodeChange: (code: string) => void;
  isLoading: boolean;
}

const RoleSelector = ({ selectedRole, onRoleChange, adminCode, onAdminCodeChange, isLoading }: RoleSelectorProps) => {
  const roleOptions = [
    {
      value: 'patient' as UserRole,
      label: 'Пациент',
      description: 'Хочу следить за своим здоровьем',
      icon: User,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      textColor: 'text-white',
      borderColor: 'border-blue-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      value: 'doctor' as UserRole,
      label: 'Врач',
      description: 'Медицинский специалист',
      icon: Stethoscope,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      textColor: 'text-white',
      borderColor: 'border-green-500',
      bgGradient: 'from-green-50 to-emerald-50',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      value: 'admin' as UserRole,
      label: 'Администратор',
      description: 'Управление платформой',
      icon: Crown,
      color: 'bg-red-500',
      hoverColor: 'hover:bg-red-600',
      textColor: 'text-white',
      borderColor: 'border-red-500',
      bgGradient: 'from-red-50 to-rose-50',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      requiresCode: true
    },
    {
      value: 'clinic' as UserRole,
      label: 'Клиника',
      description: 'Медицинское учреждение',
      icon: Building2,
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      textColor: 'text-white',
      borderColor: 'border-purple-500',
      bgGradient: 'from-purple-50 to-violet-50',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      value: 'laboratory' as UserRole,
      label: 'Лаборатория',
      description: 'Лабораторные исследования',
      icon: FlaskConical,
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600',
      textColor: 'text-white',
      borderColor: 'border-orange-500',
      bgGradient: 'from-orange-50 to-amber-50',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="text-center">
        <Label className="text-xl font-bold text-gray-900 mb-2 block">
          Выберите вашу роль в системе
        </Label>
        <p className="text-sm text-gray-600 mb-4">
          Выберите роль, которая лучше всего описывает ваше положение
        </p>
      </div>
      
      <RadioGroup 
        value={selectedRole} 
        onValueChange={(value) => onRoleChange(value as UserRole)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {roleOptions.map((option) => (
          <div key={option.value} className="relative">
            <RadioGroupItem 
              value={option.value} 
              id={option.value} 
              className="sr-only"
            />
            <Label 
              htmlFor={option.value} 
              className={`
                group flex flex-col items-center p-6 rounded-xl border-2 cursor-pointer transition-all duration-300
                ${selectedRole === option.value 
                  ? `${option.borderColor} bg-gradient-to-br ${option.bgGradient} shadow-lg scale-105` 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md hover:scale-102'
                }
              `}
            >
              <div className={`
                w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300
                ${selectedRole === option.value 
                  ? `${option.color} ${option.textColor} shadow-lg` 
                  : `${option.iconBg} group-hover:scale-110`
                }
              `}>
                <option.icon className={`
                  w-8 h-8 transition-all duration-300
                  ${selectedRole === option.value 
                    ? option.textColor 
                    : option.iconColor
                  }
                `} />
              </div>
              
              <div className="text-center">
                <div className={`
                  font-bold text-lg mb-2 transition-colors duration-300
                  ${selectedRole === option.value 
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
              
              {selectedRole === option.value && (
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
        ))}
      </RadioGroup>

      {selectedRole === 'admin' && (
        <div className="space-y-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <Crown className="w-5 h-5 text-red-600" />
            <Label htmlFor="adminCode" className="font-roboto font-semibold text-red-800">
              Код администратора
            </Label>
          </div>
          <Input
            id="adminCode"
            type="password"
            placeholder="Введите код доступа администратора"
            value={adminCode}
            onChange={(e) => onAdminCodeChange(e.target.value)}
            required
            className="font-roboto border-red-300 focus:border-red-500"
            disabled={isLoading}
          />
          <p className="text-xs text-red-600">
            Обратитесь к главному администратору для получения кода доступа
          </p>
        </div>
      )}
    </div>
  );
};

export default RoleSelector;
