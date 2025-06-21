
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  Heart, 
  Shield, 
  Users, 
  Calculator, 
  ChevronDown,
  CheckCircle,
  Star,
  ArrowRight,
  Play,
  Sparkles,
  Brain,
  Activity,
  Menu,
  X,
  Settings,
  LogOut
} from 'lucide-react'

export default function LandingPage() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<'patient' | 'doctor' | null>(null)

  const isAuthenticated = !!user

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard')
    } else if (selectedRole) {
      navigate('/register', { state: { role: selectedRole } })
    } else {
      document.getElementById('role-selection')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleLogin = () => {
    if (isAuthenticated) {
      navigate('/dashboard')
    } else {
      navigate('/login')
    }
  }

  const handleLogout = () => {
    signOut()
    setMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      {/* Navigation Header */}
      <header className="relative z-50 bg-white/80 backdrop-blur-sm border-b border-rose-100 sticky top-0">
        <nav className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  YTime PREVENT
                </h1>
                <p className="text-xs text-gray-600">Женское здоровье</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {!isAuthenticated && (
                <>
                  <a href="#features" className="text-gray-700 hover:text-rose-600 transition-colors">
                    Возможности
                  </a>
                  <a href="#how-it-works" className="text-gray-700 hover:text-rose-600 transition-colors">
                    Как это работает
                  </a>
                  <a href="#testimonials" className="text-gray-700 hover:text-rose-600 transition-colors">
                    Отзывы
                  </a>
                </>
              )}
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{user?.role === 'doctor' ? '👩‍⚕️' : user?.role === 'admin' ? '⚙️' : '👩‍💼'}</div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:from-rose-600 hover:to-pink-600 transition-all duration-200 font-medium shadow-lg"
                  >
                    Перейти в кабинет
                  </button>
                  
                  <div className="relative group">
                    <button className="p-2 hover:bg-rose-100 rounded-lg transition-colors">
                      <Settings className="w-5 h-5 text-gray-600" />
                    </button>
                    
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-rose-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="p-2">
                        <button
                          onClick={() => navigate('/role-switch')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          Сменить роль
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center space-x-2"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Выйти</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleLogin}
                    className="text-rose-600 hover:text-rose-700 font-medium"
                  >
                    Войти
                  </button>
                  <button
                    onClick={handleGetStarted}
                    className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:from-rose-600 hover:to-pink-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                  >
                    Начать
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 hover:text-rose-600"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-rose-100">
              <div className="pt-4 space-y-4">
                {!isAuthenticated ? (
                  <>
                    <a 
                      href="#features" 
                      className="block text-gray-700 hover:text-rose-600 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Возможности
                    </a>
                    <a 
                      href="#how-it-works" 
                      className="block text-gray-700 hover:text-rose-600 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Как это работает
                    </a>
                    <a 
                      href="#testimonials" 
                      className="block text-gray-700 hover:text-rose-600 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Отзывы
                    </a>
                    <div className="pt-4 space-y-3">
                      <button
                        onClick={() => {
                          handleLogin()
                          setMobileMenuOpen(false)
                        }}
                        className="w-full text-left text-rose-600 hover:text-rose-700 font-medium"
                      >
                        Войти
                      </button>
                      <button
                        onClick={() => {
                          handleGetStarted()
                          setMobileMenuOpen(false)
                        }}
                        className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 rounded-xl hover:from-rose-600 hover:to-pink-600 transition-all duration-200 font-medium"
                      >
                        Начать
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 pb-4 border-b border-rose-100">
                      <div className="text-2xl">{user?.role === 'doctor' ? '👩‍⚕️' : user?.role === 'admin' ? '⚙️' : '👩‍💼'}</div>
                      <div>
                        <p className="font-medium text-gray-800">{user?.name}</p>
                        <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        navigate('/dashboard')
                        setMobileMenuOpen(false)
                      }}
                      className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 rounded-xl hover:from-rose-600 hover:to-pink-600 transition-all duration-200 font-medium"
                    >
                      Перейти в кабинет
                    </button>
                    
                    <button
                      onClick={() => {
                        navigate('/role-switch')
                        setMobileMenuOpen(false)
                      }}
                      className="w-full text-left text-gray-700 hover:text-rose-600 py-2"
                    >
                      Сменить роль
                    </button>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full text-left text-red-600 hover:text-red-700 py-2 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Выйти</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -left-4 w-72 h-72 bg-gradient-to-r from-rose-200 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-r from-orange-200 to-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full border border-rose-100 mb-6">
                <Sparkles className="w-4 h-4 text-rose-500" />
                <span className="text-sm font-medium text-gray-700">Персонализированная медицина</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Ваше здоровье в{' '}
                <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  надежных руках
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Платформа для комплексного мониторинга женского здоровья с ИИ-анализом, 
                персонализированными рекомендациями и связью с экспертами
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-4 rounded-2xl hover:from-rose-600 hover:to-pink-600 transition-all duration-200 font-semibold text-lg shadow-xl hover:shadow-2xl flex items-center justify-center space-x-2"
                >
                  <span>{isAuthenticated ? 'Перейти в кабинет' : 'Начать заботиться о себе'}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                
                {!isAuthenticated && (
                  <button className="bg-white/80 backdrop-blur-sm text-gray-700 px-8 py-4 rounded-2xl hover:bg-white transition-all duration-200 font-semibold text-lg border border-rose-100 flex items-center justify-center space-x-2">
                    <Play className="w-5 h-5" />
                    <span>Посмотреть демо</span>
                  </button>
                )}
              </div>

              <div className="flex items-center justify-center lg:justify-start space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Конфиденциально</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Научно обосновано</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span>С заботой</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-rose-100 shadow-2xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full flex items-center justify-center">
                        <span className="text-white text-lg">👩‍💼</span>
                      </div>
                      <div>
                        <div className="h-3 bg-gray-200 rounded w-24 mb-1"></div>
                        <div className="h-2 bg-gray-100 rounded w-16"></div>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      Низкий риск
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-rose-50 p-3 rounded-xl">
                      <div className="text-2xl mb-1">🦋</div>
                      <div className="text-xs text-gray-600">Щитовидная железа</div>
                      <div className="font-bold text-green-600">В норме</div>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-xl">
                      <div className="text-2xl mb-1">🌸</div>
                      <div className="text-xs text-gray-600">Метаболизм</div>
                      <div className="font-bold text-yellow-600">Наблюдение</div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-4 rounded-xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <Brain className="w-4 h-4 text-rose-600" />
                      <span className="text-sm font-medium text-gray-700">ИИ-рекомендация</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      Рекомендуем увеличить потребление йода и добавить аэробные нагрузки
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-4 -right-4 bg-white rounded-full p-3 shadow-lg">
                <Activity className="w-6 h-6 text-rose-500" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-full p-3 shadow-lg">
                <Calculator className="w-6 h-6 text-orange-500" />
              </div>
            </div>
          </div>
        </div>

        {!isAuthenticated && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-6 h-6 text-gray-400" />
          </div>
        )}
      </section>

      {/* Role Selection - только для неавторизованных */}
      {!isAuthenticated && (
        <section id="role-selection" className="py-24 bg-white/50 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Выберите свою роль
            </h2>
            <p className="text-xl text-gray-600 mb-12">
              Платформа адаптируется под ваши потребности
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div 
                onClick={() => setSelectedRole('patient')}
                className={`relative p-8 rounded-3xl border-2 transition-all duration-300 cursor-pointer hover:shadow-2xl ${
                  selectedRole === 'patient' 
                    ? 'border-rose-500 bg-gradient-to-br from-rose-50 to-pink-50 shadow-xl' 
                    : 'border-rose-200 bg-white/80 hover:border-rose-300'
                }`}
              >
                {selectedRole === 'patient' && (
                  <div className="absolute -top-3 -right-3 bg-rose-500 text-white rounded-full p-2">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                )}
                
                <div className="text-6xl mb-6">👩‍💼</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Я - Пациент</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Хочу следить за своим здоровьем, получать персонализированные рекомендации 
                  и иметь связь с врачами
                </p>
                
                <div className="space-y-3 text-left">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-700">Мониторинг показателей здоровья</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-700">ИИ-анализ результатов</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-700">Персональные рекомендации</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-700">Связь с экспертами</span>
                  </div>
                </div>
              </div>

              <div 
                onClick={() => setSelectedRole('doctor')}
                className={`relative p-8 rounded-3xl border-2 transition-all duration-300 cursor-pointer hover:shadow-2xl ${
                  selectedRole === 'doctor' 
                    ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xl' 
                    : 'border-blue-200 bg-white/80 hover:border-blue-300'
                }`}
              >
                {selectedRole === 'doctor' && (
                  <div className="absolute -top-3 -right-3 bg-blue-500 text-white rounded-full p-2">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                )}
                
                <div className="text-6xl mb-6">👩‍⚕️</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Я - Врач</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Хочу эффективно работать с пациентами, использовать современные 
                  инструменты анализа и мониторинга
                </p>
                
                <div className="space-y-3 text-left">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-700">Медицинские калькуляторы</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-700">Управление пациентами</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-700">Аналитика и тренды</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-700">Планирование расписания</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <button
                onClick={handleGetStarted}
                disabled={!selectedRole}
                className={`px-12 py-4 rounded-2xl font-semibold text-lg transition-all duration-200 ${
                  selectedRole
                    ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 shadow-xl hover:shadow-2xl'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {selectedRole ? 'Продолжить регистрацию' : 'Выберите роль для продолжения'}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold">YTime PREVENT</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Персонализированная платформа женского здоровья
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Продукт</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Возможности</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">Как работает</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Цены</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Поддержка</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Справка</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Контакты</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Компания</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">О нас</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Блог</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Карьера</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 YTime PREVENT. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
