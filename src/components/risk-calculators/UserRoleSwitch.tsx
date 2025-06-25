
import React from 'react';
import { motion } from 'framer-motion';
import { User, UserCheck, Stethoscope } from 'lucide-react';
import { UserRole } from '../../types/risk-calculator.types';

interface UserRoleSwitchProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const UserRoleSwitch: React.FC<UserRoleSwitchProps> = ({ currentRole, onRoleChange }) => {
  const roles = [
    { id: 'patient', label: 'Пациент', icon: User, color: 'purple' },
    { id: 'doctor', label: 'Врач', icon: UserCheck, color: 'blue' },
    { id: 'specialist', label: 'Специалист', icon: Stethoscope, color: 'green' }
  ];

  const getColorClasses = (color: string, isActive: boolean) => {
    if (isActive) {
      switch (color) {
        case 'purple':
          return 'bg-purple-600 text-white shadow-md shadow-purple-200';
        case 'blue':
          return 'bg-blue-600 text-white shadow-md shadow-blue-200';
        case 'green':
          return 'bg-green-600 text-white shadow-md shadow-green-200';
        default:
          return 'bg-gray-600 text-white shadow-md';
      }
    }
    return 'text-gray-600 hover:bg-gray-100';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center space-x-2 bg-white rounded-xl p-2 shadow-lg border border-gray-200 backdrop-blur-sm"
    >
      {roles.map(({ id, label, icon: Icon, color }) => (
        <motion.button
          key={id}
          onClick={() => onRoleChange(id as UserRole)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`
            flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200
            ${getColorClasses(color, currentRole === id)}
          `}
        >
          <Icon className="w-4 h-4" />
          <span className="text-sm font-medium">{label}</span>
        </motion.button>
      ))}
    </motion.div>
  );
};
