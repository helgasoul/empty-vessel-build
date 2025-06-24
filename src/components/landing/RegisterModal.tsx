import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { XCircle } from 'lucide-react';

interface RegisterModalProps {
  onClose: () => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({ onClose }) => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    subscribeNewsletter: true,
    role: 'patient',
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (!formData.acceptTerms) {
      setError('Необходимо принять условия использования');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await signup(formData.email, formData.password, {
        full_name: `${formData.firstName} ${formData.lastName}`,
        role: formData.role,
      });

      // Redirect based on role
      switch (formData.role) {
        case 'patient':
          navigate('/patient/dashboard');
          break;
        case 'doctor':
          navigate('/doctor/dashboard');
          break;
        case 'admin':
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/');
      }

      onClose();
    } catch (err: any) {
      setError(err.message || 'Ошибка при регистрации. Пожалуйста, попробуйте еще раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="relative bg-white rounded-2xl shadow-lg max-w-md w-full mx-4">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700"
        >
          <XCircle className="w-6 h-6" />
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Создать аккаунт
          </h2>
          <p className="text-gray-600 mb-6">
            Зарегистрируйтесь, чтобы получить доступ к платформе Prevent
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Имя *
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="Анна"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Фамилия *
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="Петрова"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                placeholder="anna@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Пароль *
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                placeholder="Минимум 6 символов"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Подтвердите пароль *
              </label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                placeholder="Повторите пароль"
              />
            </div>

            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="terms"
                checked={formData.acceptTerms}
                onChange={(e) => setFormData({...formData, acceptTerms: e.target.checked})}
                className="mt-1 h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                Я согласен с{' '}
                <a href="#" className="text-rose-600 hover:text-rose-700 underline">
                  условиями использования
                </a>{' '}
                и{' '}
                <a href="#" className="text-rose-600 hover:text-rose-700 underline">
                  политикой конфиденциальности
                </a>
              </label>
            </div>

            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="newsletter"
                checked={formData.subscribeNewsletter}
                onChange={(e) => setFormData({...formData, subscribeNewsletter: e.target.checked})}
                className="mt-1 h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
              />
              <label htmlFor="newsletter" className="text-sm text-gray-600">
                Подписаться на новости и обновления платформы
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Выберите роль *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {/* Patient Role */}
                <label className="relative">
                  <input
                    type="radio"
                    name="role"
                    value="patient"
                    checked={formData.role === 'patient'}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="sr-only peer"
                    required
                  />
                  <div className="p-3 bg-gradient-to-r from-rose-100 to-pink-100 border border-rose-200 rounded-xl cursor-pointer hover:shadow-md peer-checked:ring-2 peer-checked:ring-rose-500 transition-all">
                    <div className="text-rose-600 font-medium text-sm text-center">
                      Пациент
                    </div>
                  </div>
                </label>

                {/* Doctor Role */}
                <label className="relative">
                  <input
                    type="radio"
                    name="role"
                    value="doctor"
                    checked={formData.role === 'doctor'}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="sr-only peer"
                    required
                  />
                  <div className="p-3 bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200 rounded-xl cursor-pointer hover:shadow-md peer-checked:ring-2 peer-checked:ring-blue-500 transition-all">
                    <div className="text-blue-600 font-medium text-sm text-center">
                      Врач
                    </div>
                  </div>
                </label>

                {/* Admin Role */}
                <label className="relative">
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={formData.role === 'admin'}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="sr-only peer"
                    required
                  />
                  <div className="p-3 bg-gradient-to-r from-gray-100 to-slate-100 border border-gray-200 rounded-xl cursor-pointer hover:shadow-md peer-checked:ring-2 peer-checked:ring-gray-500 transition-all">
                    <div className="text-gray-600 font-medium text-sm text-center">
                      Админ
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-medium rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
