
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { signIn, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const { error } = await signIn(formData.email, formData.password);
      if (error) {
        setError('Неверный email или пароль');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      setError(error.message || 'Ошибка входа');
    }
  };

  const fillDemoAccount = (type: 'patient' | 'doctor' | 'admin') => {
    const accounts = {
      patient: 'patient@test.com',
      doctor: 'doctor@test.com', 
      admin: 'admin@test.com'
    };
    
    setFormData({
      email: accounts[type],
      password: 'password'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-6">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium mb-6 justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>На главную</span>
          </Link>
          
          <CardTitle className="text-3xl font-bold text-gray-900">
            Вход в систему
          </CardTitle>
          <p className="text-gray-600">
            Войдите в свой аккаунт для продолжения
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Пароль"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
            
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {error}
              </div>
            )}
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isLoading ? 'Вход...' : 'Войти'}
            </Button>
          </form>
          
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Нет аккаунта?{' '}
              <Link to="/auth" className="text-purple-500 hover:text-purple-600 font-medium">
                Зарегистрироваться
              </Link>
            </p>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-3">Демо-аккаунты для тестирования:</p>
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillDemoAccount('patient')}
                  className="w-full text-sm"
                >
                  Пациент (patient@test.com)
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillDemoAccount('doctor')}
                  className="w-full text-sm"
                >
                  Врач (doctor@test.com)
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillDemoAccount('admin')}
                  className="w-full text-sm"
                >
                  Админ (admin@test.com)
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
