
import CalculatorBase from '../../components/calculators/CalculatorBase'

export default function TSHFT4Calculator() {
  const fields = [
    {
      id: 'tsh',
      label: 'ТТГ (TSH)',
      unit: 'мЕд/л',
      type: 'number' as const,
      required: true,
      min: 0.01,
      max: 100,
      placeholder: 'Например: 2.5'
    },
    {
      id: 'ft4',
      label: 'Свободный T4 (FT4)',
      unit: 'пмоль/л',
      type: 'number' as const,
      required: true,
      min: 1,
      max: 50,
      placeholder: 'Например: 16.5'
    }
  ]

  const calculate = (values: Record<string, number>) => {
    const { tsh, ft4 } = values
    const ratio = tsh / ft4
    
    let interpretation: 'normal' | 'borderline' | 'abnormal' | 'critical'
    let message: string
    let recommendations: string[] = []

    if (ratio <= 0.15) {
      interpretation = 'abnormal'
      message = 'Низкое соотношение ТТГ/FT4. Возможна центральная резистентность к тиреоидным гормонам или гипертиреоз.'
      recommendations = [
        'Исключить тиреотоксикоз',
        'Оценить функцию гипофиза',
        'Проверить антитела к рецепторам ТТГ'
      ]
    } else if (ratio > 0.15 && ratio <= 0.4) {
      interpretation = 'normal'
      message = 'Нормальное соотношение ТТГ/FT4. Центральная регуляция щитовидной железы адекватна.'
      recommendations = [
        'Продолжить мониторинг',
        'Поддерживать здоровый образ жизни'
      ]
    } else {
      interpretation = 'abnormal'
      message = 'Повышенное соотношение ТТГ/FT4. Возможна периферическая резистентность или начальный гипотиреоз.'
      recommendations = [
        'Проверить антитела к ТПО и ТГ',
        'Оценить клинические симптомы',
        'Рассмотреть заместительную терапию'
      ]
    }

    return {
      value: ratio.toFixed(3),
      interpretation,
      message,
      recommendations,
      referenceRange: '0.15 - 0.40'
    }
  }

  return (
    <CalculatorBase
      id="tsh-ft4-ratio"
      title="ТТГ/FT4 Соотношение"
      description="Оценка центральной регуляции щитовидной железы"
      icon="🦋"
      fields={fields}
      calculate={calculate}
      category="thyroid"
      backgroundInfo="Соотношение ТТГ к FT4 помогает оценить чувствительность гипоталамо-гипофизарно-тиреоидной системы. Изменения могут указывать на различные формы резистентности к тиреоидным гормонам."
    />
  )
}
