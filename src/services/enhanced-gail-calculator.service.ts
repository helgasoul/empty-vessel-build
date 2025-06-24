
import { GailCalculatorService } from './gail/GailCalculatorService';
import type {
  GailCalculatorInput,
  GailCalculatorResult,
  EnhancedRiskAssessment,
  GeneticRiskFactors,
  EnvironmentalFactors,
} from '../types/gail-calculator';

interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

class EnhancedGailCalculatorService {
  async calculateRisk(input: GailCalculatorInput): Promise<ServiceResponse<GailCalculatorResult>> {
    try {
      const result = GailCalculatorService.calculateGailRisk(input);
      return {
        success: true,
        data: result,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Ошибка при расчете рисков',
      };
    }
  }

  async calculateEnhancedRisk(
    input: GailCalculatorInput,
    geneticData?: GeneticRiskFactors,
    environmentalData?: EnvironmentalFactors
  ): Promise<ServiceResponse<EnhancedRiskAssessment>> {
    try {
      // Создаем расширенный input с дополнительными данными
      const enhancedInput = {
        ...input,
        genetic: geneticData,
        environmental: environmentalData,
      };

      const result = GailCalculatorService.calculateEnhancedRisk(enhancedInput);
      return {
        success: true,
        data: result,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Ошибка при расширенном анализе',
      };
    }
  }
}

export const enhancedGailService = new EnhancedGailCalculatorService();
