
import { useState } from 'react'
import { ArrowLeft, Info, Save, Share } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface CalculatorField {
  id: string
  label: string
  unit: string
  type: 'number' | 'select'
  required: boolean
  min?: number
  max?: number
  options?: { value: string; label: string }[]
  placeholder?: string
}

interface CalculatorResult {
  value: number | string
  interpretation: 'normal' | 'borderline' | 'abnormal' | 'critical'
  message: string
  recommendations?: string[]
  referenceRange: string
}

interface CalculatorProps {
  id: string
  title: string
  description: string
  icon: string
  fields: CalculatorField[]
  calculate: (values: Record<string, number>) => CalculatorResult
  category: string
  backgroundInfo?: string
}

export default function CalculatorBase({ 
  title, 
  description, 
  icon, 
  fields, 
  calculate, 
  backgroundInfo 
}: CalculatorProps) {
  const navigate = useNavigate()
  const [values, setValues] = useState<Record<string, number>>({})
  const [result, setResult] = useState<CalculatorResult | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showInfo, setShowInfo] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)

  const handleInputChange = (fieldId: string, value: string) => {
    const numValue = parseFloat(value)
    setValues(prev => ({ ...prev, [fieldId]: numValue }))
    
    // Очистить ошибку при вводе
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: '' }))
    }
  }

  const validateFields = () => {
    const newErrors: Record<string, string> = {}
    
    fields.forEach(field => {
      const value = values[field.id]
      
      if (field.required && (!value || isNaN(value))) {
        newErrors[field.id] = 'Это поле обязательно для заполнения'
      } else if (value && field.min !== undefined && value < field.min) {
        newErrors[field.id] = `Значение должно быть не менее ${field.min}`
      } else if (value && field.max !== undefined && value > field.max) {
        newErrors[field.id] = `Значение должно быть не более ${field.max}`
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCalculate = async () => {
    if (validateFields()) {
      setIsCalculating(true)
      try {
        // Имитация задержки для UX
        await new Promise(resolve => setTimeout(resolve, 1000))
        const calculationResult = calculate(values)
        setResult(calculationResult)
      } catch (error) {
        console.error('Ошибка расчета:', error)
      } finally {
        setIsCalculating(false)
      }
    }
  }

  const canCalculate = fields.every(field => 
    !field.required || (values[field.id] && !isNaN(values[field.id]))
  )

  const getResultColor = (interpretation: string) => {
    switch (interpretation) {
      case 'normal': return 'bg-green-100 border-green-200 text-green-800'
      case 'borderline': return 'bg-yellow-100 border-yellow-200 text-yellow-800'
      case 'abnormal': return 'bg-orange-100 border-orange-200 text-orange-800'
      case 'critical': return 'bg-red-100 border-red-200 text-red-800'
      default: return 'bg-gray-100 border-gray-200 text-gray-800'
    }
  }

  const getResultIcon = (interpretation: string) => {
    switch (interpretation) {
      case 'normal': return '✅'
      case 'borderline': return '⚠️'
      case 'abnormal': return '🔶'
      case 'critical': return '🚨'
      default: return 'ℹ️'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-rose-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/doctor/calculators')}
                className="flex items-center space-x-2 text-rose-600 hover:text-rose-700 font-medium"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Назад к калькуляторам</span>
              </button>
            </div>
            
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="flex items-center space-x-2 px-4 py-2 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-lg transition-colors"
            >
              <Info className="w-4 h-4" />
              <span>Справка</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Title Section */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{icon}</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{title}</h1>
          <p className="text-gray-600 text-lg">{description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-rose-100 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Введите данные для расчета
              </h2>
              
              <div className="space-y-6">
                {fields.map((field) => (
                  <div key={field.id}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    
                    {field.type === 'number' ? (
                      <div className="relative">
                        <input
                          type="number"
                          step="0.01"
                          min={field.min}
                          max={field.max}
                          placeholder={field.placeholder || `Введите ${field.label.toLowerCase()}`}
                          value={values[field.id] || ''}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors ${
                            errors[field.id] ? 'border-red-300 bg-red-50' : 'border-rose-200'
                          }`}
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                          {field.unit}
                        </span>
                      </div>
                    ) : (
                      <select
                        value={values[field.id] || ''}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors ${
                          errors[field.id] ? 'border-red-300 bg-red-50' : 'border-rose-200'
                        }`}
                      >
                        <option value="">Выберите значение</option>
                        {field.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    )}
                    
                    {errors[field.id] && (
                      <p className="text-red-600 text-sm mt-1">{errors[field.id]}</p>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={handleCalculate}
                disabled={!canCalculate || isCalculating}
                className={`w-full mt-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
                  canCalculate && !isCalculating
                    ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 shadow-lg hover:shadow-xl'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isCalculating ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-white rounded-full animate-spin"></div>
                    <span>Рассчитываем...</span>
                  </div>
                ) : canCalculate ? 'Рассчитать' : 'Заполните все обязательные поля'}
              </button>
            </div>
          </div>

          {/* Results & Info Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Result */}
            {result && (
              <div className={`rounded-2xl p-6 border-2 ${getResultColor(result.interpretation)}`}>
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{getResultIcon(result.interpretation)}</div>
                  <div className="text-2xl font-bold mb-2">{result.value}</div>
                  <div className="text-sm opacity-75">Референсные значения: {result.referenceRange}</div>
                </div>
                
                <div className="space-y-3">
                  <p className="font-medium">{result.message}</p>
                  
                  {result.recommendations && result.recommendations.length > 0 && (
                    <div>
                      <p className="font-medium mb-2">Рекомендации:</p>
                      <ul className="text-sm space-y-1">
                        {result.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span>•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2 mt-4">
                  <button className="flex-1 bg-white/50 hover:bg-white/80 text-current py-2 rounded-lg transition-colors flex items-center justify-center space-x-1">
                    <Save className="w-4 h-4" />
                    <span>Сохранить</span>
                  </button>
                  <button className="flex-1 bg-white/50 hover:bg-white/80 text-current py-2 rounded-lg transition-colors flex items-center justify-center space-x-1">
                    <Share className="w-4 h-4" />
                    <span>Поделиться</span>
                  </button>
                </div>
              </div>
            )}

            {/* Info Panel */}
            {showInfo && backgroundInfo && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-rose-100 shadow-lg">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center space-x-2">
                  <Info className="w-5 h-5 text-rose-600" />
                  <span>Справочная информация</span>
                </h3>
                <div className="text-sm text-gray-600 leading-relaxed">
                  {backgroundInfo}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
