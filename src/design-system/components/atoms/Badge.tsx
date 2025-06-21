
/**
 * PREVENT Design System - Badge Atom
 * Status badge with color coding and icons for health data
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BadgeProps {
  variant?: 'low' | 'medium' | 'high' | 'success' | 'warning' | 'error' | 'info' | 'menstruation' | 'ovulation' | 'fertility';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ variant = 'info', size = 'md', icon: Icon, children, className }, ref) => {
    const baseClasses = 'inline-flex items-center rounded-full font-medium transition-all duration-200';
    
    const sizeClasses = {
      sm: 'px-2 py-1 text-caption gap-1',
      md: 'px-3 py-1.5 text-label gap-1.5',
      lg: 'px-4 py-2 text-body-small gap-2',
    };
    
    const variantClasses = {
      low: 'bg-status-low/10 text-status-low border border-status-low/20',
      medium: 'bg-status-medium/10 text-amber-700 border border-status-medium/20',
      high: 'bg-status-high/10 text-status-high border border-status-high/20',
      success: 'bg-status-success/10 text-status-success border border-status-success/20',
      warning: 'bg-status-warning/10 text-amber-700 border border-status-warning/20',
      error: 'bg-status-error/10 text-status-error border border-status-error/20',
      info: 'bg-primary-100 text-primary-700 border border-primary-200',
      menstruation: 'bg-gradient-100 text-gradient-700 border border-gradient-200',
      ovulation: 'bg-accent-100 text-accent-700 border border-accent-200',
      fertility: 'bg-status-success/10 text-status-success border border-status-success/20',
    };
    
    const iconSize = {
      sm: 12,
      md: 14,
      lg: 16,
    };

    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        role="img"
        aria-label={`${variant} status: ${children}`}
      >
        {Icon && <Icon size={iconSize[size]} aria-hidden="true" />}
        <span>{children}</span>
      </div>
    );
  }
);

Badge.displayName = 'PreventBadge';

export { Badge };
