
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileText } from 'lucide-react';

interface AppointmentNotesSectionProps {
  appointmentNotes: string;
  onNotesChange: (value: string) => void;
}

const AppointmentNotesSection: React.FC<AppointmentNotesSectionProps> = ({
  appointmentNotes,
  onNotesChange,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="appointment_notes" className="flex items-center gap-2">
        <FileText className="w-4 h-4" />
        Дополнительные заметки
      </Label>
      <Textarea
        id="appointment_notes"
        value={appointmentNotes}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder="Опишите жалобы или пожелания к приему"
        rows={3}
      />
    </div>
  );
};

export default AppointmentNotesSection;
