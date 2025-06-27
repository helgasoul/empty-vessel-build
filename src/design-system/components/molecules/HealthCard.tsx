
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface HealthCardProps {
  title: string;
  description?: string;
  value?: string | number;
  unit?: string;
  status?: 'normal' | 'warning' | 'critical';
  icon?: LucideIcon;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const HealthCard: React.FC<HealthCardProps> = ({
  title,
  description,
  value,
  unit,
  status = 'normal',
  icon: Icon,
  action,
  className
}) => {
  const statusColors = {
    normal: 'bg-green-50 border-green-200',
    warning: 'bg-yellow-50 border-yellow-200',
    critical: 'bg-red-50 border-red-200'
  };

  const statusBadgeColors = {
    normal: 'success' as const,
    warning: 'warning' as const,
    critical: 'destructive' as const
  };

  return (
    <Card className={cn(statusColors[status], className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {Icon && <Icon className="w-5 h-5" />}
            <CardTitle className="text-base">{title}</CardTitle>
          </div>
          <Badge variant={statusBadgeColors[status]} size="sm">
            {status === 'normal' ? 'Норма' : status === 'warning' ? 'Внимание' : 'Критично'}
          </Badge>
        </div>
        {description && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {value && (
          <div className="flex items-baseline space-x-1 mb-2">
            <span className="text-2xl font-bold">{value}</span>
            {unit && <span className="text-sm text-gray-500">{unit}</span>}
          </div>
        )}
        {action && (
          <Button variant="outline" size="sm" onClick={action.onClick}>
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
