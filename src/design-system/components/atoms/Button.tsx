
/**
 * PREVENT Design System - Button Atom
 * Enhanced button component with gradient support and medical context
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'outline' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
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
    const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
    
    const sizeClasses = {
      sm: 'px-3 py-2 text-label gap-2 h-9',
      md: 'px-4 py-2.5 text-body gap-2 h-10',
      lg: 'px-6 py-3 text-body-large gap-3 h-12',
    };
    
    const variantClasses = {
      primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500 shadow-sm hover:shadow-md',
      secondary: 'bg-gradient-500 text-white hover:bg-gradient-600 focus:ring-gradient-500 shadow-sm hover:shadow-md',
      tertiary: 'bg-background-secondary text-text-primary hover:bg-background-tertiary border border-border-light focus:ring-primary-500 shadow-sm hover:shadow-md',
      outline: 'border border-primary-500 text-primary-500 hover:bg-primary-50 focus:ring-primary-500',
      ghost: 'text-text-primary hover:bg-background-secondary focus:ring-primary-500',
      gradient: 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white hover:shadow-lg hover:scale-105 focus:ring-purple-500 shadow-md',
    };
    
    const iconSize = {
      sm: 16,
      md: 18,
      lg: 20,
    };

    const LoadingSpinner = () => (
      <div className="animate-spin rounded-full border-2 border-transparent border-t-current" 
           style={{ width: iconSize[size], height: iconSize[size] }} />
    );

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
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <LoadingSpinner />
        ) : Icon && iconPosition === 'left' ? (
          <Icon size={iconSize[size]} aria-hidden="true" />
        ) : null}
        
        {children}
        
        {!loading && Icon && iconPosition === 'right' && (
          <Icon size={iconSize[size]} aria-hidden="true" />
        )}
      </button>
    );
  }
);

Button.displayName = 'PreventButton';

export { Button };
