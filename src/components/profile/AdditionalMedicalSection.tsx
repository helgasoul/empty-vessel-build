
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Tables } from '@/integrations/supabase/types';

type Profile = Tables<'profiles'>;

interface AdditionalMedicalSectionProps {
  profile: Partial<Profile>;
  onInputChange: (field: keyof Profile, value: any) => void;
}

const AdditionalMedicalSection: React.FC<AdditionalMedicalSectionProps> = ({ profile, onInputChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Дополнительная медицинская информация</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="mental_health_history">История психического здоровья</Label>
          <Textarea
            id="mental_health_history"
            value={profile.mental_health_history || ''}
            onChange={(e) => onInputChange('mental_health_history', e.target.value)}
            placeholder="Депрессия, тревожность, терапия, лечение..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="reproductive_health">Репродуктивное здоровье</Label>
          <Textarea
            id="reproductive_health"
            value={profile.reproductive_health || ''}
            onChange={(e) => onInputChange('reproductive_health', e.target.value)}
            placeholder="Менструальный цикл, беременности, гормональная терапия..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="preferred_doctor">Предпочитаемый врач</Label>
          <Input
            id="preferred_doctor"
            value={profile.preferred_doctor || ''}
            onChange={(e) => onInputChange('preferred_doctor', e.target.value)}
            placeholder="ФИО врача, специализация, контакты"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="insurance_info">Информация о страховке</Label>
          <Input
            id="insurance_info"
            value={profile.insurance_info || ''}
            onChange={(e) => onInputChange('insurance_info', e.target.value)}
            placeholder="Номер полиса, страховая компания"
          />
        </div>
      </div>
    </div>
  );
};

export default AdditionalMedicalSection;
