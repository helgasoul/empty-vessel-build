
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Shield, UserPlus, Trash2 } from "lucide-react";
import { useCreateUserRole, useDeleteUserRole, AppRole } from '@/hooks/useUserRoles';
import { useToast } from "@/hooks/use-toast";

const AdminPanel = () => {
  const [newUserEmail, setNewUserEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<AppRole>('user');
  const createUserRole = useCreateUserRole();
  const deleteUserRole = useDeleteUserRole();
  const { toast } = useToast();

  const handleCreateRole = async () => {
    if (!newUserEmail.trim()) {
      toast({
        title: "Ошибка",
        description: "Введите email пользователя",
        variant: "destructive",
      });
      return;
    }

    try {
      // В реальном приложении здесь нужно было бы найти пользователя по email
      // Для демонстрации используем заглушку
      await createUserRole.mutateAsync({
        userId: 'user-id-placeholder', // Здесь должен быть реальный user_id
        role: selectedRole
      });

      toast({
        title: "Роль назначена",
        description: `Роль ${selectedRole} назначена пользователю ${newUserEmail}`,
      });

      setNewUserEmail('');
      setSelectedRole('user');
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось назначить роль пользователю",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-blue-600" />
          <span>Панель администратора</span>
        </CardTitle>
        <CardDescription>
          Управление ролями пользователей и администрирование системы
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Назначение ролей */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Назначение ролей</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="userEmail">Email пользователя</Label>
              <Input
                id="userEmail"
                type="email"
                placeholder="user@example.com"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="role">Роль</Label>
              <Select value={selectedRole} onValueChange={(value: AppRole) => setSelectedRole(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Пользователь</SelectItem>
                  <SelectItem value="moderator">Модератор</SelectItem>
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

        {/* Информация о ролях */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Описание ролей</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="outline">user</Badge>
                  <span className="text-sm font-medium">Пользователь</span>
                </div>
                <p className="text-sm text-gray-600">
                  Базовые права: просмотр экспертов, консультации
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="secondary">moderator</Badge>
                  <span className="text-sm font-medium">Модератор</span>
                </div>
                <p className="text-sm text-gray-600">
                  Модерация контента, управление сообществом
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge>admin</Badge>
                  <span className="text-sm font-medium">Администратор</span>
                </div>
                <p className="text-sm text-gray-600">
                  Полные права: управление экспертами, пользователями
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Предупреждение */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <Shield className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-amber-800">Важно</h4>
              <p className="text-sm text-amber-700 mt-1">
                Права администратора дают полный доступ к системе. Назначайте их только доверенным пользователям.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminPanel;
