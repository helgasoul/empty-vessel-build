
/**
 * PREVENT Design System - DataRow Molecule
 * Date + source + indicator display for medical data
 */

import React from 'react';
import { Badge } from '../atoms/Badge';
import { cn } from '@/lib/utils';

export interface DataRowProps {
  date: string;
  source: string;
  value: string | number;
  status?: 'low' | 'medium' | 'high' | 'success' | 'warning' | 'error';
  unit?: string;
  onClick?: () => void;
  className?: string;
}

const DataRow: React.FC<DataRowProps> = ({
  date,
  source,
  value,
  status,
  unit,
  onClick,
  className
}) => {
  const isClickable = !!onClick;

  return (
    <div
      className={cn(
        'flex items-center justify-between py-3 px-4 rounded-lg border border-border-light bg-background-tertiary transition-all duration-200',
        isClickable && 'cursor-pointer hover:bg-background-secondary hover:shadow-sm',
        className
      )}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      } : undefined}
    >
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <div className="text-body-small text-text-secondary">{date}</div>
          <div className="text-caption text-text-secondary bg-background-secondary px-2 py-1 rounded">
            {source}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="text-body font-medium text-text-primary">
            {value}
            {unit && <span className="text-text-secondary ml-1">{unit}</span>}
          </div>
        </div>
        
        {status && (
          <Badge variant={status} size="sm">
            {status === 'low' ? 'Норма' : 
             status === 'medium' ? 'Внимание' : 
             status === 'high' ? 'Риск' :
             status === 'success' ? 'Хорошо' :
             status === 'warning' ? 'Осторожно' : 'Плохо'}
          </Badge>
        )}
      </div>
    </div>
  );
};

export { DataRow };
