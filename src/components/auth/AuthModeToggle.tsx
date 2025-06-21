
import React from 'react';
import { UserRole } from '@/types/user';

interface AuthModeToggleProps {
  isLogin: boolean;
  onToggle: () => void;
}

const AuthModeToggle = ({ isLogin, onToggle }: AuthModeToggleProps) => {
  return (
    <div className="text-center">
      <button
        type="button"
        onClick={onToggle}
        className="text-purple-600 hover:text-purple-700 text-sm font-medium"
      >
        {isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войдите'}
      </button>
    </div>
  );
};

export default AuthModeToggle;
