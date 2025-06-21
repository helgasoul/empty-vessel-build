
/**
 * PREVENT Design System - HealthCard Molecule
 * Organ system status card with CTA
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Badge } from '../atoms/Badge';
import { Button } from '../atoms/Button';
import { cn } from '@/lib/utils';

export interface HealthCardProps {
  title: string;
  icon: LucideIcon;
  status: 'low' | 'medium' | 'high';
  value?: string | number;
  subtitle?: string;
  lastUpdated?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const HealthCard: React.FC<HealthCardProps> = ({
  title,
  icon: Icon,
  status,
  value,
  subtitle,
  lastUpdated,
  actionLabel,
  onAction,
  className
}) => {
  return (
    <div
      className={cn(
        'bg-background-secondary rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-border-light animate-fade-in',
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-background-tertiary rounded-lg">
            <Icon className="w-6 h-6 text-coral-500" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-h4 text-text-primary font-medium">{title}</h3>
            {subtitle && (
              <p className="text-body-small text-text-secondary">{subtitle}</p>
            )}
          </div>
        </div>
        <Badge variant={status} size="sm">
          {status === 'low' ? 'Низкий' : status === 'medium' ? 'Средний' : 'Высокий'}
        </Badge>
      </div>

      {value && (
        <div className="mb-4">
          <div className="text-h2 font-semibold text-text-primary">{value}</div>
        </div>
      )}

      <div className="flex items-center justify-between">
        {lastUpdated && (
          <p className="text-caption text-text-secondary">
            Обновлено: {lastUpdated}
          </p>
        )}
        {actionLabel && onAction && (
          <Button
            variant="tertiary"
            size="sm"
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export { HealthCard };
