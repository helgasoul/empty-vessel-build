
/**
 * PREVENT Design System - Spacing Tokens
 * Consistent spacing system for the platform
 */

export const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  32: '8rem',     // 128px
} as const;

export const borderRadius = {
  none: '0',
  sm: '0.375rem',    // 6px
  default: '0.5rem', // 8px
  md: '0.75rem',     // 12px
  lg: '1rem',        // 16px
  xl: '1.5rem',      // 24px
  full: '9999px',
} as const;

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(46, 44, 47, 0.05)',
  default: '0 1px 3px 0 rgba(46, 44, 47, 0.1), 0 1px 2px 0 rgba(46, 44, 47, 0.06)',
  md: '0 4px 6px -1px rgba(46, 44, 47, 0.1), 0 2px 4px -1px rgba(46, 44, 47, 0.06)',
  lg: '0 10px 15px -3px rgba(46, 44, 47, 0.1), 0 4px 6px -2px rgba(46, 44, 47, 0.05)',
  xl: '0 20px 25px -5px rgba(46, 44, 47, 0.1), 0 10px 10px -5px rgba(46, 44, 47, 0.04)',
} as const;

export type SpacingToken = typeof spacing;
export type BorderRadiusToken = typeof borderRadius;
export type ShadowToken = typeof shadows;
