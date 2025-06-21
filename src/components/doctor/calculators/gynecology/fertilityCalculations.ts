
import { addDays } from 'date-fns';

interface FertilityData {
  lastPeriodDate: string;
  cycleLength: string;
  amh: string;
  age: string;
  fsh: string;
  lh: string;
  antralFollicles: string;
}

export interface FertilityResult {
  ovulationDate: Date;
  fertilityWindow: {
    start: Date;
    end: Date;
  };
  conception_probability: number;
  amhInterpretation: string;
  fertilityStatus: 'high' | 'moderate' | 'low' | 'very_low';
}

export const calculateFertility = (gynData: FertilityData): FertilityResult => {
  const lastPeriod = new Date(gynData.lastPeriodDate);
  const cycleLength = parseInt(gynData.cycleLength);
  const amh = parseFloat(gynData.amh);
  const age = parseInt(gynData.age);
  const afc = parseInt(gynData.antralFollicles);

  // Расчет овуляции (примерно за 14 дней до следующей менструации)
  const ovulationDate = addDays(lastPeriod, cycleLength - 14);

  // Фертильное окно (5 дней до и 1 день после овуляции)
  const fertilityWindow = {
    start: addDays(ovulationDate, -5),
    end: addDays(ovulationDate, 1)
  };

  // Интерпретация AMH
  let amhInterpretation = '';
  let fertilityStatus: 'high' | 'moderate' | 'low' | 'very_low' = 'moderate';

  if (amh > 3.0) {
    amhInterpretation = 'Высокий овариальный резерв (возможен СПКЯ)';
    fertilityStatus = 'high';
  } else if (amh > 1.5) {
    amhInterpretation = 'Нормальный овариальный резерв';
    fertilityStatus = 'high';
  } else if (amh > 0.7) {
    amhInterpretation = 'Умеренно сниженный овариальный резерв';
    fertilityStatus = 'moderate';
  } else if (amh > 0.3) {
    amhInterpretation = 'Низкий овариальный резерв';
    fertilityStatus = 'low';
  } else {
    amhInterpretation = 'Очень низкий овариальный резерв';
    fertilityStatus = 'very_low';
  }

  // Расчет вероятности зачатия (упрощенная формула)
  let conception_probability = 25; // базовая вероятность в фертильное окно

  if (age > 35) {
    conception_probability *= 0.8;
  }
  if (age > 40) {
    conception_probability *= 0.6;
  }
  if (amh < 1.0) {
    conception_probability *= 0.7;
  }
  if (afc < 7) {
    conception_probability *= 0.8;
  }

  conception_probability = Math.min(conception_probability, 30);

  return {
    ovulationDate,
    fertilityWindow,
    conception_probability,
    amhInterpretation,
    fertilityStatus
  };
};
