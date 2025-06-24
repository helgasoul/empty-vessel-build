
import React, { useState } from 'react';
import { User, Settings, LogOut, HelpCircle, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const UserDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  
  const menuItems = [
    { 
      icon: <User className="w-4 h-4" />, 
      label: 'Мой профиль', 
      href: '/profile' 
    },
    { 
      icon: <Settings className="w-4 h-4" />, 
      label: 'Настройки', 
      href: '/settings' 
    },
    { 
      icon: <Shield className="w-4 h-4" />, 
      label: 'Безопасность', 
      href: '/security' 
    },
    { 
      icon: <HelpCircle className="w-4 h-4" />, 
      label: 'Помощь', 
      href: '/help' 
    }
  ];
  
  const handleLogout = () => {
    // Placeholder for logout function
    console.log('Logout functionality to be implemented');
  };
  
  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-1 rounded-lg hover:bg-neutral-100 transition-colors"
        aria-label="Меню пользователя"
      >
        <Avatar className="w-8 h-8">
          <AvatarImage src={user?.user_metadata?.avatar_url || ''} alt={user?.email || 'Пользователь'} />
          <AvatarFallback className="bg-gradient-to-r from-[#FF6B9D] to-[#9B59B6] text-white text-sm">
            {user?.email?.charAt(0).toUpperCase() || 'П'}
          </AvatarFallback>
        </Avatar>
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-neutral-200 z-20">
            {/* User Info */}
            <div className="p-4 border-b border-neutral-200">
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
            </div>
            
            {/* Menu Items */}
            <div className="py-2">
              {menuItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="flex items-center space-x-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-neutral-400">{item.icon}</span>
                  <span>{item.label}</span>
                </a>
              ))}
            </div>
            
            {/* Logout */}
            <div className="border-t border-neutral-200 py-2">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Выйти</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
