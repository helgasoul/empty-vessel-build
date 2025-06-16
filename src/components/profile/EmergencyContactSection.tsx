
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Tables } from '@/integrations/supabase/types';

type Profile = Tables<'profiles'>;

interface EmergencyContactSectionProps {
  profile: Partial<Profile>;
  onInputChange: (field: keyof Profile, value: any) => void;
}

const EmergencyContactSection: React.FC<EmergencyContactSectionProps> = ({ profile, onInputChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Экстренные контакты</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="emergency_contact_name">Имя контакта</Label>
          <Input
            id="emergency_contact_name"
            value={profile.emergency_contact_name || ''}
            onChange={(e) => onInputChange('emergency_contact_name', e.target.value)}
            placeholder="ФИО экстренного контакта"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="emergency_contact_phone">Телефон</Label>
          <Input
            id="emergency_contact_phone"
            value={profile.emergency_contact_phone || ''}
            onChange={(e) => onInputChange('emergency_contact_phone', e.target.value)}
            placeholder="+7 (999) 123-45-67"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="emergency_contact_relation">Отношение</Label>
          <Input
            id="emergency_contact_relation"
            value={profile.emergency_contact_relation || ''}
            onChange={(e) => onInputChange('emergency_contact_relation', e.target.value)}
            placeholder="Родственник, друг, коллега"
          />
        </div>
      </div>
    </div>
  );
};

export default EmergencyContactSection;
