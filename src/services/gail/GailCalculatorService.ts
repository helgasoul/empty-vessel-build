
import { 
  GailCalculatorInput, 
  GailCalculatorResult, 
  EnhancedRiskAssessment,
  RiskLevel,
  PersonalizedRecommendations 
} from '@/types/gail-calculator';
import { supabase } from '@/integrations/supabase/client';

export class GailCalculatorService {
  /**
   * Расчет базового риска по модели Gail
   */
  static calculateGailRisk(input: GailCalculatorInput): GailCalculatorResult {
    const { personalInfo, medicalHistory, familyHistory } = input;
    
    // Базовые факторы риска
    let relativeRisk = 1.0;
    
    // Возрастной фактор
    const ageFactor = this.calculateAgeFactor(personalInfo.age);
    relativeRisk *= ageFactor;
    
    // Расовый фактор
    const raceFactor = this.calculateRaceFactor(personalInfo.race);
    relativeRisk *= raceFactor;
    
    // Семейная история
    const familyFactor = this.calculateFamilyFactor(familyHistory);
    relativeRisk *= familyFactor;
    
    // Репродуктивная история
    const reproductiveFactor = this.calculateReproductiveFactor(medicalHistory);
    relativeRisk *= reproductiveFactor;
    
    // История биопсий
    const biopsyFactor = this.calculateBiopsyFactor(medicalHistory);
    relativeRisk *= biopsyFactor;
    
    // Базовый популяционный риск
    const baselineRisk = this.getBaselineRisk(personalInfo.age, personalInfo.race);
    
    // Расчет абсолютных рисков
    const fiveYearRisk = Math.min(baselineRisk.fiveYear * relativeRisk, 0.5);
    const lifetimeRisk = Math.min(baselineRisk.lifetime * relativeRisk, 0.8);
    
    // Определение категории риска
    const riskCategory = this.determineRiskCategory(fiveYearRisk);
    
    return {
      fiveYearRisk,
      lifetimeRisk,
      relativeRisk,
      riskCategory,
      riskFactors: {
        age: ageFactor,
        race: raceFactor,
        familyHistory: familyFactor,
        reproductiveHistory: reproductiveFactor,
        biopsyHistory: biopsyFactor
      },
      populationRisk: baselineRisk,
      screeningRecommendations: this.generateScreeningRecommendations(fiveYearRisk, personalInfo.age),
      calculationMetadata: {
        modelVersion: '2.0.1',
        calculationDate: new Date(),
        inputHash: this.generateInputHash(input),
        confidence: 0.85
      }
    };
  }
  
  /**
   * Расширенная оценка риска с учетом всех факторов
   */
  static calculateEnhancedRisk(input: GailCalculatorInput): EnhancedRiskAssessment {
    const gailResult = this.calculateGailRisk(input);
    
    // Коэффициенты для различных факторов
    let geneticMultiplier = 1.0;
    let lifestyleMultiplier = 1.0;
    let environmentalMultiplier = 1.0;
    
    // Генетические факторы
    if (input.genetic) {
      geneticMultiplier = this.calculateGeneticMultiplier(input.genetic);
    }
    
    // Факторы образа жизни
    lifestyleMultiplier = this.calculateLifestyleMultiplier(input.lifestyle);
    
    // Экологические факторы
    if (input.environmental) {
      environmentalMultiplier = this.calculateEnvironmentalMultiplier(input.environmental);
    }
    
    // Комбинированный риск
    const combinedMultiplier = Math.sqrt(
      geneticMultiplier * lifestyleMultiplier * environmentalMultiplier
    );
    
    const combinedFiveYear = Math.min(gailResult.fiveYearRisk * combinedMultiplier, 0.6);
    const combinedLifetime = Math.min(gailResult.lifetimeRisk * combinedMultiplier, 0.85);
    
    return {
      gailResult,
      combinedRisk: {
        fiveYear: combinedFiveYear,
        lifetime: combinedLifetime,
        confidence: 0.78
      },
      riskContributions: {
        genetic: (geneticMultiplier - 1) * 0.3,
        lifestyle: (lifestyleMultiplier - 1) * 0.25,
        environmental: (environmentalMultiplier - 1) * 0.15,
        medical: 0.2,
        family: 0.1
      },
      geneticAnalysis: input.genetic ? this.analyzeGenetics(input.genetic) : undefined,
      environmentalAnalysis: input.environmental ? this.analyzeEnvironment(input.environmental) : undefined,
      lifestyleAnalysis: this.analyzeLifestyle(input.lifestyle),
      riskTrajectory: this.calculateRiskTrajectory(input, combinedFiveYear),
      personalizedRecommendations: this.generatePersonalizedRecommendations(input, combinedFiveYear)
    };
  }
  
  /**
   * Сохранение результатов в базу данных
   */
  static async saveCalculation(
    userId: string, 
    input: GailCalculatorInput, 
    result: EnhancedRiskAssessment
  ): Promise<void> {
    const { error } = await supabase
      .from('risk_assessments')
      .insert({
        user_id: userId,
        assessment_type: 'enhanced_gail',
        assessment_data: input,
        results_data: result,
        risk_percentage: result.combinedRisk.fiveYear * 100,
        risk_level: result.gailResult.riskCategory,
        recommendations: result.personalizedRecommendations.priority.immediate,
        created_at: new Date()
      });
    
    if (error) {
      throw new Error(`Failed to save calculation: ${error.message}`);
    }
  }
  
  // Приватные методы для расчетов
  private static calculateAgeFactor(age: number): number {
    if (age < 35) return 0.5;
    if (age < 40) return 0.7;
    if (age < 45) return 0.8;
    if (age < 50) return 1.0;
    if (age < 55) return 1.2;
    if (age < 60) return 1.4;
    if (age < 65) return 1.5;
    if (age < 70) return 1.6;
    if (age < 75) return 1.7;
    return 1.8;
  }
  
  private static calculateRaceFactor(race: string): number {
    switch (race) {
      case 'caucasian': return 1.0;
      case 'african_american': return 0.7;
      case 'hispanic': return 0.8;
      case 'asian': return 0.6;
      default: return 0.9;
    }
  }
  
  private static calculateFamilyFactor(familyHistory: any): number {
    const firstDegreeTotal = 
      (familyHistory.firstDegreeRelatives?.mother ? 1 : 0) +
      (familyHistory.firstDegreeRelatives?.sisters || 0) +
      (familyHistory.firstDegreeRelatives?.daughters || 0);
    
    return Math.pow(2.3, Math.min(firstDegreeTotal, 3));
  }
  
  private static calculateReproductiveFactor(medicalHistory: any): number {
    let factor = 1.0;
    
    // Возраст менархе
    if (medicalHistory.ageAtMenarche <= 11) factor *= 1.2;
    else if (medicalHistory.ageAtMenarche >= 14) factor *= 0.9;
    
    // Возраст первых родов
    if (!medicalHistory.ageAtFirstBirth || medicalHistory.ageAtFirstBirth >= 30) {
      factor *= 1.3;
    } else if (medicalHistory.ageAtFirstBirth < 20) {
      factor *= 0.8;
    }
    
    return factor;
  }
  
  private static calculateBiopsyFactor(medicalHistory: any): number {
    let factor = 1.0;
    
    if (medicalHistory.numberOfBiopsies >= 2) factor *= 1.5;
    else if (medicalHistory.numberOfBiopsies === 1) factor *= 1.2;
    
    if (medicalHistory.atypicalHyperplasia) factor *= 2.0;
    if (medicalHistory.lobularCarcinomaInSitu) factor *= 2.5;
    
    return factor;
  }
  
  private static getBaselineRisk(age: number, race: string) {
    // Упрощенные базовые риски по возрасту
    const baseRisks = {
      35: { fiveYear: 0.004, lifetime: 0.12 },
      40: { fiveYear: 0.006, lifetime: 0.12 },
      45: { fiveYear: 0.009, lifetime: 0.12 },
      50: { fiveYear: 0.011, lifetime: 0.12 },
      55: { fiveYear: 0.014, lifetime: 0.12 },
      60: { fiveYear: 0.017, lifetime: 0.12 },
      65: { fiveYear: 0.021, lifetime: 0.12 },
      70: { fiveYear: 0.025, lifetime: 0.12 }
    };
    
    const closestAge = Object.keys(baseRisks)
      .map(Number)
      .reduce((prev, curr) => 
        Math.abs(curr - age) < Math.abs(prev - age) ? curr : prev
      );
    
    return baseRisks[closestAge as keyof typeof baseRisks];
  }
  
  private static determineRiskCategory(fiveYearRisk: number): RiskLevel {
    if (fiveYearRisk < 0.0167) return 'low';
    if (fiveYearRisk < 0.03) return 'average';
    if (fiveYearRisk < 0.05) return 'high';
    return 'very_high';
  }
  
  private static generateScreeningRecommendations(risk: number, age: number) {
    return {
      mammographyFrequency: risk >= 0.0167 ? 'annual' as const : 'biannual' as const,
      additionalScreening: risk >= 0.03 ? ['MRI', 'Ultrasound'] : [],
      geneticCounseling: risk >= 0.03,
      clinicalExam: risk >= 0.03 ? 'enhanced' as const : 'standard' as const
    };
  }
  
  private static calculateGeneticMultiplier(genetic: any): number {
    let multiplier = 1.0;
    
    if (genetic.brca1 === 'positive') multiplier *= 5.0;
    if (genetic.brca2 === 'positive') multiplier *= 3.5;
    if (genetic.tp53 === 'positive') multiplier *= 4.0;
    if (genetic.pten === 'positive') multiplier *= 6.0;
    
    // Умеренные гены
    if (genetic.chek2 === 'positive') multiplier *= 2.0;
    if (genetic.atm === 'positive') multiplier *= 2.5;
    if (genetic.palb2 === 'positive') multiplier *= 3.0;
    
    return Math.min(multiplier, 10.0);
  }
  
  private static calculateLifestyleMultiplier(lifestyle: any): number {
    let multiplier = 1.0;
    
    // Курение
    if (lifestyle.smoking?.status === 'current') multiplier *= 1.3;
    
    // Алкоголь
    if (lifestyle.alcohol?.frequency === 'heavy') multiplier *= 1.4;
    else if (lifestyle.alcohol?.frequency === 'moderate') multiplier *= 1.1;
    
    // Физическая активность (защитный фактор)
    if (lifestyle.physicalActivity?.level === 'vigorous') multiplier *= 0.8;
    else if (lifestyle.physicalActivity?.level === 'moderate') multiplier *= 0.9;
    else if (lifestyle.physicalActivity?.level === 'sedentary') multiplier *= 1.2;
    
    return multiplier;
  }
  
  private static calculateEnvironmentalMultiplier(environmental: any): number {
    let multiplier = 1.0;
    
    // Качество воздуха
    if (environmental.airQuality?.aqi > 150) multiplier *= 1.2;
    else if (environmental.airQuality?.aqi > 100) multiplier *= 1.1;
    
    // Токсины
    if (environmental.environmentalToxins?.pesticides) multiplier *= 1.15;
    if (environmental.environmentalToxins?.heavyMetals?.length > 0) multiplier *= 1.1;
    
    return multiplier;
  }
  
  private static analyzeGenetics(genetic: any) {
    const highRiskVariants = [];
    const protectiveVariants = [];
    
    if (genetic.brca1 === 'positive') highRiskVariants.push('BRCA1');
    if (genetic.brca2 === 'positive') highRiskVariants.push('BRCA2');
    if (genetic.tp53 === 'positive') highRiskVariants.push('TP53');
    
    return {
      highRiskVariants,
      protectiveVariants,
      polygeneticRiskScore: genetic.polygeneticScore || 0.5,
      carriageStatus: highRiskVariants.length > 0 ? 'pathogenic' as const : 'negative' as const
    };
  }
  
  private static analyzeEnvironment(environmental: any) {
    const riskFactors = [];
    
    if (environmental.airQuality?.aqi > 100) riskFactors.push('Загрязнение воздуха');
    if (environmental.environmentalToxins?.pesticides) riskFactors.push('Пестициды');
    
    return {
      riskScore: Math.min(riskFactors.length * 0.1, 0.5),
      primaryRiskFactors: riskFactors,
      mitigationRecommendations: [
        'Использовать воздухоочистители',
        'Выбирать органические продукты',
        'Фильтровать питьевую воду'
      ]
    };
  }
  
  private static analyzeLifestyle(lifestyle: any) {
    const protectiveFactors = [];
    const riskFactors = [];
    
    if (lifestyle.physicalActivity?.level === 'vigorous') {
      protectiveFactors.push('Высокая физическая активность');
    }
    
    if (lifestyle.smoking?.status === 'current') {
      riskFactors.push('Курение');
    }
    
    if (lifestyle.alcohol?.frequency === 'heavy') {
      riskFactors.push('Чрезмерное употребление алкоголя');
    }
    
    return {
      protectiveFactors,
      riskFactors,
      modifiableRisks: [
        {
          factor: 'Физическая активность',
          currentImpact: lifestyle.physicalActivity?.level === 'sedentary' ? 0.2 : -0.1,
          potentialImprovement: 0.15
        }
      ]
    };
  }
  
  private static calculateRiskTrajectory(input: any, currentRisk: number) {
    const trajectory = [];
    const currentAge = input.personalInfo.age;
    
    for (let age = currentAge; age <= 80; age += 5) {
      const ageFactor = this.calculateAgeFactor(age) / this.calculateAgeFactor(currentAge);
      trajectory.push({
        age,
        risk: Math.min(currentRisk * ageFactor, 0.8),
        interventions: age === currentAge + 5 ? ['Ежегодная маммография'] : undefined
      });
    }
    
    return trajectory;
  }
  
  private static generatePersonalizedRecommendations(
    input: GailCalculatorInput, 
    risk: number
  ): PersonalizedRecommendations {
    return {
      screening: {
        mammography: {
          frequency: risk >= 0.0167 ? 'Ежегодно' : 'Каждые 2 года',
          startAge: Math.min(40, input.personalInfo.age),
          additionalProtocols: risk >= 0.03 ? ['Томосинтез', 'Контрастная маммография'] : []
        },
        ultrasound: {
          recommended: risk >= 0.03,
          frequency: risk >= 0.03 ? 'Ежегодно' : undefined,
          indications: ['Плотная железистая ткань', 'Дополнение к маммографии']
        },
        mri: {
          recommended: risk >= 0.05,
          frequency: risk >= 0.05 ? 'Ежегодно' : undefined,
          criteria: ['Высокий генетический риск', 'BRCA-мутации']
        },
        clinicalExams: {
          frequency: 'Каждые 6 месяцев',
          selfExamGuidance: true
        },
        geneticTesting: {
          recommended: risk >= 0.03 || input.familyHistory.breastCancerRelatives >= 2,
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
          supplements: risk >= 0.03 ? ['Витамин D', 'Омега-3'] : undefined
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
          eligible: risk >= 0.0167,
          options: risk >= 0.0167 ? ['Тамоксифен', 'Ралоксифен'] : undefined,
          considerations: ['Обсудить с онкологом', 'Оценить побочные эффекты']
        },
        surgicalOptions: {
          eligible: risk >= 0.2,
          procedures: risk >= 0.2 ? ['Профилактическая мастэктомия'] : undefined,
          consultationRecommended: risk >= 0.1
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
        groupsRecommended: risk >= 0.03,
        counselingType: ['Генетическое консультирование', 'Психологическая поддержка'],
        apps: ['MyHealthApp', 'BreastHealthTracker']
      },
      priority: {
        immediate: risk >= 0.03 
          ? ['Записаться к онкологу', 'Пройти генетическое тестирование']
          : ['Запланировать маммографию'],
        shortTerm: ['Начать программу физических упражнений', 'Консультация диетолога'],
        longTerm: ['Поддерживать здоровый вес', 'Регулярные обследования']
      }
    };
  }
  
  private static generateInputHash(input: GailCalculatorInput): string {
    return btoa(JSON.stringify(input)).substring(0, 16);
  }
}
