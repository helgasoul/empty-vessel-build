
/**
 * PREVENT Design System - Color Tokens
 * Brand palette with exact hex codes for women's health platform
 * Updated to match the PREVENT logo gradient identity
 */

export const colors = {
  // Primary Brand Colors - Based on logo gradient
  primary: {
    50: '#F3F1FF',
    100: '#E8E1FF',
    200: '#D4C7FF',
    300: '#B8A8FF',
    400: '#9B7CFF',
    500: '#7C3AED', // Primary purple from logo
    600: '#6D28D9',
    700: '#5B21B6',
    800: '#4C1D95',
    900: '#3C1A78',
  },
  
  gradient: {
    50: '#FDF2F8',
    100: '#FCE7F3',
    200: '#FBCFE8',
    300: '#F9A8D4',
    400: '#F472B6',
    500: '#EC4899', // Pink from logo
    600: '#DB2777',
    700: '#BE185D',
    800: '#9D174D',
    900: '#831843',
  },
  
  accent: {
    50: '#F0F9FF',
    100: '#E0F2FE',
    200: '#BAE6FD',
    300: '#7DD3FC',
    400: '#38BDF8',
    500: '#0EA5E9', // Blue accent from logo
    600: '#0284C7',
    700: '#0369A1',
    800: '#075985',
    900: '#0C4A6E',
  },
  
  // Background Colors - Softer versions of brand colors
  background: {
    primary: '#FAFAFA', // Clean white background
    secondary: '#F8FAFC', // Very light blue-gray
    tertiary: '#FFFFFF',
    gradient: 'linear-gradient(135deg, #F3F1FF 0%, #FDF2F8 50%, #F0F9FF 100%)', // Subtle brand gradient
  },
  
  // Text Colors
  text: {
    primary: '#1E293B', // Dark slate
    secondary: '#64748B', // Medium slate
    tertiary: '#94A3B8',
    inverse: '#FFFFFF',
    brand: '#7C3AED', // Brand purple for highlights
  },
  
  // Status Colors - Updated with more vibrant tones
  status: {
    low: '#10B981', // Emerald
    medium: '#F59E0B', // Amber
    high: '#EF4444', // Red
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6', // Blue
  },
  
  // Semantic Colors - Health-specific
  semantic: {
    menstruation: '#EC4899', // Pink from logo
    ovulation: '#F97316', // Orange
    fertility: '#10B981', // Green
    pregnancy: '#F59E0B', // Amber
    menopause: '#7C3AED', // Purple from logo
  },
  
  // UI Utility Colors
  border: {
    light: '#E2E8F0',
    medium: '#CBD5E1',
    dark: '#94A3B8',
  },
  
  surface: {
    elevated: '#FFFFFF',
    overlay: 'rgba(30, 41, 59, 0.6)',
    glass: 'rgba(255, 255, 255, 0.8)',
  },
  
  // New gradient definitions matching logo
  gradients: {
    primary: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 50%, #0EA5E9 100%)',
    secondary: 'linear-gradient(135deg, #F3F1FF 0%, #FDF2F8 100%)',
    accent: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)',
    background: 'linear-gradient(135deg, #FAFAFA 0%, #F8FAFC 100%)',
  },
} as const;

export type ColorToken = typeof colors;
