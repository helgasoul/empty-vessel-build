
import CalculatorBase from '../../components/calculators/CalculatorBase'

export default function FAICalculator() {
  const fields = [
    {
      id: 'testosterone',
      label: 'Общий тестостерон',
      unit: 'нмоль/л',
      type: 'number' as const,
      required: true,
      min: 0.1,
      max: 50,
      placeholder: 'Например: 1.8'
    },
    {
      id: 'shbg',
      label: 'ГСПГ (SHBG)',
      unit: 'нмоль/л',
      type: 'number' as const,
      required: true,
      min: 5,
      max: 200,
      placeholder: 'Например: 45'
    }
  ]

  const calculate = (values: Record<string, number>) => {
    const { testosterone, shbg } = values
    const fai = (testosterone / shbg) * 100
    
    let interpretation: 'normal' | 'borderline' | 'abnormal' | 'critical'
    let message: string
    let recommendations: string[] = []

    if (fai <= 5.0) {
      interpretation = 'normal'
      message = 'Нормальный уровень свободных андрогенов. Андрогенный статус в пределах нормы.'
      recommendations = [
        'Поддерживать здоровый образ жизни',
        'Регулярный контроль гормонального фона'
      ]
    } else if (fai > 5.0 && fai <= 8.0) {
      interpretation = 'borderline'
      message = 'Пограничные значения. Возможна легкая гиперандрогения.'
      recommendations = [
        'Оценить клинические признаки гиперандрогении',
        'Исключить СПКЯ',
        'Контроль веса и инсулинорезистентности'
      ]
    } else {
      interpretation = 'abnormal'
      message = 'Повышенный уровень свободных андрогенов. Вероятна гиперандрогения.'
      recommendations = [
        'Консультация гинеколога-эндокринолога',
        'Дополнительные тесты: 17-ОНП, ДГЭА-С',
        'УЗИ органов малого таза',
        'Исключить опухоли яичников/надпочечников'
      ]
    }

    return {
      value: fai.toFixed(2),
      interpretation,
      message,
      recommendations,
      referenceRange: '< 5.0'
    }
  }

  return (
    <CalculatorBase
      id="fai"
      title="Индекс свободных андрогенов"
      description="Оценка андрогенного статуса у женщин"
      icon="💗"
      fields={fields}
      calculate={calculate}
      category="hormones"
      backgroundInfo="Free Androgen Index (FAI) рассчитывается как отношение общего тестостерона к ГСПГ, умноженное на 100. Этот показатель отражает биологически активную фракцию тестостерона и используется для диагностики гиперандрогении и СПКЯ."
    />
  )
}
