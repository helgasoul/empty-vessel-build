
import React from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'circular' | 'rounded' | 'square';
  fallback?: string;
  online?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = '',
  size = 'md',
  variant = 'circular',
  fallback,
  online,
  className,
  children
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20'
  };

  const variantClasses = {
    circular: 'rounded-full',
    rounded: 'rounded-lg',
    square: 'rounded-none'
  };

  const baseClasses = `
    relative inline-block bg-gradient-to-br from-[#FF6B9D]/20 to-[#9B59B6]/20
    border-2 border-white shadow-lg overflow-hidden transition-all duration-300
    hover:shadow-xl hover:scale-105
  `;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  const onlineIndicatorSize = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
    '2xl': 'w-5 h-5'
  };

  return (
    <div className={cn(
      baseClasses,
      sizeClasses[size],
      variantClasses[variant],
      className
    )}>
      {children || (
        <>
          {src ? (
            <img
              src={src}
              alt={alt}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#FF6B9D] to-[#9B59B6] text-white font-medium">
              {fallback ? getInitials(fallback) : '?'}
            </div>
          )}
        </>
      )}
      
      {online !== undefined && (
        <div className={cn(
          'absolute bottom-0 right-0 rounded-full border-2 border-white',
          onlineIndicatorSize[size],
          online ? 'bg-green-400 animate-warm-pulse' : 'bg-gray-400'
        )} />
      )}
    </div>
  );
};

// Compatibility components for shadcn/ui usage patterns
interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
}

export const AvatarImage: React.FC<AvatarImageProps> = ({ src, alt, className, ...props }) => (
  <img
    src={src}
    alt={alt}
    className={cn("w-full h-full object-cover", className)}
    {...props}
  />
);

interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const AvatarFallback: React.FC<AvatarFallbackProps> = ({ children, className, ...props }) => (
  <div 
    className={cn(
      "w-full h-full flex items-center justify-center bg-gradient-to-br from-[#FF6B9D] to-[#9B59B6] text-white font-medium",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

interface AvatarGroupProps {
  avatars: Array<{
    src?: string;
    alt?: string;
    fallback?: string;
  }>;
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'circular' | 'rounded' | 'square';
  className?: string;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  avatars,
  max = 3,
  size = 'md',
  variant = 'circular',
  className
}) => {
  const displayAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  return (
    <div className={cn('flex -space-x-2', className)}>
      {displayAvatars.map((avatar, index) => (
        <Avatar
          key={index}
          src={avatar.src}
          alt={avatar.alt}
          fallback={avatar.fallback}
          size={size}
          variant={variant}
          className="ring-2 ring-white"
        />
      ))}
      
      {remainingCount > 0 && (
        <div className={cn(
          'flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200',
          'border-2 border-white ring-2 ring-white text-gray-600 font-medium text-sm',
          'transition-all duration-300 hover:bg-gradient-to-br hover:from-[#FF6B9D]/20 hover:to-[#9B59B6]/20',
          size === 'xs' ? 'w-6 h-6' : '',
          size === 'sm' ? 'w-8 h-8' : '',
          size === 'md' ? 'w-10 h-10' : '',
          size === 'lg' ? 'w-12 h-12' : '',
          size === 'xl' ? 'w-16 h-16' : '',
          variant === 'circular' ? 'rounded-full' : '',
          variant === 'rounded' ? 'rounded-lg' : '',
          variant === 'square' ? 'rounded-none' : ''
        )}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
};
