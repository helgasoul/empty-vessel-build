// lib/constants/medical-constants.ts
// Медицинские константы для Enhanced Gail Calculator

import { RaceEthnicity } from '@/types/gail-calculator';

// ========== GAIL MODEL КОНСТАНТЫ ==========

/**
 * Возрастные ограничения для модели Gail
 */
export const GAIL_AGE_LIMITS = {
  MIN_AGE: 35,
  MAX_AGE: 90,
  OPTIMAL_MIN_AGE: 40, // оптимальный возраст для начала расчетов
} as const;

/**
 * Ограничения для возраста менархе
 */
export const MENARCHE_LIMITS = {
  MIN_AGE: 9,
  MAX_AGE: 16,
  AVERAGE_AGE: 12.5,
} as const;

/**
 * Ограничения для возраста первых родов
 */
export const FIRST_BIRTH_LIMITS = {
  MIN_AGE: 15,
  MAX_AGE: 50,
  NULLIPARITY: null, // специальное значение для нерожавших
} as const;

/**
 * Максимальное количество биопсий для учета в модели
 */
export const MAX_BIOPSIES = 10;

/**
 * Максимальное количество родственников первой степени
 */
export const MAX_FAMILY_MEMBERS = 10;

// ========== КАТЕГОРИИ РИСКА ==========

/**
 * Пороговые значения для категоризации риска по Gail Model
 */
export const RISK_THRESHOLDS = {
  LOW: 1.67,        // < 1.67% - низкий риск
  MODERATE: 3.0,    // 1.67-3.0% - умеренный риск  
  ELEVATED: 5.0,    // 3.0-5.0% - повышенный риск
  HIGH: Infinity,   // > 5.0% - высокий риск
} as const;

/**
 * Описания категорий риска
 */
export const RISK_CATEGORIES = {
  'низкий': {
    threshold: RISK_THRESHOLDS.LOW,
    color: 'green',
    description: 'Риск ниже среднего для возрастной группы',
    actionRequired: false,
  },
  'умеренный': {
    threshold: RISK_THRESHOLDS.MODERATE,
    color: 'yellow',
    description: 'Умеренно повышенный риск',
    actionRequired: true,
  },
  'повышенный': {
    threshold: RISK_THRESHOLDS.ELEVATED,
    color: 'orange',
    description: 'Значительно повышенный риск',
    actionRequired: true,
  },
  'высокий': {
    threshold: RISK_THRESHOLDS.HIGH,
    color: 'red',
    description: 'Высокий риск развития РМЖ',
    actionRequired: true,
  },
} as const;

// ========== БАЗОВЫЕ РИСКИ ПО РАСАМ И ВОЗРАСТУ ==========

/**
 * Базовые 5-летние риски развития РМЖ по расам и возрастным группам (%)
 * Данные основаны на SEER статистике
 */
export const BASE_RISKS: Record<RaceEthnicity, Record<number, number>> = {
  'white': {
    35: 0.1, 40: 0.3, 45: 0.6, 50: 1.0, 55: 1.5, 
    60: 2.0, 65: 2.5, 70: 3.0, 75: 3.5, 80: 4.0, 85: 4.2, 90: 4.5
  },
  'african-american': {
    35: 0.08, 40: 0.25, 45: 0.5, 50: 0.8, 55: 1.2, 
    60: 1.6, 65: 2.0, 70: 2.4, 75: 2.8, 80: 3.2, 85: 3.4, 90: 3.6
  },
  'hispanic': {
    35: 0.07, 40: 0.2, 45: 0.4, 50: 0.7, 55: 1.0, 
    60: 1.4, 65: 1.8, 70: 2.2, 75: 2.6, 80: 3.0, 85: 3.2, 90: 3.4
  },
  'asian-pacific': {
    35: 0.05, 40: 0.15, 45: 0.3, 50: 0.5, 55: 0.8, 
    60: 1.1, 65: 1.4, 70: 1.7, 75: 2.0, 80: 2.3, 85: 2.5, 90: 2.7
  },
  'native-american': {
    35: 0.06, 40: 0.18, 45: 0.35, 50: 0.6, 55: 0.9, 
    60: 1.3, 65: 1.7, 70: 2.1, 75: 2.5, 80: 2.9, 85: 3.1, 90: 3.3
  },
  'other': {
    35: 0.08, 40: 0.25, 45: 0.5, 50: 0.8, 55: 1.2, 
    60: 1.6, 65: 2.0, 70: 2.4, 75: 2.8, 80: 3.2, 85: 3.4, 90: 3.6
  },
};

// ========== КОЭФФИЦИЕНТЫ РИСКА ==========

/**
 * Относительные риски для различных факторов
 */
export const RISK_FACTORS = {
  /**
   * Возраст менархе
   */
  MENARCHE: {
    '9-11': 1.15,
    '12': 1.1,
    '13': 1.0,
    '14': 0.95,
    '15-16': 0.9,
  },
  
  /**
   * Возраст первых родов / нерожавшие
   */
  FIRST_BIRTH: {
    NULLIPARITY: 1.15,
    'under-20': 0.9,
    '20-24': 0.95,
    '25-29': 1.0,
    '30-34': 1.05,
    '35-39': 1.1,
    'over-40': 1.15,
  },
  
  /**
   * Количество биопсий
   */
  BIOPSIES: {
    0: 1.0,
    1: 1.1,
    2: 1.2,
    3: 1.3,
    '4+': 1.4,
  },
  
  /**
   * Атипичная гиперплазия
   */
  ATYPICAL_HYPERPLASIA: {
    NO: 1.0,
    YES: 1.3,
  },
  
  /**
   * Семейный анамнез (родственники первой степени)
   */
  FAMILY_HISTORY: {
    0: 1.0,
    1: 1.2,
    2: 1.4,
    3: 1.6,
    '4+': 1.8,
  },
  
  /**
   * Плотность молочных желез (Enhanced фактор)
   */
  BREAST_DENSITY: {
    'almost-entirely-fatty': 0.9,
    'scattered-densities': 1.0,
    'heterogeneously-dense': 1.2,
    'extremely-dense': 1.4,
  },
} as const;

// ========== ENHANCED ФАКТОРЫ ==========

/**
 * Коэффициенты для Enhanced анализа
 */
export const ENHANCED_FACTORS = {
  /**
   * ИМТ (Индекс массы тела)
   */
  BMI: {
    'underweight': 0.95,  // < 18.5
    'normal': 1.0,        // 18.5-24.9
    'overweight': 1.05,   // 25-29.9
    'obese': 1.1,         // 30-34.9
    'severe-obese': 1.15, // >= 35
  },
  
  /**
   * Уровень потребления алкоголя
   */
  ALCOHOL: {
    'none': 1.0,
    'light': 1.02,     // 1-3 напитка в неделю
    'moderate': 1.05,  // 4-7 напитков в неделю
    'heavy': 1.1,      // >7 напитков в неделю
  },
  
  /**
   * Физическая активность
   */
  PHYSICAL_ACTIVITY: {
    'sedentary': 1.05,
    'light': 1.02,
    'moderate': 1.0,
    'vigorous': 0.95,
  },
  
  /**
   * Курение
   */
  SMOKING: {
    'never': 1.0,
    'former': 1.02,
    'current': 1.05,
  },
  
  /**
   * Гормональная терапия
   */
  HORMONAL_THERAPY: {
    'none': 1.0,
    'estrogen-only': 1.03,
    'estrogen-progestin': 1.08,
    'selective-estrogen-receptor-modulators': 0.95,
  },
} as const;

// ========== ГЕНЕТИЧЕСКИЕ ФАКТОРЫ ==========

/**
 * Относительные риски для генетических мутаций
 */
export const GENETIC_RISKS = {
  BRCA1: {
    lifetimeRisk: 65, // 55-72% пожизненный риск
    relativeRisk: 20,
  },
  BRCA2: {
    lifetimeRisk: 45, // 45-69% пожизненный риск
    relativeRisk: 15,
  },
  TP53: {
    lifetimeRisk: 85, // очень высокий риск
    relativeRisk: 25,
  },
  PTEN: {
    lifetimeRisk: 50,
    relativeRisk: 12,
  },
  ATM: {
    lifetimeRisk: 20, // умеренно повышенный
    relativeRisk: 3,
  },
  CHEK2: {
    lifetimeRisk: 25,
    relativeRisk: 4,
  },
  PALB2: {
    lifetimeRisk: 35,
    relativeRisk: 8,
  },
} as const;

// ========== РЕКОМЕНДАЦИИ ПО СКРИНИНГУ ==========

/**
 * Протоколы скрининга в зависимости от риска
 */
export const SCREENING_PROTOCOLS = {
  'низкий': {
    mammographyFrequency: 'biennial' as const,
    startAge: 50,
    additionalImaging: [],
    clinicalExamFrequency: 'annual' as const,
    selfExamRecommended: true,
  },
  'умеренный': {
    mammographyFrequency: 'annual' as const,
    startAge: 45,
    additionalImaging: [],
    clinicalExamFrequency: 'annual' as const,
    selfExamRecommended: true,
  },
  'повышенный': {
    mammographyFrequency: 'annual' as const,
    startAge: 40,
    additionalImaging: ['breast-ultrasound' as const],
    clinicalExamFrequency: 'every-6-months' as const,
    selfExamRecommended: true,
  },
  'высокий': {
    mammographyFrequency: 'annual' as const,
    startAge: 30,
    additionalImaging: ['breast-mri' as const, 'breast-ultrasound' as const],
    clinicalExamFrequency: 'every-6-months' as const,
    selfExamRecommended: true,
  },
} as const;

// ========== УРОВНИ ДОСТОВЕРНОСТИ ==========

/**
 * Факторы, влияющие на достоверность расчета
 */
export const CONFIDENCE_FACTORS = {
  BASE_CONFIDENCE: 85, // базовый уровень достоверности
  
  AGE_ADJUSTMENTS: {
    'under-35': -15,   // молодой возраст снижает точность
    '35-40': -5,
    '40-75': 0,        // оптимальный возраст
    'over-75': -10,    // старший возраст снижает точность
  },
  
  DATA_COMPLETENESS: {
    'no-biopsies': -5,
    'with-density': +5,
    'with-genetics': +10,
    'with-lifestyle': +3,
    'with-family-details': +5,
  },
  
  MIN_CONFIDENCE: 60,
  MAX_CONFIDENCE: 95,
} as const;

// ========== ЭКСПОРТ УТИЛИТ ==========

/**
 * Получить базовый риск для возраста и расы
 */
export function getBaseRisk(age: number, race: RaceEthnicity): number {
  const raceRisks = BASE_RISKS[race];
  const ageGroups = Object.keys(raceRisks).map(Number).sort((a, b) => a - b);
  
  // Найти ближайшую возрастную группу
  let closestAge = ageGroups[0];
  for (const ageGroup of ageGroups) {
    if (Math.abs(age - ageGroup) < Math.abs(age - closestAge)) {
      closestAge = ageGroup;
    }
  }
  
  return raceRisks[closestAge];
}

/**
 * Категоризировать риск
 */
export function categorizeRisk(fiveYearRisk: number): 'низкий' | 'умеренный' | 'повышенный' | 'высокий' {
  if (fiveYearRisk < RISK_THRESHOLDS.LOW) return 'низкий';
  if (fiveYearRisk < RISK_THRESHOLDS.MODERATE) return 'умеренный';
  if (fiveYearRisk < RISK_THRESHOLDS.ELEVATED) return 'повышенный';
  return 'высокий';
}

/**
 * Получить цвет для категории риска
 */
export function getRiskColor(category: string): string {
  return RISK_CATEGORIES[category as keyof typeof RISK_CATEGORIES]?.color || 'gray';
}

export default {
  GAIL_AGE_LIMITS,
  MENARCHE_LIMITS,
  FIRST_BIRTH_LIMITS,
  MAX_BIOPSIES,
  MAX_FAMILY_MEMBERS,
  RISK_THRESHOLDS,
  RISK_CATEGORIES,
  BASE_RISKS,
  RISK_FACTORS,
  ENHANCED_FACTORS,
  GENETIC_RISKS,
  SCREENING_PROTOCOLS,
  CONFIDENCE_FACTORS,
  getBaseRisk,
  categorizeRisk,
  getRiskColor,
};