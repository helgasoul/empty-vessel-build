
// YTime Design System - UI Components Export
export { Button } from './Button';
export { Card, CardHeader, CardTitle, CardContent, CardFooter } from './Card';
export { Input, Textarea } from './Input';
export { Badge, StatusBadge, PriorityBadge } from './Badge';
export { Avatar, AvatarGroup } from './Avatar';
export { 
  FloatingHearts, 
  GentleSpinner, 
  WarmPulse, 
  HeartbeatLoader, 
  WaveLoader, 
  SkeletonLoader 
} from './Loading';

// Re-export existing components for compatibility
export { Progress } from './progress';
export { Skeleton } from './skeleton';
export { Separator } from './separator';
export { Toaster } from './toaster';
export { ThemeToggle } from './theme-toggle';

// Types
export type { ButtonProps } from './button';

// Re-export Avatar and Badge components with both naming conventions for compatibility
export { Avatar as AvatarImage, Avatar as AvatarFallback } from './Avatar';
export { Badge as BadgeVariants } from './Badge';
