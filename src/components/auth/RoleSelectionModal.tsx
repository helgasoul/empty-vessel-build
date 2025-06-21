
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Stethoscope, Building, TestTube, CheckCircle } from "lucide-react";
import { useCreateUserRole, UserRole } from '@/hooks/useUserRoles';
import { useToast } from "@/hooks/use-toast";

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const RoleSelectionModal = ({ isOpen, onClose, userId }: RoleSelectionModalProps) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const createUserRole = useCreateUserRole();
  const { toast } = useToast();

  const roles = [
    {
      id: 'patient' as UserRole,
      name: 'Пациент',
      description: 'Получайте персонализированные рекомендации и отслеживайте своё здоровье',
      icon: User,
      color: 'bg-blue-100 text-blue-800',
      features: [
        'Персональные рекомендации',
        'Мониторинг здоровья',
        'Интеграция с устройствами',
        'Семейная медицинская история'
      ]
    },
    {
      id: 'doctor' as UserRole,
      name: 'Врач',
      description: 'Предоставляйте консультации и работайте с пациентами',
      icon: Stethoscope,
      color: 'bg-green-100 text-green-800',
      features: [
        'Управление пациентами',
        'Онлайн консультации',
        'Медицинские записи',
        'Расписание приемов'
      ]
    },
    {
      id: 'clinic' as UserRole,
      name: 'Клиника',
      description: 'Управляйте медицинским учреждением и предоставляйте услуги',
      icon: Building,
      color: 'bg-purple-100 text-purple-800',
      features: [
        'Управление персоналом',
        'Запись пациентов',
        'Интеграция услуг',
        'Аналитика работы'
      ]
    },
    {
      id: 'laboratory' as UserRole,
      name: 'Лаборатория',
      description: 'Предоставляйте лабораторные услуги и анализы',
      icon: TestTube,
      color: 'bg-orange-100 text-orange-800',
      features: [
        'Управление анализами',
        'Результаты исследований',
        'Интеграция с клиниками',
        'Контроль качества'
      ]
    }
  ];

  const handleRoleSelection = async () => {
    if (!selectedRole) return;

    try {
      await createUserRole.mutateAsync({
        userId,
        role: selectedRole,
      });

      toast({
        title: "Роль назначена",
        description: `Вам была назначена роль: ${roles.find(r => r.id === selectedRole)?.name}`,
      });

      onClose();
    } catch (error) {
      console.error('Error assigning role:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось назначить роль",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Выберите вашу роль в системе</DialogTitle>
          <DialogDescription>
            Это поможет нам настроить персонализированный опыт использования платформы PREVENT
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {roles.map((role) => {
            const IconComponent = role.icon;
            const isSelected = selectedRole === role.id;
            
            return (
              <Card
                key={role.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? 'ring-2 ring-purple-500 bg-purple-50' : ''
                }`}
                onClick={() => setSelectedRole(role.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-gray-100">
                        <IconComponent className="w-6 h-6 text-gray-700" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{role.name}</CardTitle>
                        <Badge className={role.color} variant="secondary">
                          {role.id === 'doctor' ? 'Требует верификации' : 'Без верификации'}
                        </Badge>
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle className="w-6 h-6 text-purple-500" />
                    )}
                  </div>
                  <CardDescription className="mt-2">{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Возможности:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {role.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex justify-between items-center mt-6 pt-6 border-t">
          <p className="text-sm text-gray-500">
            Вы сможете изменить роль позже в настройках профиля
          </p>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose}>
              Отменить
            </Button>
            <Button 
              onClick={handleRoleSelection}
              disabled={!selectedRole || createUserRole.isPending}
            >
              {createUserRole.isPending ? "Назначение..." : "Подтвердить выбор"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoleSelectionModal;
