
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useUserReminders, useCreateReminder, useUpdateReminder, useDeleteReminder, UserReminder } from '@/hooks/useUserReminders';
import { Plus, Bell, Calendar, Pill, Heart, Settings, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const RemindersManager = () => {
  const { data: reminders, isLoading } = useUserReminders();
  const createReminder = useCreateReminder();
  const updateReminder = useUpdateReminder();
  const deleteReminder = useDeleteReminder();
  
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState<Partial<UserReminder>>({
    reminder_type: 'custom',
    frequency: 'daily',
    notification_methods: ['push'],
    is_active: true,
    frequency_data: {},
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.next_reminder_at) return;
    
    await createReminder.mutateAsync({
      reminder_type: formData.reminder_type as UserReminder['reminder_type'],
      title: formData.title,
      description: formData.description,
      frequency: formData.frequency as UserReminder['frequency'],
      frequency_data: formData.frequency_data || {},
      next_reminder_at: formData.next_reminder_at,
      is_active: true,
      notification_methods: formData.notification_methods || ['push'],
    });
    
    setShowCreateDialog(false);
    setFormData({
      reminder_type: 'custom',
      frequency: 'daily',
      notification_methods: ['push'],
      is_active: true,
      frequency_data: {},
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'medication': return <Pill className="w-4 h-4" />;
      case 'appointment': return <Calendar className="w-4 h-4" />;
      case 'health_check': return <Heart className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      medication: 'Медикаменты',
      appointment: 'Приемы',
      health_check: 'Обследования',
      custom: 'Пользовательское'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getFrequencyLabel = (frequency: string) => {
    const labels = {
      once: 'Один раз',
      daily: 'Ежедневно',
      weekly: 'Еженедельно',
      monthly: 'Ежемесячно',
      custom: 'Особая'
    };
    return labels[frequency as keyof typeof labels] || frequency;
  };

  if (isLoading) {
    return <div className="text-center py-8">Загрузка напоминаний...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-montserrat text-text-primary">Напоминания</h2>
          <p className="text-text-secondary">Управляйте своими медицинскими напоминаниями</p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Добавить напоминание
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Новое напоминание</DialogTitle>
              <DialogDescription>
                Создайте персональное напоминание для поддержания здоровья
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Тип</Label>
                  <Select
                    value={formData.reminder_type}
                    onValueChange={(value) => setFormData({ ...formData, reminder_type: value as UserReminder['reminder_type'] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="medication">Медикаменты</SelectItem>
                      <SelectItem value="appointment">Приемы</SelectItem>
                      <SelectItem value="health_check">Обследования</SelectItem>
                      <SelectItem value="custom">Пользовательское</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="frequency">Частота</Label>
                  <Select
                    value={formData.frequency}
                    onValueChange={(value) => setFormData({ ...formData, frequency: value as UserReminder['frequency'] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="once">Один раз</SelectItem>
                      <SelectItem value="daily">Ежедневно</SelectItem>
                      <SelectItem value="weekly">Еженедельно</SelectItem>
                      <SelectItem value="monthly">Ежемесячно</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title">Название</Label>
                <Input
                  id="title"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Например: Принять витамин D"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Дополнительная информация..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="datetime">Дата и время</Label>
                <Input
                  id="datetime"
                  type="datetime-local"
                  value={formData.next_reminder_at || ''}
                  onChange={(e) => setFormData({ ...formData, next_reminder_at: e.target.value })}
                  required
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Отмена
                </Button>
                <Button type="submit" disabled={createReminder.isPending}>
                  {createReminder.isPending ? 'Создание...' : 'Создать'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {!reminders || reminders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bell className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Нет напоминаний</h3>
              <p className="text-gray-500 text-center mb-4">
                Создайте первое напоминание для поддержания здорового образа жизни
              </p>
              <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Создать напоминание
              </Button>
            </CardContent>
          </Card>
        ) : (
          reminders.map((reminder) => (
            <Card key={reminder.id} className={`${!reminder.is_active ? 'opacity-60' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getTypeIcon(reminder.reminder_type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">{reminder.title}</h3>
                      {reminder.description && (
                        <p className="text-sm text-gray-600 mb-2">{reminder.description}</p>
                      )}
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>Следующее: {format(new Date(reminder.next_reminder_at), 'dd.MM.yyyy HH:mm', { locale: ru })}</span>
                        <Badge variant="outline" className="text-xs">
                          {getFrequencyLabel(reminder.frequency)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant={reminder.is_active ? "default" : "secondary"}>
                      {getTypeLabel(reminder.reminder_type)}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateReminder.mutate({
                        id: reminder.id,
                        updates: { is_active: !reminder.is_active }
                      })}
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteReminder.mutate(reminder.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default RemindersManager;
