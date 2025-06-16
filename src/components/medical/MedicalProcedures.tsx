
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Building,
  Plus,
  Edit,
  FileText,
  AlertCircle
} from "lucide-react";
import { useMedicalProcedures } from "@/hooks/useMedicalProcedures";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

const MedicalProcedures = () => {
  const { procedures, loading, createProcedure, updateProcedure, deleteProcedure } = useMedicalProcedures();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProcedure, setEditingProcedure] = useState<any>(null);
  const [formData, setFormData] = useState({
    procedure_name: '',
    procedure_type: '',
    scheduled_date: '',
    scheduled_time: '',
    duration_minutes: 30,
    doctor_name: '',
    clinic_name: '',
    location: '',
    preparation_instructions: '',
    notes: '',
    status: 'scheduled' as const
  });

  const procedureTypes = [
    'Анализ крови',
    'УЗИ',
    'МРТ',
    'КТ',
    'Маммография',
    'Колоноскопия',
    'Гастроскопия',
    'Консультация специалиста',
    'Хирургическая процедура',
    'Стоматологическое лечение',
    'Другое'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingProcedure) {
        await updateProcedure(editingProcedure.id, formData);
        setEditingProcedure(null);
      } else {
        await createProcedure({
          ...formData,
          reminder_sent: false,
          is_recurring: false
        });
        setIsCreateModalOpen(false);
      }
      
      // Reset form
      setFormData({
        procedure_name: '',
        procedure_type: '',
        scheduled_date: '',
        scheduled_time: '',
        duration_minutes: 30,
        doctor_name: '',
        clinic_name: '',
        location: '',
        preparation_instructions: '',
        notes: '',
        status: 'scheduled'
      });
    } catch (error) {
      console.error('Ошибка при сохранении процедуры:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'default';
      case 'in_progress': return 'secondary';
      case 'completed': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Запланирована';
      case 'in_progress': return 'В процессе';
      case 'completed': return 'Завершена';
      case 'cancelled': return 'Отменена';
      default: return status;
    }
  };

  const handleEdit = (procedure: any) => {
    setEditingProcedure(procedure);
    setFormData({
      procedure_name: procedure.procedure_name || '',
      procedure_type: procedure.procedure_type || '',
      scheduled_date: procedure.scheduled_date || '',
      scheduled_time: procedure.scheduled_time || '',
      duration_minutes: procedure.duration_minutes || 30,
      doctor_name: procedure.doctor_name || '',
      clinic_name: procedure.clinic_name || '',
      location: procedure.location || '',
      preparation_instructions: procedure.preparation_instructions || '',
      notes: procedure.notes || '',
      status: procedure.status || 'scheduled'
    });
  };

  const ProcedureForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="procedure_name">Название процедуры</Label>
          <Input
            id="procedure_name"
            value={formData.procedure_name}
            onChange={(e) => setFormData(prev => ({ ...prev, procedure_name: e.target.value }))}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="procedure_type">Тип процедуры</Label>
          <Select value={formData.procedure_type} onValueChange={(value) => setFormData(prev => ({ ...prev, procedure_type: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите тип" />
            </SelectTrigger>
            <SelectContent>
              {procedureTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="scheduled_date">Дата</Label>
          <Input
            id="scheduled_date"
            type="date"
            value={formData.scheduled_date}
            onChange={(e) => setFormData(prev => ({ ...prev, scheduled_date: e.target.value }))}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="scheduled_time">Время</Label>
          <Input
            id="scheduled_time"
            type="time"
            value={formData.scheduled_time}
            onChange={(e) => setFormData(prev => ({ ...prev, scheduled_time: e.target.value }))}
          />
        </div>
        
        <div>
          <Label htmlFor="duration_minutes">Длительность (мин)</Label>
          <Input
            id="duration_minutes"
            type="number"
            value={formData.duration_minutes}
            onChange={(e) => setFormData(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="doctor_name">Врач</Label>
          <Input
            id="doctor_name"
            value={formData.doctor_name}
            onChange={(e) => setFormData(prev => ({ ...prev, doctor_name: e.target.value }))}
          />
        </div>
        
        <div>
          <Label htmlFor="clinic_name">Клиника</Label>
          <Input
            id="clinic_name"
            value={formData.clinic_name}
            onChange={(e) => setFormData(prev => ({ ...prev, clinic_name: e.target.value }))}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="location">Адрес</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
        />
      </div>

      <div>
        <Label htmlFor="preparation_instructions">Инструкции по подготовке</Label>
        <Textarea
          id="preparation_instructions"
          value={formData.preparation_instructions}
          onChange={(e) => setFormData(prev => ({ ...prev, preparation_instructions: e.target.value }))}
          placeholder="Например: Явиться натощак, не принимать пищу за 8 часов до процедуры..."
        />
      </div>

      <div>
        <Label htmlFor="notes">Заметки</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
        />
      </div>

      {editingProcedure && (
        <div>
          <Label htmlFor="status">Статус</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="scheduled">Запланирована</SelectItem>
              <SelectItem value="in_progress">В процессе</SelectItem>
              <SelectItem value="completed">Завершена</SelectItem>
              <SelectItem value="cancelled">Отменена</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <Button 
          type="button" 
          variant="outline"
          onClick={() => {
            setIsCreateModalOpen(false);
            setEditingProcedure(null);
            setFormData({
              procedure_name: '',
              procedure_type: '',
              scheduled_date: '',
              scheduled_time: '',
              duration_minutes: 30,
              doctor_name: '',
              clinic_name: '',
              location: '',
              preparation_instructions: '',
              notes: '',
              status: 'scheduled'
            });
          }}
        >
          Отмена
        </Button>
        <Button type="submit">
          {editingProcedure ? 'Обновить' : 'Создать'}
        </Button>
      </div>
    </form>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">Загрузка медицинских процедур...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Медицинские процедуры
          </h2>
          <p className="text-gray-600">
            Планируйте и отслеживайте медицинские процедуры
          </p>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Добавить процедуру</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Новая медицинская процедура</DialogTitle>
              <DialogDescription>
                Запланируйте медицинскую процедуру или обследование
              </DialogDescription>
            </DialogHeader>
            <ProcedureForm />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {procedures.map(procedure => (
          <Card key={procedure.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{procedure.procedure_name}</CardTitle>
                  <CardDescription>{procedure.procedure_type}</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={getStatusColor(procedure.status)}>
                    {getStatusText(procedure.status)}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(procedure)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">
                    {format(new Date(procedure.scheduled_date), 'd MMMM yyyy', { locale: ru })}
                  </span>
                </div>
                
                {procedure.scheduled_time && (
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{procedure.scheduled_time}</span>
                  </div>
                )}

                {procedure.doctor_name && (
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{procedure.doctor_name}</span>
                  </div>
                )}

                {procedure.clinic_name && (
                  <div className="flex items-center space-x-2">
                    <Building className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{procedure.clinic_name}</span>
                  </div>
                )}
              </div>

              {procedure.location && (
                <div className="flex items-center space-x-2 mb-4">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{procedure.location}</span>
                </div>
              )}

              {procedure.preparation_instructions && (
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-orange-500" />
                    <h4 className="font-medium text-sm">Подготовка к процедуре:</h4>
                  </div>
                  <p className="text-sm text-gray-600 bg-orange-50 p-3 rounded">
                    {procedure.preparation_instructions}
                  </p>
                </div>
              )}

              {procedure.notes && (
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <h4 className="font-medium text-sm">Заметки:</h4>
                  </div>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    {procedure.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {procedures.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Нет запланированных процедур</h3>
            <p className="text-gray-600 mb-4">
              Добавьте медицинские процедуры для отслеживания и подготовки
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              Добавить первую процедуру
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingProcedure} onOpenChange={() => setEditingProcedure(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Редактировать процедуру</DialogTitle>
            <DialogDescription>
              Обновите информацию о медицинской процедуре
            </DialogDescription>
          </DialogHeader>
          <ProcedureForm />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MedicalProcedures;
