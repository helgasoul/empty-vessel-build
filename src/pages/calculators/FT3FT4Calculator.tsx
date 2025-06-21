
import CalculatorBase from '../../components/calculators/CalculatorBase'

export default function FT3FT4Calculator() {
  const fields = [
    {
      id: 'ft3',
      label: 'Свободный T3 (FT3)',
      unit: 'пмоль/л',
      type: 'number' as const,
      required: true,
      min: 0.1,
      max: 50,
      placeholder: 'Например: 5.2'
    },
    {
      id: 'ft4',
      label: 'Свободный T4 (FT4)',
      unit: 'пмоль/л',
      type: 'number' as const,
      required: true,
      min: 0.1,
      max: 100,
      placeholder: 'Например: 16.5'
    }
  ]

  const calculate = (values: Record<string, number>) => {
    const { ft3, ft4 } = values
    const ratio = ft3 / ft4
    
    let interpretation: 'normal' | 'borderline' | 'abnormal' | 'critical'
    let message: string
    let recommendations: string[] = []

    if (ratio < 0.2) {
      interpretation = 'abnormal'
      message = 'Низкая конверсия T4 в T3. Возможные проблемы с периферической конверсией тиреоидных гормонов.'
      recommendations = [
        'Рассмотреть дополнительные тесты: rT3, селен, цинк',
        'Оценить функцию печени и почек',
        'Проверить уровень стресса и воспаления'
      ]
    } else if (ratio >= 0.2 && ratio <= 0.4) {
      interpretation = 'normal'
      message = 'Нормальная конверсия T4 в T3. Периферическая функция щитовидной железы в пределах нормы.'
      recommendations = [
        'Поддерживать здоровый образ жизни',
        'Регулярно контролировать функцию щитовидной железы'
      ]
    } else {
      interpretation = 'abnormal'
      message = 'Повышенное соотношение FT3/FT4. Возможен гипертиреоз или избыточная конверсия.'
      recommendations = [
        'Исключить тиреотоксикоз',
        'Проверить антитела к рецепторам ТТГ',
        'Рассмотреть сцинтиграфию щитовидной железы'
      ]
    }

    return {
      value: ratio.toFixed(3),
      interpretation,
      message,
      recommendations,
      referenceRange: '0.20 - 0.40'
    }
  }

  return (
    <CalculatorBase
      id="ft3-ft4-ratio"
      title="FT3/FT4 Соотношение"
      description="Оценка периферической конверсии тиреоидных гормонов"
      icon="🦋"
      fields={fields}
      calculate={calculate}
      category="thyroid"
      backgroundInfo="Соотношение FT3/FT4 помогает оценить эффективность конверсии неактивного T4 в активный T3 на периферии. Нормальные значения указывают на адекватную работу дейодиназ - ферментов, ответственных за конверсию тиреоидных гормонов."
    />
  )
}
