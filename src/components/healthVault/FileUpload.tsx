
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { MedicalFilesService } from '@/services/healthVault/MedicalFilesService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X, FileText, Image, File } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  onUploadComplete?: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadComplete }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [metadata, setMetadata] = useState({
    document_type: '',
    organ_system: '',
    medical_category: '',
    examination_date: '',
    doctor_name: '',
    clinic_name: '',
    description: '',
    tags: [] as string[]
  });

  const documentTypes = [
    'lab_results',
    'imaging',
    'prescription',
    'discharge_summary',
    'consultation_notes',
    'vaccination_record',
    'insurance_document',
    'other'
  ];

  const organSystems = [
    'cardiovascular',
    'respiratory',
    'nervous',
    'digestive',
    'endocrine',
    'immune',
    'musculoskeletal',
    'reproductive',
    'urinary',
    'other'
  ];

  const medicalCategories = [
    'diagnostics',
    'treatment',
    'prevention',
    'emergency',
    'routine_checkup',
    'follow_up',
    'surgery',
    'therapy'
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) return;

    setUploading(true);
    try {
      await MedicalFilesService.uploadFile({
        file: selectedFile,
        ...metadata
      });

      toast({
        title: 'Файл успешно загружен',
        description: 'Документ добавлен в ваше медицинское хранилище',
      });

      // Reset form
      setSelectedFile(null);
      setMetadata({
        document_type: '',
        organ_system: '',
        medical_category: '',
        examination_date: '',
        doctor_name: '',
        clinic_name: '',
        description: '',
        tags: []
      });

      onUploadComplete?.();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Ошибка загрузки',
        description: error instanceof Error ? error.message : 'Произошла ошибка при загрузке файла',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="h-6 w-6" />;
    if (file.type.includes('pdf')) return <FileText className="h-6 w-6" />;
    return <File className="h-6 w-6" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Загрузить медицинский документ
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Selection */}
        <div className="space-y-2">
          <Label htmlFor="file">Выберите файл</Label>
          {!selectedFile ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                id="file"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.dcm,.txt,.doc,.docx"
                onChange={handleFileSelect}
                className="hidden"
              />
              <label htmlFor="file" className="cursor-pointer">
                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">
                  Нажмите для выбора файла или перетащите сюда
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Поддерживаются: PDF, JPEG, PNG, DICOM, DOC, DOCX
                </p>
              </label>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getFileIcon(selectedFile)}
                <div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {selectedFile && (
          <>
            {/* Document Type */}
            <div className="space-y-2">
              <Label>Тип документа</Label>
              <Select 
                value={metadata.document_type} 
                onValueChange={(value) => setMetadata(prev => ({ ...prev, document_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тип документа" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type === 'lab_results' && 'Результаты анализов'}
                      {type === 'imaging' && 'Снимки/Изображения'}
                      {type === 'prescription' && 'Рецепт'}
                      {type === 'discharge_summary' && 'Выписка'}
                      {type === 'consultation_notes' && 'Заключение врача'}
                      {type === 'vaccination_record' && 'Прививочная карта'}
                      {type === 'insurance_document' && 'Страховой документ'}
                      {type === 'other' && 'Другое'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Organ System */}
            <div className="space-y-2">
              <Label>Система органов</Label>
              <Select 
                value={metadata.organ_system} 
                onValueChange={(value) => setMetadata(prev => ({ ...prev, organ_system: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите систему органов" />
                </SelectTrigger>
                <SelectContent>
                  {organSystems.map(system => (
                    <SelectItem key={system} value={system}>
                      {system === 'cardiovascular' && 'Сердечно-сосудистая'}
                      {system === 'respiratory' && 'Дыхательная'}
                      {system === 'nervous' && 'Нервная'}
                      {system === 'digestive' && 'Пищеварительная'}
                      {system === 'endocrine' && 'Эндокринная'}
                      {system === 'immune' && 'Иммунная'}
                      {system === 'musculoskeletal' && 'Опорно-двигательная'}
                      {system === 'reproductive' && 'Репродуктивная'}
                      {system === 'urinary' && 'Мочевыделительная'}
                      {system === 'other' && 'Другое'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Medical Category */}
            <div className="space-y-2">
              <Label>Медицинская категория</Label>
              <Select 
                value={metadata.medical_category} 
                onValueChange={(value) => setMetadata(prev => ({ ...prev, medical_category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  {medicalCategories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === 'diagnostics' && 'Диагностика'}
                      {category === 'treatment' && 'Лечение'}
                      {category === 'prevention' && 'Профилактика'}
                      {category === 'emergency' && 'Экстренная помощь'}
                      {category === 'routine_checkup' && 'Плановый осмотр'}
                      {category === 'follow_up' && 'Повторный осмотр'}
                      {category === 'surgery' && 'Хирургия'}
                      {category === 'therapy' && 'Терапия'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date">Дата обследования</Label>
                <Input
                  id="date"
                  type="date"
                  value={metadata.examination_date}
                  onChange={(e) => setMetadata(prev => ({ ...prev, examination_date: e.target.value }))}
                />
              </div>

              {/* Doctor */}
              <div className="space-y-2">
                <Label htmlFor="doctor">Врач</Label>
                <Input
                  id="doctor"
                  placeholder="Имя врача"
                  value={metadata.doctor_name}
                  onChange={(e) => setMetadata(prev => ({ ...prev, doctor_name: e.target.value }))}
                />
              </div>
            </div>

            {/* Clinic */}
            <div className="space-y-2">
              <Label htmlFor="clinic">Медицинское учреждение</Label>
              <Input
                id="clinic"
                placeholder="Название клиники/больницы"
                value={metadata.clinic_name}
                onChange={(e) => setMetadata(prev => ({ ...prev, clinic_name: e.target.value }))}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                placeholder="Дополнительные заметки о документе"
                value={metadata.description}
                onChange={(e) => setMetadata(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            {/* Upload Button */}
            <Button 
              onClick={handleUpload} 
              disabled={uploading}
              className="w-full"
            >
              {uploading ? 'Загрузка...' : 'Загрузить документ'}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUpload;
