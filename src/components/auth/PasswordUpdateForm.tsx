
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield } from 'lucide-react';

interface PasswordUpdateFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

const PasswordUpdateForm = ({ onSubmit, isLoading }: PasswordUpdateFormProps) => {
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
            <form onSubmit={onSubmit} className="space-y-4">
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
};

export default PasswordUpdateForm;
