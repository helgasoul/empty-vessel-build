
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";
import { useMyDoctorVerification, useCreateDoctorVerification } from '@/hooks/useDoctorVerifications';
import { useToast } from "@/hooks/use-toast";

const DoctorDiplomaUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { data: verification, isLoading } = useMyDoctorVerification();
  const createVerification = useCreateDoctorVerification();
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Проверяем тип файла
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Неподдерживаемый формат файла",
          description: "Пожалуйста, загрузите файл в формате JPG, PNG или PDF",
          variant: "destructive",
        });
        return;
      }

      // Проверяем размер файла (максимум 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Файл слишком большой",
          description: "Максимальный размер файла: 10MB",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "Файл не выбран",
        description: "Пожалуйста, выберите файл диплома",
        variant: "destructive",
      });
      return;
    }

    try {
      await createVerification.mutateAsync({ diplomaFile: selectedFile });
      
      toast({
        title: "Диплом загружен",
        description: "Ваш диплом отправлен на верификацию администраторам",
      });
      
      setSelectedFile(null);
    } catch (error) {
      console.error('Error uploading diploma:', error);
      toast({
        title: "Ошибка загрузки",
        description: error instanceof Error ? error.message : "Произошла ошибка при загрузке файла",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="secondary" className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>На рассмотрении</span>
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 flex items-center space-x-1">
            <CheckCircle className="w-3 h-3" />
            <span>Одобрено</span>
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive" className="flex items-center space-x-1">
            <XCircle className="w-3 h-3" />
            <span>Отклонено</span>
          </Badge>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Clock className="w-8 h-8 animate-spin mx-auto mb-2 text-gray-500" />
              <p>Загрузка...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="w-5 h-5" />
          <span>Верификация диплома врача</span>
        </CardTitle>
        <CardDescription>
          Для получения роли врача необходимо загрузить и верифицировать диплом
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {verification ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Статус верификации</h3>
              {getStatusBadge(verification.verification_status)}
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">Файл:</span>
                <span className="text-sm">{verification.diploma_file_name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">Загружен:</span>
                <span className="text-sm">
                  {new Date(verification.upload_date).toLocaleDateString('ru-RU')}
                </span>
              </div>
              {verification.verification_date && (
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">Рассмотрен:</span>
                  <span className="text-sm">
                    {new Date(verification.verification_date).toLocaleDateString('ru-RU')}
                  </span>
                </div>
              )}
            </div>

            {verification.verification_status === 'rejected' && verification.rejection_reason && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-red-800">Причина отклонения:</h4>
                    <p className="text-sm text-red-700 mt-1">{verification.rejection_reason}</p>
                  </div>
                </div>
              </div>
            )}

            {verification.notes && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-800 mb-1">Заметки администратора:</h4>
                <p className="text-sm text-blue-700">{verification.notes}</p>
              </div>
            )}

            {verification.verification_status === 'rejected' && (
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600 mb-4">
                  Вы можете загрузить новый диплом для повторной верификации
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Диплом не загружен
            </h3>
            <p className="text-gray-600 mb-6">
              Загрузите ваш диплом для верификации и получения роли врача
            </p>
          </div>
        )}

        {(!verification || verification.verification_status === 'rejected') && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="diploma-file">Выберите файл диплома</Label>
              <Input
                id="diploma-file"
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileSelect}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Поддерживаемые форматы: JPG, PNG, PDF. Максимальный размер: 10MB
              </p>
            </div>

            {selectedFile && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    Выбранный файл:
                  </span>
                  <span className="text-sm text-blue-700">{selectedFile.name}</span>
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  Размер: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}

            <Button
              onClick={handleUpload}
              disabled={!selectedFile || createVerification.isPending}
              className="w-full"
            >
              {createVerification.isPending ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Загрузка...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Загрузить диплом
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DoctorDiplomaUpload;
