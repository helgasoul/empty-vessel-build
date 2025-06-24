// services/api/gail-calculator.service.ts
// API сервис для Enhanced Gail Calculator с интеграцией ИИ

import { GailModelInput, GailModelResult, GailCalculationHistory, Enhancement } from '@/types/gail-calculator';
import { getBaseRisk, categorizeRisk } from '@/lib/constants/medical-constants';

// ========== КОНФИГУРАЦИЯ API ==========

interface GailCalculatorConfig {
  apiBaseUrl: string;
  apiKey: string;
  aiModelVersion: string;
  enableEnhancedFeatures: boolean;
  cacheResults: boolean;
  timeout: number;
}

const defaultConfig: GailCalculatorConfig = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.femcare.app',
  apiKey: process.env.NEXT_PUBLIC_API_KEY || '',
  aiModelVersion: '2024.1-enhanced',
  enableEnhancedFeatures: true,
  cacheResults: true,
  timeout: 30000, // 30 секунд
};

// ========== ОШИБКИ API ==========

export class GailCalculatorError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'GailCalculatorError';
  }
}

export class ValidationError extends GailCalculatorError {
  constructor(message: string, public field?: string) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}

export class NetworkError extends GailCalculatorError {
  constructor(message: string) {
    super(message, 'NETWORK_ERROR', 0);
    this.name = 'NetworkError';
  }
}

export class AIAnalysisError extends GailCalculatorError {
  constructor(message: string) {
    super(message, 'AI_ANALYSIS_ERROR', 503);
    this.name = 'AIAnalysisError';
  }
}

// ========== ОСНОВНОЙ СЕРВИС ==========

export class GailCalculatorService {
  private config: GailCalculatorConfig;
  private cache: Map<string, { result: GailModelResult; timestamp: number }>;
  private readonly CACHE_TTL = 24 * 60 * 60 * 1000; // 24 часа

  constructor(config: Partial<GailCalculatorConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    this.cache = new Map();
  }

  // ========== ПУБЛИЧНЫЕ МЕТОДЫ ==========

  /**
   * Основной метод расчета риска с Enhanced возможностями
   */
  async calculateRisk(input: GailModelInput): Promise<GailModelResult> {
    const startTime = Date.now();

    try {
      // Валидация входных данных
      this.validateInput(input);

      // Проверка кеша
      const cacheKey = this.generateCacheKey(input);
      if (this.config.cacheResults) {
        const cached = this.getFromCache(cacheKey);
        if (cached) {
          return cached;
        }
      }

      // Основной расчет Gail Model
      const standardResult = await this.calculateStandardGail(input);

      // Enhanced анализ с ИИ (если включен)
      let enhancedResult = standardResult;
      if (this.config.enableEnhancedFeatures) {
        try {
          enhancedResult = await this.enhanceWithAI(standardResult, input);
        } catch (error) {
          console.warn('ИИ-анализ недоступен, используется стандартный расчет:', error);
          // Продолжаем со стандартным результатом
        }
      }

      // Генерация рекомендаций
      const finalResult = await this.generateRecommendations(enhancedResult, input);

      // Добавление метаданных
      finalResult.calculationMetadata.processingTime = Date.now() - startTime;

      // Кеширование результата
      if (this.config.cacheResults) {
        this.setCache(cacheKey, finalResult);
      }

      return finalResult;

    } catch (error) {
      console.error('Ошибка при расчете риска:', error);
      
      if (error instanceof GailCalculatorError) {
        throw error;
      }
      
      throw new GailCalculatorError(
        `Не удалось рассчитать риск: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`
      );
    }
  }

  /**
   * Сохранение результатов в базу данных
   */
  async saveCalculation(
    input: GailModelInput, 
    result: GailModelResult, 
    patientId?: string,
    notes?: string
  ): Promise<string> {
    try {
      const calculationData = {
        patientId,
        input,
        result,
        notes,
        timestamp: new Date().toISOString()
      };

      const response = await this.makeApiRequest('/api/v1/gail-calculations', {
        method: 'POST',
        body: JSON.stringify(calculationData),
      });

      if (!response.ok) {
        throw new GailCalculatorError(
          `Ошибка сохранения: HTTP ${response.status}`,
          'SAVE_ERROR',
          response.status
        );
      }

      const { id } = await response.json();
      return id;

    } catch (error) {
      console.error('Ошибка при сохранении:', error);
      
      if (error instanceof GailCalculatorError) {
        throw error;
      }
      
      throw new GailCalculatorError('Не удалось сохранить результаты расчета');
    }
  }

  /**
   * Загрузка истории расчетов для пациента
   */
  async loadHistory(patientId: string, limit: number = 10): Promise<GailCalculationHistory[]> {
    try {
      const response = await this.makeApiRequest(
        `/api/v1/gail-calculations/history/${encodeURIComponent(patientId)}?limit=${limit}`
      );

      if (!response.ok) {
        throw new GailCalculatorError(
          `Ошибка загрузки истории: HTTP ${response.status}`,
          'LOAD_HISTORY_ERROR',
          response.status
        );
      }

      return await response.json();

    } catch (error) {
      console.error('Ошибка при загрузке истории:', error);
      
      if (error instanceof GailCalculatorError) {
        throw error;
      }
      
      // Возвращаем пустой массив в случае ошибки
      return [];
    }
  }

  /**
   * Экспорт результатов в различные форматы
   */
  async exportResults(
    result: GailModelResult, 
    format: 'pdf' | 'json' | 'csv' = 'pdf'
  ): Promise<Blob> {
    try {
      const response = await this.makeApiRequest('/api/v1/export/gail-results', {
        method: 'POST',
        body: JSON.stringify({ result, format }),
      });

      if (!response.ok) {
        throw new GailCalculatorError(
          `Ошибка экспорта: HTTP ${response.status}`,
          'EXPORT_ERROR',
          response.status
        );
      }

      return await response.blob();

    } catch (error) {
      console.error('Ошибка при экспорте:', error);
      
      if (error instanceof GailCalculatorError) {
        throw error;
      }
      
      throw new GailCalculatorError('Не удалось экспортировать результаты');
    }
  }

  /**
   * Проверка статуса API
   */
  async checkApiStatus(): Promise<{ status: 'online' | 'offline'; version: string; features: string[] }> {
    try {
      const response = await this.makeApiRequest('/api/v1/health');
      
      if (!response.ok) {
        return { status: 'offline', version: 'unknown', features: [] };
      }
      
      const data = await response.json();
      return {
        status: 'online',
        version: data.version || 'unknown',
        features: data.features || []
      };
      
    } catch (error) {
      console.warn('API недоступен:', error);
      return { status: 'offline', version: 'unknown', features: [] };
    }
  }

  // ========== ПРИВАТНЫЕ МЕТОДЫ ==========

  /**
   * Валидация входных данных
   */
  private validateInput(input: GailModelInput): void {
    const errors: string[] = [];

    // Обязательные поля
    if (!input.age || input.age < 35 || input.age > 90) {
      errors.push('Возраст должен быть от 35 до 90 лет');
    }

    if (!input.race) {
      errors.push('Необходимо указать расу/этническую принадлежность');
    }

    if (input.ageAtMenarche < 9 || input.ageAtMenarche > 16) {
      errors.push('Возраст первой менструации должен быть от 9 до 16 лет');
    }

    if (input.ageAtFirstBirth !== null && (input.ageAtFirstBirth < 15 || input.ageAtFirstBirth > 50)) {
      errors.push('Возраст первых родов должен быть от 15 до 50 лет или null для нерожавших');
    }

    if (input.numberOfBiopsies < 0 || input.numberOfBiopsies > 10) {
      errors.push('Количество биопсий должно быть от 0 до 10');
    }

    if (input.firstDegreeRelatives < 0 || input.firstDegreeRelatives > 10) {
      errors.push('Количество родственников не может быть отрицательным или больше 10');
    }

    // Enhanced поля (если указаны)
    if (input.bmi !== undefined && (input.bmi < 15 || input.bmi > 50)) {
      errors.push('ИМТ должен быть от 15 до 50');
    }

    if (errors.length > 0) {
      throw new ValidationError(`Ошибки валидации: ${errors.join(', ')}`);
    }
  }

  /**
   * Стандартный расчет Gail Model
   */
  private async calculateStandardGail(input: GailModelInput): Promise<GailModelResult> {
    // Базовые коэффициенты риска
    const ageRiskFactor = this.getAgeRiskFactor(input.age);
    const raceRiskFactor = this.getRaceRiskFactor(input.race);
    const reproductiveRiskFactor = this.getReproductiveRiskFactor(input);
    const biopsyRiskFactor = this.getBiopsyRiskFactor(input);
    const familyRiskFactor = this.getFamilyRiskFactor(input);

    // Базовый риск для возраста и расы
    const baseRisk = getBaseRisk(input.age, input.race);

    // Расчет 5-летнего риска
    const fiveYearRisk = baseRisk * ageRiskFactor * raceRiskFactor * 
      reproductiveRiskFactor * biopsyRiskFactor * familyRiskFactor;

    // Расчет пожизненного риска
    const lifetimeRisk = this.calculateLifetimeRisk(fiveYearRisk, input.age);

    // Определение категории риска
    const riskCategory = categorizeRisk(fiveYearRisk);

    // Расчет уровня достоверности
    const confidenceLevel = this.calculateConfidence(input);

    return {
      fiveYearRisk: Math.round(fiveYearRisk * 100) / 100,
      lifetimeRisk: Math.round(lifetimeRisk * 100) / 100,
      averageRisk: Math.round(baseRisk * 100) / 100,
      relativeRisk: Math.round((fiveYearRisk / baseRisk) * 100) / 100,
      riskCategory,
      confidenceLevel,
      dataCompleteness: this.calculateDataCompleteness(input),
      recommendations: [], // Будут заполнены позже
      screeningProtocol: {
        mammographyFrequency: 'annual',
        startAge: 50,
        clinicalExamFrequency: 'annual',
        selfExamRecommended: true
      },
      calculationMetadata: {
        modelVersion: this.config.aiModelVersion,
        calculationDate: new Date(),
        inputHash: this.generateInputHash(input),
        processingTime: 0, // Будет заполнено позже
        enhancementsUsed: []
      }
    };
  }

  /**
   * Улучшение результатов с помощью ИИ
   */
  private async enhanceWithAI(
    result: GailModelResult, 
    input: GailModelInput
  ): Promise<GailModelResult> {
    try {
      // Анализ дополнительных факторов риска
      const enhancedFactors = await this.analyzeEnhancedFactors(input);
      
      // Корректировка риска на основе ИИ-анализа
      const aiAdjustmentFactor = this.calculateAIAdjustment(enhancedFactors);
      
      const enhancedResult: GailModelResult = {
        ...result,
        fiveYearRisk: Math.round((result.fiveYearRisk * aiAdjustmentFactor) * 100) / 100,
        lifetimeRisk: Math.round((result.lifetimeRisk * aiAdjustmentFactor) * 100) / 100,
        enhancedFactors,
        calculationMetadata: {
          ...result.calculationMetadata,
          enhancementsUsed: [
            {
              type: 'ai-analysis',
              version: this.config.aiModelVersion,
              confidence: enhancedFactors?.environmentalRisk.score || 85,
              dataSource: 'internal-ai-models'
            }
          ]
        }
      };

      // Пересчитываем категорию риска после AI корректировки
      enhancedResult.riskCategory = categorizeRisk(enhancedResult.fiveYearRisk);

      return enhancedResult;

    } catch (error) {
      console.warn('ИИ-анализ недоступен:', error);
      throw new AIAnalysisError('Сервис ИИ-анализа временно недоступен');
    }
  }

  /**
   * Анализ дополнительных факторов риска с помощью ИИ
   */
  private async analyzeEnhancedFactors(input: GailModelInput) {
    // В реальном приложении здесь бы был вызов к ИИ-сервисам
    // Сейчас используем mock данные с логикой
    
    let environmentalScore = 20; // базовый уровень
    let lifestyleScore = 30;
    let geneticScore = 15;

    // Анализ факторов образа жизни
    if (input.bmi && input.bmi > 30) lifestyleScore += 15;
    if (input.smokingHistory?.status === 'current') lifestyleScore += 20;
    if (input.alcoholConsumption === 'heavy') lifestyleScore += 10;
    if (input.physicalActivity === 'sedentary') lifestyleScore += 10;

    // Анализ генетических факторов
    if (input.geneticTestingResults && input.geneticTestingResults.length > 0) {
      const hasPathogenic = input.geneticTestingResults.some(r => r.result === 'positive');
      if (hasPathogenic) geneticScore += 60;
    }

    // Анализ семейного анамнеза
    if (input.firstDegreeRelatives > 1) geneticScore += 20;

    return {
      environmentalRisk: {
        score: Math.min(environmentalScore, 100),
        factors: ['Качество воздуха в регионе', 'УФ-излучение'],
        impact: environmentalScore > 50 ? 'high' as const : 
                environmentalScore > 30 ? 'moderate' as const : 'low' as const
      },
      lifestyleRisk: {
        score: Math.min(lifestyleScore, 100),
        modifiableFactors: this.generateLifestyleFactors(input),
        potentialReduction: Math.max(0, lifestyleScore - 20) // потенциальное снижение
      },
      geneticPredisposition: {
        score: Math.min(geneticScore, 100),
        knownMutations: input.geneticTestingResults || [],
        recommendation: geneticScore > 50 ? 
          'Рекомендуется генетическое консультирование' :
          'Генетический риск в пределах нормы'
      }
    };
  }

  /**
   * Генерация персональных рекомендаций
   */
  private async generateRecommendations(
    result: GailModelResult, 
    input: GailModelInput
  ): Promise<GailModelResult> {
    const recommendations = [];

    // Рекомендации по скринингу
    if (result.riskCategory === 'высокий') {
      recommendations.push({
        category: 'screening' as const,
        priority: 'high' as const,
        title: 'Высокорисковый скрининг',
        description: 'МРТ молочных желез + маммография ежегодно, начиная с 30 лет',
        evidence: 'I' as const,
        timeline: 'немедленно',
        provider: 'онколог-маммолог'
      });
    } else if (result.riskCategory === 'повышенный') {
      recommendations.push({
        category: 'screening' as const,
        priority: 'high' as const,
        title: 'Усиленный скрининг',
        description: 'Ежегодная маммография с 40 лет, рассмотреть УЗИ',
        evidence: 'I' as const,
        timeline: 'в течение 3 месяцев',
        provider: 'маммолог'
      });
    } else {
      recommendations.push({
        category: 'screening' as const,
        priority: 'medium' as const,
        title: 'Стандартный скрининг',
        description: 'Маммография каждые 2 года после 50 лет',
        evidence: 'I' as const,
        timeline: 'плановое обследование',
        provider: 'терапевт/гинеколог'
      });
    }

    // Генетические рекомендации
    if (input.firstDegreeRelatives > 0) {
      recommendations.push({
        category: 'genetic' as const,
        priority: 'medium' as const,
        title: 'Генетическое консультирование',
        description: 'Оценка необходимости тестирования на мутации BRCA1/BRCA2',
        evidence: 'I' as const,
        timeline: 'в течение 6 месяцев',
        provider: 'врач-генетик'
      });
    }

    // Рекомендации по образу жизни
    if (result.enhancedFactors?.lifestyleRisk.potentialReduction && 
        result.enhancedFactors.lifestyleRisk.potentialReduction > 10) {
      recommendations.push({
        category: 'lifestyle' as const,
        priority: 'medium' as const,
        title: 'Модификация образа жизни',
        description: `Возможно снижение риска на ${result.enhancedFactors.lifestyleRisk.potentialReduction}%`,
        evidence: 'II-1' as const,
        timeline: 'постепенное внедрение',
        provider: 'врач превентивной медицины'
      });
    }

    // Обновление протокола скрининга
    const screeningProtocol = this.generateScreeningProtocol(result.riskCategory, input.age);

    return {
      ...result,
      recommendations,
      screeningProtocol
    };
  }

  /**
   * Выполнение HTTP запроса к API
   */
  private async makeApiRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const url = `${this.config.apiBaseUrl}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
        'User-Agent': `FemCare-GailCalculator/${this.config.aiModelVersion}`,
      },
      signal: AbortSignal.timeout(this.config.timeout),
    };

    const mergedOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, mergedOptions);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new NetworkError('Превышено время ожидания запроса');
        }
        if (error.message.includes('Failed to fetch')) {
          throw new NetworkError('Нет подключения к серверу');
        }
      }
      throw new NetworkError(`Ошибка сети: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    }
  }

  // ========== УТИЛИТЫ ==========

  private getAgeRiskFactor(age: number): number {
    if (age < 40) return 0.5;
    if (age < 50) return 0.8;
    if (age < 60) return 1.0;
    if (age < 70) return 1.2;
    return 1.5;
  }

  private getRaceRiskFactor(race: string): number {
    const factors = {
      'white': 1.0,
      'african-american': 0.9,
      'hispanic': 0.8,
      'asian-pacific': 0.7,
      'native-american': 0.8,
      'other': 0.9
    };
    return factors[race as keyof typeof factors] || 1.0;
  }

  private getReproductiveRiskFactor(input: GailModelInput): number {
    let factor = 1.0;
    
    // Возраст менархе
    if (input.ageAtMenarche <= 12) factor *= 1.1;
    if (input.ageAtMenarche >= 15) factor *= 0.9;
    
    // Возраст первых родов
    if (input.ageAtFirstBirth === null) {
      factor *= 1.15; // нерожавшие
    } else if (input.ageAtFirstBirth >= 30) {
      factor *= 1.1;
    } else if (input.ageAtFirstBirth < 20) {
      factor *= 0.9;
    }

    return factor;
  }

  private getBiopsyRiskFactor(input: GailModelInput): number {
    let factor = 1.0 + (input.numberOfBiopsies * 0.1);
    
    if (input.atypicalHyperplasia) {
      factor *= 1.3;
    }

    return factor;
  }

  private getFamilyRiskFactor(input: GailModelInput): number {
    return 1.0 + (input.firstDegreeRelatives * 0.2);
  }

  private calculateLifetimeRisk(fiveYearRisk: number, currentAge: number): number {
    const remainingYears = 90 - currentAge;
    const fiveYearPeriods = remainingYears / 5;
    
    let lifetimeRisk = 0;
    let currentRisk = fiveYearRisk;
    
    for (let i = 0; i < fiveYearPeriods; i++) {
      lifetimeRisk += currentRisk * (1 - lifetimeRisk / 100);
      currentRisk *= 1.1; // риск увеличивается с возрастом
    }

    return Math.min(lifetimeRisk, 50); // максимум 50%
  }

  private calculateConfidence(input: GailModelInput): number {
    let confidence = 85; // базовый уровень
    
    if (input.age < 35) confidence -= 15;
    if (input.age > 75) confidence -= 10;
    if (input.numberOfBiopsies === 0) confidence -= 5;
    if (input.breastDensity) confidence += 5;
    if (input.geneticTestingResults && input.geneticTestingResults.length > 0) confidence += 10;
    if (input.bmi) confidence += 3;
    
    return Math.max(60, Math.min(95, confidence));
  }

  private calculateDataCompleteness(input: GailModelInput): number {
    const totalFields = 15;
    let filledFields = 7; // обязательные поля
    
    if (input.breastDensity) filledFields++;
    if (input.hormonalTherapy) filledFields++;
    if (input.hormonalTherapyDuration) filledFields++;
    if (input.geneticTestingResults?.length) filledFields++;
    if (input.bmi) filledFields++;
    if (input.alcoholConsumption) filledFields++;
    if (input.physicalActivity) filledFields++;
    if (input.smokingHistory) filledFields++;
    
    return Math.round((filledFields / totalFields) * 100);
  }

  private calculateAIAdjustment(enhancedFactors: any): number {
    let adjustment = 1.0;
    
    if (enhancedFactors.environmentalRisk.score > 50) adjustment *= 1.1;
    if (enhancedFactors.lifestyleRisk.score > 50) adjustment *= 1.15;
    if (enhancedFactors.geneticPredisposition.score > 70) adjustment *= 1.2;
    
    return Math.min(adjustment, 1.5); // максимальная корректировка 50%
  }

  private generateLifestyleFactors(input: GailModelInput) {
    const factors = [];
    
    if (input.bmi && input.bmi > 25) {
      factors.push({
        factor: 'exercise' as const,
        currentLevel: 'недостаточная активность',
        targetLevel: 'умеренная активность 150 мин/неделю',
        riskReduction: 15,
        actionItems: ['30 минут ходьбы 5 дней в неделю', 'Силовые упражнения 2 раза в неделю']
      });
    }
    
    if (input.alcoholConsumption === 'moderate' || input.alcoholConsumption === 'heavy') {
      factors.push({
        factor: 'alcohol' as const,
        currentLevel: 'умеренное/значительное потребление',
        targetLevel: 'ограничение до 1 напитка в день',
        riskReduction: 8,
        actionItems: ['Сократить потребление алкоголя', 'Безалкогольные дни в неделю']
      });
    }
    
    return factors;
  }

  private generateScreeningProtocol(riskCategory: string, age: number) {
    switch (riskCategory) {
      case 'высокий':
        return {
          mammographyFrequency: 'annual' as const,
          startAge: Math.max(25, age - 10),
          additionalImaging: ['breast-mri' as const],
          clinicalExamFrequency: 'every-6-months' as const,
          selfExamRecommended: true
        };
      
      case 'повышенный':
        return {
          mammographyFrequency: 'annual' as const,
          startAge: Math.max(35, age - 10),
          additionalImaging: ['breast-ultrasound' as const],
          clinicalExamFrequency: 'every-6-months' as const,
          selfExamRecommended: true
        };
      
      default:
        return {
          mammographyFrequency: 'biennial' as const,
          startAge: 50,
          clinicalExamFrequency: 'annual' as const,
          selfExamRecommended: true
        };
    }
  }

  private generateCacheKey(input: GailModelInput): string {
    return btoa(JSON.stringify(input)).replace(/[^a-zA-Z0-9]/g, '');
  }

  private generateInputHash(input: GailModelInput): string {
    return btoa(JSON.stringify(input)).slice(0, 16);
  }

  private getFromCache(key: string): GailModelResult | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.result;
    }
    return null;
  }

  private setCache(key: string, result: GailModelResult): void {
    this.cache.set(key, { result, timestamp: Date.now() });
  }

  /**
   * Очистка просроченного кеша
   */
  public clearExpiredCache(): void {
    const now = Date.now();
    for (const [key, cached] of this.cache.entries()) {
      if (now - cached.timestamp >= this.CACHE_TTL) {
        this.cache.delete(key);
      }
    }
  }
}

// ========== ЭКСПОРТ СИНГЛТОНА ==========

export const gailCalculatorService = new GailCalculatorService();

export default GailCalculatorService;