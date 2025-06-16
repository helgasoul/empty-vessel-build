
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Tables } from '@/integrations/supabase/types';

type Profile = Tables<'profiles'>;

interface GeneralInfoSectionProps {
  profile: Partial<Profile>;
  onInputChange: (field: keyof Profile, value: any) => void;
}

const GeneralInfoSection: React.FC<GeneralInfoSectionProps> = ({ profile, onInputChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Общая информация</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="lifestyle">Образ жизни</Label>
          <Textarea
            id="lifestyle"
            value={profile.lifestyle || ''}
            onChange={(e) => onInputChange('lifestyle', e.target.value)}
            placeholder="Опишите ваш образ жизни, режим дня, работу..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="health_goals">Цели в области здоровья</Label>
          <Textarea
            id="health_goals"
            value={profile.health_goals || ''}
            onChange={(e) => onInputChange('health_goals', e.target.value)}
            placeholder="Какие у вас цели? Снижение веса, улучшение физической формы, профилактика заболеваний..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="medical_history">Медицинская история</Label>
          <Textarea
            id="medical_history"
            value={profile.medical_history || ''}
            onChange={(e) => onInputChange('medical_history', e.target.value)}
            placeholder="Общая медицинская информация, важные события..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="current_health_issues">Текущие проблемы со здоровьем</Label>
          <Textarea
            id="current_health_issues"
            value={profile.current_health_issues || ''}
            onChange={(e) => onInputChange('current_health_issues', e.target.value)}
            placeholder="Опишите любые текущие симптомы или проблемы со здоровьем..."
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};

export default GeneralInfoSection;
