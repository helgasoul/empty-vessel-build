
import React from 'react';
import { Heart, Shield, Sparkles, FolderOpen, MessageCircle, Calendar, Link } from 'lucide-react';
import { NavigationItem } from '../navigation/NavigationItem';
import { UserProfileSection } from '../navigation/UserProfileSection';

interface NavigationItemType {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: string;
  children?: NavigationItemType[];
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentModule?: string;
}

const navigationItems: NavigationItemType[] = [
  {
    id: 'overview',
    label: 'Обзор здоровья',
    icon: <Heart className="w-5 h-5" />,
    href: '/dashboard'
  },
  {
    id: 'risks',
    label: 'Мои риски',
    icon: <Shield className="w-5 h-5" />,
    href: '/risk-assessment',
    badge: 'Обновлено'
  },
  {
    id: 'recommendations',
    label: 'Рекомендации',
    icon: <Sparkles className="w-5 h-5" />,
    href: '/recommendations',
    badge: '3'
  },
  {
    id: 'health-vault',
    label: 'Мои данные',
    icon: <FolderOpen className="w-5 h-5" />,
    href: '/health-vault'
  },
  {
    id: 'chat',
    label: 'ИИ-помощник',
    icon: <MessageCircle className="w-5 h-5" />,
    href: '/ai-health'
  },
  {
    id: 'calendar',
    label: 'Календарь здоровья',
    icon: <Calendar className="w-5 h-5" />,
    href: '/medical-calendar'
  },
  {
    id: 'integrations',
    label: 'Интеграции',
    icon: <Link className="w-5 h-5" />,
    href: '/medical-integrations'
  }
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, currentModule }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-0
      `}>
        {/* Logo Section */}
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#FF6B9D] to-[#9B59B6] rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-[#FF6B9D] to-[#9B59B6] bg-clip-text text-transparent">
                YTime
              </h1>
              <p className="text-sm text-neutral-500">Забота о себе</p>
            </div>
          </div>
        </div>
        
        {/* Navigation Items */}
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {navigationItems.map((item) => (
            <NavigationItem 
              key={item.id}
              item={item}
              isActive={currentModule === item.id}
              onClose={onClose}
            />
          ))}
        </nav>
        
        {/* User Profile Section */}
        <div className="border-t border-neutral-200 p-4">
          <UserProfileSection />
        </div>
      </div>
    </>
  );
};
