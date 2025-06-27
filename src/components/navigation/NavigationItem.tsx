
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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

export const NavigationItem: React.FC<NavigationItemProps> = ({
  item,
  isActive,
  onClose
}) => {
  return (
    <NavLink
      to={item.href}
      onClick={onClose}
      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors hover:bg-gray-100 ${
        isActive ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-700'
      }`}
    >
      {item.icon}
      <span className="font-medium">{item.label}</span>
      {item.badge && (
        <Badge variant="secondary" size="sm">
          {item.badge}
        </Badge>
      )}
    </NavLink>
  );
};
