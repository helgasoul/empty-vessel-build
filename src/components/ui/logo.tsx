
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
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  };

  const textSizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <div className={`${sizeClasses[size]} flex items-center justify-center`}>
        <img
          src="/lovable-uploads/532d80ed-2c10-4c8a-8315-d7e3f7122ebb.png"
          alt="PREVENT Logo"
          className="w-full h-full object-contain rounded-lg"
          style={{ 
            background: 'transparent',
            mixBlendMode: 'multiply'
          }}
        />
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <span className={`${textSizeClasses[size]} font-montserrat font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent`}>
            PREVENT
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
