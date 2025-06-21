
import CalculatorBase from '../../components/calculators/CalculatorBase'

export default function NLRCalculator() {
  const fields = [
    {
      id: 'neutrophils',
      label: 'Нейтрофилы',
      unit: '×10⁹/л',
      type: 'number' as const,
      required: true,
      min: 0.1,
      max: 50,
      placeholder: 'Например: 3.8'
    },
    {
      id: 'lymphocytes',
      label: 'Лимфоциты',
      unit: '×10⁹/л',
      type: 'number' as const,
      required: true,
      min: 0.1,
      max: 20,
      placeholder: 'Например: 1.9'
    }
  ]

  const calculate = (values: Record<string, number>) => {
    const { neutrophils, lymphocytes } = values
    const nlr = neutrophils / lymphocytes
    
    let interpretation: 'normal' | 'borderline' | 'abnormal' | 'critical'
    let message: string
    let recommendations: string[] = []

    if (nlr <= 3.0) {
      interpretation = 'normal'
      message = 'Нормальное соотношение нейтрофилов к лимфоцитам. Признаков системного воспаления нет.'
      recommendations = [
        'Поддерживать здоровый образ жизни',
        'Регулярная профилактика инфекций'
      ]
    } else if (nlr > 3.0 && nlr <= 5.0) {
      interpretation = 'borderline'
      message = 'Пограничные значения. Возможно наличие субклинического воспаления.'
      recommendations = [
        'Оценить наличие инфекционных заболеваний',
        'Исключить хронические воспалительные процессы',
        'Контроль через 2-4 недели'
      ]
    } else {
      interpretation = 'abnormal'
      message = 'Повышенное NLR. Признаки системного воспалительного ответа или стресса.'
      recommendations = [
        'Поиск источника воспаления или инфекции',
        'Дополнительные маркеры: СРБ, СОЭ, прокальцитонин',
        'Консультация специалиста при необходимости'
      ]
    }

    return {
      value: nlr.toFixed(2),
      interpretation,
      message,
      recommendations,
      referenceRange: '< 3.0'
    }
  }

  return (
    <CalculatorBase
      id="nlr"
      title="NLR (Neutrophil-to-Lymphocyte Ratio)"
      description="Маркер системного воспаления"
      icon="🧠"
      fields={fields}
      calculate={calculate}
      category="inflammation"
      backgroundInfo="Соотношение нейтрофилов к лимфоцитам (NLR) - простой и доступный маркер системного воспаления. Повышенные значения могут указывать на инфекционные заболевания, стресс, злокачественные новообразования или другие воспалительные состояния."
    />
  )
}
