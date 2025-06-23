
import React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  `inline-flex items-center justify-center gap-2 font-medium 
   transition-all duration-300 focus:outline-none focus:ring-2 
   focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
   hover-lift relative overflow-hidden whitespace-nowrap`,
  {
    variants: {
      variant: {
        primary: `
          bg-gradient-to-r from-[#FF6B9D] to-[#9B59B6] text-white 
          hover:shadow-lg focus:ring-[#FF6B9D] shadow-md
          before:absolute before:inset-0 before:bg-white before:opacity-0 
          before:transition-opacity hover:before:opacity-10
        `,
        secondary: `
          bg-[#26D0CE] text-white hover:bg-[#1fb8b6] 
          shadow-md hover:shadow-lg focus:ring-[#26D0CE]
        `,
        outline: `
          border-2 border-[#FF6B9D] text-[#FF6B9D] hover:bg-[#FF6B9D] 
          hover:text-white focus:ring-[#FF6B9D] bg-transparent
        `,
        ghost: `
          text-[#FF6B9D] hover:bg-[#FF6B9D] hover:bg-opacity-10 
          focus:ring-[#FF6B9D] bg-transparent
        `,
        gradient: `
          bg-gradient-to-r from-[#FF6B9D] via-[#9B59B6] to-[#26D0CE] 
          text-white hover:shadow-xl focus:ring-[#FF6B9D] shadow-lg
          transform hover:scale-105 animate-gentle-scale
        `,
        warm: `
          bg-gradient-to-r from-[#FF9A8B] to-[#FF6B9D] text-white 
          hover:shadow-lg focus:ring-[#FF9A8B] shadow-md animate-warm-pulse
        `,
        cool: `
          bg-gradient-to-r from-[#26D0CE] to-[#A8E6CF] text-white 
          hover:shadow-lg focus:ring-[#26D0CE] shadow-md animate-cool-pulse
        `,
        default: `
          bg-gray-900 text-white hover:bg-gray-800 
          shadow-md hover:shadow-lg focus:ring-gray-900
        `,
        destructive: `
          bg-red-600 text-white hover:bg-red-700 
          shadow-md hover:shadow-lg focus:ring-red-600
        `,
        link: `
          text-[#FF6B9D] underline-offset-4 hover:underline 
          focus:ring-[#FF6B9D] bg-transparent p-0 h-auto
        `
      },
      size: {
        default: 'px-4 py-2 text-base h-10',
        sm: 'px-3 py-1.5 text-sm h-8',
        md: 'px-4 py-2 text-base h-10',
        lg: 'px-6 py-3 text-lg h-11',
        xl: 'px-8 py-4 text-xl h-12',
        icon: 'h-10 w-10 p-0'
      },
      shape: {
        rounded: 'rounded-lg',
        pill: 'rounded-full',
        square: 'rounded-none'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      shape: 'rounded'
    }
  }
);

interface ButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  asChild?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'default',
  shape = 'rounded',
  loading = false,
  icon,
  children,
  className,
  disabled,
  asChild = false,
  ...props
}) => {
  // Handle asChild pattern
  if (asChild) {
    const child = React.Children.only(children) as React.ReactElement;
    return React.cloneElement(child, {
      className: cn(
        buttonVariants({ variant, size, shape }),
        className,
        child.props.className
      ),
      ...props
    });
  }

  return (
    <button
      className={cn(
        buttonVariants({ variant, size, shape }),
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon}
      {size !== 'icon' && <span className="relative z-10">{children}</span>}
      {size === 'icon' && !loading && !icon && children}
    </button>
  );
};

export { buttonVariants };
