
import React, { useState } from 'react';
import { Menu, Search } from 'lucide-react';
import { Breadcrumbs } from './Breadcrumbs';
import { NotificationDropdown } from './NotificationDropdown';
import { UserDropdown } from './UserDropdown';

interface TopNavigationProps {
  onMenuClick: () => void;
  onSearchClick: () => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({ onMenuClick, onSearchClick }) => {
  const [notifications] = useState([
    {
      id: '1',
      title: 'Новая рекомендация',
      message: 'Рекомендуем пройти обследование молочных желез',
      type: 'info' as const,
      time: '5 мин назад',
      unread: true
    },
    {
      id: '2',
      title: 'Напоминание',
      message: 'Время принять витамины',
      type: 'warning' as const,
      time: '1 час назад',
      unread: true
    }
  ]);
  
  return (
    <header className="bg-white border-b border-neutral-200 lg:ml-64 transition-all duration-300 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Mobile Menu Button */}
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
          aria-label="Открыть меню"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        {/* Breadcrumbs */}
        <div className="hidden lg:block">
          <Breadcrumbs />
        </div>
        
        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Search Button */}
          <button 
            onClick={onSearchClick}
            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
            aria-label="Поиск"
          >
            <Search className="w-5 h-5 text-neutral-600" />
          </button>
          
          {/* Notifications */}
          <NotificationDropdown notifications={notifications} />
          
          {/* User Menu */}
          <UserDropdown />
        </div>
      </div>
    </header>
  );
};
