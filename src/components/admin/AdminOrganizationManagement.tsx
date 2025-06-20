
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, TestTube, Search, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OrganizationVerification {
  id: string;
  organization_id: string;
  organization_type: 'clinic' | 'laboratory';
  organization_name: string;
  verification_status: 'pending' | 'approved' | 'rejected' | 'suspended';
  verified_by?: string;
  verification_date?: string;
  rejection_reason?: string;
  documents_submitted: any[];
  notes?: string;
  created_at: string;
  contact_email: string;
  contact_phone: string;
}

const AdminOrganizationManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  // Mock data - в реальном приложении это будет загружаться из базы данных
  const mockVerifications: OrganizationVerification[] = [
    {
      id: '1',
      organization_id: 'clinic1',
      organization_type: 'clinic',
      organization_name: 'Медицинский центр "Здоровье"',
      verification_status: 'pending',
      documents_submitted: [
        { type: 'license', name: 'Лицензия на медицинскую деятельность' },
        { type: 'certificate', name: 'Сертификат аккредитации' }
      ],
      created_at: '2025-06-20T09:00:00Z',
      contact_email: 'admin@zdravie.ru',
      contact_phone: '+7 (495) 123-45-67'
    },
    {
      id: '2',
      organization_id: 'lab1',
      organization_type: 'laboratory',
      organization_name: 'Лаборатория "МедТест"',
      verification_status: 'approved',
      verified_by: 'admin@prevent.com',
      verification_date: '2025-06-18T14:30:00Z',
      documents_submitted: [
        { type: 'license', name: 'Лицензия лаборатории' },
        { type: 'iso', name: 'Сертификат ISO 15189' }
      ],
      created_at: '2025-06-15T11:20:00Z',
      contact_email: 'info@medtest.ru',
      contact_phone: '+7 (812) 987-65-43'
    },
    {
      id: '3',
      organization_id: 'clinic2',
      organization_type: 'clinic',
      organization_name: 'Клиника "Альфа-Мед"',
      verification_status: 'rejected',
      rejection_reason: 'Неполный пакет документов',
      verified_by: 'admin@prevent.com',
      verification_date: '2025-06-19T16:45:00Z',
      documents_submitted: [
        { type: 'license', name: 'Лицензия на медицинскую деятельность' }
      ],
      created_at: '2025-06-17T13:15:00Z',
      contact_email: 'contact@alpha-med.ru',
      contact_phone: '+7 (495) 789-01-23'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'suspended': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Ожидает проверки';
      case 'approved': return 'Одобрено';
      case 'rejected': return 'Отклонено';
      case 'suspended': return 'Приостановлено';
      default: return 'Неизвестно';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'suspended': return <AlertTriangle className="w-4 h-4" />;
      default: return null;
    }
  };

  const handleApprove = (id: string) => {
    toast({
      title: "Организация одобрена",
      description: "Организация успешно прошла верификацию",
    });
  };

  const handleReject = (id: string) => {
    toast({
      title: "Организация отклонена",
      description: "Запрос на верификацию отклонен",
      variant: "destructive",
    });
  };

  const handleSuspend = (id: string) => {
    toast({
      title: "Организация приостановлена",
      description: "Доступ организации временно приостановлен",
      variant: "destructive",
    });
  };

  const filteredVerifications = mockVerifications.filter(verification => {
    const matchesSearch = verification.organization_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         verification.contact_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || verification.verification_status === filterStatus;
    const matchesType = filterType === 'all' || verification.organization_type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const pendingCount = mockVerifications.filter(v => v.verification_status === 'pending').length;
  const approvedCount = mockVerifications.filter(v => v.verification_status === 'approved').length;
  const rejectedCount = mockVerifications.filter(v => v.verification_status === 'rejected').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Управление организациями</h2>
          <p className="text-gray-600">Верификация и управление клиниками и лабораториями</p>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{pendingCount}</p>
                <p className="text-sm text-gray-600">Ожидают проверки</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{approvedCount}</p>
                <p className="text-sm text-gray-600">Одобрено</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{rejectedCount}</p>
                <p className="text-sm text-gray-600">Отклонено</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Building className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{mockVerifications.length}</p>
                <p className="text-sm text-gray-600">Всего заявок</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Фильтры */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Поиск организаций</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Поиск по названию или email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status-filter">Статус</Label>
              <select
                id="status-filter"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">Все статусы</option>
                <option value="pending">Ожидает проверки</option>
                <option value="approved">Одобрено</option>
                <option value="rejected">Отклонено</option>
                <option value="suspended">Приостановлено</option>
              </select>
            </div>
            <div>
              <Label htmlFor="type-filter">Тип</Label>
              <select
                id="type-filter"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">Все типы</option>
                <option value="clinic">Клиники</option>
                <option value="laboratory">Лаборатории</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Список организаций */}
      <Card>
        <CardHeader>
          <CardTitle>Заявки на верификацию</CardTitle>
          <CardDescription>
            Найдено организаций: {filteredVerifications.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredVerifications.map((verification) => (
              <div key={verification.id} className="border rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {verification.organization_type === 'clinic' ? 
                      <Building className="w-5 h-5 text-blue-600" /> : 
                      <TestTube className="w-5 h-5 text-purple-600" />
                    }
                    <div>
                      <h3 className="font-semibold text-lg">{verification.organization_name}</h3>
                      <p className="text-sm text-gray-600">
                        {verification.organization_type === 'clinic' ? 'Клиника' : 'Лаборатория'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(verification.verification_status)}
                    <Badge className={getStatusColor(verification.verification_status)}>
                      {getStatusText(verification.verification_status)}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label className="text-sm font-medium">Контактная информация</Label>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Email: {verification.contact_email}</p>
                      <p>Телефон: {verification.contact_phone}</p>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Подача заявки</Label>
                    <p className="text-sm text-gray-600">
                      {new Date(verification.created_at).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                </div>

                {/* Документы */}
                <div className="mb-4">
                  <Label className="text-sm font-medium">Поданные документы</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {verification.documents_submitted.map((doc, index) => (
                      <Badge key={index} variant="outline">
                        {doc.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Результат верификации */}
                {verification.verification_status === 'approved' && verification.verification_date && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
                    <p className="text-sm text-green-800">
                      <strong>Одобрено:</strong> {new Date(verification.verification_date).toLocaleDateString('ru-RU')} 
                      {verification.verified_by && ` пользователем ${verification.verified_by}`}
                    </p>
                  </div>
                )}

                {verification.verification_status === 'rejected' && verification.rejection_reason && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
                    <p className="text-sm text-red-800">
                      <strong>Причина отклонения:</strong> {verification.rejection_reason}
                    </p>
                  </div>
                )}

                {verification.notes && (
                  <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded">
                    <Label className="text-sm font-medium">Заметки</Label>
                    <p className="text-sm text-gray-700 mt-1">{verification.notes}</p>
                  </div>
                )}

                {/* Действия */}
                <div className="flex space-x-2">
                  {verification.verification_status === 'pending' && (
                    <>
                      <Button 
                        size="sm" 
                        onClick={() => handleApprove(verification.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Одобрить
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleReject(verification.id)}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Отклонить
                      </Button>
                    </>
                  )}
                  
                  {verification.verification_status === 'approved' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleSuspend(verification.id)}
                    >
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      Приостановить
                    </Button>
                  )}
                  
                  <Button size="sm" variant="outline">
                    Подробности
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrganizationManagement;
