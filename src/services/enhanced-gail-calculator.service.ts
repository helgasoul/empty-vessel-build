/**
 * Enhanced Gail Calculator API Service
 * 
 * Профессиональный сервис для работы с расширенным калькулятором Gail
 * 🧮 Многофакторный анализ рисков
 * 🧬 Интеграция с генетическими данными
 * 🤖 ИИ-анализ и персональные рекомендации
 * 💖 Заботливый UX для женщин
 */

import { apiClient, type ApiResponse } from './http-client';
import type {
  GailCalculatorInput,
  GailCalculatorResult,
  EnhancedRiskAssessment,
  GeneticRiskFactors,
  EnvironmentalFactors,
  LifestyleFactors,
  PersonalizedRecommendations,
} from '../types/gail-calculator';

export class EnhancedGailCalculatorService {
  
  // 🧮 Основной расчет рисков по модели Gail
  async calculateRisk(input: GailCalculatorInput): Promise<ApiResponse<GailCalculatorResult>> {
    try {
      const response = await apiClient.calculateGailRisk({
        personalInfo: input.personalInfo,
        medicalHistory: input.medicalHistory,
        familyHistory: input.familyHistory,
        lifestyle: input.lifestyle,
        timestamp: new Date().toISOString(),
      });
      
      return response;
    } catch (error) {
      console.error('❌ Ошибка расчета рисков Gail:', error);
      throw error;
    }
  }
  
  // 🧬 Расширенный анализ с генетическими данными
  async calculateEnhancedRisk(
    input: GailCalculatorInput,
    geneticData?: GeneticRiskFactors,
    environmentalData?: EnvironmentalFactors
  ): Promise<ApiResponse<EnhancedRiskAssessment>> {
    try {
      const enhancedInput = {
        ...input,
        genetic: geneticData,
        environmental: environmentalData,
        enhancedAnalysis: true,
        analysisType: 'comprehensive',
      };
      
      const response = await apiClient.post('MULTI_FACTOR_ANALYSIS', enhancedInput, {
        encrypt: true,
        timeout: 60000, // 60 секунд для комплексного анализа
      });
      
      return response;
    } catch (error) {
      console.error('❌ Ошибка расширенного анализа рисков:', error);
      throw error;
    }
  }
  
  // 🤖 ИИ-анализ медицинских изображений для оценки рисков
  async analyzemedicalImages(
    files: File[],
    patientId: string,
    imageType: 'mammography' | 'ultrasound' | 'mri' | 'ct'
  ): Promise<ApiResponse<any>> {
    try {
      const analysisPromises = files.map(file => 
        apiClient.analyzemedicalImage(file, {
          patientId,
          imageType,
          timestamp: new Date().toISOString(),
          source: 'gail-calculator',
        })
      );
      
      const results = await Promise.all(analysisPromises);
      
      // Объединяем результаты анализа
      const combinedAnalysis = {
        imageCount: files.length,
        results: results.map(r => r.data),
        overallRisk: this.calculateCombinedImageRisk(results),
        recommendations: this.generateImageBasedRecommendations(results),
      };
      
      return {
        data: combinedAnalysis,
        success: true,
        message: 'Анализ медицинских изображений завершен',
      };
    } catch (error) {
      console.error('❌ Ошибка анализа медицинских изображений:', error);
      throw error;
    }
  }
  
  // 📊 Получение персональных рекомендаций
  async getPersonalizedRecommendations(
    userId: string,
    riskProfile: EnhancedRiskAssessment
  ): Promise<ApiResponse<PersonalizedRecommendations>> {
    try {
      const response = await apiClient.post('RECOMMENDATIONS', {
        userId,
        riskProfile,
        recommendationType: 'comprehensive',
        includeLifestyle: true,
        includeScreening: true,
        includeNutrition: true,
        includeExercise: true,
        timeHorizon: '5years',
      });
      
      return response;
    } catch (error) {
      console.error('❌ Ошибка получения рекомендаций:', error);
      throw error;
    }
  }
  
  // 🔄 Мониторинг изменений рисков во времени
  async trackRiskChanges(
    userId: string,
    timeRange: '6months' | '1year' | '2years' | '5years' = '1year'
  ): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.get(`MONITORING/${userId}/risk-trends`, {
        headers: {
          'X-Time-Range': timeRange,
        },
      });
      
      return response;
    } catch (error) {
      console.error('❌ Ошибка отслеживания изменений рисков:', error);
      throw error;
    }
  }
  
  // 🧬 Загрузка и анализ генетических данных
  async uploadGeneticData(
    file: File,
    userId: string,
    source: 'genotek' | 'genetico' | '23andme' | 'ancestryDNA' | 'other'
  ): Promise<ApiResponse<GeneticRiskFactors>> {
    try {
      const response = await apiClient.uploadFile('GENETIC_UPLOAD', file, {
        userId,
        source,
        dataType: 'raw-genetics',
        analysisType: 'breast-cancer-risk',
        timestamp: new Date().toISOString(),
      });
      
      return response;
    } catch (error) {
      console.error('❌ Ошибка загрузки генетических данных:', error);
      throw error;
    }
  }
  
  // 🌍 Анализ экологических факторов риска
  async analyzeEnvironmentalFactors(
    location: { latitude: number; longitude: number },
    userId: string
  ): Promise<ApiResponse<EnvironmentalFactors>> {
    try {
      const response = await apiClient.post('ENVIRONMENTAL_ANALYSIS', {
        userId,
        location,
        analysisTypes: [
          'air_quality',
          'uv_exposure',
          'water_quality',
          'environmental_toxins',
          'climate_factors',
        ],
        timeRange: '1year',
      });
      
      return response;
    } catch (error) {
      console.error('❌ Ошибка анализа экологических факторов:', error);
      throw error;
    }
  }
  
  // 📱 Синхронизация с носимыми устройствами
  async syncWearableData(
    userId: string,
    deviceType: 'apple_health' | 'google_fit' | 'fitbit' | 'oura' | 'whoop',
    data: any
  ): Promise<ApiResponse<LifestyleFactors>> {
    try {
      const response = await apiClient.syncWearableData(deviceType, {
        userId,
        data,
        analysisType: 'lifestyle-risk-factors',
        includeMetrics: [
          'sleep_quality',
          'physical_activity',
          'heart_rate_variability',
          'stress_levels',
          'menstrual_cycle',
        ],
      });
      
      return response;
    } catch (error) {
      console.error('❌ Ошибка синхронизации с носимыми устройствами:', error);
      throw error;
    }
  }
  
  // 📈 Создание персонального плана мониторинга
  async createMonitoringPlan(
    userId: string,
    riskProfile: EnhancedRiskAssessment,
    preferences: {
      screeningFrequency: 'standard' | 'enhanced' | 'high-risk';
      lifestyleGoals: string[];
      notificationPreferences: any;
    }
  ): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.post('LIFESTYLE_PLAN', {
        userId,
        riskProfile,
        preferences,
        planType: 'comprehensive',
        duration: '12months',
        includeReminders: true,
        includeEducation: true,
      });
      
      return response;
    } catch (error) {
      console.error('❌ Ошибка создания плана мониторинга:', error);
      throw error;
    }
  }
  
  // 🎯 Вспомогательные методы
  
  private calculateCombinedImageRisk(results: any[]): number {
    // Логика объединения рисков из множественных изображений
    const riskScores = results
      .map(r => r.data?.riskScore || 0)
      .filter(score => score > 0);
    
    if (riskScores.length === 0) return 0;
    
    // Используем максимальный риск, но учитываем консистентность
    const maxRisk = Math.max(...riskScores);
    const avgRisk = riskScores.reduce((a, b) => a + b) / riskScores.length;
    
    // Взвешенная комбинация максимального и среднего риска
    return Math.round((maxRisk * 0.7 + avgRisk * 0.3) * 100) / 100;
  }
  
  private generateImageBasedRecommendations(results: any[]): string[] {
    const recommendations: string[] = [];
    
    // Анализируем результаты и генерируем рекомендации
    results.forEach(result => {
      const data = result.data;
      if (data?.findings?.suspicious) {
        recommendations.push('Рекомендуется консультация с онкологом');
      }
      if (data?.density === 'high') {
        recommendations.push('Рассмотрите дополнительные методы скрининга (УЗИ, МРТ)');
      }
      if (data?.calcifications) {
        recommendations.push('Требуется наблюдение за кальцинатами');
      }
    });
    
    return [...new Set(recommendations)]; // Убираем дубликаты
  }
  
  // 📊 Валидация входных данных
  validateInput(input: GailCalculatorInput): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Проверка базовых данных
    if (!input.personalInfo.age || input.personalInfo.age < 35 || input.personalInfo.age > 85) {
      errors.push('Возраст должен быть от 35 до 85 лет');
    }
    
    if (!input.personalInfo.race) {
      errors.push('Необходимо указать этническую принадлежность');
    }
    
    // Проверка медицинской истории
    if (input.medicalHistory.ageAtMenarche && (input.medicalHistory.ageAtMenarche < 8 || input.medicalHistory.ageAtMenarche > 17)) {
      errors.push('Возраст менархе должен быть от 8 до 17 лет');
    }
    
    // Проверка семейной истории
    if (input.familyHistory.breastCancerRelatives < 0) {
      errors.push('Количество родственников с раком молочной железы не может быть отрицательным');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

// Singleton instance
export const enhancedGailService = new EnhancedGailCalculatorService();

// Экспорт типов для использования в компонентах
export type {
  GailCalculatorInput,
  GailCalculatorResult,
  EnhancedRiskAssessment,
  GeneticRiskFactors,
  EnvironmentalFactors,
  LifestyleFactors,
  PersonalizedRecommendations,
};
