
// YTime Design System - UI Components Export
export { Button } from './Button';
export { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter,
  CardDescription 
} from './card'; // Export shadcn card components as primary
export { 
  Card as YTimeCard,
  CardHeader as YTimeCardHeader,
  CardTitle as YTimeCardTitle,
  CardContent as YTimeCardContent,
  CardFooter as YTimeCardFooter
} from './Card'; // Export custom YTime card components with different names
export { Input, Textarea } from './Input';
export { Badge, StatusBadge, PriorityBadge } from './Badge';
export { Avatar, AvatarGroup, AvatarImage, AvatarFallback } from './Avatar';
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

// Re-export components from lowercase files for compatibility
export * from './button';
export * from './badge';
export * from './avatar';
