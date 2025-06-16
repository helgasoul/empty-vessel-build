
// Утилита для расчета индекса массы тела
export const calculateBMI = (weight: number, height: number): number => {
  if (!weight || !height || height <= 0 || weight <= 0) {
    return 0;
  }
  
  // Рост в метрах (если передан в сантиметрах)
  const heightInMeters = height > 10 ? height / 100 : height;
  const bmi = weight / (heightInMeters * heightInMeters);
  
  return Math.round(bmi * 10) / 10; // Округляем до 1 знака после запятой
};

export const getBMICategory = (bmi: number): string => {
  if (bmi === 0) return '';
  if (bmi < 18.5) return 'недостаточный вес';
  if (bmi < 25) return 'нормальный вес';
  if (bmi < 30) return 'избыточный вес';
  return 'ожирение';
};

export const getBMICategoryColor = (bmi: number): string => {
  if (bmi === 0) return 'text-gray-500';
  if (bmi < 18.5) return 'text-blue-600';
  if (bmi < 25) return 'text-green-600';
  if (bmi < 30) return 'text-yellow-600';
  return 'text-red-600';
};
