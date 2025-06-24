/**
 * hooks/useGailCalculator.ts
 * 
 * Хук для расчета рисков по модели Gail
 * 🧮 Полная реализация с персонализированными рекомендациями
 */

import { useState, useCallback, useRef } from 'react';

// ========================================
// Типы данных
// ========================================

export interface PersonalInfo {
  age: number;
  race: 'caucasian' | 'african_american' | 'hispanic' | 'asian' | 'other';
  height: number;
  weight: number;
}

export interface MedicalHistory {
  ageAtMenarche: number;
  ageAtFirstBirth?: number;
  numberOfBirths: number;
  numberOfBiopsies: number;
  atypicalHyperplasia: boolean;
  lobularCarcinomaInSitu: boolean;
  breastfeedingMonths?: number;
  ageAtMenopause?: number;
}

export interface FamilyHistory {
  breastCancerRelatives: number;
  ovarianCancerRelatives: number;
  firstDegreeRelatives?: {
    mother: boolean;
    sisters: number;
    daughters: number;
  };
  maleBreastCancer: boolean;
  knownGeneticMutations?: string[];
  averageAgeAtDiagnosis?: number;
  paternalHistory?: boolean;
  maternalHistory?: boolean;
}

export interface GailCalculatorInput {
  personalInfo: PersonalInfo;
  medicalHistory: MedicalHistory;
  familyHistory: FamilyHistory;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface RiskFactor {
  name: string;
  value: string;
  impact: 'protective' | 'neutral' | 'moderate' | 'high';
  description: string;
  evidenceLevel: 'low' | 'moderate' | 'high';
}

export interface Recommendation {
  type: 'screening' | 'lifestyle' | 'genetic' | 'medical';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  description: string;
  actionItems: string[];
  evidenceLevel: 'low' | 'moderate' | 'high';
}

export type RiskLevel = 'low' | 'moderate' | 'high' | 'very_high';

export interface GailCalculatorResult {
  fiveYearRisk: number;
  lifetimeRisk: number;
  riskLevel: RiskLevel;
  comparedToAverage: number;
  riskFactors: RiskFactor[];
  recommendations: Recommendation[];
}

export interface CalculationProgress {
  step: string;
  percentage: number;
  message: string;
}

export interface UseGailCalculatorReturn {
  calculate: (input: GailCalculatorInput) => Promise<GailCalculatorResult>;
  validateInput: (input: Partial<GailCalculatorInput>) => ValidationError[];
  isCalculating: boolean;
  progress: CalculationProgress | null;
  formatRisk: (risk: number) => string;
  getRiskLevel: (risk: number) => RiskLevel;
  clearCache: () => void;
}

// ========================================
// Константы модели Gail
// ========================================

const GAIL_MODEL_CONSTANTS = {
  // Базовые коэффициенты для различных возрастных групп
  BASE_RATES: {
    35: 0.00023,
    40: 0.00059,
    45: 0.00134,
    50: 0.00226,
    55: 0.00339,
    60: 0.00481,
    65: 0.00642,
    70: 0.00814,
    75: 0.00996,
    80: 0.01180,
    85: 0.01326,
  },
  
  // Относительные риски для различных факторов
  RELATIVE_RISKS: {
    // Возраст менархе
    ageAtMenarche: {
      '<12': 1.21,
      '12': 1.10,
      '13': 1.00,
      '14+': 0.93,
    },
    
    // Возраст первых родов / отсутствие родов
    ageAtFirstBirth: {
      'nulliparous': 1.24,
      '<20': 0.73,
      '20-24': 0.90,
      '25-29': 1.00,
      '30+': 1.23,
    },
    
    // Количество биопсий
    numberOfBiopsies: {
      0: 1.00,
      1: 1.70,
      '2+': 2.88,
    },
    
    // Атипичная гиперплазия
    atypicalHyperplasia: {
      none: 1.00,
      present: 4.17,
    },
    
    // Семейная история (родственники первой степени)
    familyHistory: {
      0: 1.00,
      1: 2.30,
      '2+': 4.76,
    },
    
    // Этническая принадлежность (корректировочные коэффициенты)
    race: {
      caucasian: 1.00,
      african_american: 0.60,
      hispanic: 0.70,
      asian: 0.50,
      other: 0.80,
    },
  },
  
  // Коэффициенты для расчета пожизненного риска
  LIFETIME_RISK_MULTIPLIERS: {
    35: 7.8,
    40: 6.9,
    45: 6.0,
    50: 5.2,
    55: 4.4,
    60: 3.7,
    65: 3.0,
    70: 2.4,
    75: 1.8,
    80: 1.3,
    85: 1.0,
  },
};

// ========================================
// Утилиты для расчетов
// ========================================

const calculateBMI = (height: number, weight: number): number => {
  const heightInM = height / 100;
  return weight / (heightInM * heightInM);
};

const formatRiskPercentage = (risk: number): string => {
  if (risk < 0.01) return '<0.1%';
  if (risk < 0.1) return `${(risk * 100).toFixed(1)}%`;
  return `${(risk * 100).toFixed(0)}%`;
};

const getRiskLevel = (risk: number): RiskLevel => {
  if (risk < 0.015) return 'low';
  if (risk < 0.025) return 'moderate';
  if (risk < 0.04) return 'high';
  return 'very_high';
};

const getClosestAge = (age: number): keyof typeof GAIL_MODEL_CONSTANTS.BASE_RATES => {
  const ages = Object.keys(GAIL_MODEL_CONSTANTS.BASE_RATES).map(Number);
  const closest = ages.reduce((prev, curr) => 
    Math.abs(curr - age) < Math.abs(prev - age) ? curr : prev
  );
  return closest as keyof typeof GAIL_MODEL_CONSTANTS.BASE_RATES;
};

// ========================================
// Валидация данных
// ========================================

const validateInput = (input: Partial<GailCalculatorInput>): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Проверка персональной информации
  if (!input.personalInfo) {
    errors.push({ field: 'personalInfo', message: 'Персональная информация обязательна' });
    return errors;
  }

  const { personalInfo, medicalHistory, familyHistory } = input;

  // Возраст
  if (!personalInfo.age || personalInfo.age < 35 || personalInfo.age > 85) {
    errors.push({ 
      field: 'personalInfo.age', 
      message: 'Возраст должен быть от 35 до 85 лет для расчета по модели Gail' 
    });
  }

  // Рост и вес
  if (!personalInfo.height || personalInfo.height < 100 || personalInfo.height > 250) {
    errors.push({ field: 'personalInfo.height', message: 'Укажите корректный рост (100-250 см)' });
  }

  if (!personalInfo.weight || personalInfo.weight < 30 || personalInfo.weight > 300) {
    errors.push({ field: 'personalInfo.weight', message: 'Укажите корректный вес (30-300 кг)' });
  }

  // Медицинская история
  if (!medicalHistory) {
    errors.push({ field: 'medicalHistory', message: 'Медицинская история обязательна' });
    return errors;
  }

  // Возраст менархе
  if (!medicalHistory.ageAtMenarche || medicalHistory.ageAtMenarche < 8 || medicalHistory.ageAtMenarche > 17) {
    errors.push({ 
      field: 'medicalHistory.ageAtMenarche', 
      message: 'Возраст первой менструации должен быть от 8 до 17 лет' 
    });
  }

  // Возраст первых родов
  if (medicalHistory.ageAtFirstBirth && 
      (medicalHistory.ageAtFirstBirth < 12 || medicalHistory.ageAtFirstBirth > 50)) {
    errors.push({ 
      field: 'medicalHistory.ageAtFirstBirth', 
      message: 'Возраст первых родов должен быть от 12 до 50 лет' 
    });
  }

  // Количество биопсий
  if (medicalHistory.numberOfBiopsies < 0 || medicalHistory.numberOfBiopsies > 10) {
    errors.push({ 
      field: 'medicalHistory.numberOfBiopsies', 
      message: 'Количество биопсий должно быть от 0 до 10' 
    });
  }

  // Семейная история
  if (!familyHistory) {
    errors.push({ field: 'familyHistory', message: 'Семейная история обязательна' });
    return errors;
  }

  if (familyHistory.breastCancerRelatives < 0 || familyHistory.breastCancerRelatives > 10) {
    errors.push({ 
      field: 'familyHistory.breastCancerRelatives', 
      message: 'Количество родственников с РМЖ должно быть от 0 до 10' 
    });
  }

  return errors;
};

// ========================================
// Основная логика расчета по модели Gail
// ========================================

const calculateGailRisk = async (
  input: GailCalculatorInput, 
  updateProgress: (progress: CalculationProgress) => void
): Promise<GailCalculatorResult> => {
  
  updateProgress({ step: 'validation', percentage: 10, message: 'Проверка данных...' });
  
  const { personalInfo, medicalHistory, familyHistory } = input;
  
  // 1. Базовый возрастной риск
  updateProgress({ step: 'base_rate', percentage: 25, message: 'Расчет базового риска...' });
  
  const ageKey = getClosestAge(personalInfo.age);
  let baseRate = GAIL_MODEL_CONSTANTS.BASE_RATES[ageKey];
  
  // 2. Корректировка по этнической принадлежности
  updateProgress({ step: 'race_adjustment', percentage: 35, message: 'Учет этнической принадлежности...' });
  
  const raceMultiplier = GAIL_MODEL_CONSTANTS.RELATIVE_RISKS.race[personalInfo.race];
  baseRate *= raceMultiplier;
  
  // 3. Факторы риска
  updateProgress({ step: 'risk_factors', percentage: 50, message: 'Анализ факторов риска...' });
  
  let relativeRisk = 1.0;
  
  // Возраст менархе
  let menarcheRisk = 1.0;
  if (medicalHistory.ageAtMenarche < 12) {
    menarcheRisk = GAIL_MODEL_CONSTANTS.RELATIVE_RISKS.ageAtMenarche['<12'];
  } else if (medicalHistory.ageAtMenarche === 12) {
    menarcheRisk = GAIL_MODEL_CONSTANTS.RELATIVE_RISKS.ageAtMenarche['12'];
  } else if (medicalHistory.ageAtMenarche === 13) {
    menarcheRisk = GAIL_MODEL_CONSTANTS.RELATIVE_RISKS.ageAtMenarche['13'];
  } else {
    menarcheRisk = GAIL_MODEL_CONSTANTS.RELATIVE_RISKS.ageAtMenarche['14+'];
  }
  relativeRisk *= menarcheRisk;
  
  // Возраст первых родов
  let birthRisk = 1.0;
  if (!medicalHistory.ageAtFirstBirth) {
    birthRisk = GAIL_MODEL_CONSTANTS.RELATIVE_RISKS.ageAtFirstBirth.nulliparous;
  } else if (medicalHistory.ageAtFirstBirth < 20) {
    birthRisk = GAIL_MODEL_CONSTANTS.RELATIVE_RISKS.ageAtFirstBirth['<20'];
  } else if (medicalHistory.ageAtFirstBirth < 25) {
    birthRisk = GAIL_MODEL_CONSTANTS.RELATIVE_RISKS.ageAtFirstBirth['20-24'];
  } else if (medicalHistory.ageAtFirstBirth < 30) {
    birthRisk = GAIL_MODEL_CONSTANTS.RELATIVE_RISKS.ageAtFirstBirth['25-29'];
  } else {
    birthRisk = GAIL_MODEL_CONSTANTS.RELATIVE_RISKS.ageAtFirstBirth['30+'];
  }
  relativeRisk *= birthRisk;
  
  // Биопсии молочной железы
  let biopsyRisk = 1.0;
  if (medicalHistory.numberOfBiopsies === 0) {
    biopsyRisk = GAIL_MODEL_CONSTANTS.RELATIVE_RISKS.numberOfBiopsies[0];
  } else if (medicalHistory.numberOfBiopsies === 1) {
    biopsyRisk = GAIL_MODEL_CONSTANTS.RELATIVE_RISKS.numberOfBiopsies[1];
  } else {
    biopsyRisk = GAIL_MODEL_CONSTANTS.RELATIVE_RISKS.numberOfBiopsies['2+'];
  }
  relativeRisk *= biopsyRisk;
  
  // Атипичная гиперплазия
  if (medicalHistory.atypicalHyperplasia) {
    relativeRisk *= GAIL_MODEL_CONSTANTS.RELATIVE_RISKS.atypicalHyperplasia.present;
  }
  
  // Семейная история
  updateProgress({ step: 'family_history', percentage: 65, message: 'Анализ семейной истории...' });
  
  let familyRisk = 1.0;
  const breastCancerRelatives = familyHistory.breastCancerRelatives || 0;
  if (breastCancerRelatives === 0) {
    familyRisk = GAIL_MODEL_CONSTANTS.RELATIVE_RISKS.familyHistory[0];
  } else if (breastCancerRelatives === 1) {
    familyRisk = GAIL_MODEL_CONSTANTS.RELATIVE_RISKS.familyHistory[1];
  } else {
    familyRisk = GAIL_MODEL_CONSTANTS.RELATIVE_RISKS.familyHistory['2+'];
  }
  relativeRisk *= familyRisk;
  
  // 4. Финальный расчет
  updateProgress({ step: 'final_calculation', percentage: 80, message: 'Финальный расчет рисков...' });
  
  const fiveYearRisk = baseRate * relativeRisk;
  const lifetimeMultiplier = GAIL_MODEL_CONSTANTS.LIFETIME_RISK_MULTIPLIERS[ageKey];
  const lifetimeRisk = Math.min(fiveYearRisk * lifetimeMultiplier, 0.85); // Максимум 85%
  
  // 5. Генерация факторов риска для отображения
  updateProgress({ step: 'risk_factors_generation', percentage: 90, message: 'Анализ факторов риска...' });
  
  const riskFactors: RiskFactor[] = [
    {
      name: 'Возраст',
      value: `${personalInfo.age} лет`,
      impact: personalInfo.age > 50 ? 'high' : personalInfo.age > 40 ? 'moderate' : 'neutral',
      description: personalInfo.age > 50 ? 'Риск увеличивается с возрастом' : 'Возрастной фактор в норме',
      evidenceLevel: 'high',
    },
    {
      name: 'Возраст менархе',
      value: `${medicalHistory.ageAtMenarche} лет`,
      impact: medicalHistory.ageAtMenarche < 12 ? 'moderate' : 'neutral',
      description: medicalHistory.ageAtMenarche < 12 ? 'Ранняя менструация повышает риск' : 'Возраст менархе в норме',
      evidenceLevel: 'moderate',
    },
    {
      name: 'Репродуктивная история',
      value: medicalHistory.ageAtFirstBirth ? `Первые роды в ${medicalHistory.ageAtFirstBirth} лет` : 'Не рожала',
      impact: !medicalHistory.ageAtFirstBirth || medicalHistory.ageAtFirstBirth > 30 ? 'moderate' : 'protective',
      description: !medicalHistory.ageAtFirstBirth ? 'Отсутствие родов повышает риск' : 
                   medicalHistory.ageAtFirstBirth > 30 ? 'Поздние роды повышают риск' : 'Репродуктивная история снижает риск',
      evidenceLevel: 'high',
    },
    {
      name: 'Биопсии молочной железы',
      value: `${medicalHistory.numberOfBiopsies} биопсий`,
      impact: medicalHistory.numberOfBiopsies > 1 ? 'high' : medicalHistory.numberOfBiopsies === 1 ? 'moderate' : 'neutral',
      description: medicalHistory.numberOfBiopsies > 1 ? 'Множественные биопсии значительно повышают риск' :
                   medicalHistory.numberOfBiopsies === 1 ? 'Биопсия умеренно повышает риск' : 'Биопсии не проводились',
      evidenceLevel: 'high',
    },
    {
      name: 'Семейная история',
      value: `${breastCancerRelatives} родственников с РМЖ`,
      impact: breastCancerRelatives > 1 ? 'high' : breastCancerRelatives === 1 ? 'moderate' : 'neutral',
      description: breastCancerRelatives > 1 ? 'Множественные случаи в семье значительно повышают риск' :
                   breastCancerRelatives === 1 ? 'Семейная история умеренно повышает риск' : 'Семейная история не отягощена',
      evidenceLevel: 'high',
    },
  ];

  // Добавляем атипичную гиперплазию если есть
  if (medicalHistory.atypicalHyperplasia) {
    riskFactors.push({
      name: 'Атипичная гиперплазия',
      value: 'Диагностирована',
      impact: 'high',
      description: 'Атипичная гиперплазия значительно повышает риск рака молочной железы',
      evidenceLevel: 'high',
    });
  }

  // 6. Генерация рекомендаций
  updateProgress({ step: 'recommendations', percentage: 95, message: 'Создание рекомендаций...' });
  
  const recommendations: Recommendation[] = [];
  const riskLevel = getRiskLevel(fiveYearRisk);

  // Скрининговые рекомендации
  if (riskLevel === 'very_high') {
    recommendations.push({
      type: 'screening',
      priority: 'urgent',
      title: 'Усиленный скрининг рака молочной железы',
      description: 'Ваш высокий риск требует более частого и интенсивного наблюдения',
      actionItems: [
        'Маммография каждые 6-12 месяцев начиная с 35-40 лет',
        'МРТ молочных желез ежегодно',
        'Консультация онколога-маммолога',
        'Рассмотрение генетического тестирования на BRCA1/BRCA2',
        'Обсуждение химиопрофилактики с врачом'
      ],
      evidenceLevel: 'high',
    });
  } else if (riskLevel === 'high') {
    recommendations.push({
      type: 'screening',
      priority: 'high',
      title: 'Интенсивный скрининг рака молочной железы',
      description: 'Рекомендуется более частое наблюдение чем стандартное',
      actionItems: [
        'Маммография ежегодно начиная с 40 лет',
        'Рассмотрение МРТ при наличии семейной истории',
        'Регулярное самообследование молочных желез',
        'Консультация маммолога при изменениях'
      ],
      evidenceLevel: 'high',
    });
  } else {
    recommendations.push({
      type: 'screening',
      priority: 'medium',
      title: 'Стандартный скрининг рака молочной железы',
      description: 'Следуйте стандартным рекомендациям по скринингу',
      actionItems: [
        'Маммография каждые 2 года после 50 лет',
        'Ежемесячное самообследование молочных желез',
        'Ежегодные осмотры у гинеколога',
        'Обращение к врачу при любых изменениях'
      ],
      evidenceLevel: 'high',
    });
  }

  // Генетические рекомендации
  if (familyHistory.breastCancerRelatives > 1 || familyHistory.knownGeneticMutations?.length || familyHistory.maleBreastCancer) {
    recommendations.push({
      type: 'genetic',
      priority: 'high',
      title: 'Генетическое консультирование',
      description: 'Семейная история указывает на возможную наследственную предрасположенность',
      actionItems: [
        'Консультация медицинского генетика',
        'Генетическое тестирование на BRCA1, BRCA2, PALB2, CHEK2',
        'Составление подробной генеалогии заболеваний в семье',
        'Обсуждение результатов с онкологом',
        'Консультирование других членов семьи при выявлении мутаций'
      ],
      evidenceLevel: 'high',
    });
  }

  // Образ жизни
  const bmi = calculateBMI(personalInfo.height, personalInfo.weight);
  const lifestyleRecommendations: string[] = [];
  
  if (bmi > 25) {
    lifestyleRecommendations.push('Снижение веса до нормальных значений ИМТ (18.5-24.9)');
  }
  
  lifestyleRecommendations.push(
    'Регулярная физическая активность (минимум 150 минут умеренной активности в неделю)',
    'Средиземноморская диета богатая овощами, фруктами, цельными злаками',
    'Ограничение алкоголя (не более 1 порции в день)',
    'Отказ от курения',
    'Поддержание здорового веса',
    'Управление стрессом и качественный сон'
  );

  recommendations.push({
    type: 'lifestyle',
    priority: 'medium',
    title: 'Модификация образа жизни',
    description: 'Здоровый образ жизни может снизить риск рака молочной железы на 20-30%',
    actionItems: lifestyleRecommendations,
    evidenceLevel: 'moderate',
  });

  // Медицинские рекомендации
  if (medicalHistory.atypicalHyperplasia || medicalHistory.lobularCarcinomaInSitu) {
    recommendations.push({
      type: 'medical',
      priority: 'high',
      title: 'Наблюдение высокорискового состояния',
      description: 'Выявленные изменения в молочных железах требуют специального наблюдения',
      actionItems: [
        'Регулярные консультации онколога-маммолога',
        'Обсуждение химиопрофилактики (тамоксифен, ралоксифен)',
        'Более частая маммография и МРТ',
        'Рассмотрение профилактической мастэктомии при очень высоком риске'
      ],
      evidenceLevel: 'high',
    });
  }

  updateProgress({ step: 'complete', percentage: 100, message: 'Расчет завершен!' });

  // Сравнение со средним популяционным риском
  const averageRisk = GAIL_MODEL_CONSTANTS.BASE_RATES[ageKey];
  const comparedToAverage = fiveYearRisk / averageRisk;

  return {
    fiveYearRisk,
    lifetimeRisk,
    riskLevel,
    comparedToAverage,
    riskFactors,
    recommendations,
  };
};

// ========================================
// Основной хук
// ========================================

export const useGailCalculator = (): UseGailCalculatorReturn => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [progress, setProgress] = useState<CalculationProgress | null>(null);
  const cacheRef = useRef<Map<string, GailCalculatorResult>>(new Map());

  const calculate = useCallback(async (input: GailCalculatorInput): Promise<GailCalculatorResult> => {
    setIsCalculating(true);
    setProgress({ step: 'start', percentage: 0, message: 'Начинаем расчет...' });

    try {
      // Проверяем кэш
      const cacheKey = JSON.stringify(input);
      const cached = cacheRef.current.get(cacheKey);
      if (cached) {
        setProgress({ step: 'cached', percentage: 100, message: 'Результат из кэша' });
        await new Promise(resolve => setTimeout(resolve, 500));
        return cached;
      }

      // Валидация входных данных
      const validationErrors = validateInput(input);
      if (validationErrors.length > 0) {
        throw new Error(`Ошибки валидации: ${validationErrors.map(e => e.message).join(', ')}`);
      }

      // Расчет
      const result = await calculateGailRisk(input, setProgress);
      
      // Сохраняем в кэш
      cacheRef.current.set(cacheKey, result);
      
      return result;
    } catch (error) {
      console.error('Ошибка расчета риска:', error);
      throw error;
    } finally {
      setIsCalculating(false);
      setTimeout(() => setProgress(null), 2000);
    }
  }, []);

  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  return {
    calculate,
    validateInput,
    isCalculating,
    progress,
    formatRisk: formatRiskPercentage,
    getRiskLevel,
    clearCache,
  };
};