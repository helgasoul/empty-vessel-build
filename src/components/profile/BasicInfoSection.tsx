
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Tables } from '@/integrations/supabase/types';

type Profile = Tables<'profiles'>;

interface BasicInfoSectionProps {
  profile: Partial<Profile>;
  onInputChange: (field: keyof Profile, value: any) => void;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ profile, onInputChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Основная информация</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="full_name">Полное имя</Label>
          <Input
            id="full_name"
            value={profile.full_name || ''}
            onChange={(e) => onInputChange('full_name', e.target.value)}
            placeholder="Анна Иванова"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date_of_birth">Дата рождения</Label>
          <Input
            id="date_of_birth"
            type="date"
            value={profile.date_of_birth || ''}
            onChange={(e) => onInputChange('date_of_birth', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Пол</Label>
          <Select value={profile.gender || ''} onValueChange={(value) => onInputChange('gender', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите пол" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="female">Женский</SelectItem>
              <SelectItem value="male">Мужской</SelectItem>
              <SelectItem value="other">Другой</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="age">Возраст</Label>
          <Input
            id="age"
            type="number"
            min="18"
            max="120"
            value={profile.age || ''}
            onChange={(e) => onInputChange('age', e.target.value ? parseInt(e.target.value) : null)}
            placeholder="25"
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfoSection;
