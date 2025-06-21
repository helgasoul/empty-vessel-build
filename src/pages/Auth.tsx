
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Shield, ArrowLeft, AlertCircle, Mail, User, Stethoscope, Settings, Building2, FlaskConical, CheckCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/user';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  const [adminCode, setAdminCode] = useState('');
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Check if this is a password reset flow
  const type = searchParams.get('type');
  const accessToken = searchParams.get('access_token');
  const refreshToken = searchParams.get('refresh_token');

  const roleOptions = [
    {
      value: 'patient' as UserRole,
      label: 'Пациент',
      description: 'Хочу следить за своим здоровьем',
      icon: User,
      color: 'bg-blue-100 text-blue-600',
      bgGradient: 'from-blue-50 to-cyan-50'
    },
    {
      value: 'doctor' as UserRole,
      label: 'Врач',
      description: 'Медицинский специалист',
      icon: Stethoscope,
      color: 'bg-green-100 text-green-600',
      bgGradient: 'from-green-50 to-emerald-50'
    },
    {
      value: 'admin' as UserRole,
      label: 'Администратор',
      description: 'Управление платформой',
      icon: Settings,
      color: 'bg-red-100 text-red-600',
      bgGradient: 'from-red-50 to-rose-50'
    },
    {
      value: 'clinic' as UserRole,
      label: 'Клиника',
      description: 'Медицинское учреждение',
      icon: Building2,
      color: 'bg-purple-100 text-purple-600',
      bgGradient: 'from-purple-50 to-violet-50'
    },
    {
      value: 'laboratory' as UserRole,
      label: 'Лаборатория',
      description: 'Лабораторные исследования',
      icon: FlaskConical,
      color: 'bg-orange-100 text-orange-600',
      bgGradient: 'from-orange-50 to-amber-50'
    }
  ];

  // Handle password reset flow
  useEffect(() => {
    if (type === 'recovery' && accessToken && refreshToken) {
      // Set the session with the tokens from the URL
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

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;

      console.log('Попытка входа для:', email);

      if (!email || !password) {
        toast.error('Пожалуйста, заполните все поля');
        setIsLoading(false);
        return;
      }

      const { error } = await signIn(email, password);

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
        
        toast.error(errorMessage);
      } else {
        toast.success('Добро пожаловать в PREVENT!');
        console.log('Успешный вход в систему');
      }
    } catch (err) {
      console.error('Неожиданная ошибка:', err);
      toast.error('Произошла неожиданная ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  const validateAdminRegistration = (adminCodeValue: string) => {
    if (selectedRole === 'admin') {
      if (!adminCodeValue) {
        toast.error('Для регистрации администратора требуется специальный код');
        return false;
      }
      // В реальном проекте здесь должна быть проверка кода
      if (adminCodeValue !== 'PREVENT_ADMIN_2024') {
        toast.error('Неверный код администратора');
        return false;
      }
    }
    return true;
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;
      const fullName = formData.get('fullName') as string;

      console.log('Попытка регистрации для:', email, 'с ролью:', selectedRole);

      if (!email || !password || !fullName) {
        toast.error('Пожалуйста, заполните все поля');
        setIsLoading(false);
        return;
      }

      if (!validateAdminRegistration(adminCode)) {
        setIsLoading(false);
        return;
      }

      if (password.length < 6) {
        toast.error('Пароль должен содержать минимум 6 символов');
        setIsLoading(false);
        return;
      }

      const { error } = await signUp(email, password, fullName);

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
        
        toast.error(errorMessage);
      } else {
        toast.success('Регистрация успешна! Проверьте почту для подтверждения аккаунта');
        console.log('Успешная регистрация с ролью:', selectedRole);
      }
    } catch (err) {
      console.error('Неожиданная ошибка:', err);
      toast.error('Произошла неожиданная ошибка');
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
        // Очищаем форму
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
      <div className="min-h-screen prevent-gradient-bg flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fade-in">
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 prevent-gradient-primary rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-montserrat font-bold text-gray-900">PREVENT</span>
                <p className="text-xs text-gray-600 font-roboto">Персонализированная медицина</p>
              </div>
            </div>
          </div>

          <Card className="prevent-card">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-montserrat">Обновление пароля</CardTitle>
              <CardDescription className="font-roboto">
                Введите новый пароль для вашего аккаунта
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="font-roboto">Новый пароль</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    required
                    minLength={6}
                    className="font-roboto"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="font-roboto">Подтвердите пароль</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    minLength={6}
                    className="font-roboto"
                    disabled={isLoading}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full prevent-button-primary"
                  disabled={isLoading}
                >
                  {isLoading ? "Обновление..." : "Обновить пароль"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen prevent-gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="flex items-center justify-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="absolute left-4 top-4 hover:bg-white/80"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 prevent-gradient-primary rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-montserrat font-bold text-gray-900">PREVENT</span>
              <p className="text-xs text-gray-600 font-roboto">Персонализированная медицина</p>
            </div>
          </div>
        </div>

        <Card className="prevent-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-montserrat">Добро пожаловать в PREVENT</CardTitle>
            <CardDescription className="font-roboto">
              Ваша персональная платформа превентивной медицины
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin" className="font-medium">Вход</TabsTrigger>
                <TabsTrigger value="signup" className="font-medium">Регистрация</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="font-roboto">Email</Label>
                    <Input
                      id="signin-email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      className="font-roboto"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="font-roboto">Пароль</Label>
                    <Input
                      id="signin-password"
                      name="password"
                      type="password"
                      required
                      className="font-roboto"
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full prevent-button-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? "Вход..." : "Войти"}
                  </Button>
                </form>
                
                <div className="text-center">
                  <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="link" className="text-sm text-purple-600 hover:text-purple-700 font-roboto">
                        Забыли пароль?
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                          <Mail className="w-5 h-5 text-purple-600" />
                          <span>Восстановление пароля</span>
                        </DialogTitle>
                        <DialogDescription>
                          Введите ваш email адрес и мы отправим вам ссылку для восстановления пароля.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handlePasswordReset} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="resetEmail" className="font-roboto">Email адрес</Label>
                          <Input
                            id="resetEmail"
                            name="resetEmail"
                            type="email"
                            placeholder="your@email.com"
                            required
                            className="font-roboto"
                            disabled={isResetLoading}
                          />
                        </div>
                        <Button
                          type="submit"
                          className="w-full prevent-button-primary"
                          disabled={isResetLoading}
                        >
                          {isResetLoading ? "Отправка..." : "Отправить ссылку"}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="font-roboto">Полное имя</Label>
                    <Input
                      id="signup-name"
                      name="fullName"
                      type="text"
                      placeholder="Анна Иванова"
                      required
                      className="font-roboto"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="font-roboto">Email</Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      className="font-roboto"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="font-roboto">Пароль</Label>
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      minLength={6}
                      required
                      className="font-roboto"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Выбор роли */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Выберите вашу роль</Label>
                    <RadioGroup 
                      value={selectedRole} 
                      onValueChange={(value) => setSelectedRole(value as UserRole)}
                      className="space-y-3"
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
                              flex items-center space-x-4 cursor-pointer p-4 rounded-xl border-2 transition-all duration-200
                              ${selectedRole === option.value 
                                ? 'border-purple-500 bg-purple-50 shadow-lg' 
                                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                              }
                            `}
                          >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${option.color} transition-all duration-200`}>
                              <option.icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900">{option.label}</div>
                              <div className="text-sm text-gray-600">{option.description}</div>
                            </div>
                            {selectedRole === option.value && (
                              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </Label>
                          {option.value === 'admin' && (
                            <div className="absolute top-2 right-2">
                              <div className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                                Требует код доступа
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Дополнительное поле для администраторов */}
                  {selectedRole === 'admin' && (
                    <div className="space-y-2">
                      <Label htmlFor="adminCode" className="font-roboto">Код администратора</Label>
                      <Input
                        id="adminCode"
                        type="password"
                        placeholder="Введите код доступа администратора"
                        value={adminCode}
                        onChange={(e) => setAdminCode(e.target.value)}
                        required
                        className="font-roboto"
                        disabled={isLoading}
                      />
                      <p className="text-xs text-gray-500">
                        Обратитесь к главному администратору для получения кода
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full prevent-button-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? "Регистрация..." : "Создать аккаунт"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="mt-6 space-y-2">
          <p className="text-center text-sm text-gray-600 font-roboto">
            Регистрируясь, вы соглашаетесь с нашими условиями использования и политикой конфиденциальности PREVENT
          </p>
          
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
        </div>
      </div>
    </div>
  );
};

export default Auth;
