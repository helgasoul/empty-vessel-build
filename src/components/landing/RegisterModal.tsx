
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User, UserCheck, Stethoscope, AlertCircle } from "lucide-react";
import { UserRole } from "@/types/user";

export interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedRole?: UserRole;
}

const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  preselectedRole = 'patient'
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [selectedRole, setSelectedRole] = useState<UserRole>(preselectedRole);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const roleOptions = [
    {
      value: 'patient' as UserRole,
      label: 'Пациент',
      description: 'Получайте персонализированные рекомендации по здоровью',
      icon: User
    },
    {
      value: 'doctor' as UserRole,
      label: 'Врач',
      description: 'Управляйте практикой и анализируйте данные пациентов',
      icon: Stethoscope
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (formData.password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }

    setIsLoading(true);

    try {
      // Mock registration - replace with actual auth logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store user role in localStorage for demo
      localStorage.setItem('userRole', selectedRole);
      
      console.log('User registered:', { 
        ...formData, 
        role: selectedRole,
        password: '[hidden]' 
      });
      
      onClose();
      
      // Redirect based on role
      if (selectedRole === 'doctor') {
        window.location.href = '/doctor/dashboard';
      } else {
        window.location.href = '/patient/dashboard';
      }
    } catch (err) {
      setError('Ошибка регистрации. Попробуйте еще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Создать аккаунт PREVENT</DialogTitle>
          <DialogDescription>
            Присоединяйтесь к платформе персонализированной превентивной медицины
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2 text-red-800">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Полное имя</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              placeholder="Анна Иванова"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="anna@example.com"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              placeholder="Минимум 6 символов"
              required
              disabled={isLoading}
              minLength={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              placeholder="Повторите пароль"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Выберите роль</Label>
            <RadioGroup
              value={selectedRole}
              onValueChange={(value) => setSelectedRole(value as UserRole)}
              disabled={isLoading}
            >
              {roleOptions.map((role) => {
                const Icon = role.icon;
                return (
                  <div
                    key={role.value}
                    className={`
                      flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors
                      ${selectedRole === role.value 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <RadioGroupItem value={role.value} id={role.value} />
                    <Icon className="w-5 h-5 text-gray-600" />
                    <div className="flex-1">
                      <Label htmlFor={role.value} className="font-medium cursor-pointer">
                        {role.label}
                      </Label>
                      <p className="text-xs text-gray-500 mt-1">{role.description}</p>
                    </div>
                  </div>
                );
              })}
            </RadioGroup>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Создание аккаунта...
              </>
            ) : (
              'Создать аккаунт'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterModal;
