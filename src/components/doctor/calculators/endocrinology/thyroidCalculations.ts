
interface ThyroidData {
  tsh: string;
  ft4: string;
  ft3: string;
  rt3: string;
  totalTestosterone: string;
  shbg: string;
  age: string;
  phase: string;
}

export interface ThyroidResult {
  t4ToT3Ratio: number;
  freeAndroogenIndex: number;
  interpretation: string;
  recommendations: string[];
  riskLevel: 'low' | 'moderate' | 'high';
}

export const calculateThyroidFunction = (thyroidData: ThyroidData): ThyroidResult => {
  const tsh = parseFloat(thyroidData.tsh);
  const ft4 = parseFloat(thyroidData.ft4);
  const ft3 = parseFloat(thyroidData.ft3);
  const rt3 = parseFloat(thyroidData.rt3);
  const testosterone = parseFloat(thyroidData.totalTestosterone);
  const shbg = parseFloat(thyroidData.shbg);
  const age = parseInt(thyroidData.age);

  // Расчет конверсии T4 в T3
  const t4ToT3Ratio = ft3 / ft4;

  // Расчет индекса свободных андрогенов (FAI)
  const freeAndroogenIndex = (testosterone / shbg) * 100;

  // Интерпретация результатов
  let interpretation = '';
  let recommendations: string[] = [];
  let riskLevel: 'low' | 'moderate' | 'high' = 'low';

  if (tsh > 4.0) {
    interpretation = 'Повышенный ТТГ может указывать на гипотиреоз';
    recommendations.push('Рекомендуется консультация эндокринолога');
    recommendations.push('Контроль антител к ТПО');
    riskLevel = 'high';
  } else if (tsh < 0.4) {
    interpretation = 'Пониженный ТТГ может указывать на гипертиреоз';
    recommendations.push('Рекомендуется УЗИ щитовидной железы');
    recommendations.push('Исключить тиреотоксикоз');
    riskLevel = 'moderate';
  } else if (t4ToT3Ratio < 0.2) {
    interpretation = 'Снижена конверсия T4 в T3, возможна периферическая резистентность';
    recommendations.push('Оценить уровень селена и цинка');
    recommendations.push('Рассмотреть коррекцию питания');
    riskLevel = 'moderate';
  } else {
    interpretation = 'Функция щитовидной железы в пределах нормы';
    recommendations.push('Контроль через 6-12 месяцев');
    riskLevel = 'low';
  }

  if (freeAndroogenIndex > 5 && age < 40) {
    recommendations.push('Исключить синдром поликистозных яичников');
    recommendations.push('Оценить инсулинорезистентность');
    if (riskLevel === 'low') riskLevel = 'moderate';
  }

  return {
    t4ToT3Ratio,
    freeAndroogenIndex,
    interpretation,
    recommendations,
    riskLevel
  };
};
