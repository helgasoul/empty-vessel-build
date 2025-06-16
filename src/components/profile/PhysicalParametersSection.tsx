
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BMIDisplay } from "@/components/ui/bmi-display";
import type { Tables } from '@/integrations/supabase/types';

type Profile = Tables<'profiles'>;

interface PhysicalParametersSectionProps {
  profile: Partial<Profile>;
  onInputChange: (field: keyof Profile, value: any) => void;
}

const PhysicalParametersSection: React.FC<PhysicalParametersSectionProps> = ({ profile, onInputChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Физические параметры</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="height">Рост (см)</Label>
          <Input
            id="height"
            type="number"
            min="100"
            max="250"
            value={profile.height || ''}
            onChange={(e) => onInputChange('height', e.target.value ? parseInt(e.target.value) : null)}
            placeholder="165"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight">Вес (кг)</Label>
          <Input
            id="weight"
            type="number"
            min="30"
            max="300"
            step="0.1"
            value={profile.weight || ''}
            onChange={(e) => onInputChange('weight', e.target.value ? parseFloat(e.target.value) : null)}
            placeholder="60.5"
          />
        </div>

        <div className="flex items-end">
          <BMIDisplay 
            weight={profile.weight} 
            height={profile.height}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default PhysicalParametersSection;
