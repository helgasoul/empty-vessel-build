
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success: "border-transparent bg-green-100 text-green-800 hover:bg-green-200",
        warning: "border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
        // Специальные варианты для женского здоровья
        menstrual: "border-transparent bg-pink-100 text-pink-800 hover:bg-pink-200",
        fertility: "border-transparent bg-green-100 text-green-800 hover:bg-green-200",
        pregnancy: "border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200",
        menopause: "border-transparent bg-purple-100 text-purple-800 hover:bg-purple-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

// Специализированные компоненты для женского здоровья
export interface StatusBadgeProps extends BadgeProps {
  status: 'low' | 'medium' | 'high' | 'critical';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className, children, ...props }) => {
  const statusVariants = {
    low: 'success',
    medium: 'warning', 
    high: 'destructive',
    critical: 'destructive'
  } as const;

  return (
    <Badge 
      variant={statusVariants[status]} 
      className={cn('font-medium', className)}
      {...props}
    >
      {children}
    </Badge>
  );
};

export interface PriorityBadgeProps extends BadgeProps {
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, className, children, ...props }) => {
  const priorityVariants = {
    low: 'secondary',
    medium: 'warning',
    high: 'destructive', 
    urgent: 'destructive'
  } as const;

  return (
    <Badge 
      variant={priorityVariants[priority]}
      className={cn('font-semibold', className)}
      {...props}
    >
      {children}
    </Badge>
  );
};

export { Badge, badgeVariants }
