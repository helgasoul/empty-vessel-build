
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar, Clock } from 'lucide-react';

interface AppointmentDateTimeSectionProps {
  appointmentDate: string;
  appointmentTime: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
}

const AppointmentDateTimeSection: React.FC<AppointmentDateTimeSectionProps> = ({
  appointmentDate,
  appointmentTime,
  onDateChange,
  onTimeChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="appointment_date" className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Дата приема
        </Label>
        <Input
          id="appointment_date"
          type="date"
          value={appointmentDate}
          onChange={(e) => onDateChange(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="appointment_time" className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Время приема
        </Label>
        <Input
          id="appointment_time"
          type="time"
          value={appointmentTime}
          onChange={(e) => onTimeChange(e.target.value)}
          required
        />
      </div>
    </div>
  );
};

export default AppointmentDateTimeSection;
