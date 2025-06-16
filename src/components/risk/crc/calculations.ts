
import { CRCProFormData, CRCProRiskResult } from "./types";

export const calculateCRCProRisk = (data: CRCProFormData): CRCProRiskResult => {
  let riskScore = 0;
  let recommendations: string[] = [];

  // Базовые факторы риска
  
  // Возраст (основной фактор риска)
  if (data.age >= 50) {
    riskScore += 15;
    if (data.age >= 60) riskScore += 10;
    if (data.age >= 70) riskScore += 15;
  } else if (data.age >= 45) {
    riskScore += 5;
  }

  // Семейная история
  if (data.family_history_crc) {
    riskScore += 20;
    recommendations.push("Обсудите с врачом более раннее начало скрининга из-за семейной истории колоректального рака");
  }
  
  if (data.family_history_polyps) {
    riskScore += 10;
    recommendations.push("Семейная история полипов увеличивает ваш риск - рассмотрите регулярные колоноскопии");
  }
  
  if (data.family_history_ibd) {
    riskScore += 15;
    recommendations.push("Семейная история воспалительных заболеваний кишечника требует особого внимания");
  }

  // Личная медицинская история
  if (data.personal_history_polyps) {
    riskScore += 25;
    recommendations.push("Личная история полипов значительно увеличивает риск - необходимо регулярное наблюдение");
  }
  
  if (data.personal_history_ibd) {
    riskScore += 30;
    recommendations.push("Воспалительные заболевания кишечника требуют интенсивного мониторинга");
  }
  
  if (data.diabetes_type2) {
    riskScore += 8;
    recommendations.push("Диабет 2 типа увеличивает риск колоректального рака - контролируйте уровень сахара");
  }

  // Образ жизни
  if (data.smoking_status === 'current') {
    riskScore += 12;
    recommendations.push("Курение значительно увеличивает риск рака - рассмотрите программы отказа от курения");
  } else if (data.smoking_status === 'former') {
    riskScore += 6;
  }

  if (data.alcohol_consumption === 'heavy') {
    riskScore += 10;
    recommendations.push("Чрезмерное употребление алкоголя увеличивает риск - рассмотрите сокращение");
  } else if (data.alcohol_consumption === 'moderate') {
    riskScore += 4;
  }

  if (data.physical_activity === 'low') {
    riskScore += 8;
    recommendations.push("Низкая физическая активность увеличивает риск - увеличьте физическую нагрузку");
  } else if (data.physical_activity === 'high') {
    riskScore -= 5;
    recommendations.push("Высокая физическая активность снижает риск - продолжайте активный образ жизни");
  }

  // Диетические факторы
  if (data.red_meat_consumption === 'high') {
    riskScore += 8;
    recommendations.push("Высокое потребление красного мяса увеличивает риск - рассмотрите сокращение");
  }
  
  if (data.processed_meat_consumption === 'high') {
    riskScore += 10;
    recommendations.push("Переработанное мясо значительно увеличивает риск - ограничьте потребление");
  }

  if (data.fiber_intake === 'low') {
    riskScore += 6;
    recommendations.push("Низкое потребление клетчатки увеличивает риск - увеличьте потребление овощей и цельнозерновых");
  } else if (data.fiber_intake === 'high') {
    riskScore -= 4;
    recommendations.push("Высокое потребление клетчатки снижает риск - продолжайте здоровое питание");
  }

  if (data.vegetable_intake === 'low') {
    riskScore += 5;
    recommendations.push("Увеличьте потребление овощей для снижения риска");
  } else if (data.vegetable_intake === 'high') {
    riskScore -= 3;
  }

  // Защитные факторы
  if (data.calcium_supplements) {
    riskScore -= 3;
    recommendations.push("Прием кальция может снижать риск - продолжайте по рекомендации врача");
  }
  
  if (data.nsaid_use) {
    riskScore -= 4;
    recommendations.push("НПВП могут снижать риск, но требуют осторожности - консультируйтесь с врачом");
  }

  // ИМТ расчет (если есть данные)
  if (data.height_cm && data.weight_kg) {
    const bmi = data.weight_kg / Math.pow(data.height_cm / 100, 2);
    if (bmi >= 30) {
      riskScore += 12;
      recommendations.push("Ожирение увеличивает риск колоректального рака - рассмотрите снижение веса");
    } else if (bmi >= 25) {
      riskScore += 6;
      recommendations.push("Избыточный вес увеличивает риск - поддерживайте здоровый вес");
    }
  }

  // Скрининг
  if (!data.previous_colonoscopy && data.age >= 45) {
    recommendations.push("Рекомендуется начать скрининг колоректального рака - обсудите с врачом");
  } else if (data.previous_colonoscopy && data.last_colonoscopy_date) {
    const lastScreening = new Date(data.last_colonoscopy_date);
    const yearsAgo = (new Date().getTime() - lastScreening.getTime()) / (1000 * 60 * 60 * 24 * 365);
    
    if (yearsAgo > 10) {
      recommendations.push("Прошло более 10 лет с последней колоноскопии - рассмотрите повторное обследование");
    } else if (yearsAgo > 5 && (data.personal_history_polyps || data.family_history_crc)) {
      recommendations.push("При наличии факторов риска рекомендуется более частый скрининг");
    }
  }

  // Преобразование в процент (максимум около 100)
  const riskPercentage = Math.min(Math.max(riskScore, 0), 85);
  
  // Определение уровня риска
  let riskLevel: 'low' | 'moderate' | 'high' | 'very_high';
  if (riskPercentage < 15) {
    riskLevel = 'low';
  } else if (riskPercentage < 35) {
    riskLevel = 'moderate';
  } else if (riskPercentage < 60) {
    riskLevel = 'high';
  } else {
    riskLevel = 'very_high';
  }

  // Общие рекомендации
  if (recommendations.length === 0) {
    recommendations.push("Поддерживайте здоровый образ жизни для снижения риска");
  }
  
  recommendations.push("Регулярно консультируйтесь с врачом для мониторинга здоровья");
  
  if (riskLevel === 'high' || riskLevel === 'very_high') {
    recommendations.push("Высокий риск требует консультации с онкологом или гастроэнтерологом");
  }

  const explanation = `Оценка основана на анализе факторов риска колоректального рака, включая возраст, семейную историю, образ жизни и диетические привычки. Риск ${riskPercentage}% указывает на ${riskLevel === 'low' ? 'низкий' : riskLevel === 'moderate' ? 'умеренный' : riskLevel === 'high' ? 'высокий' : 'очень высокий'} уровень риска развития колоректального рака.`;

  return {
    risk_percentage: riskPercentage,
    risk_level: riskLevel,
    recommendations,
    explanation
  };
};
