
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, UserPlus, Building, TestTube, Users, Copy, CheckCircle } from "lucide-react";
import { useCreateUserRole, useDeleteUserRole, AppRole } from '@/hooks/useUserRoles';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';

const RoleManagementPanel = () => {
  const [userIdForRole, setUserIdForRole] = useState('');
  const [selectedRole, setSelectedRole] = useState<AppRole>('patient');
  const [copiedUserId, setCopiedUserId] = useState(false);
  const { user } = useAuth();
  const createUserRole = useCreateUserRole();
  const deleteUserRole = useDeleteUserRole();
  const { toast } = useToast();

  const handleCreateRole = async () => {
    if (!userIdForRole.trim()) {
      toast({
        title: "Ошибка",
        description: "Введите User ID пользователя",
        variant: "destructive",
      });
      return;
    }

    try {
      await createUserRole.mutateAsync({
        userId: userIdForRole.trim(),
        role: selectedRole
      });

      toast({
        title: "Роль назначена",
        description: `Роль ${selectedRole} назначена пользователю`,
      });

      setUserIdForRole('');
      setSelectedRole('patient');
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось назначить роль пользователю",
        variant: "destructive",
      });
    }
  };

  const copyUserId = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id);
      setCopiedUserId(true);
      setTimeout(() => setCopiedUserId(false), 2000);
      toast({
        title: "Скопировано",
        description: "User ID скопирован в буфер обмена",
      });
    }
  };

  const assignAdminToSelf = async () => {
    if (!user?.id) return;
    
    try {
      await createUserRole.mutateAsync({
        userId: user.id,
        role: 'admin'
      });

      toast({
        title: "Роль администратора назначена",
        description: "Вам успешно назначена роль администратора",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось назначить роль администратора",
        variant: "destructive",
      });
    }
  };

  const roleDescriptions = {
    patient: {
      icon: Users,
      title: "Пациент",
      description: "Может управлять своими медицинскими данными, записываться на приемы, просматривать результаты анализов",
      color: "bg-blue-50 border-blue-200"
    },
    doctor: {
      icon: Shield,
      title: "Врач",
      description: "Может проводить консультации, просматривать данные пациентов (с разрешения), управлять расписанием",
      color: "bg-green-50 border-green-200"
    },
    clinic: {
      icon: Building,
      title: "Клиника",
      description: "Может управлять расписанием врачей, записями пациентов, интеграциями с системами клиники",
      color: "bg-purple-50 border-purple-200"
    },
    laboratory: {
      icon: TestTube,
      title: "Лаборатория",
      description: "Может загружать результаты анализов, управлять типами тестов, интеграциями с лабораторным оборудованием",
      color: "bg-orange-50 border-orange-200"
    },
    admin: {
      icon: Shield,
      title: "Администратор",
      description: "Полные права: управление всеми пользователями, системой, настройками безопасности",
      color: "bg-red-50 border-red-200"
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-blue-600" />
          <span>Управление ролями</span>
        </CardTitle>
        <CardDescription>
          Управление ролями пользователей в системе здравоохранения
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="assign" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="assign">Назначение ролей</TabsTrigger>
            <TabsTrigger value="roles">Описание ролей</TabsTrigger>
          </TabsList>

          <TabsContent value="assign" className="space-y-6">
            {/* Первоначальная настройка администратора */}
            {user && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-blue-800">Первоначальная настройка</h4>
                    <p className="text-sm text-blue-700 mt-1 mb-3">
                      Если вы первый администратор, назначьте себе роль администратора:
                    </p>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1">
                        <Label className="text-sm">Ваш User ID:</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Input value={user.id} readOnly className="font-mono text-xs" />
                          <Button 
                            onClick={copyUserId} 
                            variant="outline" 
                            size="sm"
                            className="shrink-0"
                          >
                            {copiedUserId ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                      <Button 
                        onClick={assignAdminToSelf}
                        disabled={createUserRole.isPending}
                        className="shrink-0"
                      >
                        Стать администратором
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Назначение ролей */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Назначение ролей пользователям</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="userIdForRole">User ID пользователя</Label>
                  <Input
                    id="userIdForRole"
                    placeholder="Введите User ID..."
                    value={userIdForRole}
                    onChange={(e) => setUserIdForRole(e.target.value)}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    User ID можно найти в таблице auth.users
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="role">Роль</Label>
                  <Select value={selectedRole} onValueChange={(value: AppRole) => setSelectedRole(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="patient">Пациент</SelectItem>
                      <SelectItem value="doctor">Врач</SelectItem>
                      <SelectItem value="clinic">Клиника</SelectItem>
                      <SelectItem value="laboratory">Лаборатория</SelectItem>
                      <SelectItem value="admin">Администратор</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end">
                  <Button 
                    onClick={handleCreateRole}
                    disabled={createUserRole.isPending}
                    className="w-full"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Назначить роль
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="roles" className="space-y-4">
            <h3 className="text-lg font-semibold">Роли в системе здравоохранения</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(roleDescriptions).map(([role, config]) => {
                const IconComponent = config.icon;
                return (
                  <Card key={role} className={config.color}>
                    <CardContent className="pt-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <IconComponent className="w-5 h-5" />
                        <Badge variant="outline">{role}</Badge>
                        <span className="text-sm font-medium">{config.title}</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {config.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RoleManagementPanel;
