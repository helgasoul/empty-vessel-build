
import { CancerRiskFormData, CancerRiskResult, CancerTypeRisk } from './types';

export const calculateCancerRisk = (data: CancerRiskFormData): CancerRiskResult => {
  const bmi = data.weight / Math.pow(data.height / 100, 2);
  
  // Расчет рисков для различных типов рака
  const cancerTypes: CancerTypeRisk[] = [];
  
  // Рак легких
  const lungCancerRisk = calculateLungCancerRisk(data);
  cancerTypes.push(lungCancerRisk);
  
  // Рак молочной железы (для женщин)
  if (data.gender === 'female') {
    const breastCancerRisk = calculateBreastCancerRisk(data, bmi);
    cancerTypes.push(breastCancerRisk);
  }
  
  // Колоректальный рак
  const colorectalCancerRisk = calculateColorectalCancerRisk(data, bmi);
  cancerTypes.push(colorectalCancerRisk);
  
  // Рак кожи (меланома)
  const melanomaRisk = calculateMelanomaRisk(data);
  cancerTypes.push(melanomaRisk);
  
  // Рак простаты (для мужчин)
  if (data.gender === 'male') {
    const prostateCancerRisk = calculateProstateCancerRisk(data);
    cancerTypes.push(prostateCancerRisk);
  }
  
  // Рак шейки матки (для женщин)
  if (data.gender === 'female') {
    const cervicalCancerRisk = calculateCervicalCancerRisk(data);
    cancerTypes.push(cervicalCancerRisk);
  }
  
  // Общий риск
  const overallTenYearRisk = cancerTypes.reduce((sum, cancer) => sum + cancer.tenYearRisk, 0);
  const overallLifetimeRisk = Math.min(100, cancerTypes.reduce((sum, cancer) => sum + cancer.lifetimeRisk, 0));
  
  const overallRiskLevel = 
    overallTenYearRisk < 5 ? 'low' :
    overallTenYearRisk < 15 ? 'moderate' :
    overallTenYearRisk < 25 ? 'high' : 'very_high';
  
  const recommendations = generateRecommendations(data, cancerTypes);
  const screeningRecommendations = generateScreeningRecommendations(data, cancerTypes);
  const lifestyleRecommendations = generateLifestyleRecommendations(data, bmi);
  
  const populationComparison = calculatePopulationComparison(data, overallTenYearRisk);
  
  return {
    overallRisk: {
      tenYearRisk: Math.round(overallTenYearRisk * 10) / 10,
      lifetimeRisk: Math.round(overallLifetimeRisk * 10) / 10,
      riskLevel: overallRiskLevel,
    },
    cancerTypes,
    recommendations,
    screeningRecommendations,
    lifestyleRecommendations,
    populationComparison,
  };
};

const calculateLungCancerRisk = (data: CancerRiskFormData): CancerTypeRisk => {
  let risk = 0.5; // базовый риск
  const riskFactors: string[] = [];
  
  // Курение - основной фактор риска
  if (data.smoking_status === 'current') {
    const packYears = (data.cigarettes_per_day / 20) * data.smoking_years;
    risk *= (1 + packYears * 0.1);
    riskFactors.push('Текущее курение');
  } else if (data.smoking_status === 'former') {
    const packYears = (data.cigarettes_per_day / 20) * data.smoking_years;
    risk *= (1 + packYears * 0.05);
    riskFactors.push('Курение в прошлом');
  }
  
  // Возраст
  if (data.age > 50) {
    risk *= (1 + (data.age - 50) * 0.02);
  }
  
  // Семейная история
  if (data.family_cancer_history && data.family_cancer_types.includes('lung')) {
    risk *= 1.8;
    riskFactors.push('Семейная история рака легких');
  }
  
  // Профессиональное воздействие
  if (data.occupational_exposure) {
    risk *= 1.3;
    riskFactors.push('Профессиональное воздействие канцерогенов');
  }
  
  const tenYearRisk = Math.min(50, risk);
  const lifetimeRisk = Math.min(100, risk * 4);
  
  return {
    type: 'lung',
    name: 'Рак легких',
    tenYearRisk: Math.round(tenYearRisk * 10) / 10,
    lifetimeRisk: Math.round(lifetimeRisk * 10) / 10,
    riskLevel: tenYearRisk < 2 ? 'low' : tenYearRisk < 8 ? 'moderate' : tenYearRisk < 20 ? 'high' : 'very_high',
    majorRiskFactors: riskFactors,
  };
};

const calculateBreastCancerRisk = (data: CancerRiskFormData, bmi: number): CancerTypeRisk => {
  let risk = 2.5; // базовый риск для женщин
  const riskFactors: string[] = [];
  
  // Возраст
  if (data.age > 50) {
    risk *= (1 + (data.age - 50) * 0.03);
  }
  
  // Семейная история
  if (data.family_cancer_history && data.family_cancer_types.includes('breast')) {
    if (data.family_cancer_degree === 'first') {
      risk *= 2.1;
      riskFactors.push('Семейная история рака молочной железы (первая линия)');
    } else {
      risk *= 1.5;
      riskFactors.push('Семейная история рака молочной железы');
    }
  }
  
  // Репродуктивные факторы
  if (data.age_at_menarche && data.age_at_menarche < 12) {
    risk *= 1.2;
    riskFactors.push('Раннее менархе');
  }
  
  if (data.age_at_menopause && data.age_at_menopause > 55) {
    risk *= 1.3;
    riskFactors.push('Поздняя менопауза');
  }
  
  if (data.pregnancies_count === 0) {
    risk *= 1.2;
    riskFactors.push('Отсутствие беременностей');
  }
  
  if (data.age_at_first_birth && data.age_at_first_birth > 30) {
    risk *= 1.2;
    riskFactors.push('Поздние первые роды');
  }
  
  // ЗГТ
  if (data.hormone_replacement_therapy) {
    risk *= 1.3;
    riskFactors.push('Заместительная гормональная терапия');
  }
  
  // Алкоголь
  if (data.alcohol_consumption === 'moderate' || data.alcohol_consumption === 'heavy') {
    risk *= 1.2;
    riskFactors.push('Употребление алкоголя');
  }
  
  // ИМТ (после менопаузы)
  if (data.age > 50 && bmi > 30) {
    risk *= 1.3;
    riskFactors.push('Избыточный вес после менопаузы');
  }
  
  const tenYearRisk = Math.min(30, risk);
  const lifetimeRisk = Math.min(100, risk * 3);
  
  return {
    type: 'breast',
    name: 'Рак молочной железы',
    tenYearRisk: Math.round(tenYearRisk * 10) / 10,
    lifetimeRisk: Math.round(lifetimeRisk * 10) / 10,
    riskLevel: tenYearRisk < 3 ? 'low' : tenYearRisk < 10 ? 'moderate' : tenYearRisk < 20 ? 'high' : 'very_high',
    majorRiskFactors: riskFactors,
  };
};

const calculateColorectalCancerRisk = (data: CancerRiskFormData, bmi: number): CancerTypeRisk => {
  let risk = 1.2;
  const riskFactors: string[] = [];
  
  // Возраст
  if (data.age > 50) {
    risk *= (1 + (data.age - 50) * 0.04);
  }
  
  // Семейная история
  if (data.family_cancer_history && data.family_cancer_types.includes('colorectal')) {
    risk *= 2.3;
    riskFactors.push('Семейная история колоректального рака');
  }
  
  // ВЗК
  if (data.inflammatory_bowel_disease) {
    risk *= 2.5;
    riskFactors.push('Воспалительные заболевания кишечника');
  }
  
  // Питание и образ жизни
  if (data.red_meat_consumption === 'high') {
    risk *= 1.3;
    riskFactors.push('Высокое потребление красного мяса');
  }
  
  if (data.processed_meat_consumption === 'high') {
    risk *= 1.4;
    riskFactors.push('Высокое потребление переработанного мяса');
  }
  
  if (data.fruit_vegetable_intake === 'low') {
    risk *= 1.2;
    riskFactors.push('Низкое потребление фруктов и овощей');
  }
  
  // Курение
  if (data.smoking_status === 'current') {
    risk *= 1.2;
    riskFactors.push('Курение');
  }
  
  // Алкоголь
  if (data.alcohol_consumption === 'heavy') {
    risk *= 1.4;
    riskFactors.push('Злоупотребление алкоголем');
  }
  
  // ИМТ
  if (bmi > 30) {
    risk *= 1.3;
    riskFactors.push('Ожирение');
  }
  
  // Низкая физическая активность
  if (data.physical_activity === 'low') {
    risk *= 1.2;
    riskFactors.push('Низкая физическая активность');
  }
  
  const tenYearRisk = Math.min(25, risk);
  const lifetimeRisk = Math.min(100, risk * 3.5);
  
  return {
    type: 'colorectal',
    name: 'Колоректальный рак',
    tenYearRisk: Math.round(tenYearRisk * 10) / 10,
    lifetimeRisk: Math.round(lifetimeRisk * 10) / 10,
    riskLevel: tenYearRisk < 2 ? 'low' : tenYearRisk < 6 ? 'moderate' : tenYearRisk < 15 ? 'high' : 'very_high',
    majorRiskFactors: riskFactors,
  };
};

const calculateMelanomaRisk = (data: CancerRiskFormData): CancerTypeRisk => {
  let risk = 0.3;
  const riskFactors: string[] = [];
  
  // Тип кожи
  if (data.skin_type === 'very_fair' || data.skin_type === 'fair') {
    risk *= 3;
    riskFactors.push('Светлый тип кожи');
  }
  
  // Воздействие солнца
  if (data.sun_exposure === 'high') {
    risk *= 2.5;
    riskFactors.push('Высокое воздействие солнца');
  }
  
  // Семейная история
  if (data.family_cancer_history && data.family_cancer_types.includes('melanoma')) {
    risk *= 2.8;
    riskFactors.push('Семейная история меланомы');
  }
  
  // Возраст
  if (data.age > 40) {
    risk *= (1 + (data.age - 40) * 0.02);
  }
  
  const tenYearRisk = Math.min(15, risk);
  const lifetimeRisk = Math.min(100, risk * 6);
  
  return {
    type: 'melanoma',
    name: 'Меланома',
    tenYearRisk: Math.round(tenYearRisk * 10) / 10,
    lifetimeRisk: Math.round(lifetimeRisk * 10) / 10,
    riskLevel: tenYearRisk < 1 ? 'low' : tenYearRisk < 3 ? 'moderate' : tenYearRisk < 8 ? 'high' : 'very_high',
    majorRiskFactors: riskFactors,
  };
};

const calculateProstateCancerRisk = (data: CancerRiskFormData): CancerTypeRisk => {
  let risk = 1.5;
  const riskFactors: string[] = [];
  
  // Возраст - основной фактор
  if (data.age > 50) {
    risk *= (1 + (data.age - 50) * 0.05);
  }
  
  // Семейная история
  if (data.family_cancer_history && data.family_cancer_types.includes('prostate')) {
    risk *= 2.2;
    riskFactors.push('Семейная история рака простаты');
  }
  
  const tenYearRisk = Math.min(30, risk);
  const lifetimeRisk = Math.min(100, risk * 4);
  
  return {
    type: 'prostate',
    name: 'Рак простаты',
    tenYearRisk: Math.round(tenYearRisk * 10) / 10,
    lifetimeRisk: Math.round(lifetimeRisk * 10) / 10,
    riskLevel: tenYearRisk < 3 ? 'low' : tenYearRisk < 10 ? 'moderate' : tenYearRisk < 20 ? 'high' : 'very_high',
    majorRiskFactors: riskFactors,
  };
};

const calculateCervicalCancerRisk = (data: CancerRiskFormData): CancerTypeRisk => {
  let risk = 0.8;
  const riskFactors: string[] = [];
  
  // Курение
  if (data.smoking_status === 'current') {
    risk *= 2.3;
    riskFactors.push('Курение');
  }
  
  // Скрининг
  if (data.pap_smear_frequency === 'never') {
    risk *= 3.5;
    riskFactors.push('Отсутствие скрининга');
  } else if (data.pap_smear_frequency === 'irregular') {
    risk *= 1.8;
    riskFactors.push('Нерегулярный скрининг');
  }
  
  const tenYearRisk = Math.min(10, risk);
  const lifetimeRisk = Math.min(100, risk * 5);
  
  return {
    type: 'cervical',
    name: 'Рак шейки матки',
    tenYearRisk: Math.round(tenYearRisk * 10) / 10,
    lifetimeRisk: Math.round(lifetimeRisk * 10) / 10,
    riskLevel: tenYearRisk < 1 ? 'low' : tenYearRisk < 3 ? 'moderate' : tenYearRisk < 6 ? 'high' : 'very_high',
    majorRiskFactors: riskFactors,
  };
};

const generateRecommendations = (data: CancerRiskFormData, cancerTypes: CancerTypeRisk[]): string[] => {
  const recommendations: string[] = [];
  
  // Общие рекомендации
  recommendations.push('Придерживайтесь здорового образа жизни');
  recommendations.push('Регулярно проходите профилактические осмотры');
  
  // Специфические рекомендации по типам рака
  const highRiskCancers = cancerTypes.filter(cancer => cancer.riskLevel === 'high' || cancer.riskLevel === 'very_high');
  
  if (highRiskCancers.length > 0) {
    recommendations.push('Обратитесь к онкологу для консультации о повышенных рисках');
    recommendations.push('Рассмотрите возможность генетического консультирования');
  }
  
  if (data.smoking_status === 'current') {
    recommendations.push('Бросьте курить - это самый важный шаг для снижения риска рака');
  }
  
  if (data.alcohol_consumption === 'heavy') {
    recommendations.push('Сократите потребление алкоголя');
  }
  
  return recommendations;
};

const generateScreeningRecommendations = (data: CancerRiskFormData, cancerTypes: CancerTypeRisk[]): string[] => {
  const screening: string[] = [];
  
  // Маммография
  if (data.gender === 'female' && data.age >= 40) {
    if (data.mammography_frequency !== 'regular') {
      screening.push('Регулярная маммография (ежегодно после 40 лет)');
    }
  }
  
  // Колоноскопия
  if (data.age >= 45) {
    if (data.colonoscopy_frequency !== 'regular') {
      screening.push('Колоноскопия каждые 10 лет начиная с 45 лет');
    }
  }
  
  // Цитология шейки матки
  if (data.gender === 'female' && data.age >= 21) {
    if (data.pap_smear_frequency !== 'regular') {
      screening.push('Цитологическое исследование шейки матки каждые 3 года');
    }
  }
  
  // Дерматологический осмотр
  if (data.skin_type === 'very_fair' || data.skin_type === 'fair' || data.sun_exposure === 'high') {
    screening.push('Ежегодный осмотр у дерматолога');
  }
  
  return screening;
};

const generateLifestyleRecommendations = (data: CancerRiskFormData, bmi: number): string[] => {
  const lifestyle: string[] = [];
  
  if (bmi > 25) {
    lifestyle.push('Поддерживайте здоровый вес');
  }
  
  if (data.physical_activity === 'low') {
    lifestyle.push('Увеличьте физическую активность (не менее 150 минут в неделю)');
  }
  
  if (data.fruit_vegetable_intake === 'low') {
    lifestyle.push('Увеличьте потребление фруктов и овощей (не менее 5 порций в день)');
  }
  
  if (data.red_meat_consumption === 'high') {
    lifestyle.push('Сократите потребление красного мяса');
  }
  
  if (data.processed_meat_consumption === 'high') {
    lifestyle.push('Избегайте переработанного мяса');
  }
  
  if (data.sun_exposure === 'high') {
    lifestyle.push('Защищайтесь от солнца: используйте солнцезащитный крем, носите защитную одежду');
  }
  
  return lifestyle;
};

const calculatePopulationComparison = (data: CancerRiskFormData, overallRisk: number): any => {
  const averageRiskForAge = data.age > 50 ? 8 : 3;
  const percentile = Math.round((overallRisk / averageRiskForAge) * 50);
  
  return {
    percentile: Math.min(95, Math.max(5, percentile)),
    comparedToAge: `средний для возраста ${data.age} лет`,
    comparedToGender: data.gender === 'female' ? 'женщин' : 'мужчин',
  };
};
