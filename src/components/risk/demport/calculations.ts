
import { DemPortFormData, DemPortRiskResult } from './types';

export const calculateDemPortRisk = (data: DemPortFormData): DemPortRiskResult => {
  let riskScore = 0;
  const riskFactors: string[] = [];
  const protectiveFactors: string[] = [];
  const recommendations: string[] = [];

  // Базовый возрастной риск
  if (data.age >= 85) {
    riskScore += 6;
    riskFactors.push('Возраст 85+ лет');
  } else if (data.age >= 75) {
    riskScore += 4;
    riskFactors.push('Возраст 75-84 года');
  } else if (data.age >= 65) {
    riskScore += 2.5;
    riskFactors.push('Возраст 65-74 года');
  } else if (data.age >= 55) {
    riskScore += 1;
    riskFactors.push('Возраст 55-64 года');
  } else if (data.age >= 45) {
    riskScore += 0.3;
  }

  // Пол (женщины имеют несколько больший риск)
  if (data.gender === 'female') {
    riskScore += 0.3;
  }

  // APOE4 статус (критически важный фактор)
  if (data.apoe4_status === 'two_copies') {
    riskScore += 8;
    riskFactors.push('Две копии гена APOE4');
    recommendations.push('Необходима консультация генетика и невролога');
  } else if (data.apoe4_status === 'one_copy') {
    riskScore += 3;
    riskFactors.push('Одна копия гена APOE4');
    recommendations.push('Рекомендуется углубленная профилактика');
  }

  // Образование (сильный защитный фактор)
  if (data.education_years >= 16) {
    riskScore -= 1.5;
    protectiveFactors.push('Высшее образование');
  } else if (data.education_years >= 12) {
    riskScore -= 0.5;
    protectiveFactors.push('Среднее образование');
  } else if (data.education_years < 8) {
    riskScore += 1;
    riskFactors.push('Низкий уровень образования');
    recommendations.push('Увеличьте интеллектуальную активность');
  }

  // Сердечно-сосудистые факторы
  if (data.systolic_bp >= 160) {
    riskScore += 2;
    riskFactors.push('Высокое артериальное давление');
    recommendations.push('Контролируйте артериальное давление');
  } else if (data.systolic_bp >= 140) {
    riskScore += 1;
    riskFactors.push('Повышенное артериальное давление');
  }

  if (data.total_cholesterol >= 240) {
    riskScore += 1.5;
    riskFactors.push('Высокий уровень холестерина');
    recommendations.push('Контролируйте уровень холестерина');
  }

  if (data.hdl_cholesterol < 40) {
    riskScore += 1;
    riskFactors.push('Низкий уровень ЛПВП');
    recommendations.push('Повышайте уровень "хорошего" холестерина');
  } else if (data.hdl_cholesterol >= 60) {
    riskScore -= 0.5;
    protectiveFactors.push('Высокий уровень ЛПВП');
  }

  if (data.diabetes) {
    riskScore += 2;
    riskFactors.push('Сахарный диабет');
    recommendations.push('Строго контролируйте уровень глюкозы');
  }

  // Курение
  if (data.smoking_status === 'current') {
    riskScore += 1.5;
    riskFactors.push('Курение');
    recommendations.push('Бросьте курить немедленно');
  } else if (data.smoking_status === 'former') {
    riskScore += 0.3;
    riskFactors.push('Курение в прошлом');
  }

  // Физическая активность
  if (data.physical_activity === 'high') {
    riskScore -= 1;
    protectiveFactors.push('Высокая физическая активность');
  } else if (data.physical_activity === 'moderate') {
    riskScore -= 0.3;
    protectiveFactors.push('Умеренная физическая активность');
  } else {
    riskScore += 0.8;
    riskFactors.push('Низкая физическая активность');
    recommendations.push('Увеличьте физическую активность');
  }

  // ИМТ
  if (data.bmi) {
    if (data.bmi >= 30) {
      riskScore += 1;
      riskFactors.push('Ожирение');
      recommendations.push('Нормализуйте массу тела');
    } else if (data.bmi < 18.5) {
      riskScore += 0.5;
      riskFactors.push('Недостаточная масса тела');
    } else if (data.bmi >= 18.5 && data.bmi < 25) {
      riskScore -= 0.3;
      protectiveFactors.push('Нормальная масса тела');
    }
  }

  // Алкоголь
  if (data.alcohol_consumption === 'light' || data.alcohol_consumption === 'moderate') {
    riskScore -= 0.2;
    protectiveFactors.push('Умеренное потребление алкоголя');
  } else if (data.alcohol_consumption === 'heavy') {
    riskScore += 1;
    riskFactors.push('Злоупотребление алкоголем');
    recommendations.push('Сократите потребление алкоголя');
  }

  // Медицинская история
  if (data.depression_history) {
    riskScore += 1;
    riskFactors.push('История депрессии');
    recommendations.push('Следите за психическим здоровьем');
  }

  if (data.head_injury_history) {
    riskScore += 0.8;
    riskFactors.push('Черепно-мозговые травмы');
  }

  if (data.stroke_history) {
    riskScore += 2;
    riskFactors.push('Инсульт в анамнезе');
    recommendations.push('Интенсивная профилактика сосудистых заболеваний');
  }

  if (data.heart_disease) {
    riskScore += 1.5;
    riskFactors.push('Сердечно-сосудистые заболевания');
    recommendations.push('Контролируйте состояние сердца');
  }

  // Когнитивные активности
  if (data.cognitive_activities === 'high') {
    riskScore -= 1;
    protectiveFactors.push('Высокая когнитивная активность');
  } else if (data.cognitive_activities === 'low') {
    riskScore += 0.5;
    riskFactors.push('Низкая когнитивная активность');
    recommendations.push('Увеличьте интеллектуальную нагрузку');
  }

  // Социальная активность
  if (data.social_engagement === 'high') {
    riskScore -= 0.8;
    protectiveFactors.push('Высокая социальная активность');
  } else if (data.social_engagement === 'low') {
    riskScore += 0.8;
    riskFactors.push('Социальная изоляция');
    recommendations.push('Развивайте социальные связи');
  }

  // Качество сна
  if (data.sleep_quality === 'good') {
    riskScore -= 0.3;
    protectiveFactors.push('Хорошее качество сна');
  } else if (data.sleep_quality === 'poor') {
    riskScore += 0.8;
    riskFactors.push('Плохое качество сна');
    recommendations.push('Улучшите гигиену сна');
  }

  // Уровень стресса
  if (data.stress_levels === 'high') {
    riskScore += 0.8;
    riskFactors.push('Высокий уровень стресса');
    recommendations.push('Изучите техники управления стрессом');
  } else if (data.stress_levels === 'low') {
    riskScore -= 0.3;
    protectiveFactors.push('Низкий уровень стресса');
  }

  // Семейная история
  if (data.family_dementia_history) {
    riskScore += 2;
    riskFactors.push('Семейная история деменции');
    recommendations.push('Регулярное наблюдение у невролога');
  }

  if (data.family_cardiovascular_history) {
    riskScore += 0.5;
    riskFactors.push('Семейная история сердечно-сосудистых заболеваний');
  }

  // Конвертация в проценты (DemPoRT использует популяционные данные)
  const baselineRisk = data.age >= 65 ? 15 : 5; // базовый популяционный риск
  const tenYearRisk = Math.min(Math.max(baselineRisk + (riskScore * 1.8), 0.5), 60);
  const lifetimeRisk = Math.min(Math.max(tenYearRisk * 2.5, 2), 85);

  // Определение уровня риска
  let riskLevel: 'low' | 'intermediate' | 'high';
  if (tenYearRisk < 8) {
    riskLevel = 'low';
  } else if (tenYearRisk < 20) {
    riskLevel = 'intermediate';
  } else {
    riskLevel = 'high';
  }

  // Процентиль в популяции
  const populationPercentile = Math.min(Math.max((riskScore + 5) * 8, 5), 95);

  // Базовые рекомендации
  recommendations.push(
    'Соблюдайте средиземноморскую диету',
    'Поддерживайте регулярную физическую активность',
    'Высыпайтесь (7-9 часов в сутки)',
    'Поддерживайте социальную активность',
    'Регулярно проходите медицинские осмотры'
  );

  return {
    tenYearRisk: Math.round(tenYearRisk * 10) / 10,
    lifetimeRisk: Math.round(lifetimeRisk * 10) / 10,
    riskLevel,
    riskFactors,
    protectiveFactors,
    recommendations: [...new Set(recommendations)],
    populationPercentile: Math.round(populationPercentile),
  };
};
