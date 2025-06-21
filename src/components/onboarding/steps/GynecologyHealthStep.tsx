
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { GynecologyHealthData, OnboardingData } from '@/types/onboarding';

interface GynecologyHealthStepProps {
  data: Partial<OnboardingData>;
  onUpdate: (stepKey: keyof OnboardingData, data: any) => void;
}

const GynecologyHealthStep: React.FC<GynecologyHealthStepProps> = ({ data, onUpdate }) => {
  const gynecologyHealth = data.gynecologyHealth || {} as GynecologyHealthData;

  const updateField = (field: keyof GynecologyHealthData, value: any) => {
    onUpdate('gynecologyHealth', { ...gynecologyHealth, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Менструальный цикл */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">Менструальный цикл</h4>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="cycleLength">Длина цикла (дни)</Label>
            <Input
              id="cycleLength"
              type="number"
              min="21"
              max="35"
              value={gynecologyHealth.menstrualCycleLength || ''}
              onChange={(e) => updateField('menstrualCycleLength', e.target.value ? Number(e.target.value) : null)}
              placeholder="28"
            />
            <p className="text-xs text-gray-500">Обычно от 21 до 35 дней</p>
          </div>
          
          <div className="space-y-2">
            <Label className="flex items-center space-x-2">
              <Checkbox
                checked={gynecologyHealth.menstrualCycleRegular || false}
                onCheckedChange={(checked) => updateField('menstrualCycleRegular', checked)}
              />
              <span>Регулярный цикл</span>
            </Label>
            <p className="text-xs text-gray-500">Цикл считается регулярным, если колебания не превышают 3-4 дня</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Дата последней менструации</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {gynecologyHealth.lastMenstrualPeriod ? (
                  format(gynecologyHealth.lastMenstrualPeriod, "dd MMMM yyyy", { locale: ru })
                ) : (
                  <span>Выберите дату</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={gynecologyHealth.lastMenstrualPeriod || undefined}
                onSelect={(date) => updateField('lastMenstrualPeriod', date)}
                initialFocus
                locale={ru}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Беременности и роды */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">Беременности и роды</h4>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="pregnancies">Всего беременностей</Label>
            <Input
              id="pregnancies"
              type="number"
              min="0"
              max="20"
              value={gynecologyHealth.pregnanciesCount || ''}
              onChange={(e) => updateField('pregnanciesCount', e.target.value ? Number(e.target.value) : 0)}
              placeholder="0"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="liveBirths">Роды</Label>
            <Input
              id="liveBirths"
              type="number"
              min="0"
              max="20"
              value={gynecologyHealth.liveBirthsCount || ''}
              onChange={(e) => updateField('liveBirthsCount', e.target.value ? Number(e.target.value) : 0)}
              placeholder="0"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="miscarriages">Выкидыши</Label>
            <Input
              id="miscarriages"
              type="number"
              min="0"
              max="10"
              value={gynecologyHealth.miscarriagesCount || ''}
              onChange={(e) => updateField('miscarriagesCount', e.target.value ? Number(e.target.value) : 0)}
              placeholder="0"
            />
          </div>
        </div>

        {gynecologyHealth.pregnanciesCount > 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="ageFirstPregnancy">Возраст первой беременности</Label>
              <Input
                id="ageFirstPregnancy"
                type="number"
                min="12"
                max="50"
                value={gynecologyHealth.ageFirstPregnancy || ''}
                onChange={(e) => updateField('ageFirstPregnancy', e.target.value ? Number(e.target.value) : null)}
                placeholder="25"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="breastfeeding">Общая продолжительность ГВ (месяцы)</Label>
              <Input
                id="breastfeeding"
                type="number"
                min="0"
                max="120"
                value={gynecologyHealth.breastfeedingDuration || ''}
                onChange={(e) => updateField('breastfeedingDuration', e.target.value ? Number(e.target.value) : 0)}
                placeholder="12"
              />
            </div>
          </div>
        )}
      </div>

      {/* Контрацепция и гормональная терапия */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">Контрацепция и гормональная терапия</h4>
        
        <div className="space-y-2">
          <Label>Текущая контрацепция</Label>
          <Select value={gynecologyHealth.currentContraception || ''} onValueChange={(value) => updateField('currentContraception', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите метод контрацепции" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Не использую</SelectItem>
              <SelectItem value="pills">Противозачаточные таблетки</SelectItem>
              <SelectItem value="iud">ВМС (спираль)</SelectItem>
              <SelectItem value="hormonal_iud">Гормональная ВМС</SelectItem>
              <SelectItem value="implant">Имплант</SelectItem>
              <SelectItem value="patch">Пластырь</SelectItem>
              <SelectItem value="ring">Вагинальное кольцо</SelectItem>
              <SelectItem value="barrier">Барьерные методы</SelectItem>
              <SelectItem value="natural">Естественные методы</SelectItem>
              <SelectItem value="sterilization">Стерилизация</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center space-x-2">
            <Checkbox
              checked={gynecologyHealth.hormoneTherapy || false}
              onCheckedChange={(checked) => updateField('hormoneTherapy', checked)}
            />
            <span>Принимаю гормональную терапию</span>
          </Label>
        </div>

        {gynecologyHealth.hormoneTherapy && (
          <div className="space-y-2">
            <Label htmlFor="hormoneType">Тип гормональной терапии</Label>
            <Input
              id="hormoneType"
              value={gynecologyHealth.hormoneTherapyType || ''}
              onChange={(e) => updateField('hormoneTherapyType', e.target.value)}
              placeholder="Например: ЗГТ, эстрогены, прогестины"
            />
          </div>
        )}
      </div>

      <div className="bg-pink-50 p-4 rounded-lg">
        <h4 className="font-medium text-pink-900 mb-2">Важно для анализа рисков</h4>
        <p className="text-sm text-pink-800">
          Информация о менструальном цикле, беременностях и гормональной терапии 
          критически важна для оценки рисков рака молочной железы, яичников, 
          эндометрия и других гинекологических заболеваний.
        </p>
      </div>
    </div>
  );
};

export default GynecologyHealthStep;
