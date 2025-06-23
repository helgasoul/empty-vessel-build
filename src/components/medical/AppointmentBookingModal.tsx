
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateGynecologyAppointment } from '@/hooks/useMedicalPartners';
import { Calendar, Clock, User, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface AppointmentBookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partner: any;
}

type AppointmentType = 'consultation' | 'screening' | 'procedure' | 'diagnostics';
type CyclePhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal';

const AppointmentBookingModal: React.FC<AppointmentBookingModalProps> = ({
  open,
  onOpenChange,
  partner
}) => {
  const [formData, setFormData] = useState({
    appointment_type: 'consultation' as AppointmentType,
    appointment_date: '',
    appointment_time: '',
    doctor_name: '',
    service_name: '',
    appointment_notes: '',
    cycle_day: '',
    cycle_phase: '' as CyclePhase | '',
    preparation_required: false,
  });

  const createAppointment = useCreateGynecologyAppointment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.appointment_date || !formData.appointment_time) {
      return;
    }

    try {
      await createAppointment.mutateAsync({
        appointment_type: formData.appointment_type,
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time,
        partner_id: partner?.id,
        doctor_name: formData.doctor_name || undefined,
        service_name: formData.service_name || undefined,
        appointment_notes: formData.appointment_notes || undefined,
        cycle_day: formData.cycle_day ? parseInt(formData.cycle_day) : undefined,
        cycle_phase: formData.cycle_phase || undefined,
        estimated_duration: 30,
        timezone: 'Europe/Moscow',
        cycle_considerations: {},
        preparation_required: formData.preparation_required,
        preparation_instructions: [],
        preparation_completed: false,
        results_available: false,
        results_summary: {},
        follow_up_required: false,
        insurance_covered: false,
      });
      
      onOpenChange(false);
      setFormData({
        appointment_type: 'consultation',
        appointment_date: '',
        appointment_time: '',
        doctor_name: '',
        service_name: '',
        appointment_notes: '',
        cycle_day: '',
        cycle_phase: '',
        preparation_required: false,
      });
    } catch (error) {
      console.error('Error creating appointment:', error);
    }
  };

  if (!partner) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Запись в {partner.partner_name}
          </DialogTitle>
          <DialogDescription>
            Заполните форму для записи на прием
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="appointment_type">Тип приема</Label>
              <Select 
                value={formData.appointment_type} 
                onValueChange={(value: AppointmentType) => setFormData(prev => ({ ...prev, appointment_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тип приема" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consultation">Консультация</SelectItem>
                  <SelectItem value="screening">Скрининг</SelectItem>
                  <SelectItem value="procedure">Процедура</SelectItem>
                  <SelectItem value="diagnostics">Диагностика</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="service_name">Название услуги</Label>
              <Input
                id="service_name"
                value={formData.service_name}
                onChange={(e) => setFormData(prev => ({ ...prev, service_name: e.target.value }))}
                placeholder="Например: Гинекологический осмотр"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="appointment_date">Дата приема</Label>
              <Input
                id="appointment_date"
                type="date"
                value={formData.appointment_date}
                onChange={(e) => setFormData(prev => ({ ...prev, appointment_date: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="appointment_time">Время приема</Label>
              <Input
                id="appointment_time"
                type="time"
                value={formData.appointment_time}
                onChange={(e) => setFormData(prev => ({ ...prev, appointment_time: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="doctor_name">Врач (по желанию)</Label>
              <Input
                id="doctor_name"
                value={formData.doctor_name}
                onChange={(e) => setFormData(prev => ({ ...prev, doctor_name: e.target.value }))}
                placeholder="Имя врача"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cycle_day">День цикла (по желанию)</Label>
              <Input
                id="cycle_day"
                type="number"
                min="1"
                max="35"
                value={formData.cycle_day}
                onChange={(e) => setFormData(prev => ({ ...prev, cycle_day: e.target.value }))}
                placeholder="1-35"
              />
            </div>
          </div>

          {formData.cycle_day && (
            <div className="space-y-2">
              <Label htmlFor="cycle_phase">Фаза цикла</Label>
              <Select 
                value={formData.cycle_phase} 
                onValueChange={(value: CyclePhase) => setFormData(prev => ({ ...prev, cycle_phase: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите фазу цикла" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="menstrual">Менструальная</SelectItem>
                  <SelectItem value="follicular">Фолликулярная</SelectItem>
                  <SelectItem value="ovulation">Овуляция</SelectItem>
                  <SelectItem value="luteal">Лютеиновая</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="appointment_notes">Дополнительные заметки</Label>
            <Textarea
              id="appointment_notes"
              value={formData.appointment_notes}
              onChange={(e) => setFormData(prev => ({ ...prev, appointment_notes: e.target.value }))}
              placeholder="Опишите жалобы или пожелания к приему"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit" disabled={createAppointment.isPending}>
              {createAppointment.isPending ? 'Записываю...' : 'Записаться'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentBookingModal;
