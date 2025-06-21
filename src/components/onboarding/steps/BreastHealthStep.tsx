
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
import { BreastHealthData, OnboardingData } from '@/types/onboarding';

interface BreastHealthStepProps {
  data: Partial<OnboardingData>;
  onUpdate: (stepKey: keyof OnboardingData, data: any) => void;
}

const BreastHealthStep: React.FC<BreastHealthStepProps> = ({ data, onUpdate }) => {
  const breastHealth = data.breastHealth || {} as BreastHealthData;

  const updateField = (field: keyof BreastHealthData, value: any) => {
    onUpdate('breastHealth', { ...breastHealth, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Самообследование */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">Самообследование молочных желез</h4>
        
        <div className="space-y-2">
          <Label>Как часто проводите самообследование?</Label>
          <Select value={breastHealth.breastSelfExamFrequency || ''} onValueChange={(value) => updateField('breastSelfExamFrequency', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите частоту" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Ежемесячно</SelectItem>
              <SelectItem value="occasionally">Иногда</SelectItem>
              <SelectItem value="never">Никогда</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">Рекомендуется проводить самообследование ежемесячно на 5-7 день цикла</p>
        </div>
      </div>

      {/* Инструментальные исследования */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">Инструментальные исследования</h4>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Последняя маммография</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {breastHealth.lastMammography ? (
                    format(breastHealth.lastMammography, "dd MMMM yyyy", { locale: ru })
                  ) : (
                    <span>Не проводилась</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={breastHealth.lastMammography || undefined}
                  onSelect={(date) => updateField('lastMammography', date)}
                  initialFocus
                  locale={ru}
                />
              </PopoverContent>
            </Popover>
            <p className="text-xs text-gray-500">Рекомендуется ежегодно после 40 лет</p>
          </div>

          <div className="space-y-2">
            <Label>Последнее УЗИ молочных желез</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {breastHealth.lastUltrasound ? (
                    format(breastHealth.lastUltrasound, "dd MMMM yyyy", { locale: ru })
                  ) : (
                    <span>Не проводилось</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={breastHealth.lastUltrasound || undefined}
                  onSelect={(date) => updateField('lastUltrasound', date)}
                  initialFocus
                  locale={ru}
                />
              </PopoverContent>
            </Popover>
            <p className="text-xs text-gray-500">Рекомендуется ежегодно до 40 лет</p>
          </div>
        </div>
      </div>

      {/* Плотность ткани */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">Характеристики молочных желез</h4>
        
        <div className="space-y-2">
          <Label>Плотность ткани молочных желез</Label>
          <Select value={breastHealth.breastDensity || ''} onValueChange={(value) => updateField('breastDensity', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите плотность" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">A - Преимущественно жировая ткань</SelectItem>
              <SelectItem value="scattered">B - Рассеянные участки плотной ткани</SelectItem>
              <SelectItem value="heterogeneous">C - Неоднородно плотная ткань</SelectItem>
              <SelectItem value="dense">D - Крайне плотная ткань</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">Информация из последней маммографии или УЗИ</p>
        </div>
      </div>

      {/* Операции */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">Хирургические вмешательства</h4>
        
        <div className="space-y-2">
          <Label className="flex items-center space-x-2">
            <Checkbox
              checked={breastHealth.breastSurgery || false}
              onCheckedChange={(checked) => updateField('breastSurgery', checked)}
            />
            <span>Операции на молочных железах</span>
          </Label>
        </div>

        {breastHealth.breastSurgery && (
          <div className="space-y-2">
            <Label htmlFor="surgeryType">Тип операции</Label>
            <Input
              id="surgeryType"
              value={breastHealth.breastSurgeryType || ''}
              onChange={(e) => updateField('breastSurgeryType', e.target.value)}
              placeholder="Например: биопсия, удаление кисты, пластическая операция"
            />
          </div>
        )}
      </div>

      <div className="bg-red-50 p-4 rounded-lg">
        <h4 className="font-medium text-red-900 mb-2">Важность скрининга</h4>
        <p className="text-sm text-red-800">
          Регулярное самообследование и инструментальные исследования молочных желез 
          являются ключевыми факторами ранней диагностики рака молочной железы. 
          Плотность ткани влияет на выбор метода скрининга и частоту обследований.
        </p>
      </div>
    </div>
  );
};

export default BreastHealthStep;
