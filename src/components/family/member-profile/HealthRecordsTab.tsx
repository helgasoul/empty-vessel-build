
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Calendar, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface HealthRecord {
  id: string;
  record_type: string;
  title: string;
  description?: string;
  date_recorded?: string;
  doctor_name?: string;
  clinic_name?: string;
  results?: any;
  severity?: string;
  status: string;
  notes?: string;
  created_at: string;
}

interface HealthRecordsTabProps {
  memberId: string;
}

const HealthRecordsTab: React.FC<HealthRecordsTabProps> = ({ memberId }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRecord, setNewRecord] = useState({
    record_type: '',
    title: '',
    description: '',
    date_recorded: new Date().toISOString().split('T')[0],
    doctor_name: '',
    clinic_name: '',
    severity: '',
    status: 'active',
    notes: ''
  });

  const recordTypes = [
    { value: 'diagnosis', label: 'Диагноз' },
    { value: 'procedure', label: 'Процедура' },
    { value: 'test_result', label: 'Результат анализа' },
    { value: 'prescription', label: 'Назначение' },
    { value: 'vaccination', label: 'Прививка' },
    { value: 'consultation', label: 'Консультация' },
    { value: 'surgery', label: 'Операция' },
    { value: 'other', label: 'Другое' }
  ];

  const severityLevels = [
    { value: 'mild', label: 'Легкая', color: 'bg-green-100 text-green-800' },
    { value: 'moderate', label: 'Умеренная', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'severe', label: 'Тяжелая', color: 'bg-orange-100 text-orange-800' },
    { value: 'critical', label: 'Критическая', color: 'bg-red-100 text-red-800' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Активно', color: 'bg-blue-100 text-blue-800' },
    { value: 'resolved', label: 'Вылечено', color: 'bg-green-100 text-green-800' },
    { value: 'chronic', label: 'Хроническое', color: 'bg-purple-100 text-purple-800' },
    { value: 'monitoring', label: 'Наблюдение', color: 'bg-gray-100 text-gray-800' }
  ];

  useEffect(() => {
    loadRecords();
  }, [memberId]);

  const loadRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('family_member_health_records')
        .select('*')
        .eq('family_member_id', memberId)
        .order('date_recorded', { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error('Error loading health records:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить медицинские записи",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addRecord = async () => {
    if (!user || !newRecord.record_type || !newRecord.title) {
      toast({
        title: "Ошибка",
        description: "Заполните обязательные поля",
        variant: "destructive"
      });
      return;
    }

    try {
      const recordData = {
        family_member_id: memberId,
        record_type: newRecord.record_type,
        title: newRecord.title,
        description: newRecord.description || null,
        date_recorded: newRecord.date_recorded || null,
        doctor_name: newRecord.doctor_name || null,
        clinic_name: newRecord.clinic_name || null,
        severity: newRecord.severity || null,
        status: newRecord.status,
        notes: newRecord.notes || null,
        created_by: user.id
      };

      const { error } = await supabase
        .from('family_member_health_records')
        .insert(recordData);

      if (error) throw error;

      toast({
        title: "Успешно",
        description: "Медицинская запись добавлена"
      });

      setNewRecord({
        record_type: '',
        title: '',
        description: '',
        date_recorded: new Date().toISOString().split('T')[0],
        doctor_name: '',
        clinic_name: '',
        severity: '',
        status: 'active',
        notes: ''
      });
      setShowAddForm(false);
      loadRecords();
    } catch (error) {
      console.error('Error adding health record:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить медицинскую запись",
        variant: "destructive"
      });
    }
  };

  const getRecordTypeLabel = (type: string) => {
    const recordType = recordTypes.find(rt => rt.value === type);
    return recordType ? recordType.label : type;
  };

  const getSeverityBadge = (severity: string) => {
    const severityLevel = severityLevels.find(sl => sl.value === severity);
    if (!severityLevel) return null;
    
    return (
      <Badge className={severityLevel.color}>
        {severityLevel.label}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusOption = statusOptions.find(so => so.value === status);
    if (!statusOption) return null;
    
    return (
      <Badge className={statusOption.color}>
        {statusOption.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Загрузка записей...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-green-600" />
                <span>Медицинские записи</span>
              </CardTitle>
              <CardDescription>
                История болезней, процедур и медицинских событий
              </CardDescription>
            </div>
            <Button onClick={() => setShowAddForm(!showAddForm)}>
              <Plus className="w-4 h-4 mr-2" />
              Добавить запись
            </Button>
          </div>
        </CardHeader>
      </Card>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Новая медицинская запись</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="record_type">Тип записи</Label>
                <select
                  className="w-full p-2 border rounded"
                  value={newRecord.record_type}
                  onChange={(e) => setNewRecord(prev => ({ ...prev, record_type: e.target.value }))}
                >
                  <option value="">Выберите тип</option>
                  {recordTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_recorded">Дата</Label>
                <Input
                  id="date_recorded"
                  type="date"
                  value={newRecord.date_recorded}
                  onChange={(e) => setNewRecord(prev => ({ ...prev, date_recorded: e.target.value }))}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title">Название</Label>
                <Input
                  id="title"
                  value={newRecord.title}
                  onChange={(e) => setNewRecord(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Краткое описание диагноза, процедуры или события"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="doctor_name">Врач</Label>
                <Input
                  id="doctor_name"
                  value={newRecord.doctor_name}
                  onChange={(e) => setNewRecord(prev => ({ ...prev, doctor_name: e.target.value }))}
                  placeholder="ФИО врача"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clinic_name">Клиника</Label>
                <Input
                  id="clinic_name"
                  value={newRecord.clinic_name}
                  onChange={(e) => setNewRecord(prev => ({ ...prev, clinic_name: e.target.value }))}
                  placeholder="Название медицинского учреждения"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="severity">Степень тяжести</Label>
                <select
                  className="w-full p-2 border rounded"
                  value={newRecord.severity}
                  onChange={(e) => setNewRecord(prev => ({ ...prev, severity: e.target.value }))}
                >
                  <option value="">Не указано</option>
                  {severityLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Статус</Label>
                <select
                  className="w-full p-2 border rounded"
                  value={newRecord.status}
                  onChange={(e) => setNewRecord(prev => ({ ...prev, status: e.target.value }))}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={newRecord.description}
                onChange={(e) => setNewRecord(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Подробное описание диагноза, симптомов, лечения..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Заметки</Label>
              <Textarea
                id="notes"
                value={newRecord.notes}
                onChange={(e) => setNewRecord(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Дополнительные заметки..."
                rows={2}
              />
            </div>

            <div className="flex space-x-2">
              <Button onClick={addRecord}>Добавить</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Отмена
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {records.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Нет медицинских записей
            </h3>
            <p className="text-gray-600">
              Добавьте первую медицинскую запись для ведения истории болезни
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {records.map((record) => (
            <Card key={record.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">
                      {getRecordTypeLabel(record.record_type)}
                    </Badge>
                    {record.severity && getSeverityBadge(record.severity)}
                    {getStatusBadge(record.status)}
                  </div>
                  {record.date_recorded && (
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{format(new Date(record.date_recorded), 'dd MMM yyyy', { locale: ru })}</span>
                    </div>
                  )}
                </div>

                <h3 className="font-medium text-lg mb-2">{record.title}</h3>
                
                {record.description && (
                  <p className="text-gray-700 mb-3">{record.description}</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {record.doctor_name && (
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Врач:</span>
                      <span className="font-medium">{record.doctor_name}</span>
                    </div>
                  )}
                  
                  {record.clinic_name && (
                    <div>
                      <span className="text-gray-600">Клиника:</span>
                      <span className="font-medium ml-1">{record.clinic_name}</span>
                    </div>
                  )}
                </div>

                {record.notes && (
                  <div className="mt-3 p-3 bg-gray-50 rounded">
                    <p className="text-sm text-gray-700">{record.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default HealthRecordsTab;
