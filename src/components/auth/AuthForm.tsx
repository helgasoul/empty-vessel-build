
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { UserRole } from '@/types/user';
import RoleSelector from './RoleSelector';

interface AuthFormProps {
  isLogin: boolean;
  formData: {
    email: string;
    password: string;
    fullName: string;
    confirmPassword: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    email: string;
    password: string;
    fullName: string;
    confirmPassword: string;
  }>>;
  selectedRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  adminCode: string;
  onAdminCodeChange: (code: string) => void;
  error: string;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const AuthForm = ({
  isLogin,
  formData,
  setFormData,
  selectedRole,
  onRoleChange,
  adminCode,
  onAdminCodeChange,
  error,
  isLoading,
  onSubmit
}: AuthFormProps) => {
  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2 text-red-800">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
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

            <RoleSelector
              selectedRole={selectedRole}
              onRoleChange={onRoleChange}
              adminCode={adminCode}
              onAdminCodeChange={onAdminCodeChange}
              isLoading={isLoading}
            />
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
    </div>
  );
};

export default AuthForm;
