
import { useState, useEffect } from 'react'
import { Calculator, CheckCircle, AlertCircle, Loader } from 'lucide-react'

interface AutoCalculatorProps {
  labResults: Record<string, { value: number; unit: string }>
  onCalculationsComplete: (results: any[]) => void
}

export const AutoCalculator = ({ labResults, onCalculationsComplete }: AutoCalculatorProps) => {
  const [isCalculating, setIsCalculating] = useState(false)
  const [availableCalculations, setAvailableCalculations] = useState<string[]>([])

  const calculatorFunctions = {
    'ft3_ft4_ratio': (data: any) => {
      if (data.FT3 && data.FT4) {
        const ratio = data.FT3.value / data.FT4.value
        let interpretation: 'normal' | 'borderline' | 'abnormal' = 'normal'
        let message = 'Нормальная конверсия T4 в T3'
        
        if (ratio < 0.2) {
          interpretation = 'abnormal'
          message = 'Низкая конверсия T4 в T3'
        } else if (ratio > 0.4) {
          interpretation = 'abnormal'
          message = 'Повышенное соотношение FT3/FT4'
        }
        
        return {
          id: Date.now().toString() + '_ft3_ft4',
          name: 'FT3/FT4 Ratio',
          value: ratio.toFixed(3),
          interpretation,
          message,
          date: new Date().toISOString()
        }
      }
      return null
    },
    
    'homa_ir': (data: any) => {
      if (data.Glucose && data.Insulin) {
        const homaIR = (data.Glucose.value * data.Insulin.value) / 22.5
        let interpretation: 'normal' | 'borderline' | 'abnormal' = 'normal'
        let message = 'Нормальная чувствительность к инсулину'
        
        if (homaIR > 2.7 && homaIR <= 4.0) {
          interpretation = 'borderline'
          message = 'Пограничные значения инсулинорезистентности'
        } else if (homaIR > 4.0) {
          interpretation = 'abnormal'
          message = 'Выраженная инсулинорезистентность'
        }
        
        return {
          id: Date.now().toString() + '_homa_ir',
          name: 'HOMA-IR',
          value: homaIR.toFixed(2),
          interpretation,
          message,
          date: new Date().toISOString()
        }
      }
      return null
    },
    
    'fai': (data: any) => {
      if (data.Testosterone && data.SHBG) {
        const fai = (data.Testosterone.value / data.SHBG.value) * 100
        let interpretation: 'normal' | 'borderline' | 'abnormal' = 'normal'
        let message = 'Нормальный уровень свободных андрогенов'
        
        if (fai > 5.0 && fai <= 8.0) {
          interpretation = 'borderline'
          message = 'Пограничные значения свободных андрогенов'
        } else if (fai > 8.0) {
          interpretation = 'abnormal'
          message = 'Повышенный уровень свободных андрогенов'
        }
        
        return {
          id: Date.now().toString() + '_fai',
          name: 'Free Androgen Index',
          value: fai.toFixed(2),
          interpretation,
          message,
          date: new Date().toISOString()
        }
      }
      return null
    },
    
    'tg_hdl_ratio': (data: any) => {
      if (data.Triglycerides && data.HDL) {
        const ratio = data.Triglycerides.value / data.HDL.value
        let interpretation: 'normal' | 'borderline' | 'abnormal' = 'normal'
        let message = 'Нормальное соотношение ТГ/ЛПВП'
        
        if (ratio > 2.0 && ratio <= 3.0) {
          interpretation = 'borderline'
          message = 'Пограничные значения метаболического риска'
        } else if (ratio > 3.0) {
          interpretation = 'abnormal'
          message = 'Повышенный метаболический риск'
        }
        
        return {
          id: Date.now().toString() + '_tg_hdl',
          name: 'TG/HDL Ratio',
          value: ratio.toFixed(2),
          interpretation,
          message,
          date: new Date().toISOString()
        }
      }
      return null
    }
  }

  useEffect(() => {
    const available = Object.keys(calculatorFunctions).filter(calcKey => {
      switch (calcKey) {
        case 'ft3_ft4_ratio':
          return labResults.FT3 && labResults.FT4
        case 'homa_ir':
          return labResults.Glucose && labResults.Insulin
        case 'fai':
          return labResults.Testosterone && labResults.SHBG
        case 'tg_hdl_ratio':
          return labResults.Triglycerides && labResults.HDL
        default:
          return false
      }
    })
    
    setAvailableCalculations(available)
  }, [labResults])

  const handleAutoCalculate = async () => {
    setIsCalculating(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const results = availableCalculations
        .map(calcKey => calculatorFunctions[calcKey as keyof typeof calculatorFunctions](labResults))
        .filter(result => result !== null)
      
      onCalculationsComplete(results)
    } catch (error) {
      console.error('Ошибка автоматического расчета:', error)
    } finally {
      setIsCalculating(false)
    }
  }

  if (availableCalculations.length === 0) {
    return (
      <div className="bg-gray-50 p-4 rounded-xl">
        <div className="flex items-center space-x-2 text-gray-600">
          <AlertCircle className="w-5 h-5" />
          <span>Недостаточно данных для автоматических расчетов</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-6 rounded-xl border border-rose-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-gray-800 flex items-center space-x-2">
            <Calculator className="w-5 h-5 text-rose-600" />
            <span>Автоматические расчеты</span>
          </h3>
          <p className="text-sm text-gray-600">
            Доступно {availableCalculations.length} калькуляторов для этих анализов
          </p>
        </div>
        
        <button
          onClick={handleAutoCalculate}
          disabled={isCalculating}
          className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
            isCalculating
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600'
          }`}
        >
          {isCalculating ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>Рассчитываем...</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              <span>Рассчитать все</span>
            </>
          )}
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {availableCalculations.map(calcKey => (
          <div key={calcKey} className="bg-white/80 p-3 rounded-lg">
            <div className="text-sm font-medium text-gray-700">
              {calcKey === 'ft3_ft4_ratio' ? 'FT3/FT4' :
               calcKey === 'homa_ir' ? 'HOMA-IR' :
               calcKey === 'fai' ? 'FAI' :
               calcKey === 'tg_hdl_ratio' ? 'TG/HDL' : calcKey}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {isCalculating ? '⏳ Расчет...' : '✅ Готов'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
