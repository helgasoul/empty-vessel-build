
import { LabResult, CalculatedIndex } from '@/types/patient';

export class MedicalIndexCalculator {
  static async calculateMedicalIndices(labResult: LabResult): Promise<CalculatedIndex[]> {
    const indices: CalculatedIndex[] = [];

    // HOMA-IR расчет
    if (this.hasRequiredParametersForHOMAIR(labResult)) {
      const homaIR = this.calculateHOMAIR(labResult);
      if (homaIR) indices.push(homaIR);
    }

    // FT3/FT4 соотношение
    if (this.hasRequiredParametersForFT3FT4(labResult)) {
      const ft3ft4 = this.calculateFT3FT4Ratio(labResult);
      if (ft3ft4) indices.push(ft3ft4);
    }

    return indices;
  }

  private static hasRequiredParametersForHOMAIR(labResult: LabResult): boolean {
    return !!(labResult.results.glucose && labResult.results.insulin);
  }

  private static calculateHOMAIR(labResult: LabResult): CalculatedIndex | null {
    const glucose = parseFloat(labResult.results.glucose?.value as string);
    const insulin = parseFloat(labResult.results.insulin?.value as string);

    if (glucose && insulin) {
      const homaIR = (glucose * insulin) / 22.5;
      return {
        name: 'HOMA-IR',
        value: homaIR,
        interpretation: homaIR < 2.5 ? 'Нормальная чувствительность к инсулину' : 
                      homaIR < 5 ? 'Умеренная инсулинорезистентность' : 'Выраженная инсулинорезистентность',
        normalRange: '< 2.5',
        calculatedAt: new Date(),
        basedOn: ['glucose', 'insulin']
      };
    }

    return null;
  }

  private static hasRequiredParametersForFT3FT4(labResult: LabResult): boolean {
    return !!(labResult.results.ft3 && labResult.results.ft4);
  }

  private static calculateFT3FT4Ratio(labResult: LabResult): CalculatedIndex | null {
    const ft3 = parseFloat(labResult.results.ft3?.value as string);
    const ft4 = parseFloat(labResult.results.ft4?.value as string);

    if (ft3 && ft4) {
      const ratio = ft3 / ft4;
      return {
        name: 'FT3/FT4 Ratio',
        value: ratio,
        interpretation: ratio >= 0.2 && ratio <= 0.4 ? 'Нормальное соотношение' : 'Нарушенное соотношение',
        normalRange: '0.2 - 0.4',
        calculatedAt: new Date(),
        basedOn: ['ft3', 'ft4']
      };
    }

    return null;
  }
}
