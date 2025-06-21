
export interface CalculatorTab {
  id: string;
  label: string;
  icon: string;
  description: string;
  component: string;
}

export const calculatorTabs: CalculatorTab[] = [
  {
    id: 'thyroid',
    label: '🦋 Тиреоидные индексы',
    icon: 'Activity',
    description: 'Калькуляторы для оценки функции щитовидной железы',
    component: 'ThyroidCalculators'
  },
  {
    id: 'hormonal-metabolic',
    label: '🌸 Гормоны и метаболизм',
    icon: 'Heart',
    description: 'Оценка инсулинорезистентности и гормонального баланса',
    component: 'HormonalMetabolicCalculators'
  },
  {
    id: 'endocrinology',
    label: '💊 Эндокринология',
    icon: 'Pill',
    description: 'Эндокринологические расчеты и интерпретации',
    component: 'EndocrinologyCalculators'
  },
  {
    id: 'metabolic',
    label: '⚡ Метаболизм',
    icon: 'Zap',
    description: 'Метаболические индексы и расчеты',
    component: 'MetabolicCalculators'
  },
  {
    id: 'gynecology',
    label: '🌺 Гинекология',
    icon: 'Heart',
    description: 'Гинекологические калькуляторы и оценки',
    component: 'GynecologyCalculators'
  },
  {
    id: 'cardiovascular',
    label: '❤️ Кардиология',
    icon: 'Heart',
    description: 'Сердечно-сосудистые риски и расчеты',
    component: 'CardiovascularCalculators'
  },
  {
    id: 'psychological',
    label: '🧠 Психометрия',
    icon: 'Brain',
    description: 'Психологические шкалы и оценки',
    component: 'PsychologicalScales'
  }
];
