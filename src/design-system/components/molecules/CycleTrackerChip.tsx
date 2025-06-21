
/**
 * PREVENT Design System - CycleTrackerChip Molecule
 * Menstrual cycle phase indicator with icon
 */

import React from 'react';
import { Circle, Heart, Flower2, Moon } from 'lucide-react';
import { Badge } from '../atoms/Badge';
import { cn } from '@/lib/utils';

export interface CycleTrackerChipProps {
  phase: 'menstrual' | 'follicular' | 'ovulation' | 'luteal';
  day?: number;
  totalDays?: number;
  className?: string;
}

const CycleTrackerChip: React.FC<CycleTrackerChipProps> = ({
  phase,
  day,
  totalDays,
  className
}) => {
  const phaseConfig = {
    menstrual: {
      label: 'Менструация',
      icon: Circle,
      variant: 'menstruation' as const,
      color: 'border-berry-300 bg-berry-50',
    },
    follicular: {
      label: 'Фолликулярная',
      icon: Flower2,
      variant: 'fertility' as const,
      color: 'border-sage-300 bg-sage-50',
    },
    ovulation: {
      label: 'Овуляция',
      icon: Heart,
      variant: 'ovulation' as const,
      color: 'border-coral-300 bg-coral-50',
    },
    luteal: {
      label: 'Лютеиновая',
      icon: Moon,
      variant: 'info' as const,
      color: 'border-sage-300 bg-sage-50',
    },
  };

  const config = phaseConfig[phase];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200',
        config.color,
        className
      )}
    >
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5" aria-hidden="true" />
        <Badge variant={config.variant} size="sm">
          {config.label}
        </Badge>
      </div>
      
      {day && totalDays && (
        <div className="text-body-small text-text-secondary">
          День {day} из {totalDays}
        </div>
      )}
    </div>
  );
};

export { CycleTrackerChip };
