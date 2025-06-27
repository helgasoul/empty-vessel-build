import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Heart, Activity, Moon, Flower } from 'lucide-react';

interface WomenHealthCardProps {
  title: string;
  description?: string;
  value?: string | number;
  status?: 'low' | 'medium' | 'high' | 'normal';
  type?: 'menstrual' | 'fertility' | 'pregnancy' | 'menopause' | 'general';
  trend?: 'up' | 'down' | 'stable';
  className?: string;
  children?: React.ReactNode;
}

const typeIcons = {
  menstrual: Heart,
  fertility: Flower,
  pregnancy: Activity,
  menopause: Moon,
  general: Activity
};

const typeColors = {
  menstrual: 'bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200',
  fertility: 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200',
  pregnancy: 'bg-gradient-to-br from-blue-50 to-sky-50 border-blue-200',
  menopause: 'bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200',
  general: 'bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200'
};

const statusVariants = {
  low: 'success',
  medium: 'warning',
  high: 'destructive',
  normal: 'secondary'
} as const;

export const WomenHealthCard: React.FC<WomenHealthCardProps> = ({
  title,
  description,
  value,
  status = 'normal',
  type = 'general',
  trend,
  className,
  children
}) => {
  const IconComponent = typeIcons[type];
  
  return (
    <Card className={cn(
      'prevent-card transition-all duration-300 hover:shadow-lg',
      typeColors[type],
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <IconComponent className="w-5 h-5 text-gray-600" />
            <CardTitle className="text-base font-semibold text-gray-800">
              {title}
            </CardTitle>
          </div>
          {status && (
            <Badge variant={statusVariants[status]} className="text-xs">
              {status === 'normal' ? 'Норма' : 
               status === 'low' ? 'Низкий' :
               status === 'medium' ? 'Средний' : 'Высокий'}
            </Badge>
          )}
        </div>
        {description && (
          <CardDescription className="text-sm text-gray-600 mt-1">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      
      {(value || children) && (
        <CardContent className="pt-0">
          {value && (
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-800">
                {value}
              </span>
              {trend && (
                <span className={cn(
                  'text-sm font-medium',
                  trend === 'up' ? 'text-green-600' :
                  trend === 'down' ? 'text-red-600' : 'text-gray-500'
                )}>
                  {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}
                </span>
              )}
            </div>
          )}
          {children}
        </CardContent>
      )}
    </Card>
  );
};

export default WomenHealthCard;
