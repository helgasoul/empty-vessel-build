
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Shield, UserPlus, AlertTriangle, Copy, CheckCircle } from "lucide-react";
import { useCreateUserRole, useDeleteUserRole, AppRole } from '@/hooks/useUserRoles';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';

const AdminPanel = () => {
  const [newUserEmail, setNewUserEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<AppRole>('user');
  const [userIdForRole, setUserIdForRole] = useState('');
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

      setNewUserEmail('');
      setUserIdForRole('');
      setSelectedRole('user');
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
          <h3 className="text-lg font-semibold">Назначение ролей</h3>
          
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
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-amber-800">Важно</h4>
              <p className="text-sm text-amber-700 mt-1">
                Права администратора дают полный доступ к системе. Назначайте их только доверенным пользователям.
                User ID можно найти в Supabase Dashboard → Authentication → Users.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminPanel;
