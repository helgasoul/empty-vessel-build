
import { Calculator } from '../types/risk-calculator.types';

export const calculatorsConfig: Calculator[] = [
  {
    id: 'gail',
    name: 'Gail Model',
    description: {
      patient: 'Оценка риска рака молочной железы на основе личных факторов',
      doctor: 'Валидированная модель для оценки 5-летнего риска рака молочной железы',
      specialist: 'Модель Gail с учетом семейного анамнеза и биопсий'
    },
    icon: 'heart',
    color: {
      primary: '#EC4899',
      bg: '#FED7E2',
      text: '#BE185D'
    },
    category: 'oncology',
    timeframe: '5 лет',
    estimatedTime: '5-7 минут',
    evidenceLevel: 'high',
    complexity: 'moderate',
    requiredData: {
      basic: ['возраст', 'возраст первой менструации'],
      standard: ['возраст первых родов', 'количество биопсий'],
      advanced: ['атипичная гиперплазия', 'семейный анамнез', 'этническая принадлежность']
    },
    guidelines: ['NCCN', 'ASCO', 'ACS']
  },
  {
    id: 'prevent',
    name: 'PREVENT Calculator',
    description: {
      patient: 'Оценка риска сердечно-сосудистых заболеваний в течение 10 лет',
      doctor: 'Новейший калькулятор ACC/AHA для первичной профилактики',
      specialist: 'PREVENT с учетом социальных детерминант здоровья'
    },
    icon: 'heart',
    color: {
      primary: '#EF4444',
      bg: '#FEE2E2',
      text: '#DC2626'
    },
    category: 'cardiovascular',
    timeframe: '10 лет',
    estimatedTime: '8-10 минут',
    evidenceLevel: 'high',
    complexity: 'complex',
    requiredData: {
      basic: ['возраст', 'пол', 'артериальное давление'],
      standard: ['холестерин', 'диабет', 'курение'],
      advanced: ['почечная функция', 'социальный статус', 'ZIP код']
    },
    guidelines: ['ACC/AHA 2023', 'ESC 2021']
  },
  {
    id: 'frax',
    name: 'FRAX Calculator',
    description: {
      patient: 'Оценка риска переломов костей в ближайшие 10 лет',
      doctor: 'Международный инструмент оценки остеопоротических переломов',
      specialist: 'FRAX с учетом плотности костной ткани и корректировкой'
    },
    icon: 'bone',
    color: {
      primary: '#F97316',
      bg: '#FED7AA',
      text: '#EA580C'
    },
    category: 'bone',
    timeframe: '10 лет',
    estimatedTime: '6-8 минут',
    evidenceLevel: 'high',
    complexity: 'moderate',
    requiredData: {
      basic: ['возраст', 'пол', 'вес', 'рост'],
      standard: ['переломы в анамнезе', 'семейный анамнез'],
      advanced: ['плотность костной ткани', 'глюкокортикоиды']
    },
    guidelines: ['IOF', 'ISCD', 'NOGG']
  },
  {
    id: 'framingham',
    name: 'Framingham Dementia',
    description: {
      patient: 'Оценка риска развития деменции и болезни Альцгеймера',
      doctor: 'Фрамингемская модель риска деменции',
      specialist: 'Расширенная модель с генетическими и биомаркерами'
    },
    icon: 'brain',
    color: {
      primary: '#8B5CF6',
      bg: '#E9D5FF',
      text: '#7C3AED'
    },
    category: 'neurological',
    timeframe: '10 лет',
    estimatedTime: '10-12 минут',
    evidenceLevel: 'moderate',
    complexity: 'complex',
    requiredData: {
      basic: ['возраст', 'образование', 'когнитивные тесты'],
      standard: ['сосудистые факторы', 'депрессия'],
      advanced: ['APOE генотип', 'биомаркеры', 'нейровизуализация']
    },
    guidelines: ['Alzheimer\'s Association', 'NIA-AA']
  },
  {
    id: 'crat',
    name: 'Colorectal Cancer Risk',
    description: {
      patient: 'Оценка риска колоректального рака на основе образа жизни',
      doctor: 'Валидированный инструмент для скрининга колоректального рака',
      specialist: 'CRAT с молекулярными маркерами и семейным анамнезом'
    },
    icon: 'shield',
    color: {
      primary: '#3B82F6',
      bg: '#DBEAFE',
      text: '#1D4ED8'
    },
    category: 'oncology',
    timeframe: '10 лет',
    estimatedTime: '7-9 минут',
    evidenceLevel: 'high',
    complexity: 'moderate',
    requiredData: {
      basic: ['возраст', 'пол', 'семейный анамнез'],
      standard: ['курение', 'ИМТ', 'физическая активность'],
      advanced: ['полипы в анамнезе', 'ВЗК', 'генетические синдромы']
    },
    guidelines: ['USPSTF', 'ACS', 'NCCN']
  }
];
