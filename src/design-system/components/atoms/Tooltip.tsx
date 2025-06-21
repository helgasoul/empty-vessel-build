
/**
 * PREVENT Design System - Tooltip Atom
 * Medical term explainer with proper accessibility
 */

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export interface TooltipProps {
  content: string;
  children: React.ReactElement;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  children, 
  position = 'top',
  delay = 500,
  className 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-text-primary',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-text-primary',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-text-primary',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-text-primary',
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {React.cloneElement(children, {
        'aria-describedby': isVisible ? 'tooltip' : undefined,
      })}
      
      {isVisible && (
        <div
          id="tooltip"
          role="tooltip"
          className={cn(
            'absolute z-50 px-3 py-2 text-caption font-medium text-white bg-text-primary rounded-md shadow-lg animate-fade-in max-w-xs',
            positionClasses[position],
            className
          )}
        >
          {content}
          <div
            className={cn(
              'absolute w-0 h-0 border-4',
              arrowClasses[position]
            )}
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
};

export { Tooltip };
