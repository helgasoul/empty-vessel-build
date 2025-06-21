
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { UserRole, UserRoleEnum } from '@/types/user';
import { 
  User, 
  Stethoscope, 
  Settings, 
  Building2, 
  FlaskConical,
  CheckCircle,
  AlertCircle,
  Crown,
  Shield,
  ArrowLeft
} from 'lucide-react';
import AuthHeader from '@/components/auth/AuthHeader';
import PasswordUpdateForm from '@/components/auth/PasswordUpdateForm';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  const [adminCode, setAdminCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: ''
  });

  // Check if this is a password reset flow
  const type = searchParams.get('type');
  const accessToken = searchParams.get('access_token');
  const refreshToken = searchParams.get('refresh_token');

  // Handle password reset flow
  useEffect(() => {
    if (type === 'recovery' && accessToken && refreshToken) {
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      }).then(({ error }) => {
        if (error) {
          console.error('Error setting session:', error);
          toast.error('Ошибка при восстановлении пароля');
        } else {
          toast.success('Теперь вы можете изменить свой пароль');
        }
      });
    }
  }, [type, accessToken, refreshToken]);

  // Если пользователь уже авторизован, перенаправляем на главную
  useEffect(() => {
    if (user && type !== 'recovery') {
      navigate('/');
    }
  }, [user, navigate, type]);

  // ✅ ПОЛНЫЙ список ролей
  const roleOptions = [
    {
      value: 'patient' as UserRole,
      label: 'Пациент',
      description: 'Хочу следить за своим здоровьем',
      icon: User,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      textColor: 'text-white',
      borderColor: 'border-blue-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      value: 'doctor' as UserRole,
      label: 'Врач',
      description: 'Медицинский специалист',
      icon: Stethoscope,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      textColor: 'text-white',
      borderColor: 'border-green-500',
      bgGradient: 'from-green-50 to-emerald-50',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      value: 'admin' as UserRole,
      label: 'Администратор',
      description: 'Управление платформой',
      icon: Crown,
      color: 'bg-red-500',
      hoverColor: 'hover:bg-red-600',
      textColor: 'text-white',
      borderColor: 'border-red-500',
      bgGradient: 'from-red-50 to-rose-50',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      requiresCode: true
    },
    {
      value: 'clinic' as UserRole,
      label: 'Клиника',
      description: 'Медицинское учреждение',
      icon: Building2,
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      textColor: 'text-white',
      borderColor: 'border-purple-500',
      bgGradient: 'from-purple-50 to-violet-50',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      value: 'laboratory' as UserRole,
      label: 'Лаборатория',
      description: 'Лабораторные исследования',
      icon: FlaskConical,
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600',
      textColor: 'text-white',
      borderColor: 'border-orange-500',
      bgGradient: 'from-orange-50 to-amber-50',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600'
    }
  ];

  const handleRoleChange = (value: string) => {
    console.log('🔄 Роль изменена на:', value);
    setSelectedRole(value as UserRole);
    setError('');
  };

  const validateForm = () => {
    if (!isLogin) {
      if (!formData.fullName.trim()) {
        setError('Введите полное имя');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Пароли не совпадают');
        return false;
      }
      if (selectedRole === 'admin' && !adminCode.trim()) {
        setError('Введите код администратора');
        return false;
      }
      if (selectedRole === 'admin' && adminCode !== 'PREVENT_ADMIN_2024') {
        setError('Неверный код администратора');
        return false;
      }
    }
    
    if (!formData.email.trim()) {
      setError('Введите email');
      return false;
    }
    if (!formData.password.trim()) {
      setError('Введите пароль');
      return false;
    }
    
    return true;
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('Попытка входа для:', formData.email);

      if (!formData.email || !formData.password) {
        setError('Пожалуйста, заполните все поля');
        setIsLoading(false);
        return;
      }

      const { error } = await signIn(formData.email, formData.password);

      if (error) {
        console.error('Ошибка входа:', error);
        let errorMessage = 'Произошла ошибка при входе';
        
        if (error.message === 'Invalid login credentials') {
          errorMessage = 'Неверный email или пароль';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Пожалуйста, подтвердите ваш email адрес';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Слишком много попыток входа. Попробуйте позже';
        } else {
          errorMessage = error.message;
        }
        
        setError(errorMessage);
      } else {
        toast.success('Добро пожаловать в PREVENT!');
        console.log('Успешный вход в систему');
      }
    } catch (err) {
      console.error('Неожиданная ошибка:', err);
      setError('Произошла неожиданная ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    console.log('📝 Отправка формы регистрации:', {
      email: formData.email,
      fullName: formData.fullName,
      selectedRole,
      hasAdminCode: !!adminCode
    });

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      if (formData.password.length < 6) {
        setError('Пароль должен содержать минимум 6 символов');
        setIsLoading(false);
        return;
      }

      const { error } = await signUp(formData.email, formData.password, formData.fullName);

      if (error) {
        console.error('Ошибка регистрации:', error);
        let errorMessage = 'Произошла ошибка при регистрации';
        
        if (error.message === 'User already registered') {
          errorMessage = 'Пользователь с таким email уже зарегистрирован';
        } else if (error.message.includes('Password should be at least')) {
          errorMessage = 'Пароль должен содержать минимум 6 символов';
        } else if (error.message.includes('Invalid email')) {
          errorMessage = 'Пожалуйста, введите корректный email адрес';
        } else {
          errorMessage = error.message;
        }
        
        setError(errorMessage);
      } else {
        console.log('✅ Регистрация выполнена с ролью:', selectedRole);
        toast.success('Регистрация успешна! Проверьте почту для подтверждения аккаунта');
        
        // Перенаправление в зависимости от роли
        switch (selectedRole) {
          case 'admin':
            navigate('/admin-dashboard');
            break;
          case 'doctor':
            navigate('/doctor-dashboard');
            break;
          default:
            navigate('/');
        }
      }
    } catch (err) {
      console.error('Неожиданная ошибка:', err);
      setError('Произошла неожиданная ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsResetLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get('resetEmail') as string;

      if (!email) {
        toast.error('Пожалуйста, введите email адрес');
        setIsResetLoading(false);
        return;
      }

      console.log('Sending password reset request for:', email);

      const response = await supabase.functions.invoke('send-password-reset', {
        body: { email }
      });

      console.log('Password reset response:', response);

      if (response.error) {
        console.error('Error sending password reset:', response.error);
        toast.error('Ошибка при отправке письма для восстановления пароля. Попробуйте еще раз.');
      } else if (response.data) {
        if (response.data.testMode) {
          toast.success('В тестовом режиме письма отправляются только на зарегистрированный email. Ссылка сгенерирована успешно.');
          console.log('Test mode reset link:', response.data.resetLink);
        } else {
          toast.success('Письмо для восстановления пароля отправлено на ваш email');
        }
        setResetDialogOpen(false);
        (e.target as HTMLFormElement).reset();
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('Произошла неожиданная ошибка. Попробуйте еще раз.');
    } finally {
      setIsResetLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const password = formData.get('newPassword') as string;
      const confirmPassword = formData.get('confirmPassword') as string;

      if (!password || !confirmPassword) {
        toast.error('Пожалуйста, заполните все поля');
        setIsLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        toast.error('Пароли не совпадают');
        setIsLoading(false);
        return;
      }

      if (password.length < 6) {
        toast.error('Пароль должен содержать минимум 6 символов');
        setIsLoading(false);
        return;
      }

      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        console.error('Error updating password:', error);
        toast.error('Ошибка при обновлении пароля');
      } else {
        toast.success('Пароль успешно обновлен!');
        navigate('/');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('Произошла неожиданная ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  // If this is a password recovery flow, show password update form
  if (type === 'recovery' && user) {
    return (
      <PasswordUpdateForm
        onSubmit={handlePasswordUpdate}
        isLoading={isLoading}
      />
    );
  }

  return (
    <div className="min-h-screen prevent-gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-2xl animate-fade-in">
        <AuthHeader />

        <Card className="prevent-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-montserrat">
              {isLogin ? 'Добро пожаловать в PREVENT' : 'Регистрация в PREVENT'}
            </CardTitle>
            <CardDescription className="font-roboto">
              Ваша персональная платформа превентивной медицины
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2 text-red-800">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={isLogin ? handleSignIn : handleSignUp} className="space-y-6">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="font-roboto">Полное имя</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    placeholder="Анна Иванова"
                    required={!isLogin}
                    className="font-roboto"
                    disabled={isLoading}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="font-roboto">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="your@email.com"
                  required
                  className="font-roboto"
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="font-roboto">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder={isLogin ? "Введите пароль" : "Минимум 6 символов"}
                  required
                  className="font-roboto"
                  disabled={isLoading}
                  minLength={isLogin ? undefined : 6}
                />
              </div>

              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="font-roboto">Подтвердите пароль</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      placeholder="Подтвердите пароль"
                      required
                      className="font-roboto"
                      disabled={isLoading}
                      minLength={6}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="text-center">
                      <Label className="text-xl font-bold text-gray-900 mb-2 block">
                        Выберите вашу роль в системе
                      </Label>
                      <p className="text-sm text-gray-600 mb-4">
                        Выберите роль, которая лучше всего описывает ваше положение
                      </p>
                    </div>
                    
                    {/* Отладочная информация */}
                    <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                      Выбрана роль: {selectedRole} | Всего ролей: {roleOptions.length}
                    </div>
                    
                    <RadioGroup 
                      value={selectedRole} 
                      onValueChange={handleRoleChange}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      {roleOptions.map((option) => (
                        <div key={option.value} className="relative">
                          <RadioGroupItem 
                            value={option.value} 
                            id={option.value} 
                            className="sr-only"
                          />
                          <Label 
                            htmlFor={option.value} 
                            className={`
                              group flex flex-col items-center p-6 rounded-xl border-2 cursor-pointer transition-all duration-300
                              ${selectedRole === option.value 
                                ? `${option.borderColor} bg-gradient-to-br ${option.bgGradient} shadow-lg scale-105` 
                                : 'border-gray-200 hover:border-gray-300 hover:shadow-md hover:scale-102'
                              }
                            `}
                          >
                            <div className={`
                              w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300
                              ${selectedRole === option.value 
                                ? `${option.color} ${option.textColor} shadow-lg` 
                                : `${option.iconBg} group-hover:scale-110`
                              }
                            `}>
                              <option.icon className={`
                                w-8 h-8 transition-all duration-300
                                ${selectedRole === option.value 
                                  ? option.textColor 
                                  : option.iconColor
                                }
                              `} />
                            </div>
                            
                            <div className="text-center">
                              <div className={`
                                font-bold text-lg mb-2 transition-colors duration-300
                                ${selectedRole === option.value 
                                  ? 'text-gray-900' 
                                  : 'text-gray-700 group-hover:text-gray-900'
                                }
                              `}>
                                {option.label}
                              </div>
                              <div className="text-sm text-gray-600 mb-3">
                                {option.description}
                              </div>
                            </div>
                            
                            {selectedRole === option.value && (
                              <div className="absolute -top-2 -right-2">
                                <div className={`
                                  w-8 h-8 rounded-full flex items-center justify-center
                                  ${option.color} ${option.textColor} shadow-lg animate-scale-in
                                `}>
                                  <CheckCircle className="w-5 h-5" />
                                </div>
                              </div>
                            )}
                            
                            {option.requiresCode && (
                              <div className="absolute top-2 left-2">
                                <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow">
                                  Код доступа
                                </div>
                              </div>
                            )}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>

                    {/* Дополнительное поле для администраторов */}
                    {selectedRole === 'admin' && (
                      <div className="space-y-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Crown className="w-5 h-5 text-red-600" />
                          <Label htmlFor="adminCode" className="font-roboto font-semibold text-red-800">
                            Код администратора
                          </Label>
                        </div>
                        <Input
                          id="adminCode"
                          type="password"
                          placeholder="Введите код доступа администратора"
                          value={adminCode}
                          onChange={(e) => setAdminCode(e.target.value)}
                          required
                          className="font-roboto border-red-300 focus:border-red-500"
                          disabled={isLoading}
                        />
                        <p className="text-xs text-red-600">
                          Обратитесь к главному администратору для получения кода доступа
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}

              <Button 
                type="submit" 
                className="w-full prevent-button-primary text-lg py-3"
                disabled={isLoading}
              >
                {isLoading ? (isLogin ? 'Вход...' : 'Регистрация...') : (isLogin ? 'Войти' : 'Создать аккаунт')}
              </Button>
            </form>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setSelectedRole('patient');
                  setAdminCode('');
                  setFormData({
                    email: '',
                    password: '',
                    fullName: '',
                    confirmPassword: ''
                  });
                }}
                className="text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                {isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войдите'}
              </button>
            </div>

            {/* Отладочная панель */}
            <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-600">
              <div><strong>Debug info:</strong></div>
              <div>Режим: {isLogin ? 'Вход' : 'Регистрация'}</div>
              <div>Выбранная роль: {selectedRole}</div>
              <div>Доступные роли: {roleOptions.map(r => r.value).join(', ')}</div>
              {selectedRole === 'admin' && (
                <div>Код админа введен: {adminCode ? 'Да' : 'Нет'}</div>
              )}
            </div>

            {/* Информационный блок */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-blue-800">
                  <p className="font-medium mb-1">Информация для тестирования:</p>
                  <p>Если у вас проблемы с входом, убедитесь что email и пароль введены корректно. При возникновении ошибок проверьте консоль браузера для получения детальной информации.</p>
                  {selectedRole === 'admin' && (
                    <p className="mt-1 font-medium">Тестовый код администратора: PREVENT_ADMIN_2024</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
