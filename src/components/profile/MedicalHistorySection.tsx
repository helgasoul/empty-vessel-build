
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Tables } from '@/integrations/supabase/types';

type Profile = Tables<'profiles'>;

interface MedicalHistorySectionProps {
  profile: Partial<Profile>;
  onInputChange: (field: keyof Profile, value: any) => void;
}

const MedicalHistorySection: React.FC<MedicalHistorySectionProps> = ({ profile, onInputChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Медицинская история</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="family_history">Семейная история</Label>
          <Textarea
            id="family_history"
            value={profile.family_history || ''}
            onChange={(e) => onInputChange('family_history', e.target.value)}
            placeholder="Заболевания в семье: диабет, сердечно-сосудистые заболевания, онкология..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="chronic_conditions">Хронические заболевания</Label>
          <Textarea
            id="chronic_conditions"
            value={profile.chronic_conditions || ''}
            onChange={(e) => onInputChange('chronic_conditions', e.target.value)}
            placeholder="Хронические заболевания, диагнозы..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="current_medications">Текущие лекарства</Label>
          <Textarea
            id="current_medications"
            value={profile.current_medications || ''}
            onChange={(e) => onInputChange('current_medications', e.target.value)}
            placeholder="Принимаемые препараты, дозировки, режим..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="allergies">Аллергии</Label>
          <Textarea
            id="allergies"
            value={profile.allergies || ''}
            onChange={(e) => onInputChange('allergies', e.target.value)}
            placeholder="Аллергические реакции на лекарства, продукты, другие вещества..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="previous_surgeries">Предыдущие операции</Label>
          <Textarea
            id="previous_surgeries"
            value={profile.previous_surgeries || ''}
            onChange={(e) => onInputChange('previous_surgeries', e.target.value)}
            placeholder="Перенесенные операции, даты, особенности..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="vaccination_history">История вакцинации</Label>
          <Textarea
            id="vaccination_history"
            value={profile.vaccination_history || ''}
            onChange={(e) => onInputChange('vaccination_history', e.target.value)}
            placeholder="Вакцинации, даты, реакции..."
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};

export default MedicalHistorySection;
