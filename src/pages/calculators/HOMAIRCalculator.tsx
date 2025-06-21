
import CalculatorBase from '../../components/calculators/CalculatorBase'

export default function HOMAIRCalculator() {
  const fields = [
    {
      id: 'glucose',
      label: 'Глюкоза натощак',
      unit: 'ммоль/л',
      type: 'number' as const,
      required: true,
      min: 2.0,
      max: 30.0,
      placeholder: 'Например: 5.2'
    },
    {
      id: 'insulin',
      label: 'Инсулин натощак',
      unit: 'мкЕд/мл',
      type: 'number' as const,
      required: true,
      min: 0.1,
      max: 200,
      placeholder: 'Например: 8.5'
    }
  ]

  const calculate = (values: Record<string, number>) => {
    const { glucose, insulin } = values
    const homaIR = (glucose * insulin) / 22.5
    
    let interpretation: 'normal' | 'borderline' | 'abnormal' | 'critical'
    let message: string
    let recommendations: string[] = []

    if (homaIR <= 2.7) {
      interpretation = 'normal'
      message = 'Нормальная чувствительность к инсулину. Риск инсулинорезистентности низкий.'
      recommendations = [
        'Поддерживать здоровый образ жизни',
        'Регулярная физическая активность',
        'Сбалансированное питание'
      ]
    } else if (homaIR > 2.7 && homaIR <= 4.0) {
      interpretation = 'borderline'
      message = 'Пограничные значения. Начальные признаки инсулинорезистентности.'
      recommendations = [
        'Увеличить физическую активность',
        'Снизить потребление простых углеводов',
        'Контроль веса',
        'Повторить анализ через 3 месяца'
      ]
    } else {
      interpretation = 'abnormal'
      message = 'Выраженная инсулинорезистентность. Повышенный риск развития диабета 2 типа.'
      recommendations = [
        'Консультация эндокринолога',
        'Дополнительные тесты: HbA1c, OGTT',
        'Коррекция образа жизни',
        'Рассмотреть медикаментозную терапию'
      ]
    }

    return {
      value: homaIR.toFixed(2),
      interpretation,
      message,
      recommendations,
      referenceRange: '< 2.7'
    }
  }

  return (
    <CalculatorBase
      id="homa-ir"
      title="HOMA-IR"
      description="Оценка инсулинорезистентности"
      icon="🌸"
      fields={fields}
      calculate={calculate}
      category="metabolic"
      backgroundInfo="HOMA-IR (Homeostatic Model Assessment for Insulin Resistance) - метод оценки инсулинорезистентности на основе концентраций глюкозы и инсулина натощак. Повышенные значения указывают на снижение чувствительности тканей к инсулину."
    />
  )
}
