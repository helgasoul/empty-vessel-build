
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { NeuroHealthData, OnboardingData } from '@/types/onboarding';

interface NeuroHealthStepProps {
  data: Partial<OnboardingData>;
  onUpdate: (stepKey: keyof OnboardingData, data: any) => void;
}

const NeuroHealthStep: React.FC<NeuroHealthStepProps> = ({ data, onUpdate }) => {
  const neuroHealth = data.neuroHealth || {} as NeuroHealthData;

  const updateField = (field: keyof NeuroHealthData, value: any) => {
    onUpdate('neuroHealth', { ...neuroHealth, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Психическое здоровье */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">Психическое здоровье</h4>
        
        <div className="space-y-4">
          <Label className="flex items-center space-x-2">
            <Checkbox
              checked={neuroHealth.depressionHistory || false}
              onCheckedChange={(checked) => updateField('depressionHistory', checked)}
            />
            <span>История депрессии</span>
          </Label>
          
          <Label className="flex items-center space-x-2">
            <Checkbox
              checked={neuroHealth.anxietyDisorder || false}
              onCheckedChange={(checked) => updateField('anxietyDisorder', checked)}
            />
            <span>Тревожные расстройства</span>
          </Label>
          
          <Label className="flex items-center space-x-2">
            <Checkbox
              checked={neuroHealth.memoryConcerns || false}
              onCheckedChange={(checked) => updateField('memoryConcerns', checked)}
            />
            <span>Проблемы с памятью</span>
          </Label>
        </div>
      </div>

      {/* Сон */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">Сон</h4>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="sleepDuration">Продолжительность сна (часы)</Label>
            <Input
              id="sleepDuration"
              type="number"
              min="3"
              max="12"
              step="0.5"
              value={neuroHealth.sleepDuration || ''}
              onChange={(e) => updateField('sleepDuration', e.target.value ? Number(e.target.value) : null)}
              placeholder="7.5"
            />
            <p className="text-xs text-gray-500">Рекомендуется: 7-9 часов</p>
          </div>
          
          <div className="space-y-2">
            <Label>Качество сна: {neuroHealth.sleepQuality || 5}/10</Label>
            <Slider
              value={[neuroHealth.sleepQuality || 5]}
              onValueChange={(value) => updateField('sleepQuality', value[0])}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Очень плохо</span>
              <span>Отлично</span>
            </div>
          </div>
        </div>
      </div>

      {/* Стресс */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">Стресс</h4>
        
        <div className="space-y-2">
          <Label>Уровень стресса: {neuroHealth.stressLevel || 5}/10</Label>
          <Slider
            value={[neuroHealth.stressLevel || 5]}
            onValueChange={(value) => updateField('stressLevel', value[0])}
            max={10}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Минимальный</span>
            <span>Экстремальный</span>
          </div>
        </div>
      </div>

      {/* Головные боли */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">Головные боли</h4>
        
        <div className="space-y-2">
          <Label>Частота головных болей</Label>
          <Select value={neuroHealth.headacheFrequency || ''} onValueChange={(value) => updateField('headacheFrequency', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите частоту" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="never">Никогда</SelectItem>
              <SelectItem value="rarely">Редко (менее 1 раза в месяц)</SelectItem>
              <SelectItem value="monthly">Ежемесячно</SelectItem>
              <SelectItem value="weekly">Еженедельно</SelectItem>
              <SelectItem value="daily">Ежедневно</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-purple-50 p-4 rounded-lg">
        <h4 className="font-medium text-purple-900 mb-2">Неврологическое здоровье женщин</h4>
        <p className="text-sm text-purple-800">
          Женщины чаще мужчин страдают от мигрени, депрессии и тревожных расстройств. 
          Гормональные изменения во время менструального цикла, беременности и менопаузы 
          могут влиять на неврологические симптомы. Качественный сон критически важен 
          для когнитивного здоровья и профилактики нейродегенеративных заболеваний.
        </p>
      </div>
    </div>
  );
};

export default NeuroHealthStep;
