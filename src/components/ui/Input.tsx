
import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'feminine' | 'warm' | 'cool';
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  variant = 'default',
  label,
  error,
  icon,
  rightIcon,
  className,
  ...props
}) => {
  const baseClasses = `
    w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 
    focus:outline-none placeholder:text-gray-400 font-medium
    backdrop-blur-sm bg-white/80
  `;

  const variantClasses = {
    default: `
      border-gray-200 focus:border-[#FF6B9D] focus:ring-0 
      focus:shadow-[0_0_0_3px_rgba(255,107,157,0.1)]
    `,
    feminine: `
      border-[#FF6B9D]/30 focus:border-[#FF6B9D] 
      focus:shadow-[0_0_0_3px_rgba(255,107,157,0.15)]
      bg-gradient-to-r from-white/90 to-pink-50/30
    `,
    warm: `
      border-[#FF9A8B]/30 focus:border-[#FF9A8B] 
      focus:shadow-[0_0_0_3px_rgba(255,154,139,0.15)]
      bg-gradient-to-r from-white/90 to-orange-50/30
    `,
    cool: `
      border-[#26D0CE]/30 focus:border-[#26D0CE] 
      focus:shadow-[0_0_0_3px_rgba(38,208,206,0.15)]
      bg-gradient-to-r from-white/90 to-teal-50/30
    `
  };

  const errorClasses = error ? 'border-red-300 focus:border-red-500' : '';

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        <input
          className={cn(
            baseClasses,
            variantClasses[variant],
            errorClasses,
            icon ? 'pl-10' : '',
            rightIcon ? 'pr-10' : '',
            className
          )}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600 mt-1 animate-gentle-fade-in">
          {error}
        </p>
      )}
    </div>
  );
};

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'default' | 'feminine' | 'warm' | 'cool';
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  variant = 'default',
  label,
  error,
  className,
  ...props
}) => {
  const baseClasses = `
    w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 
    focus:outline-none placeholder:text-gray-400 font-medium
    backdrop-blur-sm bg-white/80 resize-vertical min-h-[100px]
  `;

  const variantClasses = {
    default: `
      border-gray-200 focus:border-[#FF6B9D] focus:ring-0 
      focus:shadow-[0_0_0_3px_rgba(255,107,157,0.1)]
    `,
    feminine: `
      border-[#FF6B9D]/30 focus:border-[#FF6B9D] 
      focus:shadow-[0_0_0_3px_rgba(255,107,157,0.15)]
      bg-gradient-to-r from-white/90 to-pink-50/30
    `,
    warm: `
      border-[#FF9A8B]/30 focus:border-[#FF9A8B] 
      focus:shadow-[0_0_0_3px_rgba(255,154,139,0.15)]
      bg-gradient-to-r from-white/90 to-orange-50/30
    `,
    cool: `
      border-[#26D0CE]/30 focus:border-[#26D0CE] 
      focus:shadow-[0_0_0_3px_rgba(38,208,206,0.15)]
      bg-gradient-to-r from-white/90 to-teal-50/30
    `
  };

  const errorClasses = error ? 'border-red-300 focus:border-red-500' : '';

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <textarea
        className={cn(
          baseClasses,
          variantClasses[variant],
          errorClasses,
          className
        )}
        {...props}
      />
      
      {error && (
        <p className="text-sm text-red-600 mt-1 animate-gentle-fade-in">
          {error}
        </p>
      )}
    </div>
  );
};
