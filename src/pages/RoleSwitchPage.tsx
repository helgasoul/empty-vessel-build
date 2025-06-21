
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { UserRole } from '../types/auth'
import { ArrowLeft, Eye, EyeOff, RefreshCw } from 'lucide-react'

export default function RoleSwitchPage() {
  const navigate = useNavigate()
  const { user, switchRole } = useAuth()
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRoleSwitch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Simulate password verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (switchRole) {
        switchRole(selectedRole)
        navigate('/dashboard')
      }
    } catch (error: any) {
      setError(error.message || 'Ошибка при смене роли')
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleDescription = (role: UserRole) => {
    switch (role) {
      case 'patient':
        return 'Мониторинг здоровья, персональные рекомендации, связь с врачами'
      case 'doctor':
        return 'Работа с пациентами, медицинские калькуляторы, аналитика'
      case 'admin':
        return 'Управление платформой, пользователями и системными настройками'
      default:
        return ''
    }
  }

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'patient': return '👩‍💼'
      case 'doctor': return '👩‍⚕️'
      case 'admin': return '⚙️'
      default: return '👤'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center space-x-2 text-rose-600 hover:text-rose-700 font-medium mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>На главную</span>
          </button>
          
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Смена роли
          </h1>
          <p className="text-gray-600">
            Подтвердите свою личность для смены роли
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-rose-100 shadow-lg mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="text-3xl">{getRoleIcon(user?.role || 'patient')}</div>
            <div>
              <div className="font-medium text-gray-800">{user?.name}</div>
              <div className="text-sm text-gray-500">{user?.email}</div>
              <div className="text-xs text-gray-400 capitalize">
                Текущая роль: {user?.role === 'patient' ? 'Пациент' : 
                                user?.role === 'doctor' ? 'Врач' : 'Администратор'}
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleRoleSwitch} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-rose-100 shadow-lg">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Выберите новую роль:
            </label>
            <div className="space-y-3">
              {(['patient', 'doctor', 'admin'] as UserRole[]).map((role) => (
                <label
                  key={role}
                  className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                    selectedRole === role
                      ? 'border-rose-500 bg-rose-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    checked={selectedRole === role}
                    onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="text-2xl">{getRoleIcon(role)}</div>
                    <div>
                      <div className="font-medium text-gray-800">
                        {role === 'patient' ? 'Пациент' : 
                         role === 'doctor' ? 'Врач' : 'Администратор'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {getRoleDescription(role)}
                      </div>
                    </div>
                  </div>
                  {selectedRole === role && (
                    <div className="w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Подтвердите пароль для смены роли:
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите ваш пароль"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !password}
            className={`w-full py-3 rounded-xl font-medium transition-all duration-200 ${
              isLoading || !password
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 shadow-lg hover:shadow-xl'
            }`}
          >
            {isLoading ? 'Смена роли...' : 'Сменить роль'}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-800 text-sm"
          >
            Отменить и вернуться на главную
          </button>
        </div>
      </div>
    </div>
  )
}
