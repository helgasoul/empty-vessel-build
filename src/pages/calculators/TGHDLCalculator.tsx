
import CalculatorBase from '../../components/calculators/CalculatorBase'

export default function TGHDLCalculator() {
  const fields = [
    {
      id: 'triglycerides',
      label: 'Триглицериды (ТГ)',
      unit: 'ммоль/л',
      type: 'number' as const,
      required: true,
      min: 0.1,
      max: 50,
      placeholder: 'Например: 1.8'
    },
    {
      id: 'hdl',
      label: 'ЛПВП (HDL)',
      unit: 'ммоль/л',
      type: 'number' as const,
      required: true,
      min: 0.1,
      max: 10,
      placeholder: 'Например: 1.2'
    }
  ]

  const calculate = (values: Record<string, number>) => {
    const { triglycerides, hdl } = values
    const ratio = triglycerides / hdl
    
    let interpretation: 'normal' | 'borderline' | 'abnormal' | 'critical'
    let message: string
    let recommendations: string[] = []

    if (ratio <= 2.0) {
      interpretation = 'normal'
      message = 'Нормальное соотношение ТГ/ЛПВП. Низкий метаболический риск.'
      recommendations = [
        'Поддерживать здоровый образ жизни',
        'Регулярная физическая активность',
        'Сбалансированное питание'
      ]
    } else if (ratio > 2.0 && ratio <= 3.0) {
      interpretation = 'borderline'
      message = 'Пограничные значения. Умеренный метаболический риск.'
      recommendations = [
        'Коррекция диеты - снижение простых углеводов',
        'Увеличение физической активности',
        'Контроль веса',
        'Повторный анализ через 3 месяца'
      ]
    } else {
      interpretation = 'abnormal'
      message = 'Повышенное соотношение ТГ/ЛПВП. Высокий метаболический риск, возможна инсулинорезистентность.'
      recommendations = [
        'Обследование на диабет (HbA1c, ОГТТ)',
        'Расчет HOMA-IR',
        'Консультация эндокринолога',
        'Кардиологическая оценка риска'
      ]
    }

    return {
      value: ratio.toFixed(2),
      interpretation,
      message,
      recommendations,
      referenceRange: '< 2.0'
    }
  }

  return (
    <CalculatorBase
      id="tg-hdl-ratio"
      title="ТГ/ЛПВП Соотношение"
      description="Оценка метаболического риска"
      icon="🌸"
      fields={fields}
      calculate={calculate}
      category="metabolic"
      backgroundInfo="Соотношение триглицеридов к ЛПВП - важный маркер метаболического синдрома и инсулинорезистентности. Повышенные значения связаны с увеличенным риском сердечно-сосудистых заболеваний и диабета 2 типа."
    />
  )
}
