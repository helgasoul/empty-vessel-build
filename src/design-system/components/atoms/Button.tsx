
/**
 * PREVENT Design System - Button Atom
 * Accessible button component with loading states and focus management
 */

import React from 'react';
import { LucideIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'destructive' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    icon: Icon, 
    iconPosition = 'left',
    loading = false,
    fullWidth = false,
    children, 
    className,
    disabled,
    ...props 
  }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const sizeClasses = {
      sm: 'px-3 py-2 text-body-small gap-1.5 h-8',
      md: 'px-4 py-2.5 text-body gap-2 h-10',
      lg: 'px-6 py-3 text-body-large gap-2.5 h-12',
    };
    
    const variantClasses = {
      primary: 'bg-coral-500 text-white hover:bg-coral-600 focus:ring-coral-500 shadow-sm hover:shadow-md',
      secondary: 'bg-sage-500 text-white hover:bg-sage-600 focus:ring-sage-500 shadow-sm hover:shadow-md',
      tertiary: 'bg-background-secondary text-text-primary border border-border-medium hover:bg-background-tertiary focus:ring-coral-500',
      destructive: 'bg-status-error text-white hover:bg-red-600 focus:ring-status-error shadow-sm hover:shadow-md',
      ghost: 'text-text-primary hover:bg-background-secondary focus:ring-coral-500',
    };
    
    const iconSize = {
      sm: 16,
      md: 18,
      lg: 20,
    };

    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          sizeClasses[size],
          variantClasses[variant],
          fullWidth && 'w-full',
          className
        )}
        disabled={isDisabled}
        {...props}
      >
        {loading ? (
          <Loader2 size={iconSize[size]} className="animate-spin" aria-hidden="true" />
        ) : (
          Icon && iconPosition === 'left' && <Icon size={iconSize[size]} aria-hidden="true" />
        )}
        
        <span>{children}</span>
        
        {!loading && Icon && iconPosition === 'right' && (
          <Icon size={iconSize[size]} aria-hidden="true" />
        )}
      </button>
    );
  }
);

Button.displayName = 'PreventButton';

export { Button };
