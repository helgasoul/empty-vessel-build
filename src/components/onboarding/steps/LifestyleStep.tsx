
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { LifestyleData, OnboardingData } from '@/types/onboarding';

interface LifestyleStepProps {
  data: Partial<OnboardingData>;
  onUpdate: (stepKey: keyof OnboardingData, data: any) => void;
}

const LifestyleStep: React.FC<LifestyleStepProps> = ({ data, onUpdate }) => {
  const lifestyle = data.lifestyle || {} as LifestyleData;

  const updateField = (field: keyof LifestyleData, value: any) => {
    onUpdate('lifestyle', { ...lifestyle, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Курение */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">Курение</h4>
        
        <div className="space-y-2">
          <Label>Статус курения</Label>
          <Select value={lifestyle.smokingStatus || ''} onValueChange={(value) => updateField('smokingStatus', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите статус" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="never">Никогда не курила</SelectItem>
              <SelectItem value="former">Бросила курить</SelectItem>
              <SelectItem value="current">Курю в настоящее время</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {(lifestyle.smokingStatus === 'former' || lifestyle.smokingStatus === 'current') && (
          <div className="space-y-2">
            <Label htmlFor="packYears">Индекс курения (пачка-лет)</Label>
            <Input
              id="packYears"
              type="number"
              min="0"
              max="100"
              step="0.5"
              value={lifestyle.smokingPackYears || ''}
              onChange={(e) => updateField('smokingPackYears', e.target.value ? Number(e.target.value) : null)}
              placeholder="10"
            />
            <p className="text-xs text-gray-500">Количество пачек в день × количество лет курения</p>
          </div>
        )}
      </div>

      {/* Алкоголь */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">Алкоголь</h4>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Частота употребления</Label>
            <Select value={lifestyle.alcoholFrequency || ''} onValueChange={(value) => updateField('alcoholFrequency', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите частоту" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="never">Не употребляю</SelectItem>
                <SelectItem value="monthly">Раз в месяц или реже</SelectItem>
                <SelectItem value="weekly">1-3 раза в неделю</SelectItem>
                <SelectItem value="daily">Почти ежедневно</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="drinksPerWeek">Порций в неделю</Label>
            <Input
              id="drinksPerWeek"
              type="number"
              min="0"
              max="50"
              value={lifestyle.alcoholDrinksPerWeek || ''}
              onChange={(e) => updateField('alcoholDrinksPerWeek', e.target.value ? Number(e.target.value) : 0)}
              placeholder="2"
            />
            <p className="text-xs text-gray-500">1 порция = 150 мл вина или 50 мл крепкого алкоголя</p>
          </div>
        </div>
      </div>

      {/* Физическая активность */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">Физическая активность</h4>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Частота тренировок</Label>
            <Select value={lifestyle.exerciseFrequency || ''} onValueChange={(value) => updateField('exerciseFrequency', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите частоту" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="never">Не занимаюсь</SelectItem>
                <SelectItem value="rarely">1-2 раза в месяц</SelectItem>
                <SelectItem value="weekly">1-3 раза в неделю</SelectItem>
                <SelectItem value="daily">Почти ежедневно</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Интенсивность нагрузок</Label>
            <Select value={lifestyle.exerciseIntensity || ''} onValueChange={(value) => updateField('exerciseIntensity', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите интенсивность" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Легкая (прогулки, йога)</SelectItem>
                <SelectItem value="moderate">Умеренная (быстрая ходьба, плавание)</SelectItem>
                <SelectItem value="vigorous">Интенсивная (бег, силовые тренировки)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Питание */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">Питание</h4>
        
        <div className="space-y-2">
          <Label htmlFor="dietType">Тип питания</Label>
          <Input
            id="dietType"
            value={lifestyle.dietType || ''}
            onChange={(e) => updateField('dietType', e.target.value)}
            placeholder="Например: обычное, вегетарианское, средиземноморское"
          />
        </div>
      </div>

      {/* Профессиональные факторы */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">Профессиональные и экологические факторы</h4>
        
        <div className="space-y-2">
          <Label htmlFor="occupation">Профессия</Label>
          <Input
            id="occupation"
            value={lifestyle.occupation || ''}
            onChange={(e) => updateField('occupation', e.target.value)}
            placeholder="Ваша профессия"
          />
        </div>

        <div className="space-y-2">
          <Label>Уровень стресса на работе: {lifestyle.workStressLevel || 5}/10</Label>
          <Slider
            value={[lifestyle.workStressLevel || 5]}
            onValueChange={(value) => updateField('workStressLevel', value[0])}
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

        <div className="space-y-4">
          <Label className="flex items-center space-x-2">
            <Checkbox
              checked={lifestyle.chemicalExposure || false}
              onCheckedChange={(checked) => updateField('chemicalExposure', checked)}
            />
            <span>Контакт с химическими веществами на работе</span>
          </Label>
          
          <Label className="flex items-center space-x-2">
            <Checkbox
              checked={lifestyle.radiationExposure || false}
              onCheckedChange={(checked) => updateField('radiationExposure', checked)}
            />
            <span>Воздействие радиации</span>
          </Label>
        </div>
      </div>

      <div className="bg-orange-50 p-4 rounded-lg">
        <h4 className="font-medium text-orange-900 mb-2">Влияние образа жизни на здоровье</h4>
        <p className="text-sm text-orange-800">
          Образ жизни является одним из ключевых факторов, влияющих на риск развития 
          хронических заболеваний. Курение, злоупотребление алкоголем, низкая физическая 
          активность и профессиональные вредности могут значительно повышать риски 
          онкологических и сердечно-сосудистых заболеваний.
        </p>
      </div>
    </div>
  );
};

export default LifestyleStep;
