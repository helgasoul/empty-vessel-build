
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BMIDisplay } from "@/components/ui/bmi-display";
import { CRCProFormData } from './types';

interface CRCProPersonalInfoProps {
  data: CRCProFormData;
  updateData: (updates: Partial<CRCProFormData>) => void;
}

export const CRCProPersonalInfo: React.FC<CRCProPersonalInfoProps> = ({ data, updateData }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="age">Возраст *</Label>
          <Input
            id="age"
            type="number"
            min="18"
            max="100"
            value={data.age}
            onChange={(e) => updateData({ age: parseInt(e.target.value) || 0 })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Пол *</Label>
          <Select value={data.gender} onValueChange={(value: 'male' | 'female') => updateData({ gender: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите пол" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="female">Женский</SelectItem>
              <SelectItem value="male">Мужской</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="height">Рост (см)</Label>
          <Input
            id="height"
            type="number"
            min="100"
            max="250"
            value={data.height_cm || ''}
            onChange={(e) => updateData({ height_cm: parseInt(e.target.value) || undefined })}
            placeholder="Например: 170"
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
            value={data.weight_kg || ''}
            onChange={(e) => updateData({ weight_kg: parseFloat(e.target.value) || undefined })}
            placeholder="Например: 65.5"
          />
        </div>

        {/* Автоматический расчет ИМТ */}
        <div className="flex items-end">
          <BMIDisplay 
            weight={data.weight_kg} 
            height={data.height_cm}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};
