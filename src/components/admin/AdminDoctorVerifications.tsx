
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, FileText, CheckCircle, XCircle, Clock, Eye, Download, User } from "lucide-react";
import { useDoctorVerifications, useUpdateVerificationStatus } from '@/hooks/useDoctorVerifications';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

const AdminDoctorVerifications = () => {
  const { data: verifications, isLoading } = useDoctorVerifications();
  const updateStatus = useUpdateVerificationStatus();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedVerification, setSelectedVerification] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [notes, setNotes] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const handleApprove = async (verificationId: string) => {
    try {
      await updateStatus.mutateAsync({
        verificationId,
        status: 'approved',
        notes: notes.trim() || undefined,
      });

      toast({
        title: "Диплом одобрен",
        description: "Верификация диплома успешно одобрена",
      });

      setSelectedVerification(null);
      setNotes('');
    } catch (error) {
      console.error('Error approving verification:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось одобрить верификацию",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (verificationId: string) => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Укажите причину отклонения",
        description: "Необходимо указать причину отклонения",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateStatus.mutateAsync({
        verificationId,
        status: 'rejected',
        rejectionReason: rejectionReason.trim(),
        notes: notes.trim() || undefined,
      });

      toast({
        title: "Диплом отклонен",
        description: "Верификация диплома отклонена",
      });

      setSelectedVerification(null);
      setRejectionReason('');
      setNotes('');
    } catch (error) {
      console.error('Error rejecting verification:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось отклонить верификацию",
        variant: "destructive",
      });
    }
  };

  const handleDownloadFile = async (filePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('diplomas')
        .download(filePath);

      if (error) {
        throw error;
      }

      // Создаем URL для скачивания
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось скачать файл",
        variant: "destructive",
      });
    }
  };

  const filteredVerifications = verifications?.filter(verification => {
    const matchesSearch = verification.diploma_file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         verification.user_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || verification.verification_status === filterStatus;
    return matchesSearch && matchesStatus;
  }) || [];

  const pendingCount = verifications?.filter(v => v.verification_status === 'pending').length || 0;
  const approvedCount = verifications?.filter(v => v.verification_status === 'approved').length || 0;
  const rejectedCount = verifications?.filter(v => v.verification_status === 'rejected').length || 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Clock className="w-8 h-8 animate-spin mx-auto mb-2 text-gray-500" />
          <p>Загрузка верификаций...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Верификация дипломов врачей</h2>
          <p className="text-gray-600">Управление заявками на верификацию дипломов</p>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{verifications?.length || 0}</p>
                <p className="text-sm text-gray-600">Всего заявок</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{pendingCount}</p>
                <p className="text-sm text-gray-600">На рассмотрении</p>
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
      </div>

      {/* Фильтры */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Поиск</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Поиск по имени файла или ID пользователя..."
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
                <option value="pending">На рассмотрении</option>
                <option value="approved">Одобрено</option>
                <option value="rejected">Отклонено</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Список верификаций */}
      <Card>
        <CardHeader>
          <CardTitle>Заявки на верификацию</CardTitle>
          <CardDescription>
            Найдено заявок: {filteredVerifications.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredVerifications.map((verification) => (
              <div key={verification.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-500" />
                    <div>
                      <h3 className="font-semibold">{verification.diploma_file_name}</h3>
                      <p className="text-sm text-gray-600">
                        ID пользователя: {verification.user_id.slice(-8)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(verification.verification_status)}
                      <Badge className={getStatusColor(verification.verification_status)}>
                        {verification.verification_status === 'pending' && 'На рассмотрении'}
                        {verification.verification_status === 'approved' && 'Одобрено'}
                        {verification.verification_status === 'rejected' && 'Отклонено'}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>Загружен: {new Date(verification.upload_date).toLocaleString('ru-RU')}</span>
                  <span>Размер: {(verification.file_size / 1024 / 1024).toFixed(2)} MB</span>
                </div>

                {verification.rejection_reason && (
                  <div className="bg-red-50 border border-red-200 rounded p-3 mb-3">
                    <p className="text-sm text-red-700">
                      <strong>Причина отклонения:</strong> {verification.rejection_reason}
                    </p>
                  </div>
                )}

                {verification.notes && (
                  <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3">
                    <p className="text-sm text-blue-700">
                      <strong>Заметки:</strong> {verification.notes}
                    </p>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownloadFile(verification.diploma_file_path, verification.diploma_file_name)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Скачать
                  </Button>
                  
                  {verification.verification_status === 'pending' && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm"
                          onClick={() => {
                            setSelectedVerification(verification);
                            setRejectionReason('');
                            setNotes('');
                          }}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Рассмотреть
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Рассмотрение заявки</DialogTitle>
                          <DialogDescription>
                            {verification.diploma_file_name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="notes">Заметки (необязательно)</Label>
                            <Textarea
                              id="notes"
                              placeholder="Дополнительные заметки..."
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="rejection-reason">Причина отклонения (если отклоняете)</Label>
                            <Textarea
                              id="rejection-reason"
                              placeholder="Укажите причину отклонения..."
                              value={rejectionReason}
                              onChange={(e) => setRejectionReason(e.target.value)}
                            />
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button 
                              onClick={() => handleApprove(verification.id)}
                              disabled={updateStatus.isPending}
                              className="flex-1 bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Одобрить
                            </Button>
                            <Button 
                              onClick={() => handleReject(verification.id)}
                              disabled={updateStatus.isPending || !rejectionReason.trim()}
                              variant="destructive"
                              className="flex-1"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Отклонить
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDoctorVerifications;
