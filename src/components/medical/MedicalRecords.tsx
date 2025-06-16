import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileText, Plus, Calendar, User, Building, Trash2, Edit, Paperclip } from 'lucide-react';
import { useMedicalRecords } from '@/hooks/useMedicalRecords';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import FileUpload from './FileUpload';
import AttachedFiles from './AttachedFiles';

const MedicalRecords = () => {
  const { records, loading, createRecord, updateRecord, deleteRecord, deleteFile } = useMedicalRecords();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [recordType, setRecordType] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [recordDate, setRecordDate] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setRecordType('');
    setTitle('');
    setDescription('');
    setDoctorName('');
    setClinicName('');
    setRecordDate('');
    setSelectedFiles([]);
    setEditingRecord(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordType || !title || !recordDate) return;

    setIsSubmitting(true);
    try {
      const recordData = {
        record_type: recordType as any,
        title,
        description,
        doctor_name: doctorName,
        clinic_name: clinicName,
        record_date: recordDate
      };

      if (editingRecord) {
        await updateRecord(editingRecord.id, recordData, selectedFiles);
      } else {
        await createRecord(recordData, selectedFiles);
      }

      resetForm();
      setIsDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (record: any) => {
    setEditingRecord(record);
    setRecordType(record.record_type);
    setTitle(record.title);
    setDescription(record.description || '');
    setDoctorName(record.doctor_name || '');
    setClinicName(record.clinic_name || '');
    setRecordDate(record.record_date);
    setSelectedFiles([]);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить эту запись?')) {
      await deleteRecord(id);
    }
  };

  const handleDeleteFile = async (recordId: string, fileUrl: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот файл?')) {
      await deleteFile(recordId, fileUrl);
    }
  };

  const getRecordTypeLabel = (type: string) => {
    const labels = {
      'diagnosis': 'Диагноз',
      'prescription': 'Рецепт',
      'lab_result': 'Результат анализа',
      'imaging': 'Обследование',
      'vaccination': 'Вакцинация',
      'allergy': 'Аллергия',
      'surgery': 'Операция',
      'consultation': 'Консультация'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getRecordTypeColor = (type: string) => {
    const colors = {
      'diagnosis': 'bg-red-100 text-red-800',
      'prescription': 'bg-blue-100 text-blue-800',
      'lab_result': 'bg-green-100 text-green-800',
      'imaging': 'bg-purple-100 text-purple-800',
      'vaccination': 'bg-yellow-100 text-yellow-800',
      'allergy': 'bg-orange-100 text-orange-800',
      'surgery': 'bg-gray-100 text-gray-800',
      'consultation': 'bg-teal-100 text-teal-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="flex justify-center p-8">Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Медицинские записи</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#F0A1C0] hover:bg-[#F0A1C0]/90" onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Добавить запись
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingRecord ? 'Редактировать запись' : 'Новая медицинская запись'}
              </DialogTitle>
              <DialogDescription>
                Добавьте информацию о вашем медицинском документе и прикрепите файлы
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="recordType">Тип записи</Label>
                <Select value={recordType} onValueChange={setRecordType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип записи" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="diagnosis">Диагноз</SelectItem>
                    <SelectItem value="prescription">Рецепт</SelectItem>
                    <SelectItem value="lab_result">Результат анализа</SelectItem>
                    <SelectItem value="imaging">Обследование</SelectItem>
                    <SelectItem value="vaccination">Вакцинация</SelectItem>
                    <SelectItem value="allergy">Аллергия</SelectItem>
                    <SelectItem value="surgery">Операция</SelectItem>
                    <SelectItem value="consultation">Консультация</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="title">Название</Label>
                <Input
                  placeholder="Краткое название записи"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  placeholder="Подробное описание"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="doctorName">Врач</Label>
                <Input
                  placeholder="ФИО врача"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="clinicName">Клиника</Label>
                <Input
                  placeholder="Название клиники"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="recordDate">Дата</Label>
                <Input
                  type="date"
                  value={recordDate}
                  onChange={(e) => setRecordDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label>Файлы</Label>
                <FileUpload
                  files={selectedFiles}
                  onFilesChange={setSelectedFiles}
                  maxFiles={5}
                />
              </div>

              {editingRecord && editingRecord.file_attachments && editingRecord.file_attachments.length > 0 && (
                <div>
                  <Label>Уже прикрепленные файлы</Label>
                  <AttachedFiles
                    files={editingRecord.file_attachments}
                    onDeleteFile={(fileUrl) => handleDeleteFile(editingRecord.id, fileUrl)}
                    canDelete={true}
                  />
                </div>
              )}

              <Button 
                type="submit" 
                disabled={isSubmitting || !recordType || !title || !recordDate}
                className="w-full bg-[#F0A1C0] hover:bg-[#F0A1C0]/90"
              >
                {isSubmitting ? 'Сохранение...' : editingRecord ? 'Сохранить изменения' : 'Добавить запись'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {records.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Нет медицинских записей</h3>
            <p className="text-gray-600 mb-4">
              Начните ведение цифровой медкарты, добавив первую запись
            </p>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#F0A1C0] hover:bg-[#F0A1C0]/90" onClick={resetForm}>
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить первую запись
                </Button>
              </DialogTrigger>
            </Dialog>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {records.map(record => (
            <Card key={record.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <Badge className={getRecordTypeColor(record.record_type)}>
                    {getRecordTypeLabel(record.record_type)}
                  </Badge>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(record)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(record.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-lg">{record.title}</CardTitle>
                {record.file_attachments && record.file_attachments.length > 0 && (
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Paperclip className="w-4 h-4" />
                    <span>{record.file_attachments.length} файлов</span>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {record.description && (
                  <p className="text-sm text-gray-600 mb-3">{record.description}</p>
                )}
                
                <div className="space-y-2 text-sm mb-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(record.record_date), 'dd MMMM yyyy', { locale: ru })}
                  </div>
                  
                  {record.doctor_name && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <User className="w-4 h-4" />
                      {record.doctor_name}
                    </div>
                  )}
                  
                  {record.clinic_name && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Building className="w-4 h-4" />
                      {record.clinic_name}
                    </div>
                  )}
                </div>

                {record.file_attachments && record.file_attachments.length > 0 && (
                  <AttachedFiles
                    files={record.file_attachments}
                    onDeleteFile={(fileUrl) => handleDeleteFile(record.id, fileUrl)}
                    canDelete={true}
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicalRecords;
