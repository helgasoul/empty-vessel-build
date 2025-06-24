// lib/constants/ui-constants.ts
// UI константы для Enhanced Gail Calculator

// ========== ЦВЕТОВАЯ СХЕМА ==========

/**
 * Основная палитра цветов для платформы женского здоровья
 * Теплые, заботливые тона для создания чувства защищенности
 */
export const COLORS = {
  // Основные цвета бренда
  PRIMARY: {
    50: '#FDF2F8',   // очень светло-розовый
    100: '#FCE7F3',  // светло-розовый  
    200: '#FBCFE8',  // розовый
    300: '#F9A8D4',  // средний розовый
    400: '#F472B6',  // яркий розовый
    500: '#EC4899',  // основной розовый
    600: '#DB2777',  // темно-розовый
    700: '#BE185D',  // очень темно-розовый
    800: '#9D174D',  // burgundy
    900: '#831843',  // темный burgundy
  },
  
  // Дополнительные цвета
  SECONDARY: {
    50: '#F3E8FF',   // светло-фиолетовый
    100: '#E9D5FF',  // фиолетовый  
    200: '#DDD6FE',  // средний фиолетовый
    300: '#C4B5FD',  // лавандовый
    400: '#A78BFA',  // яркий лавандовый
    500: '#8B5CF6',  // основной фиолетовый
    600: '#7C3AED',  // темно-фиолетовый
    700: '#6D28D9',  // очень темно-фиолетовый
    800: '#5B21B6',  // глубокий фиолетовый
    900: '#4C1D95',  // темный фиолетовый
  },
  
  // Акцентные цвета
  ACCENT: {
    MINT: {
      50: '#F0FDF4',   // очень светло-зеленый
      100: '#DCFCE7',  // светло-зеленый
      200: '#BBF7D0',  // мятный
      300: '#86EFAC',  // средний мятный
      400: '#4ADE80',  // яркий мятный
      500: '#22C55E',  // основной зеленый
      600: '#16A34A',  // темно-зеленый
      700: '#15803D',  // очень темно-зеленый
      800: '#166534',  // forest green
      900: '#14532D',  // темный зеленый
    },
    PEACH: {
      50: '#FFF7ED',   // очень светло-персиковый
      100: '#FFEDD5',  // светло-персиковый
      200: '#FED7AA',  // персиковый
      300: '#FDBA74',  // средний персиковый
      400: '#FB923C',  // яркий персиковый
      500: '#F97316',  // основной оранжевый
      600: '#EA580C',  // темно-оранжевый
      700: '#C2410C',  // очень темно-оранжевый
      800: '#9A3412',  // коричнево-оранжевый
      900: '#7C2D12',  // темный коричневый
    },
  },
  
  // Нейтральные цвета
  NEUTRAL: {
    50: '#FAFAF9',   // почти белый
    100: '#F5F5F4',  // очень светло-серый
    200: '#E7E5E4',  // светло-серый
    300: '#D6D3D1',  // серый
    400: '#A8A29E',  // средний серый
    500: '#78716C',  // темно-серый
    600: '#57534E',  // очень темно-серый
    700: '#44403C',  // charcoal
    800: '#292524',  // темный charcoal
    900: '#1C1917',  // почти черный
  },
  
  // Статусные цвета
  STATUS: {
    SUCCESS: '#22C55E',   // зеленый
    WARNING: '#F59E0B',   // желтый
    ERROR: '#EF4444',     // красный
    INFO: '#3B82F6',      // синий
  },
} as const;

/**
 * Цвета для категорий риска
 */
export const RISK_COLORS = {
  'низкий': {
    bg: 'bg-green-50',
    text: 'text-green-800',
    border: 'border-green-200',
    icon: 'text-green-500',
    progress: 'bg-green-500',
  },
  'умеренный': {
    bg: 'bg-yellow-50',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
    icon: 'text-yellow-500',
    progress: 'bg-yellow-500',
  },
  'повышенный': {
    bg: 'bg-orange-50',
    text: 'text-orange-800',
    border: 'border-orange-200',
    icon: 'text-orange-500',
    progress: 'bg-orange-500',
  },
  'высокий': {
    bg: 'bg-red-50',
    text: 'text-red-800',
    border: 'border-red-200',
    icon: 'text-red-500',
    progress: 'bg-red-500',
  },
  'pending': {
    bg: 'bg-gray-50',
    text: 'text-gray-800',
    border: 'border-gray-200',
    icon: 'text-gray-500',
    progress: 'bg-gray-500',
  },
} as const;

/**
 * Цвета для приоритетов
 */
export const PRIORITY_COLORS = {
  low: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    dot: 'bg-green-500',
  },
  medium: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    dot: 'bg-yellow-500',
  },
  high: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    dot: 'bg-orange-500',
  },
  urgent: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    dot: 'bg-red-500',
  },
} as const;

// ========== ТИПОГРАФИКА ==========

/**
 * Размеры текста
 */
export const TYPOGRAPHY = {
  SIZES: {
    xs: 'text-xs',      // 12px
    sm: 'text-sm',      // 14px
    base: 'text-base',  // 16px
    lg: 'text-lg',      // 18px
    xl: 'text-xl',      // 20px
    '2xl': 'text-2xl',  // 24px
    '3xl': 'text-3xl',  // 30px
    '4xl': 'text-4xl',  // 36px
  },
  
  WEIGHTS: {
    light: 'font-light',     // 300
    normal: 'font-normal',   // 400
    medium: 'font-medium',   // 500
    semibold: 'font-semibold', // 600
    bold: 'font-bold',       // 700
  },
  
  FAMILIES: {
    sans: 'font-sans',       // Inter, system fonts
    serif: 'font-serif',     // Georgia, serif
    mono: 'font-mono',       // monospace
  },
} as const;

// ========== АНИМАЦИИ ==========

/**
 * Стандартные анимации
 */
export const ANIMATIONS = {
  TRANSITIONS: {
    fast: 'transition-all duration-150 ease-in-out',
    normal: 'transition-all duration-200 ease-in-out',
    slow: 'transition-all duration-300 ease-in-out',
  },
  
  HOVER: {
    scale: 'hover:scale-105 transform transition-transform duration-200',
    opacity: 'hover:opacity-80 transition-opacity duration-200',
    shadow: 'hover:shadow-lg transition-shadow duration-200',
  },
  
  FOCUS: {
    ring: 'focus:ring-2 focus:ring-pink-500 focus:ring-offset-2',
    outline: 'focus:outline-none focus:ring-2 focus:ring-pink-500',
  },
} as const;

// ========== SPACING ==========

/**
 * Стандартные отступы
 */
export const SPACING = {
  PADDING: {
    xs: 'p-1',    // 4px
    sm: 'p-2',    // 8px
    md: 'p-4',    // 16px
    lg: 'p-6',    // 24px
    xl: 'p-8',    // 32px
    '2xl': 'p-12', // 48px
  },
  
  MARGIN: {
    xs: 'm-1',    // 4px
    sm: 'm-2',    // 8px
    md: 'm-4',    // 16px
    lg: 'm-6',    // 24px
    xl: 'm-8',    // 32px
    '2xl': 'm-12', // 48px
  },
  
  GAP: {
    xs: 'gap-1',  // 4px
    sm: 'gap-2',  // 8px
    md: 'gap-4',  // 16px
    lg: 'gap-6',  // 24px
    xl: 'gap-8',  // 32px
  },
} as const;

// ========== РАЗМЕРЫ КОМПОНЕНТОВ ==========

/**
 * Стандартные размеры
 */
export const SIZES = {
  BUTTONS: {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  },
  
  INPUTS: {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-4 py-3 text-lg',
  },
  
  CARDS: {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  },
  
  ICONS: {
    xs: 'h-3 w-3',   // 12px
    sm: 'h-4 w-4',   // 16px
    md: 'h-5 w-5',   // 20px
    lg: 'h-6 w-6',   // 24px
    xl: 'h-8 w-8',   // 32px
    '2xl': 'h-10 w-10', // 40px
  },
} as const;

// ========== КОМПОНЕНТЫ ==========

/**
 * Стили для карточек
 */
export const CARD_STYLES = {
  base: 'bg-white rounded-lg border shadow-sm',
  hover: 'hover:shadow-md transition-shadow duration-200',
  focus: 'focus-within:ring-2 focus-within:ring-pink-500 focus-within:ring-offset-2',
  
  variants: {
    default: 'border-gray-200',
    primary: 'border-pink-200 bg-pink-50',
    secondary: 'border-purple-200 bg-purple-50',
    success: 'border-green-200 bg-green-50',
    warning: 'border-yellow-200 bg-yellow-50',
    error: 'border-red-200 bg-red-50',
  },
} as const;

/**
 * Стили для кнопок
 */
export const BUTTON_STYLES = {
  base: 'inline-flex items-center justify-center rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  
  variants: {
    primary: 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 focus:ring-pink-500',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500',
    success: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500',
    warning: 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500',
    error: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
  },
} as const;

/**
 * Стили для бейджей
 */
export const BADGE_STYLES = {
  base: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
  
  variants: {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-pink-100 text-pink-800',
    secondary: 'bg-purple-100 text-purple-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
  },
} as const;

// ========== ГРАДИЕНТЫ ==========

/**
 * Фоновые градиенты
 */
export const GRADIENTS = {
  primary: 'bg-gradient-to-r from-pink-50 to-purple-50',
  secondary: 'bg-gradient-to-br from-pink-50 via-white to-purple-50',
  warm: 'bg-gradient-to-r from-pink-100 to-orange-100',
  cool: 'bg-gradient-to-r from-purple-100 to-blue-100',
  
  buttons: {
    primary: 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700',
    secondary: 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700',
    success: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700',
  },
} as const;

// ========== ТЕНИ ==========

/**
 * Стандартные тени
 */
export const SHADOWS = {
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  
  // Цветные тени
  pink: 'shadow-lg shadow-pink-500/25',
  purple: 'shadow-lg shadow-purple-500/25',
  green: 'shadow-lg shadow-green-500/25',
} as const;

// ========== BREAKPOINTS ==========

/**
 * Responsive breakpoints
 */
export const BREAKPOINTS = {
  sm: '640px',    // мобильные (ландшафт)
  md: '768px',    // планшеты
  lg: '1024px',   // ноутбуки
  xl: '1280px',   // десктопы
  '2xl': '1536px', // большие экраны
} as const;

// ========== Z-INDEX ==========

/**
 * Z-index значения
 */
export const Z_INDEX = {
  base: 1,
  dropdown: 10,
  sticky: 20,
  overlay: 30,
  modal: 40,
  popover: 50,
  tooltip: 60,
  toast: 70,
} as const;

// ========== КОНСТАНТЫ ИНТЕРФЕЙСА ==========

/**
 * Максимальная ширина контента
 */
export const MAX_WIDTHS = {
  xs: 'max-w-xs',     // 320px
  sm: 'max-w-sm',     // 384px
  md: 'max-w-md',     // 448px
  lg: 'max-w-lg',     // 512px
  xl: 'max-w-xl',     // 576px
  '2xl': 'max-w-2xl', // 672px
  '3xl': 'max-w-3xl', // 768px
  '4xl': 'max-w-4xl', // 896px
  '5xl': 'max-w-5xl', // 1024px
  '6xl': 'max-w-6xl', // 1152px
  '7xl': 'max-w-7xl', // 1280px
  full: 'max-w-full',
  screen: 'max-w-screen',
} as const;

/**
 * Радиусы скругления
 */
export const BORDER_RADIUS = {
  none: 'rounded-none',
  sm: 'rounded-sm',     // 2px
  md: 'rounded-md',     // 6px
  lg: 'rounded-lg',     // 8px
  xl: 'rounded-xl',     // 12px
  '2xl': 'rounded-2xl', // 16px
  '3xl': 'rounded-3xl', // 24px
  full: 'rounded-full',
} as const;

// ========== ЭКСПОРТ УТИЛИТ ==========

/**
 * Получить цвета для категории риска
 */
export function getRiskColorClasses(category: string) {
  return RISK_COLORS[category as keyof typeof RISK_COLORS] || RISK_COLORS.pending;
}

/**
 * Получить цвета для приоритета
 */
export function getPriorityColorClasses(priority: string) {
  return PRIORITY_COLORS[priority as keyof typeof PRIORITY_COLORS] || PRIORITY_COLORS.low;
}

/**
 * Создать составной класс
 */
export function createClassName(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export default {
  COLORS,
  RISK_COLORS,
  PRIORITY_COLORS,
  TYPOGRAPHY,
  ANIMATIONS,
  SPACING,
  SIZES,
  CARD_STYLES,
  BUTTON_STYLES,
  BADGE_STYLES,
  GRADIENTS,
  SHADOWS,
  BREAKPOINTS,
  Z_INDEX,
  MAX_WIDTHS,
  BORDER_RADIUS,
  getRiskColorClasses,
  getPriorityColorClasses,
  createClassName,
};