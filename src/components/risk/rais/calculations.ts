
import { RaisRiskFormData, RaisRiskResult, ChemicalRiskResult } from './types';

// Справочные данные по токсикологическим параметрам химических веществ
const CHEMICAL_DATA: Record<string, {
  name: string;
  cancerSlopeFactor?: number; // (мг/кг/день)^-1
  referenceInhalationDose?: number; // мг/м³
  referenceDermalDose?: number; // мг/кг/день
  referenceOralDose?: number; // мг/кг/день
  volatilityFactor: number;
  absorptionFactor: number;
}> = {
  benzene: {
    name: 'Бензол',
    cancerSlopeFactor: 0.055,
    referenceInhalationDose: 0.03,
    referenceDermalDose: 0.02,
    referenceOralDose: 0.004,
    volatilityFactor: 0.8,
    absorptionFactor: 0.1
  },
  toluene: {
    name: 'Толуол',
    referenceInhalationDose: 5.0,
    referenceDermalDose: 0.08,
    referenceOralDose: 0.08,
    volatilityFactor: 0.6,
    absorptionFactor: 0.05
  },
  formaldehyde: {
    name: 'Формальдегид',
    cancerSlopeFactor: 0.045,
    referenceInhalationDose: 0.009,
    referenceDermalDose: 0.2,
    referenceOralDose: 0.2,
    volatilityFactor: 0.9,
    absorptionFactor: 0.2
  },
  mercury: {
    name: 'Ртуть',
    referenceInhalationDose: 0.0003,
    referenceDermalDose: 0.000021,
    referenceOralDose: 0.0003,
    volatilityFactor: 0.3,
    absorptionFactor: 0.15
  },
  lead: {
    name: 'Свинец',
    referenceInhalationDose: 0.000012,
    referenceDermalDose: 0.0000042,
    referenceOralDose: 0.0036,
    volatilityFactor: 0.1,
    absorptionFactor: 0.3
  },
  cadmium: {
    name: 'Кадмий',
    cancerSlopeFactor: 6.3,
    referenceInhalationDose: 0.0001,
    referenceDermalDose: 0.00001,
    referenceOralDose: 0.001,
    volatilityFactor: 0.2,
    absorptionFactor: 0.25
  },
  chromium_vi: {
    name: 'Хром VI',
    cancerSlopeFactor: 41.0,
    referenceInhalationDose: 0.0001,
    referenceDermalDose: 0.00006,
    referenceOralDose: 0.003,
    volatilityFactor: 0.1,
    absorptionFactor: 0.4
  },
  arsenic: {
    name: 'Мышьяк',
    cancerSlopeFactor: 1.5,
    referenceInhalationDose: 0.000015,
    referenceDermalDose: 0.0003,
    referenceOralDose: 0.0003,
    volatilityFactor: 0.2,
    absorptionFactor: 0.3
  },
  vinyl_chloride: {
    name: 'Винилхлорид',
    cancerSlopeFactor: 1.9,
    referenceInhalationDose: 0.1,
    referenceDermalDose: 0.003,
    referenceOralDose: 0.003,
    volatilityFactor: 0.95,
    absorptionFactor: 0.1
  },
  dichloromethane: {
    name: 'Дихлорметан',
    cancerSlopeFactor: 0.0075,
    referenceInhalationDose: 6.0,
    referenceDermalDose: 0.06,
    referenceOralDose: 0.06,
    volatilityFactor: 0.85,
    absorptionFactor: 0.08
  }
};

const DEFAULT_CHEMICAL_DATA = {
  name: 'Неизвестное вещество',
  referenceInhalationDose: 0.1,
  referenceDermalDose: 0.01,
  referenceOralDose: 0.01,
  volatilityFactor: 0.5,
  absorptionFactor: 0.1
};

function calculateExposureDose(data: RaisRiskFormData): {
  inhalationDose: number;
  dermalDose: number;
  oralDose: number;
} {
  const { 
    body_weight, 
    exposure_duration, 
    exposure_frequency, 
    exposure_time_per_day,
    inhalation_exposure,
    inhalation_concentration = 0,
    dermal_exposure,
    dermal_concentration = 0,
    skin_surface_area = 0,
    oral_exposure,
    oral_dose = 0
  } = data;

  // Расчет среднесуточной дозы (ADTC - Average Daily Total Concentration)
  const exposureFactor = (exposure_frequency * exposure_time_per_day * exposure_duration) / (365 * 24 * 70);

  let inhalationDose = 0;
  if (inhalation_exposure && inhalation_concentration > 0) {
    // Доза ингаляционного воздействия (мг/кг/день)
    const inhalationRate = 20; // м³/день (стандартная скорость дыхания взрослого)
    inhalationDose = (inhalation_concentration * inhalationRate * exposureFactor) / body_weight;
  }

  let dermalDose = 0;
  if (dermal_exposure && dermal_concentration > 0 && skin_surface_area > 0) {
    // Доза контактного воздействия (мг/кг/день)
    const absorptionFactor = 0.1; // коэффициент абсорбции через кожу
    dermalDose = (dermal_concentration * skin_surface_area * absorptionFactor * exposureFactor) / body_weight;
  }

  let adjustedOralDose = 0;
  if (oral_exposure && oral_dose > 0) {
    // Пероральная доза с учетом продолжительности воздействия
    adjustedOralDose = oral_dose * exposureFactor;
  }

  return {
    inhalationDose,
    dermalDose,
    oralDose: adjustedOralDose
  };
}

function calculateChemicalRisk(
  chemicalType: string,
  doses: { inhalationDose: number; dermalDose: number; oralDose: number },
  data: RaisRiskFormData
): ChemicalRiskResult {
  const chemicalData = CHEMICAL_DATA[chemicalType] || DEFAULT_CHEMICAL_DATA;
  
  let cancerRisk = 0;
  let nonCancerRisk = 0;
  let primaryRoute = 'inhalation';

  // Расчет канцерогенного риска
  if (chemicalData.cancerSlopeFactor) {
    const totalDose = doses.inhalationDose + doses.dermalDose + doses.oralDose;
    cancerRisk = totalDose * chemicalData.cancerSlopeFactor;
  }

  // Расчет неканцерогенного риска (коэффициент опасности)
  let hazardQuotients: number[] = [];

  if (doses.inhalationDose > 0 && chemicalData.referenceInhalationDose) {
    hazardQuotients.push(doses.inhalationDose / chemicalData.referenceInhalationDose);
  }

  if (doses.dermalDose > 0 && chemicalData.referenceDermalDose) {
    hazardQuotients.push(doses.dermalDose / chemicalData.referenceDermalDose);
  }

  if (doses.oralDose > 0 && chemicalData.referenceOralDose) {
    hazardQuotients.push(doses.oralDose / chemicalData.referenceOralDose);
  }

  nonCancerRisk = Math.max(...hazardQuotients, 0);

  // Определение основного пути воздействия
  if (doses.dermalDose > doses.inhalationDose && doses.dermalDose > doses.oralDose) {
    primaryRoute = 'dermal';
  } else if (doses.oralDose > doses.inhalationDose && doses.oralDose > doses.dermalDose) {
    primaryRoute = 'oral';
  }

  // Определение уровня риска
  let riskLevel: 'acceptable' | 'of_concern' | 'high' | 'very_high' = 'acceptable';
  
  if (cancerRisk > 1e-4 || nonCancerRisk > 10) {
    riskLevel = 'very_high';
  } else if (cancerRisk > 1e-5 || nonCancerRisk > 1) {
    riskLevel = 'high';
  } else if (cancerRisk > 1e-6 || nonCancerRisk > 0.1) {
    riskLevel = 'of_concern';
  }

  return {
    substance: chemicalData.name,
    cancerRisk,
    nonCancerRisk,
    exposureRoute: primaryRoute,
    riskLevel
  };
}

function generateRecommendations(data: RaisRiskFormData, result: RaisRiskResult): string[] {
  const recommendations: string[] = [];

  // Базовые рекомендации в зависимости от уровня риска
  if (result.overallRisk.riskLevel === 'very_high') {
    recommendations.push('Немедленно обратитесь к специалисту по гигиене труда или токсикологу');
    recommendations.push('Прекратите воздействие химического вещества до получения профессиональной консультации');
  } else if (result.overallRisk.riskLevel === 'high') {
    recommendations.push('Настоятельно рекомендуется консультация с врачом-токсикологом');
    recommendations.push('Минимизируйте воздействие химического вещества');
  }

  // Рекомендации по путям воздействия
  if (data.inhalation_exposure) {
    recommendations.push('Используйте респираторы или маски при работе с химическими веществами');
    recommendations.push('Обеспечьте хорошую вентиляцию в рабочих и жилых помещениях');
  }

  if (data.dermal_exposure) {
    recommendations.push('Используйте защитные перчатки и одежду при контакте с химическими веществами');
    recommendations.push('Тщательно мойте руки и открытые участки кожи после возможного контакта');
  }

  if (data.oral_exposure) {
    recommendations.push('Избегайте приема пищи и питья в зонах возможного химического загрязнения');
    recommendations.push('Используйте системы фильтрации воды, если источник может быть загрязнен');
  }

  // Профессиональные рекомендации
  if (data.work_environment === 'industrial' || data.work_environment === 'laboratory') {
    recommendations.push('Строго соблюдайте протоколы безопасности на рабочем месте');
    recommendations.push('Проходите регулярные медицинские осмотры');
  }

  // Жилищные рекомендации
  if (data.proximity_to_industrial_sites === 'very_close' || data.proximity_to_industrial_sites === 'close') {
    recommendations.push('Рассмотрите возможность использования очистителей воздуха дома');
    recommendations.push('Регулярно проветривайте помещения, особенно в периоды низкой промышленной активности');
  }

  return recommendations;
}

function generateProtectiveMeasures(data: RaisRiskFormData): string[] {
  const measures: string[] = [];

  measures.push('Используйте сертифицированные средства индивидуальной защиты (СИЗ)');
  measures.push('Регулярно проводите мониторинг качества воздуха и воды');
  measures.push('Поддерживайте чистоту в жилых и рабочих помещениях');

  if (data.chemical_substance === 'benzene' || data.chemical_substance === 'toluene') {
    measures.push('Избегайте курения и ограничьте потребление алкоголя');
  }

  if (data.chemical_substance === 'mercury' || data.chemical_substance === 'lead') {
    measures.push('Включите в рацион продукты, богатые антиоксидантами');
    measures.push('Рассмотрите возможность хелирующей терапии под наблюдением врача');
  }

  return measures;
}

export function calculateRaisRisk(data: RaisRiskFormData): RaisRiskResult {
  const doses = calculateExposureDose(data);
  const chemicalRisk = calculateChemicalRisk(data.chemical_substance, doses, data);

  // Общий риск
  const totalCancerRisk = chemicalRisk.cancerRisk;
  const totalNonCancerRisk = chemicalRisk.nonCancerRisk;
  const hazardIndex = totalNonCancerRisk;

  let overallRiskLevel: 'acceptable' | 'of_concern' | 'high' | 'very_high' = 'acceptable';
  
  if (totalCancerRisk > 1e-4 || hazardIndex > 10) {
    overallRiskLevel = 'very_high';
  } else if (totalCancerRisk > 1e-5 || hazardIndex > 1) {
    overallRiskLevel = 'high';
  } else if (totalCancerRisk > 1e-6 || hazardIndex > 0.1) {
    overallRiskLevel = 'of_concern';
  }

  const result: RaisRiskResult = {
    overallRisk: {
      totalCancerRisk,
      totalNonCancerRisk,
      hazardIndex,
      riskLevel: overallRiskLevel
    },
    chemicalRisks: [chemicalRisk],
    exposureRoutes: {
      inhalation: doses.inhalationDose,
      dermal: doses.dermalDose,
      oral: doses.oralDose
    },
    recommendations: [],
    protectiveMeasures: generateProtectiveMeasures(data),
    monitoringRecommendations: [
      'Регулярно контролируйте концентрации химических веществ в воздухе',
      'Проводите анализы крови и мочи на содержание токсичных веществ',
      'Мониторьте состояние здоровья с особым вниманием к органам-мишеням'
    ],
    populationComparison: {
      percentile: Math.min(95, Math.max(5, 50 + (totalCancerRisk - 1e-6) * 1000)),
      comparedToAge: `${data.age}-летних`,
      comparedToScenario: data.exposure_scenario === 'residential' ? 'жителей' : 
                        data.exposure_scenario === 'occupational' ? 'работников' : 'населения'
    }
  };

  result.recommendations = generateRecommendations(data, result);

  return result;
}
