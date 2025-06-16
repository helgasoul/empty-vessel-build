
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Tables } from '@/integrations/supabase/types';

type Profile = Tables<'profiles'>;

interface LifestyleSectionProps {
  profile: Partial<Profile>;
  onInputChange: (field: keyof Profile, value: any) => void;
}

const LifestyleSection: React.FC<LifestyleSectionProps> = ({ profile, onInputChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Образ жизни</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="activity_level">Уровень активности</Label>
          <Select value={profile.activity_level || ''} onValueChange={(value) => onInputChange('activity_level', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите уровень" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedentary">Малоподвижный</SelectItem>
              <SelectItem value="lightly_active">Слегка активный</SelectItem>
              <SelectItem value="moderately_active">Умеренно активный</SelectItem>
              <SelectItem value="very_active">Очень активный</SelectItem>
              <SelectItem value="extremely_active">Крайне активный</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="exercise_frequency">Частота упражнений</Label>
          <Select value={profile.exercise_frequency || ''} onValueChange={(value) => onInputChange('exercise_frequency', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Частота тренировок" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="never">Никогда</SelectItem>
              <SelectItem value="rarely">Редко</SelectItem>
              <SelectItem value="weekly">Еженедельно</SelectItem>
              <SelectItem value="daily">Ежедневно</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="stress_levels">Уровень стресса</Label>
          <Select value={profile.stress_levels || ''} onValueChange={(value) => onInputChange('stress_levels', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Уровень стресса" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Низкий</SelectItem>
              <SelectItem value="moderate">Умеренный</SelectItem>
              <SelectItem value="high">Высокий</SelectItem>
              <SelectItem value="very_high">Очень высокий</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="smoking_status">Курение</Label>
          <Select value={profile.smoking_status || ''} onValueChange={(value) => onInputChange('smoking_status', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Статус курения" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="never">Никогда не курил(а)</SelectItem>
              <SelectItem value="former">Бросил(а) курить</SelectItem>
              <SelectItem value="current">Курю</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="alcohol_consumption">Алкоголь</Label>
          <Select value={profile.alcohol_consumption || ''} onValueChange={(value) => onInputChange('alcohol_consumption', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Употребление алкоголя" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="never">Никогда</SelectItem>
              <SelectItem value="rarely">Редко</SelectItem>
              <SelectItem value="occasionally">Иногда</SelectItem>
              <SelectItem value="regularly">Регулярно</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="last_checkup_date">Последний осмотр</Label>
          <Input
            id="last_checkup_date"
            type="date"
            value={profile.last_checkup_date || ''}
            onChange={(e) => onInputChange('last_checkup_date', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="sleep_patterns">Режим сна</Label>
          <Textarea
            id="sleep_patterns"
            value={profile.sleep_patterns || ''}
            onChange={(e) => onInputChange('sleep_patterns', e.target.value)}
            placeholder="Опишите ваш режим сна: время отхода ко сну, продолжительность, качество..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dietary_restrictions">Диетические ограничения</Label>
          <Textarea
            id="dietary_restrictions"
            value={profile.dietary_restrictions || ''}
            onChange={(e) => onInputChange('dietary_restrictions', e.target.value)}
            placeholder="Аллергии на продукты, диеты, предпочтения в питании..."
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};

export default LifestyleSection;
