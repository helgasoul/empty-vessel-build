
import React from 'react';
import { Heart, Sparkles } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showText = true, 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  const subtextSizeClasses = {
    sm: 'text-xs',
    md: 'text-xs',
    lg: 'text-sm'
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className={`${sizeClasses[size]} prevent-gradient-primary rounded-2xl flex items-center justify-center relative overflow-hidden shadow-lg`}>
        {/* Фоновое сияние */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
        
        {/* Основная иконка */}
        <div className="relative flex items-center justify-center">
          <Heart className={`${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6'} text-white`} fill="currentColor" />
          
          {/* Декоративная звездочка */}
          <Sparkles className={`${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-3 h-3'} text-white/80 absolute -top-1 -right-1`} />
        </div>
        
        {/* Мягкое свечение */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-feminine-lavender-300/30 to-feminine-pink-300/30 animate-glow" />
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <span className={`${textSizeClasses[size]} font-montserrat font-bold bg-gradient-to-r from-feminine-lavender-500 to-feminine-pink-500 bg-clip-text text-transparent`}>
            PREVENT
          </span>
          <p className={`${subtextSizeClasses[size]} text-gray-600 dark:text-gray-400 font-roboto leading-tight`}>
            Забота о женском здоровье
          </p>
        </div>
      )}
    </div>
  );
};

export default Logo;
