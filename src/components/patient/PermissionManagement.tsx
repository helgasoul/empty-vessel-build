
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Shield, UserCheck, Clock, AlertTriangle } from "lucide-react";
import { usePatientPermissions, useGrantPermission, useRevokePermission } from '@/hooks/usePatientDoctorPermissions';
import { useToast } from '@/hooks/use-toast';

const DATA_TYPES = [
  { id: 'basic_profile', label: 'Базовый профиль' },
  { id: 'questionnaires', label: 'Анкеты и опросники' },
  { id: 'lab_results', label: 'Результаты анализов' },
  { id: 'genetic_data', label: 'Генетические данные' },
  { id: 'medical_images', label: 'Медицинские изображения' },
];

const PermissionManagement = () => {
  const { toast } = useToast();
  const { data: permissions, isLoading } = usePatientPermissions();
  const grantPermission = useGrantPermission();
  const revokePermission = useRevokePermission();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    doctorEmail: '',
    permissionType: 'read' as 'read' | 'write' | 'full',
    role: 'doctor' as 'doctor' | 'clinic' | 'laboratory',
    dataTypes: [] as string[],
    expiresInDays: '',
  });

  const handleGrantPermission = async () => {
    if (!formData.doctorEmail || formData.dataTypes.length === 0) {
      toast({
        title: "Ошибка",
        description: "Заполните все обязательные поля",
        variant: "destructive",
      });
      return;
    }

    // В реальном приложении здесь был бы поиск врача по email
    // Пока используем фиктивный ID
    const doctorId = "doctor-uuid-here";

    const expires_at = formData.expiresInDays 
      ? new Date(Date.now() + parseInt(formData.expiresInDays) * 24 * 60 * 60 * 1000).toISOString()
      : undefined;

    await grantPermission.mutateAsync({
      granted_to_id: doctorId,
      granted_to_role: formData.role,
      permission_type: formData.permissionType,
      data_types: formData.dataTypes,
      expires_at,
    });

    setIsDialogOpen(false);
    setFormData({
      doctorEmail: '',
      permissionType: 'read',
      role: 'doctor',
      dataTypes: [],
      expiresInDays: '',
    });
  };

  const handleRevokePermission = async (permissionId: string) => {
    await revokePermission.mutateAsync(permissionId);
  };

  const handleDataTypeChange = (dataTypeId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      dataTypes: checked 
        ? [...prev.dataTypes, dataTypeId]
        : prev.dataTypes.filter(id => id !== dataTypeId)
    }));
  };

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Управление доступом к данным</h2>
          <p className="text-gray-600 mt-1">
            Контролируйте, кто имеет доступ к вашим медицинским данным
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Предоставить доступ</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Предоставить доступ врачу</DialogTitle>
              <DialogDescription>
                Укажите врача и выберите типы данных для предоставления доступа
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="doctor-email">Email врача</Label>
                <Input
                  id="doctor-email"
                  type="email"
                  placeholder="doctor@example.com"
                  value={formData.doctorEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, doctorEmail: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Тип разрешения</Label>
                <Select value={formData.permissionType} onValueChange={(value: any) => setFormData(prev => ({ ...prev, permissionType: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="read">Только просмотр</SelectItem>
                    <SelectItem value="write">Просмотр и запись</SelectItem>
                    <SelectItem value="full">Полный доступ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Типы данных</Label>
                <div className="space-y-2">
                  {DATA_TYPES.map((dataType) => (
                    <div key={dataType.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={dataType.id}
                        checked={formData.dataTypes.includes(dataType.id)}
                        onCheckedChange={(checked) => handleDataTypeChange(dataType.id, checked as boolean)}
                      />
                      <Label htmlFor={dataType.id} className="text-sm">
                        {dataType.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expires-days">Срок действия (дни)</Label>
                <Input
                  id="expires-days"
                  type="number"
                  placeholder="30"
                  value={formData.expiresInDays}
                  onChange={(e) => setFormData(prev => ({ ...prev, expiresInDays: e.target.value }))}
                />
              </div>

              <Button 
                onClick={handleGrantPermission} 
                className="w-full"
                disabled={grantPermission.isPending}
              >
                {grantPermission.isPending ? 'Предоставление...' : 'Предоставить доступ'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {permissions?.map((permission) => (
          <Card key={permission.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {permission.granted_to_role === 'doctor' ? 'Врач' : 
                       permission.granted_to_role === 'clinic' ? 'Клиника' : 'Лаборатория'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Доступ: {permission.permission_type === 'read' ? 'Только просмотр' :
                              permission.permission_type === 'write' ? 'Просмотр и запись' : 'Полный доступ'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="flex flex-wrap gap-1">
                    {permission.data_types.map((dataType) => (
                      <Badge key={dataType} variant="secondary" className="text-xs">
                        {DATA_TYPES.find(dt => dt.id === dataType)?.label || dataType}
                      </Badge>
                    ))}
                  </div>
                  
                  {permission.expires_at && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      Истекает: {new Date(permission.expires_at).toLocaleDateString()}
                    </div>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRevokePermission(permission.id)}
                    disabled={revokePermission.isPending}
                  >
                    Отозвать
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {permissions?.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Нет активных разрешений
              </h3>
              <p className="text-gray-600">
                Вы еще не предоставили доступ к своим данным ни одному врачу
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PermissionManagement;
