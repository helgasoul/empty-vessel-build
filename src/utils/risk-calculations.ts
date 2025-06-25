
import { RiskResult } from '../types/risk-calculator.types';

export const calculateRisk = (
  calculatorId: string,
  inputData: Record<string, any>
): RiskResult => {
  // Mock calculation for demo purposes
  // In real implementation, this would contain actual algorithms
  
  const mockRisk = Math.random() * 0.3; // 0-30% risk
  
  const getCategory = (risk: number) => {
    if (risk < 0.05) return 'low';
    if (risk < 0.15) return 'moderate';
    if (risk < 0.25) return 'high';
    return 'very-high';
  };

  const category = getCategory(mockRisk);
  
  const explanations = {
    low: {
      patient: 'Ваш риск ниже среднего для вашей возрастной группы.',
      doctor: 'Риск в пределах низкого диапазона, рекомендуется стандартное наблюдение.',
      specialist: 'Низкий риск согласно современным алгоритмам стратификации.'
    },
    moderate: {
      patient: 'У вас умеренный риск. Рекомендуется обсудить с врачом план профилактики.',
      doctor: 'Умеренный риск, рассмотрите дополнительные профилактические меры.',
      specialist: 'Показана интенсификация профилактических мероприятий.'
    },
    high: {
      patient: 'Повышенный риск требует консультации специалиста.',
      doctor: 'Высокий риск, необходимо углубленное обследование.',
      specialist: 'Высокий риск, рекомендуется персонализированная стратегия.'
    },
    'very-high': {
      patient: 'Очень высокий риск. Необходима срочная консультация врача.',
      doctor: 'Очень высокий риск, требуется немедленное вмешательство.',
      specialist: 'Критически высокий риск, показана агрессивная профилактика.'
    }
  };

  return {
    value: mockRisk,
    category: category as 'low' | 'moderate' | 'high' | 'very-high',
    explanation: explanations[category],
    recommendations: [
      'Поддерживайте здоровый образ жизни',
      'Регулярно проходите скрининговые обследования',
      'Обсудите результаты с вашим врачом'
    ],
    populationComparison: {
      percentile: Math.round(mockRisk * 100),
      averageRisk: 0.12
    }
  };
};

export const formatRiskPercentage = (risk: number): string => {
  return `${(risk * 100).toFixed(1)}%`;
};

export const getRiskColor = (category: string): string => {
  const colors = {
    low: '#22C55E',
    moderate: '#F59E0B',
    high: '#EF4444',
    'very-high': '#DC2626'
  };
  return colors[category as keyof typeof colors] || '#6B7280';
};
