
import type {
  GailCalculatorInput,
  GailCalculatorResult,
  EnhancedRiskAssessment,
  GeneticRiskFactors,
  EnvironmentalFactors,
  PersonalizedRecommendations,
  ApiResponse,
  ValidationError,
} from '../types/gail-calculator';

// ========================================
// Класс сервиса
// ========================================

export class EnhancedGailCalculatorService {
  private readonly API_BASE_URL: string;
  private readonly API_VERSION: string = 'v1';

  constructor() {
    this.API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';
  }

  // ========================================
  // Вспомогательные методы
  // ========================================

  private async apiCall<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.API_BASE_URL}/${this.API_VERSION}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Platform': 'prevent-health-web',
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  private calculateBasicGailRisk(input: GailCalculatorInput): GailCalculatorResult {
    // Базовая реализация алгоритма Gail
    const { personalInfo, medicalHistory, familyHistory } = input;

    // Базовые коэффициенты риска (упрощенные)
    let riskScore = 0.01; // базовый риск 1%

    // Возраст
    if (personalInfo.age >= 50) riskScore += 0.005;
    if (personalInfo.age >= 60) riskScore += 0.010;
    if (personalInfo.age >= 70) riskScore += 0.015;

    // Семейная история
    riskScore += familyHistory.breastCancerRelatives * 0.008;

    // Возраст менархе
    if (medicalHistory.ageAtMenarche < 12) riskScore += 0.003;

    // Возраст первых родов
    if (!medicalHistory.ageAtFirstBirth || medicalHistory.ageAtFirstBirth > 30) {
      riskScore += 0.005;
    }

    // Биопсии
    riskScore += medicalHistory.numberOfBiopsies * 0.002;

    // Атипичная гиперплазия
    if (medicalHistory.atypicalHyperplasia) {
      riskScore += 0.012;
    }

    // Расовые факторы
    if (personalInfo.race === 'african_american') {
      riskScore *= 0.8;
    }

    // Ограничиваем максимальный риск
    const fiveYearRisk = Math.min(riskScore, 0.5);
    const lifetimeRisk = Math.min(fiveYearRisk * 4, 0.8);

    return {
      fiveYearRisk,
      lifetimeRisk,
      relativeRisk: fiveYearRisk / 0.02,
      riskCategory: this.determineRiskCategory(fiveYearRisk),
      
      riskFactors: {
        age: personalInfo.age >= 50 ? 1.2 : 1.0,
        race: personalInfo.race === 'caucasian' ? 1.0 : 0.8,
        familyHistory: 1 + (familyHistory.breastCancerRelatives * 0.4),
        reproductiveHistory: medicalHistory.ageAtMenarche < 12 ? 1.1 : 1.0,
        biopsyHistory: 1 + (medicalHistory.numberOfBiopsies * 0.1),
      },

      populationRisk: {
        fiveYear: 0.02,
        lifetime: 0.125,
        sameAgeGroup: this.getAgeGroupRisk(personalInfo.age),
      },

      screeningRecommendations: {
        mammographyFrequency: fiveYearRisk > 0.03 ? 'annual' : 'biannual',
        additionalScreening: fiveYearRisk > 0.05 ? ['MRI', 'genetic_counseling'] : [],
        geneticCounseling: familyHistory.breastCancerRelatives > 1,
        clinicalExam: fiveYearRisk > 0.05 ? 'enhanced' : 'standard',
      },

      calculationMetadata: {
        modelVersion: 'Enhanced_Gail_v2.1',
        calculationDate: new Date(),
        inputHash: this.generateInputHash(input),
        confidence: this.calculateConfidence(input),
      },
    };
  }

  private determineRiskCategory(risk: number): 'low' | 'average' | 'high' | 'very_high' {
    if (risk < 0.015) return 'low';
    if (risk < 0.05) return 'average';
    if (risk < 0.1) return 'high';
    return 'very_high';
  }

  private getAgeGroupRisk(age: number): number {
    if (age < 40) return 0.005;
    if (age < 50) return 0.015;
    if (age < 60) return 0.025;
    if (age < 70) return 0.035;
    return 0.045;
  }

  private generateInputHash(input: GailCalculatorInput): string {
    const keyData = {
      age: input.personalInfo.age,
      race: input.personalInfo.race,
      ageAtMenarche: input.medicalHistory.ageAtMenarche,
      ageAtFirstBirth: input.medicalHistory.ageAtFirstBirth,
      numberOfBiopsies: input.medicalHistory.numberOfBiopsies,
      atypicalHyperplasia: input.medicalHistory.atypicalHyperplasia,
      breastCancerRelatives: input.familyHistory.breastCancerRelatives,
    };
    
    return btoa(JSON.stringify(keyData)).substring(0, 16);
  }

  private calculateConfidence(input: GailCalculatorInput): number {
    let confidence = 0.8;

    // Увеличиваем уверенность если есть полные данные
    if (input.medicalHistory.ageAtFirstBirth) confidence += 0.05;
    if (input.medicalHistory.numberOfBiopsies >= 0) confidence += 0.05;
    if (input.familyHistory.breastCancerRelatives >= 0) confidence += 0.05;

    // Снижаем уверенность для крайних возрастов
    if (input.personalInfo.age < 40 || input.personalInfo.age > 75) {
      confidence -= 0.1;
    }

    return Math.min(confidence, 0.95);
  }

  // ========================================
  // Основной расчет рисков
  // ========================================

  async calculateRisk(input: GailCalculatorInput): Promise<ApiResponse<GailCalculatorResult>> {
    try {
      // В development режиме используем локальный расчет
      if (process.env.NODE_ENV === 'development') {
        // Симулируем задержку API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const result = this.calculateBasicGailRisk(input);
        
        return {
          data: result,
          success: true,
          message: 'Расчет рисков выполнен успешно',
          metadata: {
            timestamp: new Date().toISOString(),
            requestId: `req_${Date.now()}`,
            version: '1.0.0',
            processingTime: 1000,
          },
        };
      }

      // В production делаем реальный API запрос
      return await this.apiCall<GailCalculatorResult>('/gail-calculator', {
        method: 'POST',
        body: JSON.stringify({
          input,
          requestId: `req_${Date.now()}`,
          timestamp: new Date().toISOString(),
        }),
      });

    } catch (error) {
      console.error('Ошибка расчета рисков:', error);
      throw new Error('Не удалось рассчитать риски. Попробуйте еще раз.');
    }
  }

  // ========================================
  // Расширенный анализ
  // ========================================

  async calculateEnhancedRisk(
    input: GailCalculatorInput,
    geneticData?: GeneticRiskFactors,
    environmentalData?: EnvironmentalFactors
  ): Promise<ApiResponse<EnhancedRiskAssessment>> {
    try {
      // В development режиме используем моковые данные
      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const gailResult = this.calculateBasicGailRisk(input);
        
        // Создаем расширенный результат
        const enhancedResult: EnhancedRiskAssessment = {
          gailResult,
          
          combinedRisk: {
            fiveYear: gailResult.fiveYearRisk * (geneticData ? 1.2 : 1.0),
            lifetime: gailResult.lifetimeRisk * (geneticData ? 1.15 : 1.0),
            confidence: 0.85,
          },

          riskContributions: {
            genetic: geneticData ? 0.2 : 0.05,
            lifestyle: 0.25,
            environmental: environmentalData ? 0.15 : 0.1,
            medical: 0.3,
            family: 0.2,
          },

          geneticAnalysis: geneticData ? {
            highRiskVariants: geneticData.brca1 === 'positive' || geneticData.brca2 === 'positive' 
              ? ['BRCA1', 'BRCA2'] : [],
            protectiveVariants: [],
            polygeneticRiskScore: 0.5,
            carriageStatus: geneticData.brca1 === 'positive' || geneticData.brca2 === 'positive' 
              ? 'pathogenic' : 'negative',
          } : undefined,

          environmentalAnalysis: environmentalData ? {
            riskScore: 0.15,
            primaryRiskFactors: ['Загрязнение воздуха', 'Химические вещества'],
            mitigationRecommendations: [
              'Использовать воздухоочистители',
              'Выбирать органические продукты',
              'Фильтровать питьевую воду'
            ],
          } : undefined,

          lifestyleAnalysis: {
            protectiveFactors: ['Физическая активность', 'Здоровое питание'],
            riskFactors: ['Курение', 'Алкоголь'],
            modifiableRisks: [
              {
                factor: 'Физическая активность',
                currentImpact: -0.1,
                potentialImprovement: 0.15
              }
            ],
          },

          riskTrajectory: [
            {
              age: input.personalInfo.age + 5,
              risk: gailResult.fiveYearRisk * 1.1,
              interventions: ['Ежегодная маммография']
            },
            {
              age: input.personalInfo.age + 10,
              risk: gailResult.fiveYearRisk * 1.2,
              interventions: ['МРТ молочных желез']
            }
          ],

          personalizedRecommendations: this.generatePersonalizedRecommendations(input, gailResult.fiveYearRisk),
        };

        return {
          data: enhancedResult,
          success: true,
          message: 'Расширенный анализ рисков выполнен успешно',
          metadata: {
            timestamp: new Date().toISOString(),
            requestId: `req_enhanced_${Date.now()}`,
            version: '1.0.0',
            processingTime: 2000,
          },
        };
      }

      // В production делаем реальный API запрос
      return await this.apiCall<EnhancedRiskAssessment>('/gail-calculator/enhanced', {
        method: 'POST',
        body: JSON.stringify({
          input,
          geneticData,
          environmentalData,
          requestId: `req_enhanced_${Date.now()}`,
          timestamp: new Date().toISOString(),
        }),
      });

    } catch (error) {
      console.error('Ошибка расширенного анализа:', error);
      throw new Error('Не удалось выполнить расширенный анализ. Попробуйте еще раз.');
    }
  }

  // ========================================
  // Генерация персонализированных рекомендаций
  // ========================================

  private generatePersonalizedRecommendations(
    input: GailCalculatorInput,
    riskScore: number
  ): PersonalizedRecommendations {
    return {
      screening: {
        mammography: {
          frequency: riskScore > 0.03 ? 'Ежегодно' : 'Каждые 2 года',
          startAge: Math.min(40, input.personalInfo.age),
          additionalProtocols: riskScore > 0.05 ? ['Томосинтез', 'Контрастная маммография'] : []
        },
        ultrasound: {
          recommended: riskScore > 0.03,
          frequency: riskScore > 0.03 ? 'Ежегодно' : undefined,
          indications: ['Плотная железистая ткань', 'Дополнение к маммографии']
        },
        mri: {
          recommended: riskScore > 0.05,
          frequency: riskScore > 0.05 ? 'Ежегодно' : undefined,
          criteria: ['Высокий генетический риск', 'BRCA-мутации']
        },
        clinicalExams: {
          frequency: 'Каждые 6 месяцев',
          selfExamGuidance: true
        },
        geneticTesting: {
          recommended: riskScore > 0.03 || input.familyHistory.breastCancerRelatives >= 2,
          genes: ['BRCA1', 'BRCA2', 'TP53', 'CHEK2'],
          counselingRequired: true
        }
      },
      lifestyle: {
        nutrition: {
          recommendations: [
            'Средиземноморская диета',
            'Увеличить потребление клетчатки',
            'Ограничить красное мясо'
          ],
          avoidFoods: ['Обработанное мясо', 'Трансжиры', 'Избыток сахара'],
          supplements: riskScore > 0.03 ? ['Витамин D', 'Омега-3'] : undefined
        },
        exercise: {
          type: ['Аэробные нагрузки', 'Силовые тренировки'],
          frequency: '5 раз в неделю',
          duration: '30-45 минут',
          intensity: 'Умеренная до высокой'
        },
        stressManagement: {
          techniques: ['Медитация', 'Йога', 'Дыхательные практики'],
          resources: ['Приложения для медитации', 'Групповые занятия']
        },
        sleep: {
          targetHours: 7.5,
          hygieneTips: ['Регулярный режим', 'Темная комната', 'Ограничить экраны']
        }
      },
      medical: {
        chemoprevention: {
          eligible: riskScore > 0.0167,
          options: riskScore > 0.0167 ? ['Тамоксифен', 'Ралоксифен'] : undefined,
          considerations: ['Обсудить с онкологом', 'Оценить побочные эффекты']
        },
        surgicalOptions: {
          eligible: riskScore > 0.2,
          procedures: riskScore > 0.2 ? ['Профилактическая мастэктомия'] : undefined,
          consultationRecommended: riskScore > 0.1
        },
        hormonalManagement: {
          recommendations: ['Мониторинг гормонального статуса'],
          avoidance: ['Длительная ЗГТ без показаний']
        }
      },
      monitoring: {
        biomarkers: ['CA 15-3', 'CEA', 'Гормональный статус'],
        frequency: 'Ежегодно',
        alertThresholds: {
          'CA 15-3': 30,
          'CEA': 5
        }
      },
      education: {
        topics: ['Самообследование', 'Факторы риска', 'Здоровый образ жизни'],
        resources: [
          {
            title: 'Руководство по самообследованию',
            url: '/education/self-exam',
            type: 'article'
          }
        ]
      },
      support: {
        groupsRecommended: riskScore > 0.03,
        counselingType: ['Генетическое консультирование', 'Психологическая поддержка'],
        apps: ['MyHealthApp', 'BreastHealthTracker']
      },
      priority: {
        immediate: riskScore > 0.03 
          ? ['Записаться к онкологу', 'Пройти генетическое тестирование']
          : ['Запланировать маммографию'],
        shortTerm: ['Начать программу физических упражнений', 'Консультация диетолога'],
        longTerm: ['Поддерживать здоровый вес', 'Регулярные обследования']
      }
    };
  }

  // ========================================
  // Валидация входных данных
  // ========================================

  validateInput(input: GailCalculatorInput): ValidationError[] {
    const errors: ValidationError[] = [];

    // Валидация личной информации
    if (!input.personalInfo.age || input.personalInfo.age < 18 || input.personalInfo.age > 100) {
      errors.push({
        field: 'personalInfo.age',
        message: 'Возраст должен быть от 18 до 100 лет',
        code: 'INVALID_AGE'
      });
    }

    if (!input.personalInfo.race) {
      errors.push({
        field: 'personalInfo.race',
        message: 'Необходимо указать расовую принадлежность',
        code: 'MISSING_RACE'
      });
    }

    // Валидация медицинской истории
    if (input.medicalHistory.ageAtMenarche && 
        (input.medicalHistory.ageAtMenarche < 8 || input.medicalHistory.ageAtMenarche > 18)) {
      errors.push({
        field: 'medicalHistory.ageAtMenarche',
        message: 'Возраст менархе должен быть от 8 до 18 лет',
        code: 'INVALID_MENARCHE_AGE'
      });
    }

    if (input.medicalHistory.ageAtFirstBirth && input.medicalHistory.ageAtFirstBirth < 15) {
      errors.push({
        field: 'medicalHistory.ageAtFirstBirth',
        message: 'Возраст первых родов не может быть менее 15 лет',
        code: 'INVALID_FIRST_BIRTH_AGE'
      });
    }

    // Валидация семейной истории
    if (input.familyHistory.breastCancerRelatives < 0) {
      errors.push({
        field: 'familyHistory.breastCancerRelatives',
        message: 'Количество родственников с раком молочной железы не может быть отрицательным',
        code: 'INVALID_FAMILY_HISTORY'
      });
    }

    return errors;
  }
}

// Экспортируем экземпляр сервиса
export const enhancedGailService = new EnhancedGailCalculatorService();
