
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';
import { validateAuthForm, getAuthErrorMessage } from '@/utils/authValidation';

interface FormData {
  email: string;
  password: string;
  fullName: string;
  confirmPassword: string;
}

export const useAuthHandlers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async (
    e: React.FormEvent<HTMLFormElement>,
    formData: FormData
  ) => {
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
        setError(getAuthErrorMessage(error));
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

  const handleSignUp = async (
    e: React.FormEvent<HTMLFormElement>,
    formData: FormData,
    selectedRole: UserRole
  ) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    console.log('📝 Отправка формы регистрации:', {
      email: formData.email,
      fullName: formData.fullName,
      selectedRole
    });

    const validationError = validateAuthForm(formData, false, selectedRole, '');
    if (validationError) {
      setError(validationError);
      setIsLoading(false);
      return;
    }

    try {
      if (formData.password.length < 6) {
        setError('Пароль должен содержать минимум 6 символов');
        setIsLoading(false);
        return;
      }

      const { error } = await signUp(formData.email, formData.password, formData.fullName, selectedRole);

      if (error) {
        console.error('Ошибка регистрации:', error);
        setError(getAuthErrorMessage(error));
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

  return {
    isLoading,
    error,
    setError,
    handleSignIn,
    handleSignUp,
    handlePasswordUpdate
  };
};
