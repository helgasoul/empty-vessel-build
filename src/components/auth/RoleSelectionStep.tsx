
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Stethoscope, Building, TestTube, CheckCircle } from "lucide-react";
import { useCreateUserRole } from '@/hooks/useUserRoles';
import { useToast } from "@/hooks/use-toast";
import DoctorDiplomaUpload from '@/components/doctor/DoctorDiplomaUpload';

interface RoleSelectionStepProps {
  userId: string;
  onComplete: () => void;
}

const RoleSelectionStep = ({ userId, onComplete }: RoleSelectionStepProps) => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showDiplomaUpload, setShowDiplomaUpload] = useState(false);
  const createUserRole = useCreateUserRole();
  const { toast } = useToast();

  const roles = [
    {
      id: 'patient',
      name: 'Пациент',
      description: 'Получайте персонализированные рекомендации и отслеживайте своё здоровье',
      icon: User,
      color: 'bg-blue-100 text-blue-800',
      requiresVerification: false,
    },
    {
      id: 'doctor',
      name: 'Врач',
      description: 'Предоставляйте консультации и работайте с пациентами',
      icon: Stethoscope,
      color: 'bg-green-100 text-green-800',
      requiresVerification: true,
    },
    {
      id: 'clinic',
      name: 'Клиника',
      description: 'Управляйте медицинским учреждением и предоставляйте услуги',
      icon: Building,
      color: 'bg-purple-100 text-purple-800',
      requiresVerification: false,
    },
    {
      id: 'laboratory',
      name: 'Лаборатория',
      description: 'Предоставляйте лабораторные услуги и анализы',
      icon: TestTube,
      color: 'bg-orange-100 text-orange-800',
      requiresVerification: false,
    },
  ];

  const handleRoleSelection = async (roleId: string) => {
    if (roleId === 'doctor') {
      setSelectedRole(roleId);
      setShowDiplomaUpload(true);
      return;
    }

    try {
      await createUserRole.mutateAsync({
        userId,
        role: roleId as any,
      });

      toast({
        title: "Роль назначена",
        description: `Вам была назначена роль: ${roles.find(r => r.id === roleId)?.name}`,
      });

      onComplete();
    } catch (error) {
      console.error('Error assigning role:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось назначить роль",
        variant: "destructive",
      });
    }
  };

  const handleDoctorRoleWithoutDiploma = async () => {
    try {
      await createUserRole.mutateAsync({
        userId,
        role: 'doctor',
      });

      toast({
        title: "Роль врача назначена",
        description: "Вы можете загрузить диплом позже для полной верификации",
      });

      onComplete();
    } catch (error) {
      console.error('Error assigning doctor role:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось назначить роль",
        variant: "destructive",
      });
    }
  };

  if (showDiplomaUpload) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Stethoscope className="w-5 h-5" />
              <span>Роль врача</span>
            </CardTitle>
            <CardDescription>
              Для полной верификации роли врача требуется загрузка диплома
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Опции регистрации врача:</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Загрузить диплом сейчас</p>
                    <p className="text-sm text-gray-600">
                      Рекомендуется для полного доступа ко всем функциям
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Продолжить без диплома</p>
                    <p className="text-sm text-gray-600">
                      Вы сможете загрузить диплом позже в профиле
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button onClick={handleDoctorRoleWithoutDiploma} variant="outline" className="flex-1">
                Продолжить без диплома
              </Button>
              <Button onClick={() => setShowDiplomaUpload(false)} variant="outline">
                Назад
              </Button>
            </div>
          </CardContent>
        </Card>

        <DoctorDiplomaUpload />

        <div className="flex justify-center">
          <Button onClick={onComplete} className="px-8">
            Завершить регистрацию
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Выберите вашу роль</h2>
        <p className="text-gray-600">
          Это поможет нам настроить персонализированный опыт использования платформы
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((role) => {
          const IconComponent = role.icon;
          return (
            <Card
              key={role.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedRole === role.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedRole(role.id)}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-gray-100">
                      <IconComponent className="w-6 h-6 text-gray-700" />
                    </div>
                    <span>{role.name}</span>
                  </div>
                  <Badge className={role.color}>
                    {role.requiresVerification ? 'Требует верификации' : 'Без верификации'}
                  </Badge>
                </CardTitle>
                <CardDescription>{role.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRoleSelection(role.id);
                  }}
                  disabled={createUserRole.isPending}
                  className="w-full"
                  variant={selectedRole === role.id ? "default" : "outline"}
                >
                  {createUserRole.isPending ? "Назначение..." : "Выбрать роль"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-500">
          Вы сможете изменить роль позже в настройках профиля
        </p>
      </div>
    </div>
  );
};

export default RoleSelectionStep;
