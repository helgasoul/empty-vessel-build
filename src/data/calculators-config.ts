
import { Calculator } from '../types/risk-calculator.types';

export const calculatorsConfig: Calculator[] = [
  {
    id: 'gail',
    name: 'Модель Gail',
    description: {
      patient: 'Оценка вашего персонального риска развития рака молочной железы',
      doctor: 'Валидированная модель оценки 5-летнего риска рака молочной железы',
      specialist: 'Статистическая модель NCI на основе данных BCDDP и SEER программ'
    },
    icon: 'Heart',
    color: {
      primary: '#EC4899',
      bg: '#FDF2F8', 
      text: '#BE185D'
    },
    category: 'oncology',
    timeframe: '5 лет / пожизненно',
    estimatedTime: '5-7 минут',
    evidenceLevel: 'high',
    complexity: 'moderate',
    requiredData: {
      basic: ['Возраст', 'Возраст первой менструации', 'Семейная история'],
      standard: ['Возраст первых родов', 'Количество биопсий', 'Раса/этничность'],
      advanced: ['Плотность молочной железы', 'Генетические мутации', 'Гормональная терапия']
    },
    guidelines: ['USPSTF 2019', 'NCCN 2023', 'ACS 2023']
  },
  
  {
    id: 'prevent',
    name: 'PREVENT Calculator',
    description: {
      patient: 'Определение риска сердечно-сосудистых заболеваний в ближайшие 10 лет',
      doctor: 'Современная модель оценки ССЗ с учетом социальных детерминант здоровья',
      specialist: 'AHA 2023 PREVENT модель с интеграцией почечной функции и СДЗ'
    },
    icon: 'Activity',
    color: {
      primary: '#EF4444',
      bg: '#FEF2F2',
      text: '#DC2626'
    },
    category: 'cardiovascular',
    timeframe: '10 лет',
    estimatedTime: '3-5 минут',
    evidenceLevel: 'high',
    complexity: 'moderate',
    requiredData: {
      basic: ['Возраст', 'Артериальное давление', 'Курение', 'Диабет'],
      standard: ['Общий холестерин', 'HDL холестерин', 'ИМТ', 'Физическая активность'],
      advanced: ['Функция почек (eGFR)', 'Социально-экономические факторы', 'Женские факторы риска']
    },
    guidelines: ['AHA/ACC 2023', 'ESC 2021', 'CCS 2022']
  },

  {
    id: 'frax',
    name: 'FRAX Calculator',
    description: {
      patient: 'Оценка риска переломов костей в ближайшие 10 лет',
      doctor: 'Инструмент ВОЗ для оценки 10-летнего риска остеопоротических переломов',
      specialist: 'Алгоритм FRAX с интеграцией DXA и трабекулярного костного индекса'
    },
    icon: 'Bone',
    color: {
      primary: '#F97316',
      bg: '#FFF7ED',
      text: '#EA580C'
    },
    category: 'bone',
    timeframe: '10 лет',
    estimatedTime: '2-3 минуты',
    evidenceLevel: 'high',
    complexity: 'simple',
    requiredData: {
      basic: ['Возраст', 'Вес', 'Рост', 'Переломы в анамнезе'],
      standard: ['Курение', 'Алкоголь', 'Ревматоидный артрит', 'Глюкокортикоиды'],
      advanced: ['T-score DXA', 'Трабекулярный костный индекс', 'Падения в анамнезе']
    },
    guidelines: ['WHO 2019', 'IOF 2020', 'ISCD 2019']
  },

  {
    id: 'framingham',
    name: 'Framingham Dementia',
    description: {
      patient: 'Оценка риска развития проблем с памятью и мышлением',
      doctor: 'Модель оценки риска деменции на основе Framingham Heart Study',
      specialist: 'Интегрированная модель с биомаркерами ЦСЖ и нейровизуализацией'
    },
    icon: 'Brain',
    color: {
      primary: '#8B5CF6',
      bg: '#FAF5FF',
      text: '#7C3AED'
    },
    category: 'neurological',
    timeframe: '10 лет',
    estimatedTime: '4-6 минут',
    evidenceLevel: 'moderate',
    complexity: 'moderate',
    requiredData: {
      basic: ['Возраст', 'Образование', 'Когнитивные тесты'],
      standard: ['APOE генотип', 'Сердечно-сосудистые факторы', 'Депрессия'],
      advanced: ['Биомаркеры ЦСЖ', 'МРТ головного мозга', 'ПЭТ-амилоид']
    },
    guidelines: ['AA/NIA 2018', 'EAN 2020', 'AAN 2018']
  },

  {
    id: 'crat',
    name: 'CRAT Calculator',
    description: {
      patient: 'Оценка риска развития рака кишечника',
      doctor: 'NCI инструмент оценки риска колоректального рака',
      specialist: 'Модель с интеграцией генетических и эпигенетических маркеров'
    },
    icon: 'Target',
    color: {
      primary: '#3B82F6',
      bg: '#EFF6FF',
      text: '#1D4ED8'
    },
    category: 'oncology',
    timeframe: '5 лет',
    estimatedTime: '3-4 минуты',
    evidenceLevel: 'high',
    complexity: 'simple',
    requiredData: {
      basic: ['Возраст', 'Семейная история', 'Полипы в анамнезе'],
      standard: ['Образ жизни', 'Диета', 'Скрининговые исследования'],
      advanced: ['Генетическое тестирование', 'Микросателлитная нестабильность', 'Воспалительные маркеры']
    },
    guidelines: ['USPSTF 2021', 'NCCN 2023', 'ACG 2021']
  }
];
