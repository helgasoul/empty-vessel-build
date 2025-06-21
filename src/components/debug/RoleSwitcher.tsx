
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';

const RoleSwitcher = () => {
  const { user, switchRole } = useAuth();
  
  if (!user) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
      <div className="text-sm font-medium mb-2 text-gray-700">
        🔄 Тест: {user.role}
      </div>
      <div className="flex space-x-2">
        <button 
          onClick={() => switchRole('patient')}
          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
            user.role === 'patient' 
              ? 'bg-blue-500 text-white' 
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          }`}
        >
          Пациент
        </button>
        <button 
          onClick={() => switchRole('doctor')}
          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
            user.role === 'doctor' 
              ? 'bg-green-500 text-white' 
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
        >
          Врач
        </button>
        <button 
          onClick={() => switchRole('admin')}
          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
            user.role === 'admin' 
              ? 'bg-red-500 text-white' 
              : 'bg-red-100 text-red-700 hover:bg-red-200'
          }`}
        >
          Админ
        </button>
      </div>
    </div>
  );
};

export default RoleSwitcher;
