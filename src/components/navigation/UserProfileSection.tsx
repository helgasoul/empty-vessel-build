import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

const UserProfileSection: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
        {user?.user_metadata?.avatar_url ? (
          <img 
            src={user.user_metadata.avatar_url} 
            alt="Avatar" 
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <span className="text-white text-sm font-medium">
            {user?.email?.[0]?.toUpperCase() || 'U'}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-900">
          {user?.user_metadata?.full_name || user?.email || 'Пользователь'}
        </p>
        <p className="text-xs text-gray-500">
          {user?.email || 'email@example.com'}
        </p>
      </div>
    </div>
  );
};

export default UserProfileSection;
