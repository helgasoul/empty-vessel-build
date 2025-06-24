import { useState, useCallback, useEffect } from 'react';

// Типы для эмоциональной поддержки
interface EmotionalState {
  anxietyLevel: 'low' | 'medium' | 'high' | 'unknown';
  readinessScore: number; // 0-100
  isReadyForResults: boolean;
  preferredDisclosureStyle: 'direct' | 'gentle' | 'gradual';
  completedPreparation: boolean;
}

interface RelaxationTechnique {
  id: string;
  name: string;
  description: string;
  duration: number; // в секундах
  instructions: string[];
  audioUrl?: string;
}

interface GailInput {
  age: number;
  ageAtFirstPeriod: number;
  ageAtFirstBirth: number | null;
  relatives: number;
  biopsies: number;
  raceEthnicity: string;
}

interface GailResult {
  fiveYearRisk: number;
  lifetimeRisk: number;
  riskLevel: 'low' | 'average' | 'high';
  factors: RiskFactor[];
  explanation: GailExplanation;
}

interface RiskFactor {
  name: string;
  value: any;
  impact: 'increases' | 'decreases' | 'neutral';
  weight: number;
  explanation: string;
}

interface GailExplanation {
  plainLanguage: string;
  stepByStep: CalculationStep[];
  limitations: string[];
  confidence: number;
  nextSteps: string[];
}

interface CalculationStep {
  factor: string;
  value: any;
  contribution: number;
  explanation: string;
}

interface PreparationStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
  estimatedTime: number;
}

export const useEnhancedGailCalculator = () => {
  // Основное состояние
  const [gailInput, setGailInput] = useState<GailInput | null>(null);
  const [gailResult, setGailResult] = useState<GailResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  
  // Эмоциональное состояние
  const [emotionalState, setEmotionalState] = useState<EmotionalState>({
    anxietyLevel: 'unknown',
    readinessScore: 0,
    isReadyForResults: false,
    preferredDisclosureStyle: 'gentle',
    completedPreparation: false
  });
  
  // Состояние подготовки
  const [preparationSteps, setPreparationSteps] = useState<PreparationStep[]>([]);
  const [currentPreparationStep, setCurrentPreparationStep] = useState<number>(0);
  const [showingResults, setShowingResults] = useState(false);
  const [resultsDisclosureStage, setResultsDisclosureStage] = useState<number>(0);

  // Техники релаксации
  const relaxationTechniques: RelaxationTechnique[] = [
    {
      id: 'breathing',
      name: 'Дыхательная техника 4-7-8',
      description: 'Простое упражнение для снижения тревожности',
      duration: 120,
      instructions: [
        'Сядьте удобно и закройте глаза',
        'Вдохните через нос на 4 счета',
        'Задержите дыхание на 7 счетов',
        'Выдохните через рот на 8 счетов',
        'Повторите 4 раза'
      ]
    },
    {
      id: 'grounding',
      name: 'Техника заземления 5-4-3-2-1',
      description: 'Помогает сосредоточиться на настоящем моменте',
      duration: 180,
      instructions: [
        'Назовите 5 вещей, которые видите',
        'Назовите 4 вещи, которые слышите',
        'Назовите 3 вещи, которые чувствуете тактильно',
        'Назовите 2 запаха, которые ощущаете',
        'Назовите 1 вкус во рту'
      ]
    },
    {
      id: 'progressive',
      name: 'Прогрессивная мышечная релаксация',
      description: 'Поочередное напряжение и расслабление мышц',
      duration: 300,
      instructions: [
        'Начните с пальцев ног - напрягите на 5 секунд, затем расслабьте',
        'Переходите к икрам, бедрам, ягодицам',
        'Напрягите и расслабьте мышцы живота',
        'Поработайте с руками - от кистей к плечам',
        'Завершите мышцами лица и головы'
      ]
    }
  ];

  // Инициализация шагов подготовки
  useEffect(() => {
    setPreparationSteps([
      {
        id: 'anxiety-assessment',
        title: 'Оценка эмоционального состояния',
        description: 'Понимание вашего текущего состояния поможет подготовиться к получению результатов',
        completed: false,
        required: true,
        estimatedTime: 60
      },
      {
        id: 'information-preference',
        title: 'Настройка подачи информации',
        description: 'Выберите, как вы хотели бы получать результаты',
        completed: false,
        required: true,
        estimatedTime: 30
      },
      {
        id: 'relaxation',
        title: 'Техника релаксации',
        description: 'Подготовим вас эмоционально к получению результатов',
        completed: false,
        required: false,
        estimatedTime: 180
      },
      {
        id: 'support-check',
        title: 'Проверка поддержки',
        description: 'Убедимся, что у вас есть поддержка после получения результатов',
        completed: false,
        required: true,
        estimatedTime: 45
      }
    ]);
  }, []);

  // Оценка тревожности
  const assessAnxiety = useCallback((responses: {
    feelingNervous: number; // 1-5
    worriedAboutHealth: number; // 1-5
    sleepQuality: number; // 1-5
    physicalSymptoms: string[];
    previousExperience: 'positive' | 'negative' | 'none';
  }) => {
    let anxietyScore = 0;
    
    // Расчет на основе ответов
    anxietyScore += responses.feelingNervous * 2;
    anxietyScore += responses.worriedAboutHealth * 2;
    anxietyScore += (6 - responses.sleepQuality) * 1.5;
    anxietyScore += responses.physicalSymptoms.length * 1;
    
    if (responses.previousExperience === 'negative') anxietyScore += 3;
    if (responses.previousExperience === 'positive') anxietyScore -= 2;
    
    let level: 'low' | 'medium' | 'high';
    if (anxietyScore <= 8) level = 'low';
    else if (anxietyScore <= 16) level = 'medium';
    else level = 'high';
    
    const readinessScore = Math.max(0, 100 - anxietyScore * 4);
    
    setEmotionalState(prev => ({
      ...prev,
      anxietyLevel: level,
      readinessScore,
      isReadyForResults: level === 'low' || readinessScore > 60
    }));
    
    // Обновляем статус первого шага
    setPreparationSteps(prev => 
      prev.map(step => 
        step.id === 'anxiety-assessment' 
          ? { ...step, completed: true }
          : step
      )
    );
    
    return { level, readinessScore };
  }, []);

  // Выбор стиля подачи информации
  const setDisclosurePreference = useCallback((style: 'direct' | 'gentle' | 'gradual') => {
    setEmotionalState(prev => ({
      ...prev,
      preferredDisclosureStyle: style
    }));
    
    setPreparationSteps(prev => 
      prev.map(step => 
        step.id === 'information-preference' 
          ? { ...step, completed: true }
          : step
      )
    );
  }, []);

  // Выполнение техники релаксации
  const performRelaxation = useCallback((techniqueId: string) => {
    return new Promise<boolean>((resolve) => {
      const technique = relaxationTechniques.find(t => t.id === techniqueId);
      if (!technique) {
        resolve(false);
        return;
      }
      
      // Имитация выполнения техники (в реальном приложении здесь будет интерактивная сессия)
      setTimeout(() => {
        setEmotionalState(prev => ({
          ...prev,
          readinessScore: Math.min(100, prev.readinessScore + 15),
          anxietyLevel: prev.anxietyLevel === 'high' ? 'medium' : 
                      prev.anxietyLevel === 'medium' ? 'low' : prev.anxietyLevel
        }));
        
        setPreparationSteps(prev => 
          prev.map(step => 
            step.id === 'relaxation' 
              ? { ...step, completed: true }
              : step
          )
        );
        
        resolve(true);
      }, technique.duration * 1000);
    });
  }, []);

  // Проверка системы поддержки
  const checkSupportSystem = useCallback((supportData: {
    hasEmergencyContact: boolean;
    hasSupportPerson: boolean;
    comfortableDiscussing: boolean;
    knowsNextSteps: boolean;
  }) => {
    const supportScore = Object.values(supportData).filter(Boolean).length;
    const isAdequateSupport = supportScore >= 3;
    
    setPreparationSteps(prev => 
      prev.map(step => 
        step.id === 'support-check' 
          ? { ...step, completed: true }
          : step
      )
    );
    
    if (isAdequateSupport) {
      setEmotionalState(prev => ({
        ...prev,
        readinessScore: Math.min(100, prev.readinessScore + 10)
      }));
    }
    
    return isAdequateSupport;
  }, []);

  // Проверка готовности к получению результатов
  const checkReadiness = useCallback((): boolean => {
    const requiredSteps = preparationSteps.filter(step => step.required);
    const completedRequired = requiredSteps.filter(step => step.completed);
    
    const allRequiredCompleted = completedRequired.length === requiredSteps.length;
    const emotionallyReady = emotionalState.readinessScore >= 60;
    
    const isReady = allRequiredCompleted && emotionallyReady;
    
    setEmotionalState(prev => ({
      ...prev,
      isReadyForResults: isReady,
      completedPreparation: isReady
    }));
    
    return isReady;
  }, [preparationSteps, emotionalState.readinessScore]);

  // Расчет Gail с эмоциональной подготовкой
  const calculateGailScore = useCallback((input: GailInput): Promise<GailResult> => {
    return new Promise((resolve) => {
      setIsCalculating(true);
      
      // Симуляция расчета (здесь будет реальная логика Gail Model)
      setTimeout(() => {
        // Базовый расчет (упрощенная версия)
        let riskScore = 0;
        
        // Возраст
        if (input.age >= 50) riskScore += 0.8;
        else if (input.age >= 40) riskScore += 0.4;
        
        // Возраст первых месячных
        if (input.ageAtFirstPeriod <= 12) riskScore += 0.3;
        
        // Возраст первых родов
        if (input.ageAtFirstBirth === null || input.ageAtFirstBirth >= 30) {
          riskScore += 0.5;
        }
        
        // Родственники с раком груди
        riskScore += input.relatives * 0.6;
        
        // Биопсии
        riskScore += input.biopsies * 0.4;
        
        const fiveYearRisk = Math.min(riskScore, 5);
        const lifetimeRisk = Math.min(riskScore * 4, 20);
        
        const riskLevel: 'low' | 'average' | 'high' = 
          fiveYearRisk < 1.7 ? 'low' : 
          fiveYearRisk < 3.0 ? 'average' : 'high';
        
        const factors: RiskFactor[] = [
          {
            name: 'Возраст',
            value: input.age,
            impact: input.age >= 40 ? 'increases' : 'neutral',
            weight: input.age >= 50 ? 0.3 : 0.1,
            explanation: input.age >= 40 
              ? 'Риск рака груди увеличивается с возрастом'
              : 'Ваш возраст не увеличивает риск значительно'
          },
          {
            name: 'Семейная история',
            value: input.relatives,
            impact: input.relatives > 0 ? 'increases' : 'neutral',
            weight: input.relatives * 0.2,
            explanation: input.relatives > 0
              ? 'Наличие родственников с раком груди увеличивает риск'
              : 'Отсутствие семейной истории рака груди снижает риск'
          }
        ];
        
        const explanation: GailExplanation = {
          plainLanguage: generatePlainLanguageExplanation(fiveYearRisk, riskLevel),
          stepByStep: [
            {
              factor: 'Базовый риск по возрасту',
              value: input.age,
              contribution: input.age >= 50 ? 0.8 : 0.4,
              explanation: 'Риск увеличивается с возрастом'
            }
          ],
          limitations: [
            'Модель основана на данных о женщинах европейского происхождения',
            'Не учитывает генетические мутации BRCA1/BRCA2',
            'Предсказывает средний риск, индивидуальный может отличаться'
          ],
          confidence: 0.75,
          nextSteps: generateNextSteps(riskLevel)
        };
        
        const result: GailResult = {
          fiveYearRisk,
          lifetimeRisk,
          riskLevel,
          factors,
          explanation
        };
        
        setGailResult(result);
        setIsCalculating(false);
        resolve(result);
      }, 2000);
    });
  }, []);

  // Генерация объяснения простым языком
  const generatePlainLanguageExplanation = (risk: number, level: 'low' | 'average' | 'high'): string => {
    const riskPercent = (risk * 100).toFixed(1);
    
    switch (level) {
      case 'low':
        return `Ваш риск развития рака груди в ближайшие 5 лет составляет ${riskPercent}%. Это означает, что из 100 женщин с похожими характеристиками у ${riskPercent} может развиться рак груди. Это считается низким риском.`;
      
      case 'average':
        return `Ваш риск составляет ${riskPercent}%, что соответствует среднему уровню риска. Важно помнить, что это статистическая оценка, и регулярные обследования помогут обнаружить любые изменения на ранней стадии.`;
      
      case 'high':
        return `Ваш риск составляет ${riskPercent}%, что выше среднего. Это не означает, что у вас обязательно разовьется рак, но важно обсудить с врачом дополнительные меры профилактики и более частые обследования.`;
      
      default:
        return '';
    }
  };

  // Генерация следующих шагов
  const generateNextSteps = (riskLevel: 'low' | 'average' | 'high'): string[] => {
    const commonSteps = [
      'Обсудите результаты с вашим врачом',
      'Продолжайте регулярные самообследования',
      'Ведите здоровый образ жизни'
    ];
    
    switch (riskLevel) {
      case 'low':
        return [
          ...commonSteps,
          'Следуйте стандартному графику скрининга',
          'Маммография раз в 2 года после 50 лет'
        ];
      
      case 'average':
        return [
          ...commonSteps,
          'Рассмотрите возможность ежегодной маммографии после 40 лет',
          'Обсудите с врачом оптимальную частоту обследований'
        ];
      
      case 'high':
        return [
          ...commonSteps,
          'Рассмотрите возможность генетического консультирования',
          'Обсудите дополнительные методы скрининга (МРТ, УЗИ)',
          'Ежегодная маммография, возможно с более раннего возраста',
          'Рассмотрите профилактические меры с врачом'
        ];
      
      default:
        return commonSteps;
    }
  };

  // Градуальное раскрытие результатов
  const startGradualDisclosure = useCallback(async () => {
    if (!gailResult || !emotionalState.isReadyForResults) return;
    
    setShowingResults(true);
    setResultsDisclosureStage(1);
    
    // Этап 1: Подготовка к результатам
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Этап 2: Общая информация о процессе
    setResultsDisclosureStage(2);
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    // Этап 3: Основной результат
    setResultsDisclosureStage(3);
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Этап 4: Детальное объяснение
    setResultsDisclosureStage(4);
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Этап 5: Следующие шаги
    setResultsDisclosureStage(5);
  }, [gailResult, emotionalState.isReadyForResults]);

  // Основная функция подготовки к результатам
  const prepareForResults = useCallback(async () => {
    if (!gailInput) return false;
    
    // Проверяем готовность
    const isReady = checkReadiness();
    
    if (!isReady) {
      // Если не готов, предлагаем дополнительную подготовку
      if (emotionalState.anxietyLevel === 'high') {
        // Обязательная релаксация для высокой тревожности
        const relaxationComplete = await performRelaxation('breathing');
        if (!relaxationComplete) return false;
      }
    }
    
    // Рассчитываем результат
    await calculateGailScore(gailInput);
    
    // Начинаем градуальное раскрытие если выбран такой стиль
    if (emotionalState.preferredDisclosureStyle === 'gradual') {
      await startGradualDisclosure();
    }
    
    return true;
  }, [gailInput, checkReadiness, emotionalState, calculateGailScore, performRelaxation, startGradualDisclosure]);

  return {
    // Основные данные
    gailInput,
    setGailInput,
    gailResult,
    isCalculating,
    
    // Эмоциональное состояние
    emotionalState,
    preparationSteps,
    currentPreparationStep,
    showingResults,
    resultsDisclosureStage,
    
    // Техники релаксации
    relaxationTechniques,
    
    // Основные функции
    prepareForResults,
    calculateGailScore,
    
    // Функции подготовки
    assessAnxiety,
    setDisclosurePreference,
    performRelaxation,
    checkSupportSystem,
    checkReadiness,
    
    // Функции раскрытия результатов
    startGradualDisclosure,
    
    // Утилиты
    getProgressPercentage: () => {
      const completedSteps = preparationSteps.filter(s => s.completed).length;
      return (completedSteps / preparationSteps.length) * 100;
    },
    
    getEmotionalSupport: () => {
      switch (emotionalState.anxietyLevel) {
        case 'high':
          return {
            message: 'Мы понимаем, что ожидание результатов может вызывать тревогу. Давайте вместе подготовимся к их получению.',
            recommendedTechniques: ['breathing', 'grounding'],
            supportActions: ['call-support', 'schedule-consultation']
          };
        case 'medium':
          return {
            message: 'Это нормально - чувствовать волнение перед получением результатов. Мы поможем вам подготовиться.',
            recommendedTechniques: ['breathing'],
            supportActions: ['relaxation-session']
          };
        default:
          return {
            message: 'Вы готовы к получению результатов. Мы объясним все понятным языком.',
            recommendedTechniques: [],
            supportActions: []
          };
      }
    }
  };
};