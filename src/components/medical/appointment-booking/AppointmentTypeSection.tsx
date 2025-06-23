
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type AppointmentType = 'consultation' | 'screening' | 'procedure' | 'diagnostics';

interface AppointmentTypeSectionProps {
  appointmentType: AppointmentType;
  serviceName: string;
  doctorName: string;
  onAppointmentTypeChange: (value: AppointmentType) => void;
  onServiceNameChange: (value: string) => void;
  onDoctorNameChange: (value: string) => void;
}

const AppointmentTypeSection: React.FC<AppointmentTypeSectionProps> = ({
  appointmentType,
  serviceName,
  doctorName,
  onAppointmentTypeChange,
  onServiceNameChange,
  onDoctorNameChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="appointment_type">Тип приема</Label>
        <Select value={appointmentType} onValueChange={onAppointmentTypeChange}>
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
          value={serviceName}
          onChange={(e) => onServiceNameChange(e.target.value)}
          placeholder="Например: Гинекологический осмотр"
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="doctor_name">Врач (по желанию)</Label>
        <Input
          id="doctor_name"
          value={doctorName}
          onChange={(e) => onDoctorNameChange(e.target.value)}
          placeholder="Имя врача"
        />
      </div>
    </div>
  );
};

export default AppointmentTypeSection;
