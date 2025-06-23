
import React from 'react';
import { Settings, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';

export const UserProfileSection: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="space-y-3">
      {/* User Info */}
      <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-[#FF6B9D]/5 to-[#9B59B6]/5 rounded-lg">
        <Avatar className="w-10 h-10">
          <AvatarImage src={user?.avatar_url || ''} alt={user?.email || 'Пользователь'} />
          <AvatarFallback className="bg-gradient-to-r from-[#FF6B9D] to-[#9B59B6] text-white text-sm">
            {user?.email?.charAt(0).toUpperCase() || 'П'}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-neutral-900 truncate">
            {user?.email || 'Пользователь'}
          </p>
          <p className="text-xs text-neutral-500">
            Персональный план
          </p>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="flex space-x-2">
        <a
          href="/profile"
          className="flex-1 flex items-center justify-center space-x-2 py-2 px-3 text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
        >
          <User className="w-4 h-4" />
          <span>Профиль</span>
        </a>
        <a
          href="/settings"
          className="flex-1 flex items-center justify-center space-x-2 py-2 px-3 text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
        >
          <Settings className="w-4 h-4" />
          <span>Настройки</span>
        </a>
      </div>
    </div>
  );
};
