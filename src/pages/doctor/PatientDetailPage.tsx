
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  Heart, 
  Activity, 
  FileText, 
  MessageCircle, 
  Download,
  Upload,
  Calculator,
  AlertTriangle,
  TrendingUp,
  Phone,
  Mail,
  Clock
} from 'lucide-react'
import { AutoCalculator } from '@/components/calculators/AutoCalculator'
import { TrendAnalysis } from '@/components/analytics/TrendAnalysis'
import { PatientChat } from '@/components/communication/PatientChat'

interface Patient {
  id: string
  name: string
  age: number
  dateOfBirth: string
  email: string
  phone: string
  address: string
  avatar: string
  registrationDate: string
  lastVisit: string
  riskLevel: 'low' | 'medium' | 'high'
  status: 'active' | 'inactive'
  medicalHistory: string[]
  allergies: string[]
  currentMedications: string[]
}

interface LabResult {
  id: string
  date: string
  type: string
  results: Record<string, { value: number; unit: string; reference: string }>
  status: 'new' | 'viewed' | 'analyzed'
}

interface CalculatorResult {
  id: string
  name: string
  value: string
  interpretation: 'normal' | 'borderline' | 'abnormal' | 'critical'
  message: string
  date: string
  trend?: 'up' | 'down' | 'stable'
}

export default function PatientDetailPage() {
  const { patientId } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [patient, setPatient] = useState<Patient | null>(null)
  const [labResults, setLabResults] = useState<LabResult[]>([])
  const [calculatorResults, setCalculatorResults] = useState<CalculatorResult[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Mock patient data loading
  useEffect(() => {
    setTimeout(() => {
      setPatient({
        id: patientId || '1',
        name: 'Анна Петрова',
        age: 38,
        dateOfBirth: '1987-03-15',
        email: 'anna.petrova@email.com',
        phone: '+7 (999) 123-45-67',
        address: 'Москва, ул. Тверская, 15-45',
        avatar: '👩‍💼',
        registrationDate: '2024-01-15',
        lastVisit: '2025-06-15',
        riskLevel: 'medium',
        status: 'active',
        medicalHistory: ['Гипотиреоз (2020)', 'СПКЯ (2019)'],
        allergies: ['Пенициллин', 'Орехи'],
        currentMedications: ['Левотироксин 75 мкг', 'Метформин 1000 мг']
      })

      setLabResults([
        {
          id: '1',
          date: '2025-06-15',
          type: 'Гормональный профиль',
          results: {
            'TSH': { value: 3.2, unit: 'мЕд/л', reference: '0.4-4.0' },
            'FT4': { value: 14.5, unit: 'пмоль/л', reference: '9-19' },
            'FT3': { value: 4.8, unit: 'пмоль/л', reference: '2.3-6.3' },
            'Testosterone': { value: 2.1, unit: 'нмоль/л', reference: '0.5-2.6' },
            'SHBG': { value: 35, unit: 'нмоль/л', reference: '18-144' }
          },
          status: 'new'
        },
        {
          id: '2',
          date: '2025-06-10',
          type: 'Биохимический анализ',
          results: {
            'Glucose': { value: 5.4, unit: 'ммоль/л', reference: '3.9-6.1' },
            'Insulin': { value: 12.3, unit: 'мкЕд/мл', reference: '2.6-24.9' },
            'HbA1c': { value: 5.6, unit: '%', reference: '<5.7' },
            'Triglycerides': { value: 1.8, unit: 'ммоль/л', reference: '<1.7' },
            'HDL': { value: 1.2, unit: 'ммоль/л', reference: '>1.2' }
          },
          status: 'viewed'
        }
      ])

      setCalculatorResults([
        {
          id: '1',
          name: 'FT3/FT4 Ratio',
          value: '0.331',
          interpretation: 'normal',
          message: 'Нормальная конверсия T4 в T3',
          date: '2025-06-15',
          trend: 'stable'
        },
        {
          id: '2',
          name: 'HOMA-IR',
          value: '2.9',
          interpretation: 'borderline',
          message: 'Пограничные значения инсулинорезистентности',
          date: '2025-06-10',
          trend: 'up'
        },
        {
          id: '3',
          name: 'Free Androgen Index',
          value: '6.0',
          interpretation: 'abnormal',
          message: 'Повышенный уровень свободных андрогенов',
          date: '2025-06-15',
          trend: 'down'
        }
      ])

      setIsLoading(false)
    }, 1000)
  }, [patientId])

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getResultColor = (interpretation: string) => {
    switch (interpretation) {
      case 'normal': return 'bg-green-100 border-green-200 text-green-800'
      case 'borderline': return 'bg-yellow-100 border-yellow-200 text-yellow-800'
      case 'abnormal': return 'bg-orange-100 border-orange-200 text-orange-800'
      case 'critical': return 'bg-red-100 border-red-200 text-red-800'
      default: return 'bg-gray-100 border-gray-200 text-gray-800'
    }
  }

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up': return '📈'
      case 'down': return '📉'
      case 'stable': return '➡️'
      default: return '➡️'
    }
  }

  const handleCalculationsComplete = (results: CalculatorResult[]) => {
    setCalculatorResults(prev => [...prev, ...results])
  }

  const tabs = [
    { id: 'overview', name: 'Обзор', icon: User },
    { id: 'lab-results', name: 'Анализы', icon: FileText },
    { id: 'calculators', name: 'Калькуляторы', icon: Calculator },
    { id: 'history', name: 'История', icon: Clock },
    { id: 'communication', name: 'Общение', icon: MessageCircle }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-rose-600 font-medium">Загрузка данных пациента...</p>
        </div>
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😟</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Пациент не найден</h2>
          <button
            onClick={() => navigate('/doctor/patients')}
            className="bg-rose-500 text-white px-6 py-3 rounded-lg hover:bg-rose-600 transition-colors"
          >
            Вернуться к списку
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-rose-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/doctor/patients')}
                className="flex items-center space-x-2 text-rose-600 hover:text-rose-700 font-medium"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>К списку пациентов</span>
              </button>
              <div className="h-6 w-px bg-rose-200"></div>
              <div className="flex items-center space-x-3">
                <div className="text-4xl">{patient.avatar}</div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{patient.name}</h1>
                  <p className="text-gray-600">{patient.age} лет • ID: {patient.id}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(patient.riskLevel)}`}>
                {patient.riskLevel === 'low' ? 'Низкий риск' : 
                 patient.riskLevel === 'medium' ? 'Средний риск' : 'Высокий риск'}
              </span>
              <button className="p-2 bg-rose-100 hover:bg-rose-200 rounded-lg transition-colors">
                <Phone className="w-5 h-5 text-rose-600" />
              </button>
              <button className="p-2 bg-rose-100 hover:bg-rose-200 rounded-lg transition-colors">
                <Mail className="w-5 h-5 text-rose-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex space-x-1 bg-white/50 rounded-2xl p-1 backdrop-blur-sm border border-rose-100">
          {tabs.map((tab) => {
            const IconComponent = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-200 flex-1 justify-center ${
                  activeTab === tab.id
                    ? 'bg-white shadow-lg text-rose-600 font-medium'
                    : 'text-gray-600 hover:text-rose-600'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 pb-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Patient Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-rose-100 shadow-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                  <User className="w-6 h-6 text-rose-600" />
                  <span>Основная информация</span>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Дата рождения</label>
                      <p className="text-gray-800">{new Date(patient.dateOfBirth).toLocaleDateString('ru-RU')}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-gray-800">{patient.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Телефон</label>
                      <p className="text-gray-800">{patient.phone}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Адрес</label>
                      <p className="text-gray-800">{patient.address}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Дата регистрации</label>
                      <p className="text-gray-800">{new Date(patient.registrationDate).toLocaleDateString('ru-RU')}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Последний визит</label>
                      <p className="text-gray-800">{new Date(patient.lastVisit).toLocaleDateString('ru-RU')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Medical History */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-rose-100 shadow-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                  <Heart className="w-6 h-6 text-rose-600" />
                  <span>Медицинская история</span>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-700 mb-3">Анамнез</h3>
                    <div className="space-y-2">
                      {patient.medicalHistory.map((item, index) => (
                        <div key={index} className="bg-rose-50 px-3 py-2 rounded-lg text-sm">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-700 mb-3">Аллергии</h3>
                    <div className="space-y-2">
                      {patient.allergies.map((item, index) => (
                        <div key={index} className="bg-yellow-50 px-3 py-2 rounded-lg text-sm flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-600" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-700 mb-3">Текущие препараты</h3>
                    <div className="space-y-2">
                      {patient.currentMedications.map((item, index) => (
                        <div key={index} className="bg-blue-50 px-3 py-2 rounded-lg text-sm">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions & Latest Results */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-rose-100 shadow-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Быстрые действия</h2>
                
                <div className="space-y-3">
                  <button 
                    onClick={() => setActiveTab('communication')}
                    className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 rounded-xl hover:from-rose-600 hover:to-pink-600 transition-all duration-200 font-medium flex items-center justify-center space-x-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Написать сообщение</span>
                  </button>
                  
                  <button className="w-full bg-white border-2 border-rose-200 text-rose-600 py-3 rounded-xl hover:bg-rose-50 transition-all duration-200 font-medium flex items-center justify-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>Запланировать встречу</span>
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab('lab-results')}
                    className="w-full bg-white border-2 border-rose-200 text-rose-600 py-3 rounded-xl hover:bg-rose-50 transition-all duration-200 font-medium flex items-center justify-center space-x-2"
                  >
                    <Upload className="w-5 h-5" />
                    <span>Загрузить документы</span>
                  </button>
                  
                  <button className="w-full bg-white border-2 border-rose-200 text-rose-600 py-3 rounded-xl hover:bg-rose-50 transition-all duration-200 font-medium flex items-center justify-center space-x-2">
                    <Download className="w-5 h-5" />
                    <span>Экспорт данных</span>
                  </button>
                </div>
              </div>

              {/* Latest Calculator Results */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-rose-100 shadow-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                  <Calculator className="w-6 h-6 text-rose-600" />
                  <span>Последние расчеты</span>
                </h2>
                
                <div className="space-y-4">
                  {calculatorResults.slice(0, 3).map((result) => (
                    <div key={result.id} className={`p-4 rounded-xl border-2 ${getResultColor(result.interpretation)}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{result.name}</h3>
                        <span className="text-2xl">{getTrendIcon(result.trend)}</span>
                      </div>
                      <div className="text-2xl font-bold mb-1">{result.value}</div>
                      <div className="text-sm opacity-75">{result.message}</div>
                      <div className="text-xs opacity-50 mt-2">{new Date(result.date).toLocaleDateString('ru-RU')}</div>
                    </div>
                  ))}
                </div>
                
                <button 
                  onClick={() => setActiveTab('calculators')}
                  className="w-full mt-4 text-rose-600 hover:text-rose-700 font-medium text-center"
                >
                  Посмотреть все →
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'lab-results' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Лабораторные анализы</h2>
              <button className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:from-rose-600 hover:to-pink-600 transition-all duration-200 font-medium flex items-center space-x-2">
                <Upload className="w-5 h-5" />
                <span>Загрузить анализы</span>
              </button>
            </div>

            {labResults.map((labResult) => (
              <div key={labResult.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-rose-100 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{labResult.type}</h3>
                    <p className="text-gray-600">{new Date(labResult.date).toLocaleDateString('ru-RU')}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      labResult.status === 'new' ? 'bg-red-100 text-red-800' :
                      labResult.status === 'viewed' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {labResult.status === 'new' ? 'Новый' :
                       labResult.status === 'viewed' ? 'Просмотрен' : 'Проанализирован'}
                    </span>
                    <button className="p-2 hover:bg-rose-100 rounded-lg transition-colors">
                      <Download className="w-5 h-5 text-rose-600" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(labResult.results).map(([parameter, data]) => (
                    <div key={parameter} className="bg-rose-25 p-4 rounded-xl">
                      <div className="font-medium text-gray-800">{parameter}</div>
                      <div className="text-2xl font-bold text-rose-600">{data.value} <span className="text-sm text-gray-500">{data.unit}</span></div>
                      <div className="text-sm text-gray-500">Норма: {data.reference}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <AutoCalculator 
                    labResults={labResult.results} 
                    onCalculationsComplete={handleCalculationsComplete}
                  />
                </div>

                <div className="mt-6 flex space-x-3">
                  <button className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all duration-200 font-medium flex items-center space-x-2">
                    <Calculator className="w-4 h-4" />
                    <span>Рассчитать индексы</span>
                  </button>
                  <button className="bg-white border-2 border-rose-200 text-rose-600 px-4 py-2 rounded-lg hover:bg-rose-50 transition-all duration-200 font-medium">
                    Добавить комментарий
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'calculators' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Рассчитанные индексы</h2>
              <button 
                onClick={() => navigate('/doctor/calculators')}
                className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:from-rose-600 hover:to-pink-600 transition-all duration-200 font-medium flex items-center space-x-2"
              >
                <Calculator className="w-5 h-5" />
                <span>Новый расчет</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {calculatorResults.map((result) => (
                <div key={result.id} className={`rounded-2xl p-6 border-2 ${getResultColor(result.interpretation)} shadow-lg`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">{result.name}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{getTrendIcon(result.trend)}</span>
                      <TrendingUp className="w-5 h-5" />
                    </div>
                  </div>
                  
                  <div className="text-3xl font-bold mb-2">{result.value}</div>
                  <div className="text-sm mb-4">{result.message}</div>
                  <div className="text-xs opacity-75">{new Date(result.date).toLocaleDateString('ru-RU')}</div>
                  
                  <div className="mt-4 flex space-x-2">
                    <button className="flex-1 bg-white/50 hover:bg-white/80 text-current py-2 rounded-lg transition-colors text-sm font-medium">
                      Детали
                    </button>
                    <button className="flex-1 bg-white/50 hover:bg-white/80 text-current py-2 rounded-lg transition-colors text-sm font-medium">
                      История
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Trend Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              <TrendAnalysis
                title="HOMA-IR Динамика"
                data={[
                  { date: '2025-04-15', value: 2.1 },
                  { date: '2025-05-10', value: 2.5 },
                  { date: '2025-06-10', value: 2.9 }
                ]}
                unit=""
                referenceRange={{ min: 0, max: 2.7 }}
                interpretation="borderline"
              />
              <TrendAnalysis
                title="FAI Динамика"
                data={[
                  { date: '2025-04-15', value: 7.2 },
                  { date: '2025-05-10', value: 6.8 },
                  { date: '2025-06-15', value: 6.0 }
                ]}
                unit=""
                referenceRange={{ min: 0, max: 5.0 }}
                interpretation="abnormal"
              />
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-rose-100 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">История взаимодействий</h2>
            <div className="text-center text-gray-500 py-12">
              <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>История взаимодействий будет отображаться здесь</p>
            </div>
          </div>
        )}

        {activeTab === 'communication' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Общение с пациентом</h2>
            <PatientChat 
              patientName={patient.name}
              patientAvatar={patient.avatar}
            />
          </div>
        )}
      </main>
    </div>
  )
}
