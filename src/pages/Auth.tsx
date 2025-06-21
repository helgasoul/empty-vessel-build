
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/user';
import AuthHeader from '@/components/auth/AuthHeader';
import AuthTabs from '@/components/auth/AuthTabs';
import AuthInfoSection from '@/components/auth/AuthInfoSection';
import PasswordUpdateForm from '@/components/auth/PasswordUpdateForm';

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
            <CardTitle className="text-2xl font-montserrat">Добро пожаловать в PREVENT</CardTitle>
            <CardDescription className="font-roboto">
              Ваша персональная платформа превентивной медицины
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AuthTabs
              onSignIn={handleSignIn}
              onSignUp={handleSignUp}
              onPasswordReset={handlePasswordReset}
              isLoading={isLoading}
              isResetLoading={isResetLoading}
              resetDialogOpen={resetDialogOpen}
              setResetDialogOpen={setResetDialogOpen}
              selectedRole={selectedRole}
              setSelectedRole={setSelectedRole}
              adminCode={adminCode}
              setAdminCode={setAdminCode}
            />
          </CardContent>
        </Card>

        <AuthInfoSection selectedRole={selectedRole} />
      </div>
    </div>
  );
};

export default Auth;
