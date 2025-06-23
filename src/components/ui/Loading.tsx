
import React from 'react';
import { cn } from '@/lib/utils';

interface FloatingHeartsProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'warm' | 'cool';
}

export const FloatingHearts: React.FC<FloatingHeartsProps> = ({ 
  size = 'md',
  color = 'primary' 
}) => {
  const sizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3'
  };

  const colorClasses = {
    primary: 'bg-[#FF6B9D]',
    secondary: 'bg-[#26D0CE]',
    warm: 'bg-[#FF9A8B]',
    cool: 'bg-[#A8E6CF]'
  };

  return (
    <div className="flex items-center justify-center space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            sizeClasses[size],
            colorClasses[color],
            'rounded-full animate-gentle-bounce'
          )}
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
};

interface GentleSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'warm' | 'cool';
}

export const GentleSpinner: React.FC<GentleSpinnerProps> = ({ 
  size = 'md',
  color = 'primary' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10'
  };

  const colorClasses = {
    primary: 'border-[#FF6B9D] border-t-transparent',
    secondary: 'border-[#26D0CE] border-t-transparent',
    warm: 'border-[#FF9A8B] border-t-transparent',
    cool: 'border-[#A8E6CF] border-t-transparent'
  };
  
  return (
    <div 
      className={cn(
        sizeClasses[size],
        colorClasses[color],
        'border-2 rounded-full animate-spin'
      )} 
    />
  );
};

interface WarmPulseProps {
  children: React.ReactNode;
  variant?: 'primary' | 'warm' | 'cool' | 'soft';
}

export const WarmPulse: React.FC<WarmPulseProps> = ({ 
  children, 
  variant = 'primary' 
}) => {
  const variantClasses = {
    primary: 'from-[#FF6B9D]/20 to-[#9B59B6]/20',
    warm: 'from-[#FF9A8B]/20 to-[#FF6B9D]/20',
    cool: 'from-[#26D0CE]/20 to-[#A8E6CF]/20',
    soft: 'from-[#A8E6CF]/15 to-[#26D0CE]/15'
  };

  return (
    <div className="animate-warm-pulse">
      <div className={cn(
        'bg-gradient-to-r rounded-lg p-4',
        variantClasses[variant]
      )}>
        {children}
      </div>
    </div>
  );
};

interface HeartbeatLoaderProps {
  size?: 'sm' | 'md' | 'lg';
}

export const HeartbeatLoader: React.FC<HeartbeatLoaderProps> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex items-center justify-center">
      <div className={cn(
        sizeClasses[size],
        'text-[#FF6B9D] animate-floating-hearts'
      )}>
        <svg 
          viewBox="0 0 24 24" 
          fill="currentColor"
          className="w-full h-full"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </div>
    </div>
  );
};

interface WaveLoaderProps {
  color?: 'primary' | 'secondary' | 'warm' | 'cool';
}

export const WaveLoader: React.FC<WaveLoaderProps> = ({ color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-[#FF6B9D]',
    secondary: 'bg-[#26D0CE]',
    warm: 'bg-[#FF9A8B]',
    cool: 'bg-[#A8E6CF]'
  };

  return (
    <div className="flex items-center justify-center space-x-1">
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={cn(
            'w-1 h-8 rounded-full animate-gentle-bounce',
            colorClasses[color]
          )}
          style={{ 
            animationDelay: `${i * 0.1}s`,
            animationDuration: '1.4s'
          }}
        />
      ))}
    </div>
  );
};

interface SkeletonLoaderProps {
  className?: string;
  variant?: 'primary' | 'warm' | 'cool';
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  className,
  variant = 'primary' 
}) => {
  const variantClasses = {
    primary: 'from-[#FF6B9D]/10 via-white/50 to-[#9B59B6]/10',
    warm: 'from-[#FF9A8B]/10 via-white/50 to-[#FF6B9D]/10',
    cool: 'from-[#26D0CE]/10 via-white/50 to-[#A8E6CF]/10'
  };

  return (
    <div 
      className={cn(
        'animate-pulse bg-gradient-to-r rounded-lg',
        variantClasses[variant],
        className
      )} 
    />
  );
};
