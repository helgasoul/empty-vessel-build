
/**
 * PREVENT Design System - Typography Tokens
 * Inter/IBM Plex Sans font system for women's health platform
 */

export const typography = {
  fontFamily: {
    primary: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
    secondary: ['IBM Plex Sans', 'system-ui', '-apple-system', 'sans-serif'],
  },
  
  fontSize: {
    // Headings
    h1: '2.25rem', // 36px
    h2: '1.5rem',  // 24px
    h3: '1.25rem', // 20px
    h4: '1.125rem', // 18px
    
    // Body text
    body: '1rem',     // 16px
    bodyLarge: '1.125rem', // 18px
    bodySmall: '0.875rem', // 14px
    
    // UI elements
    label: '0.875rem', // 14px
    caption: '0.75rem', // 12px
  },
  
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  lineHeight: {
    tight: '1.2',
    normal: '1.5',
    relaxed: '1.75',
  },
  
  letterSpacing: {
    tight: '-0.01em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
  },
} as const;

export type TypographyToken = typeof typography;
