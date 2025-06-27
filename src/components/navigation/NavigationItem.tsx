
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface NavigationItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
  badge?: number;
  isCollapsed?: boolean;
}

export const NavigationItem: React.FC<NavigationItemProps> = ({
  to,
  icon: Icon,
  label,
  badge,
  isCollapsed = false
}) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors hover:bg-gray-100 ${
          isActive ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-700'
        }`
      }
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      {!isCollapsed && (
        <>
          <span className="font-medium">{label}</span>
          {badge && badge > 0 && (
            <Badge variant="error" size="sm">
              {badge}
            </Badge>
          )}
        </>
      )}
    </NavLink>
  );
};
