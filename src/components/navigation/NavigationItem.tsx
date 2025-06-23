
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';

interface NavigationItemType {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: string;
  children?: NavigationItemType[];
}

interface NavigationItemProps {
  item: NavigationItemType;
  isActive: boolean;
  onClose: () => void;
}

export const NavigationItem: React.FC<NavigationItemProps> = ({ item, isActive, onClose }) => {
  const location = useLocation();
  const isCurrentRoute = location.pathname === item.href;
  
  return (
    <a
      href={item.href}
      onClick={onClose}
      className={`
        flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 group
        ${isCurrentRoute || isActive 
          ? 'bg-gradient-to-r from-[#FF6B9D]/10 to-[#9B59B6]/10 text-[#FF6B9D] border-r-2 border-[#FF6B9D]' 
          : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
        }
      `}
    >
      <div className="flex items-center space-x-3">
        <span className={`transition-colors ${isCurrentRoute || isActive ? 'text-[#FF6B9D]' : 'text-neutral-400 group-hover:text-neutral-600'}`}>
          {item.icon}
        </span>
        <span className="font-medium">{item.label}</span>
      </div>
      
      {item.badge && (
        <Badge 
          variant={item.badge === 'Обновлено' ? 'secondary' : 'primary'} 
          size="sm"
          className="ml-2"
        >
          {item.badge}
        </Badge>
      )}
    </a>
  );
};
