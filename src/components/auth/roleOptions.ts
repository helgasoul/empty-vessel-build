
import { User, Stethoscope, Crown, Building2, FlaskConical } from 'lucide-react';
import { UserRole } from '@/types/user';

export interface RoleOption {
  value: UserRole;
  label: string;
  description: string;
  icon: typeof User;
  color: string;
  hoverColor: string;
  textColor: string;
  borderColor: string;
  bgGradient: string;
  iconBg: string;
  iconColor: string;
  requiresCode?: boolean;
}

export const roleOptions: RoleOption[] = [
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
