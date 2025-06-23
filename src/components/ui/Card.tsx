
import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  variant?: 'default' | 'gentle' | 'elevated' | 'gradient' | 'warm' | 'cool' | 'soft';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  children,
  className = '',
  hover = true
}) => {
  const baseClasses = `
    rounded-xl transition-all duration-300 backdrop-blur-sm
    ${hover ? 'hover-lift hover-glow' : ''}
  `;
  
  const variantClasses = {
    default: `
      bg-white/90 border border-gray-200 shadow-sm 
      hover:shadow-md border-opacity-50
    `,
    gentle: `
      bg-gradient-to-br from-white/95 to-gray-50/95 
      border border-gray-200/60 shadow-sm hover:shadow-lg
      backdrop-filter backdrop-blur-lg
    `,
    elevated: `
      bg-white/95 shadow-lg hover:shadow-xl border-0
      backdrop-filter backdrop-blur-md
    `,
    gradient: `
      bg-gradient-to-br from-[#FF6B9D]/5 via-white/90 to-[#9B59B6]/5 
      border border-[#FF6B9D]/20 shadow-md hover:shadow-lg
      backdrop-filter backdrop-blur-lg
    `,
    warm: `
      bg-gradient-to-br from-[#FF9A8B]/10 via-white/90 to-[#FF6B9D]/10 
      border border-[#FF9A8B]/20 shadow-md hover:shadow-lg
      animate-gentle-fade-in
    `,
    cool: `
      bg-gradient-to-br from-[#26D0CE]/10 via-white/90 to-[#A8E6CF]/10 
      border border-[#26D0CE]/20 shadow-md hover:shadow-lg
      animate-gentle-fade-in
    `,
    soft: `
      bg-gradient-to-br from-[#A8E6CF]/10 via-white/95 to-[#26D0CE]/5 
      border border-[#A8E6CF]/30 shadow-sm hover:shadow-md
      animate-gentle-fade-in
    `
  };
  
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  return (
    <div 
      className={cn(
        baseClasses,
        variantClasses[variant],
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => (
  <div className={cn("mb-4", className)}>
    {children}
  </div>
);

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  gradient?: boolean;
}

export const CardTitle: React.FC<CardTitleProps> = ({ 
  children, 
  className, 
  gradient = false 
}) => (
  <h3 className={cn(
    "text-xl font-semibold leading-tight tracking-tight",
    gradient ? "text-gradient-warm" : "text-gray-800",
    className
  )}>
    {children}
  </h3>
);

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className }) => (
  <div className={cn("text-gray-600", className)}>
    {children}
  </div>
);

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className }) => (
  <div className={cn("mt-4 pt-4 border-t border-gray-100", className)}>
    {children}
  </div>
);
