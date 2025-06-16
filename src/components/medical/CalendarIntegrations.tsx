
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Calendar, 
  Plus, 
  Settings, 
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { useCalendarIntegrations } from "@/hooks/useCalendarIntegrations";
import type { CalendarIntegration } from '@/types/telemedicine';

const CalendarIntegrations = () => {
  const { integrations, loading, createIntegration, updateIntegration, deleteIntegration } = useCalendarIntegrations();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIntegration, setEditingIntegration] = useState<CalendarIntegration | null>(null);
  const [formData, setFormData] = useState<{
    calendar_type: CalendarIntegration['calendar_type'];
    calendar_id: string;
    integration_status: CalendarIntegration['integration_status'];
  }>({
    calendar_type: 'google_calendar',
    calendar_id: '',
    integration_status: 'active'
  });

  const calendars = [
    { value: 'google_calendar' as const, label: 'Google Calendar', icon: '📅' },
    { value: 'outlook' as const, label: 'Microsoft Outlook', icon: '📆' },
    { value: 'apple_calendar' as const, label: 'Apple Calendar', icon: '🗓️' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'inactive':
        return <XCircle className="w-4 h-4 text-gray-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'error': return 'destructive';
      default: return 'outline';
    }
  };

  const getCalendarLabel = (type: string) => {
    return calendars.find(c => c.value === type)?.label || type;
  };

  const getCalendarIcon = (type: string) => {
    return calendars.find(c => c.value === type)?.icon || '📅';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingIntegration) {
        await updateIntegration(editingIntegration.id, formData);
      } else {
        await createIntegration({
          ...formData,
          sync_settings: {}
        });
      }
      
      setIsDialogOpen(false);
      setEditingIntegration(null);
      setFormData({
        calendar_type: 'google_calendar',
        calendar_id: '',
        integration_status: 'active'
      });
    } catch (error) {
      console.error('Ошибка при сохранении интеграции:', error);
    }
  };

  const handleEdit = (integration: CalendarIntegration) => {
    setEditingIntegration(integration);
    setFormData({
      calendar_type: integration.calendar_type,
      calendar_id: integration.calendar_id || '',
      integration_status: integration.integration_status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Вы уверены, что хотите удалить эту интеграцию?')) {
      await deleteIntegration(id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">Загрузка интеграций...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Календарные интеграции</h3>
          <p className="text-sm text-gray-600">
            Подключите календарь для автоматической синхронизации встреч
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Добавить календарь
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingIntegration ? 'Редактировать календарь' : 'Новый календарь'}
              </DialogTitle>
              <DialogDescription>
                Подключите календарь для синхронизации консультаций
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="calendar_type">Тип календаря</Label>
                <Select
                  value={formData.calendar_type}
                  onValueChange={(value: CalendarIntegration['calendar_type']) => 
                    setFormData({ ...formData, calendar_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {calendars.map(calendar => (
                      <SelectItem key={calendar.value} value={calendar.value}>
                        <div className="flex items-center gap-2">
                          <span>{calendar.icon}</span>
                          <span>{calendar.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="calendar_id">ID календаря</Label>
                <Input
                  id="calendar_id"
                  value={formData.calendar_id}
                  onChange={(e) => setFormData({ ...formData, calendar_id: e.target.value })}
                  placeholder="Введите ID календаря (необязательно)"
                />
              </div>

              <div>
                <Label htmlFor="status">Статус</Label>
                <Select
                  value={formData.integration_status}
                  onValueChange={(value: CalendarIntegration['integration_status']) => 
                    setFormData({ ...formData, integration_status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Активна</SelectItem>
                    <SelectItem value="inactive">Неактивна</SelectItem>
                    <SelectItem value="error">Ошибка</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit">
                  {editingIntegration ? 'Сохранить' : 'Создать'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {integrations.length > 0 ? (
        <div className="grid gap-4">
          {integrations.map(integration => (
            <Card key={integration.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">
                      {getCalendarIcon(integration.calendar_type)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {getCalendarLabel(integration.calendar_type)}
                      </CardTitle>
                      <CardDescription>
                        {integration.calendar_id && `ID: ${integration.calendar_id}`}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {getStatusIcon(integration.integration_status)}
                      <Badge variant={getStatusColor(integration.integration_status)}>
                        {integration.integration_status === 'active' ? 'Активна' :
                         integration.integration_status === 'inactive' ? 'Неактивна' : 'Ошибка'}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(integration)}
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(integration.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Нет подключенных календарей</h3>
            <p className="text-gray-600 mb-4">
              Подключите календарь для автоматической синхронизации встреч
            </p>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>Подключить календарь</Button>
              </DialogTrigger>
            </Dialog>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CalendarIntegrations;
