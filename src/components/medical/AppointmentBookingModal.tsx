
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useCreateGynecologyAppointment } from '@/hooks/useMedicalPartners';
import { Calendar } from 'lucide-react';
import AppointmentTypeSection from './appointment-booking/AppointmentTypeSection';
import AppointmentDateTimeSection from './appointment-booking/AppointmentDateTimeSection';
import CycleTrackingSection from './appointment-booking/CycleTrackingSection';
import AppointmentNotesSection from './appointment-booking/AppointmentNotesSection';

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

  const updateFormData = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <AppointmentTypeSection
            appointmentType={formData.appointment_type}
            serviceName={formData.service_name}
            doctorName={formData.doctor_name}
            onAppointmentTypeChange={(value) => updateFormData('appointment_type', value)}
            onServiceNameChange={(value) => updateFormData('service_name', value)}
            onDoctorNameChange={(value) => updateFormData('doctor_name', value)}
          />

          <AppointmentDateTimeSection
            appointmentDate={formData.appointment_date}
            appointmentTime={formData.appointment_time}
            onDateChange={(value) => updateFormData('appointment_date', value)}
            onTimeChange={(value) => updateFormData('appointment_time', value)}
          />

          <CycleTrackingSection
            cycleDay={formData.cycle_day}
            cyclePhase={formData.cycle_phase}
            onCycleDayChange={(value) => updateFormData('cycle_day', value)}
            onCyclePhaseChange={(value) => updateFormData('cycle_phase', value)}
          />

          <AppointmentNotesSection
            appointmentNotes={formData.appointment_notes}
            onNotesChange={(value) => updateFormData('appointment_notes', value)}
          />

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
