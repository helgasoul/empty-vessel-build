
import type { Config } from "tailwindcss";
import { colors, typography, spacing, borderRadius, shadows } from './src/design-system/tokens';

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./src/design-system/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      fontFamily: {
        sans: typography.fontFamily.primary,
        body: typography.fontFamily.secondary,
      },
      fontSize: {
        'h1': [typography.fontSize.h1, { lineHeight: typography.lineHeight.tight, fontWeight: typography.fontWeight.semibold }],
        'h2': [typography.fontSize.h2, { lineHeight: typography.lineHeight.normal, fontWeight: typography.fontWeight.medium }],
        'h3': [typography.fontSize.h3, { lineHeight: typography.lineHeight.normal, fontWeight: typography.fontWeight.medium }],
        'h4': [typography.fontSize.h4, { lineHeight: typography.lineHeight.normal, fontWeight: typography.fontWeight.medium }],
        'body': [typography.fontSize.body, { lineHeight: typography.lineHeight.normal }],
        'body-large': [typography.fontSize.bodyLarge, { lineHeight: typography.lineHeight.normal }],
        'body-small': [typography.fontSize.bodySmall, { lineHeight: typography.lineHeight.normal }],
        'label': [typography.fontSize.label, { lineHeight: typography.lineHeight.normal, fontWeight: typography.fontWeight.medium }],
        'caption': [typography.fontSize.caption, { lineHeight: typography.lineHeight.normal }],
      },
      colors: {
        // PREVENT Brand Colors
        coral: colors.coral,
        berry: colors.berry,
        sage: colors.sage,
        
        // Background system
        background: {
          DEFAULT: colors.background.primary,
          secondary: colors.background.secondary,
          tertiary: colors.background.tertiary,
        },
        
        // Text system
        foreground: colors.text.primary,
        text: colors.text,
        
        // Status colors
        status: colors.status,
        
        // Semantic health colors
        health: colors.semantic,
        
        // UI colors
        border: {
          DEFAULT: colors.border.light,
          medium: colors.border.medium,
          dark: colors.border.dark,
        },
        
        // shadcn/ui compatibility
        primary: {
          DEFAULT: colors.coral[500],
          foreground: colors.text.inverse,
        },
        secondary: {
          DEFAULT: colors.sage[500],
          foreground: colors.text.inverse,
        },
        destructive: {
          DEFAULT: colors.status.error,
          foreground: colors.text.inverse,
        },
        muted: {
          DEFAULT: colors.background.secondary,
          foreground: colors.text.secondary,
        },
        accent: {
          DEFAULT: colors.berry[500],
          foreground: colors.text.inverse,
        },
        popover: {
          DEFAULT: colors.background.tertiary,
          foreground: colors.text.primary,
        },
        card: {
          DEFAULT: colors.background.secondary,
          foreground: colors.text.primary,
        },
        input: colors.border.medium,
        ring: colors.coral[500],
      },
      borderRadius: {
        ...borderRadius,
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: shadows,
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'slide-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(40px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'gentle-bounce': {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-4px)',
          }
        },
        'pulse-soft': {
          '0%': {
            opacity: '1',
          },
          '50%': {
            opacity: '0.7',
          },
          '100%': {
            opacity: '1',
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.6s ease-out',
        'slide-up': 'slide-up 0.8s ease-out',
        'gentle-bounce': 'gentle-bounce 2s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
