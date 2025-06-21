
/**
 * PREVENT Design System - Color Tokens
 * Brand palette with exact hex codes for women's health platform
 */

export const colors = {
  // Primary Brand Colors
  coral: {
    50: '#FFF7F6',
    100: '#FFEBE9',
    200: '#FFD7D4',
    300: '#FFB8B3',
    400: '#FF8B83',
    500: '#F6635C', // Primary coral warm
    600: '#E54B42',
    700: '#C73A30',
    800: '#A52F26',
    900: '#8A2A22',
  },
  
  berry: {
    50: '#FAF1F3',
    100: '#F5E1E6',
    200: '#EBC4CE',
    300: '#DC9BA9',
    400: '#CA6B7F',
    500: '#B42F48', // Berry red - trust/menstruation
    600: '#A1293F',
    700: '#862337',
    800: '#6F1F30',
    900: '#5D1C29',
  },
  
  sage: {
    50: '#F4F7F6',
    100: '#E8EFED',
    200: '#D1DFDB',
    300: '#A8C5BE',
    400: '#7BA59B',
    500: '#557C74', // Deep sage - secondary CTAs
    600: '#4A6E66',
    700: '#3F5C55',
    800: '#354D47',
    900: '#2E403B',
  },
  
  // Background Colors
  background: {
    primary: '#FFF7F3', // Warm beige - main UI background
    secondary: '#F8E2E0', // Soft rose - card backgrounds
    tertiary: '#FFFFFF',
  },
  
  // Text Colors
  text: {
    primary: '#2E2C2F', // Dark charcoal
    secondary: '#5C5A5D', // Soft ink
    tertiary: '#8B8B8B',
    inverse: '#FFFFFF',
  },
  
  // Status Colors
  status: {
    low: '#66BFA6',
    medium: '#F4B942',
    high: '#DE3B4A',
    success: '#66BFA6',
    warning: '#F4B942',
    error: '#DE3B4A',
    info: '#557C74',
  },
  
  // Semantic Colors
  semantic: {
    menstruation: '#B42F48',
    ovulation: '#F6635C',
    fertility: '#66BFA6',
    pregnancy: '#F4B942',
    menopause: '#557C74',
  },
  
  // UI Utility Colors
  border: {
    light: '#F0E8E6',
    medium: '#E0D4D1',
    dark: '#C0B0AB',
  },
  
  surface: {
    elevated: '#FFFFFF',
    overlay: 'rgba(46, 44, 47, 0.6)',
  },
} as const;

export type ColorToken = typeof colors;
