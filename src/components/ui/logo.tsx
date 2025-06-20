
import React from 'react';

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

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className={`${sizeClasses[size]} flex items-center justify-center`}>
        <img
          src="/lovable-uploads/5ac94c15-2b2b-47a6-89ea-9e0163d76e7b.png"
          alt="PREVENT Logo"
          className="w-full h-full object-contain"
        />
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <span className={`${textSizeClasses[size]} font-montserrat font-bold bg-gradient-to-r from-feminine-lavender-500 to-feminine-pink-500 bg-clip-text text-transparent`}>
            PREVENT
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
