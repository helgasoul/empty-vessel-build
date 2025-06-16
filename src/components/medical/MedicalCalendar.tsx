
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, Clock, MapPin, User, Building, Plus, Edit, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, parseISO, isSameDay } from "date-fns";
import { ru } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MedicalEvent {
  id: string;
  title: string;
  description?: string;
  event_type: string;
  event_date: string;
  event_time?: string;
  duration_minutes?: number;
  location?: string;
  doctor_name?: string;
  clinic_name?: string;
  reminder_minutes?: number;
  is_completed: boolean;
  notes?: string;
}

const eventTypeLabels = {
  appointment: 'Прием',
  procedure: 'Процедура',
  medication: 'Прием лекарств',
  test: 'Анализы',
  consultation: 'Консультация',
  vaccination: 'Вакцинация',
  checkup: 'Осмотр'
};

const eventTypeColors = {
  appointment: 'bg-blue-500',
  procedure: 'bg-purple-500',
  medication: 'bg-green-500',
  test: 'bg-orange-500',
  consultation: 'bg-cyan-500',
  vaccination: 'bg-pink-500',
  checkup: 'bg-indigo-500'
};

const formSchema = z.object({
  title: z.string().min(1, "Название обязательно"),
  description: z.string().optional(),
  event_type: z.enum(['appointment', 'procedure', 'medication', 'test', 'consultation', 'vaccination', 'checkup']),
  event_date: z.string().min(1, "Дата обязательна"),
  event_time: z.string().optional(),
  duration_minutes: z.number().min(1).max(480).optional(),
  location: z.string().optional(),
  doctor_name: z.string().optional(),
  clinic_name: z.string().optional(),
  reminder_minutes: z.number().min(0).max(1440).optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const MedicalCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<MedicalEvent[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<MedicalEvent | null>(null);
  const [loading, setLoading] = useState(true);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      event_type: "appointment",
      event_date: format(new Date(), 'yyyy-MM-dd'),
      event_time: "",
      duration_minutes: 60,
      location: "",
      doctor_name: "",
      clinic_name: "",
      reminder_minutes: 15,
      notes: "",
    },
  });

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('medical_calendar_events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Ошибка при загрузке событий');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Пользователь не авторизован');

      const eventData = {
        ...data,
        user_id: user.id,
        event_time: data.event_time || null,
        duration_minutes: data.duration_minutes || 60,
        reminder_minutes: data.reminder_minutes || 15,
      };

      if (editingEvent) {
        const { error } = await supabase
          .from('medical_calendar_events')
          .update(eventData)
          .eq('id', editingEvent.id);
        
        if (error) throw error;
        toast.success('Событие обновлено');
      } else {
        const { error } = await supabase
          .from('medical_calendar_events')
          .insert([eventData]);
        
        if (error) throw error;
        toast.success('Событие создано');
      }

      await fetchEvents();
      setIsDialogOpen(false);
      setEditingEvent(null);
      form.reset();
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error('Ошибка при сохранении события');
    }
  };

  const handleEdit = (event: MedicalEvent) => {
    setEditingEvent(event);
    form.reset({
      title: event.title,
      description: event.description || "",
      event_type: event.event_type as any,
      event_date: event.event_date,
      event_time: event.event_time || "",
      duration_minutes: event.duration_minutes || 60,
      location: event.location || "",
      doctor_name: event.doctor_name || "",
      clinic_name: event.clinic_name || "",
      reminder_minutes: event.reminder_minutes || 15,
      notes: event.notes || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('medical_calendar_events')
        .delete()
        .eq('id', eventId);
      
      if (error) throw error;
      toast.success('Событие удалено');
      await fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Ошибка при удалении события');
    }
  };

  const toggleComplete = async (event: MedicalEvent) => {
    try {
      const { error } = await supabase
        .from('medical_calendar_events')
        .update({ is_completed: !event.is_completed })
        .eq('id', event.id);
      
      if (error) throw error;
      toast.success(event.is_completed ? 'Событие отмечено как невыполненное' : 'Событие отмечено как выполненное');
      await fetchEvents();
    } catch (error) {
      console.error('Error toggling completion:', error);
      toast.error('Ошибка при обновлении статуса');
    }
  };

  const selectedDateEvents = events.filter(event => 
    isSameDay(parseISO(event.event_date), selectedDate)
  );

  const upcomingEvents = events.filter(event => 
    !event.is_completed && new Date(event.event_date) >= new Date()
  ).slice(0, 5);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Медицинский календарь</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Загрузка...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Медицинский календарь</h2>
          <p className="text-gray-600">Управляйте медицинскими событиями и напоминаниями</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingEvent(null);
            form.reset();
          }
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Добавить событие
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingEvent ? 'Редактировать событие' : 'Создать событие'}
              </DialogTitle>
              <DialogDescription>
                {editingEvent ? 'Обновите информацию о медицинском событии' : 'Добавьте новое медицинское событие в календарь'}
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Название</FormLabel>
                        <FormControl>
                          <Input placeholder="Прием у кардиолога" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="event_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Тип события</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите тип" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(eventTypeLabels).map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Описание</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Дополнительная информация..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="event_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Дата</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="event_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Время</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="duration_minutes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Длительность (мин)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="60" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 60)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="reminder_minutes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Напоминание (мин до)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="15" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 15)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="doctor_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Врач</FormLabel>
                        <FormControl>
                          <Input placeholder="Иванов И.И." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="clinic_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Клиника</FormLabel>
                        <FormControl>
                          <Input placeholder="Медицинский центр" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Адрес</FormLabel>
                      <FormControl>
                        <Input placeholder="ул. Примерная, д. 1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Заметки</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Дополнительные заметки..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Отмена
                  </Button>
                  <Button type="submit">
                    {editingEvent ? 'Обновить' : 'Создать'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CalendarIcon className="w-5 h-5" />
                <span>Календарь</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                locale={ru}
                className="rounded-md border"
                modifiers={{
                  hasEvent: (date) => events.some(event => 
                    isSameDay(parseISO(event.event_date), date)
                  )
                }}
                modifiersStyles={{
                  hasEvent: { 
                    backgroundColor: '#3b82f6', 
                    color: 'white',
                    fontWeight: 'bold'
                  }
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                События на {format(selectedDate, 'd MMMM yyyy', { locale: ru })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDateEvents.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Нет событий на выбранную дату
                </p>
              ) : (
                <div className="space-y-3">
                  {selectedDateEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`p-4 rounded-lg border-l-4 ${eventTypeColors[event.event_type as keyof typeof eventTypeColors]} ${
                        event.is_completed ? 'bg-gray-50 opacity-75' : 'bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className={`font-semibold ${event.is_completed ? 'line-through text-gray-500' : ''}`}>
                              {event.title}
                            </h4>
                            <Badge variant="secondary" className="text-xs">
                              {eventTypeLabels[event.event_type as keyof typeof eventTypeLabels]}
                            </Badge>
                            {event.is_completed && (
                              <Badge variant="outline" className="text-xs text-green-600">
                                Выполнено
                              </Badge>
                            )}
                          </div>
                          
                          {event.event_time && (
                            <div className="flex items-center space-x-1 text-sm text-gray-600 mb-1">
                              <Clock className="w-4 h-4" />
                              <span>{event.event_time}</span>
                              {event.duration_minutes && (
                                <span>({event.duration_minutes} мин)</span>
                              )}
                            </div>
                          )}
                          
                          {event.doctor_name && (
                            <div className="flex items-center space-x-1 text-sm text-gray-600 mb-1">
                              <User className="w-4 h-4" />
                              <span>{event.doctor_name}</span>
                            </div>
                          )}
                          
                          {event.clinic_name && (
                            <div className="flex items-center space-x-1 text-sm text-gray-600 mb-1">
                              <Building className="w-4 h-4" />
                              <span>{event.clinic_name}</span>
                            </div>
                          )}
                          
                          {event.location && (
                            <div className="flex items-center space-x-1 text-sm text-gray-600 mb-1">
                              <MapPin className="w-4 h-4" />
                              <span>{event.location}</span>
                            </div>
                          )}
                          
                          {event.description && (
                            <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-1 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleComplete(event)}
                          >
                            {event.is_completed ? 'Отменить' : 'Выполнено'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(event)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(event.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Ближайшие события</CardTitle>
              <CardDescription>Предстоящие медицинские события</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  Нет предстоящих событий
                </p>
              ) : (
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="p-3 rounded-lg border">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className={`w-3 h-3 rounded-full ${eventTypeColors[event.event_type as keyof typeof eventTypeColors]}`}></div>
                        <h5 className="font-medium text-sm">{event.title}</h5>
                      </div>
                      <div className="text-xs text-gray-600">
                        {format(parseISO(event.event_date), 'd MMM, yyyy', { locale: ru })}
                        {event.event_time && ` в ${event.event_time}`}
                      </div>
                      {event.doctor_name && (
                        <div className="text-xs text-gray-500 mt-1">
                          {event.doctor_name}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MedicalCalendar;
