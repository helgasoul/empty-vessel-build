import React, { useState } from 'react';
import { X, Heart, Shield, Building2, FlaskConical, UserCog, Eye, EyeOff, ArrowRight } from 'lucide-react';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedRole?: string | null;
}

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  firstName: string;
  lastName: string;
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
}

const roleIcons = {
  patient: <Heart className="w-5 h-5" />,
  doctor: <Shield className="w-5 h-5" />,
  clinic: <Building2 className="w-5 h-5" />,
  laboratory: <FlaskConical className="w-5 h-5" />,
  admin: <UserCog className="w-5 h-5" />
};

const roleColors = {
  patient: 'from-rose-400 to-pink-500',
  doctor: 'from-blue-400 to-indigo-500',
  clinic: 'from-emerald-400 to-teal-500',
  laboratory: 'from-purple-400 to-violet-500',
  admin: 'from-gray-400 to-slate-500'
};

export const RegisterModal: React.FC<RegisterModalProps> = ({ 
  isOpen, 
  onClose, 
  preselectedRole 
}) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    role: preselectedRole || '',
    firstName: '',
    lastName: '',
    agreeToTerms: false,
    agreeToPrivacy: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<RegisterFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterFormData> = {};

    if (!formData.email) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Некорректный email';
    }

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Пароль должен содержать минимум 8 символов';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    if (!formData.firstName) {
      newErrors.firstName = 'Имя обязательно';
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Фамилия обязательна';
    }

    if (!formData.role) {
      newErrors.role = 'Выберите роль';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'Необходимо согласие с условиями';
    }

    if (!formData.agreeToPrivacy) {
      newErrors.agreeToPrivacy = 'Необходимо согласие с политикой конфиденциальности';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Здесь будет логика регистрации
      console.log('Registering user:', formData);
      
      // Симуляция запроса
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Перенаправление на соответствующий dashboard в зависимости от роли
      switch (formData.role) {
        case 'patient':
          window.location.href = '/patient/dashboard';
          break;
        case 'doctor':
          window.location.href = '/doctor/dashboard';
          break;
        case 'clinic':
          window.location.href = '/clinic/dashboard';
          break;
        case 'laboratory':
          window.location.href = '/laboratory/dashboard';
          break;
        case 'admin':
          window.location.href = '/admin/dashboard';
          break;
        default:
          window.location.href = '/dashboard';
      }
      
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof RegisterFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Очистка ошибки при изменении поля
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Присоединиться к Prevent
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Создайте аккаунт для доступа к платформе
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Выберите вашу роль
            </label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(roleIcons).map(([key, icon]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleInputChange('role', key)}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                    formData.role === key
                      ? `border-transparent bg-gradient-to-r ${roleColors[key as keyof typeof roleColors]} text-white`
                      : 'border-gray-200 hover:border-rose-300 bg-white text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {icon}
                    <span className="text-sm font-medium capitalize">
                      {key === 'patient' ? 'Пациент' :
                       key === 'doctor' ? 'Врач' :
                       key === 'clinic' ? 'Клиника' :
                       key === 'laboratory' ? 'Лаборатория' :
                       'Админ'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            {errors.role && (
              <p className="text-red-500 text-xs mt-1">{errors.role}</p>
            )}
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Имя
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent ${
                  errors.firstName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ваше имя"
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Фамилия
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent ${
                  errors.lastName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ваша фамилия"
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Пароль
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Минимум 8 символов"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Подтвердите пароль
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent ${
                  errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Повторите пароль"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Agreements */}
          <div className="space-y-3">
            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                className="mt-1 h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-600">
                Я согласен с{' '}
                <a href="#" className="text-rose-600 hover:text-rose-700 underline">
                  Условиями использования
                </a>
              </span>
            </label>
            {errors.agreeToTerms && (
              <p className="text-red-500 text-xs">{errors.agreeToTerms}</p>
            )}

            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={formData.agreeToPrivacy}
                onChange={(e) => handleInputChange('agreeToPrivacy', e.target.checked)}
                className="mt-1 h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-600">
                Я согласен с{' '}
                <a href="#" className="text-rose-600 hover:text-rose-700 underline">
                  Политикой конфиденциальности
                </a>
              </span>
            </label>
            {errors.agreeToPrivacy && (
              <p className="text-red-500 text-xs">{errors.agreeToPrivacy}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white py-3 px-4 rounded-full font-semibold transition-all duration-300 ${
              isLoading 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:from-rose-600 hover:to-pink-700 hover:shadow-lg transform hover:-translate-y-0.5'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Создание аккаунта...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <span>Создать аккаунт</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </button>

          {/* Login Link */}
          <div className="text-center pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Уже есть аккаунт?{' '}
              <button 
                type="button"
                className="text-rose-600 hover:text-rose-700 font-medium"
                onClick={() => {
                  // Здесь будет логика перехода к форме входа
                  console.log('Switch to login');
                }}
              >
                Войти
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};