
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/user';
import AuthHeader from '@/components/auth/AuthHeader';
import PasswordUpdateForm from '@/components/auth/PasswordUpdateForm';
import AuthForm from '@/components/auth/AuthForm';
import AuthModeToggle from '@/components/auth/AuthModeToggle';
import AuthInfoSection from '@/components/auth/AuthInfoSection';
import DebugInfoSection from '@/components/auth/DebugInfoSection';

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

  const handleRoleChange = (value: UserRole) => {
    console.log('🔄 Роль изменена на:', value);
    setSelectedRole(value);
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

  const handleModeToggle = () => {
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
            <AuthForm
              isLogin={isLogin}
              formData={formData}
              setFormData={setFormData}
              selectedRole={selectedRole}
              onRoleChange={handleRoleChange}
              adminCode={adminCode}
              onAdminCodeChange={setAdminCode}
              error={error}
              isLoading={isLoading}
              onSubmit={isLogin ? handleSignIn : handleSignUp}
            />

            <AuthModeToggle
              isLogin={isLogin}
              onToggle={handleModeToggle}
            />

            <DebugInfoSection
              isLogin={isLogin}
              selectedRole={selectedRole}
              adminCode={adminCode}
            />

            <AuthInfoSection selectedRole={selectedRole} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
