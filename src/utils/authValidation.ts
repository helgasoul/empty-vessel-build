
import { UserRole } from '@/types/user';

interface FormData {
  email: string;
  password: string;
  fullName: string;
  confirmPassword: string;
}

export const validateAuthForm = (
  formData: FormData,
  isLogin: boolean,
  selectedRole: UserRole,
  adminCode: string
): string | null => {
  if (!isLogin) {
    if (!formData.fullName.trim()) {
      return 'Введите полное имя';
    }
    if (formData.password !== formData.confirmPassword) {
      return 'Пароли не совпадают';
    }
    if (selectedRole === 'admin' && !adminCode.trim()) {
      return 'Введите код администратора';
    }
    if (selectedRole === 'admin' && adminCode !== 'PREVENT_ADMIN_2024') {
      return 'Неверный код администратора';
    }
  }
  
  if (!formData.email.trim()) {
    return 'Введите email';
  }
  if (!formData.password.trim()) {
    return 'Введите пароль';
  }
  
  return null;
};

export const getAuthErrorMessage = (error: any): string => {
  if (error.message === 'Invalid login credentials') {
    return 'Неверный email или пароль';
  } else if (error.message.includes('Email not confirmed')) {
    return 'Пожалуйста, подтвердите ваш email адрес';
  } else if (error.message.includes('Too many requests')) {
    return 'Слишком много попыток входа. Попробуйте позже';
  } else if (error.message === 'User already registered') {
    return 'Пользователь с таким email уже зарегистрирован';
  } else if (error.message.includes('Password should be at least')) {
    return 'Пароль должен содержать минимум 6 символов';
  } else if (error.message.includes('Invalid email')) {
    return 'Пожалуйста, введите корректный email адрес';
  }
  return error.message;
};
