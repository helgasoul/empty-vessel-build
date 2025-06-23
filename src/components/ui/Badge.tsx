
import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'warm' | 'cool' | 'soft' | 'success' | 'warning' | 'error' | 'outline' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  pulse?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  children,
  className,
  pulse = false,
  ...props
}) => {
  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-full 
    transition-all duration-300 border backdrop-blur-sm
    ${props.onClick ? 'cursor-pointer hover:scale-105' : ''}
  `;

  const variantClasses = {
    default: `
      bg-gray-100/80 text-gray-700 border-gray-200
    `,
    primary: `
      bg-gradient-to-r from-[#FF6B9D]/20 to-[#9B59B6]/20 
      text-[#FF6B9D] border-[#FF6B9D]/30
    `,
    secondary: `
      bg-[#26D0CE]/20 text-[#26D0CE] border-[#26D0CE]/30
    `,
    warm: `
      bg-gradient-to-r from-[#FF9A8B]/20 to-[#FF6B9D]/20 
      text-[#FF9A8B] border-[#FF9A8B]/30
    `,
    cool: `
      bg-gradient-to-r from-[#26D0CE]/20 to-[#A8E6CF]/20 
      text-[#26D0CE] border-[#26D0CE]/30
    `,
    soft: `
      bg-[#A8E6CF]/20 text-[#26D0CE] border-[#A8E6CF]/30
    `,
    success: `
      bg-green-100/80 text-green-700 border-green-200
    `,
    warning: `
      bg-yellow-100/80 text-yellow-700 border-yellow-200
    `,
    error: `
      bg-red-100/80 text-red-700 border-red-200
    `,
    destructive: `
      bg-red-100/80 text-red-700 border-red-200
    `,
    outline: `
      bg-transparent text-gray-700 border-gray-300 hover:bg-gray-50
    `
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  const pulseClass = pulse ? 'animate-warm-pulse' : '';

  return (
    <span
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        pulseClass,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled';
  children?: React.ReactNode;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, children }) => {
  const statusConfig = {
    active: { variant: 'success' as const, text: 'Активно', pulse: true },
    inactive: { variant: 'default' as const, text: 'Неактивно', pulse: false },
    pending: { variant: 'warning' as const, text: 'Ожидание', pulse: true },
    completed: { variant: 'cool' as const, text: 'Завершено', pulse: false },
    cancelled: { variant: 'error' as const, text: 'Отменено', pulse: false }
  };

  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} pulse={config.pulse}>
      {children || config.text}
    </Badge>
  );
};

interface PriorityBadgeProps {
  priority: 'low' | 'medium' | 'high' | 'critical';
  children?: React.ReactNode;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, children }) => {
  const priorityConfig = {
    low: { variant: 'soft' as const, text: 'Низкий', pulse: false },
    medium: { variant: 'warm' as const, text: 'Средний', pulse: false },
    high: { variant: 'primary' as const, text: 'Высокий', pulse: false },
    critical: { variant: 'error' as const, text: 'Критический', pulse: true }
  };

  const config = priorityConfig[priority];

  return (
    <Badge variant={config.variant} pulse={config.pulse}>
      {children || config.text}
    </Badge>
  );
};
