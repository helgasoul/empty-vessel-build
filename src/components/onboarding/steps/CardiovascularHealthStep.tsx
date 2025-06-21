
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { CardiovascularHealthData, OnboardingData } from '@/types/onboarding';

interface CardiovascularHealthStepProps {
  data: Partial<OnboardingData>;
  onUpdate: (stepKey: keyof OnboardingData, data: any) => void;
}

const CardiovascularHealthStep: React.FC<CardiovascularHealthStepProps> = ({ data, onUpdate }) => {
  const cardiovascularHealth = data.cardiovascularHealth || {} as CardiovascularHealthData;

  const updateField = (field: keyof CardiovascularHealthData, value: any) => {
    onUpdate('cardiovascularHealth', { ...cardiovascularHealth, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Артериальное давление */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">Артериальное давление</h4>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="systolic">Систолическое (верхнее) давление</Label>
            <Input
              id="systolic"
              type="number"
              min="80"
              max="250"
              value={cardiovascularHealth.systolicBP || ''}
              onChange={(e) => updateField('systolicBP', e.target.value ? Number(e.target.value) : null)}
              placeholder="120"
            />
            <p className="text-xs text-gray-500">Нормальное: менее 120 мм рт.ст.</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="diastolic">Диастолическое (нижнее) давление</Label>
            <Input
              id="diastolic"
              type="number"
              min="40"
              max="150"
              value={cardiovascularHealth.diastolicBP || ''}
              onChange={(e) => updateField('diastolicBP', e.target.value ? Number(e.target.value) : null)}
              placeholder="80"
            />
            <p className="text-xs text-gray-500">Нормальное: менее 80 мм рт.ст.</p>
          </div>
        </div>
      </div>

      {/* Пульс */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">Пульс</h4>
        
        <div className="space-y-2">
          <Label htmlFor="heartRate">Пульс в покое (уд/мин)</Label>
          <Input
            id="heartRate"
            type="number"
            min="40"
            max="200"
            value={cardiovascularHealth.restingHeartRate || ''}
            onChange={(e) => updateField('restingHeartRate', e.target.value ? Number(e.target.value) : null)}
            placeholder="70"
          />
          <p className="text-xs text-gray-500">Нормальный: 60-100 уд/мин</p>
        </div>
      </div>

      {/* Липидный профиль */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">Липидный профиль (последний анализ)</h4>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="totalCholesterol">Общий холестерин</Label>
            <Input
              id="totalCholesterol"
              type="number"
              min="2"
              max="15"
              step="0.1"
              value={cardiovascularHealth.cholesterolTotal || ''}
              onChange={(e) => updateField('cholesterolTotal', e.target.value ? Number(e.target.value) : null)}
              placeholder="5.2"
            />
            <p className="text-xs text-gray-500">ммоль/л, норма: менее 5.2</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="hdlCholesterol">HDL (хороший)</Label>
            <Input
              id="hdlCholesterol"
              type="number"
              min="0.5"
              max="5"
              step="0.1"
              value={cardiovascularHealth.cholesterolHDL || ''}
              onChange={(e) => updateField('cholesterolHDL', e.target.value ? Number(e.target.value) : null)}
              placeholder="1.3"
            />
            <p className="text-xs text-gray-500">ммоль/л, норма: более 1.2 для женщин</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ldlCholesterol">LDL (плохой)</Label>
            <Input
              id="ldlCholesterol"
              type="number"
              min="1"
              max="10"
              step="0.1"
              value={cardiovascularHealth.cholesterolLDL || ''}
              onChange={(e) => updateField('cholesterolLDL', e.target.value ? Number(e.target.value) : null)}
              placeholder="3.3"
            />
            <p className="text-xs text-gray-500">ммоль/л, норма: менее 3.3</p>
          </div>
        </div>
      </div>

      {/* Заболевания */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">Сердечно-сосудистые заболевания</h4>
        
        <div className="space-y-4">
          <Label className="flex items-center space-x-2">
            <Checkbox
              checked={cardiovascularHealth.hypertension || false}
              onCheckedChange={(checked) => updateField('hypertension', checked)}
            />
            <span>Артериальная гипертензия</span>
          </Label>
          
          <Label className="flex items-center space-x-2">
            <Checkbox
              checked={cardiovascularHealth.heartDisease || false}
              onCheckedChange={(checked) => updateField('heartDisease', checked)}
            />
            <span>Заболевания сердца (ИБС, стенокардия, инфаркт)</span>
          </Label>
          
          <Label className="flex items-center space-x-2">
            <Checkbox
              checked={cardiovascularHealth.strokeHistory || false}
              onCheckedChange={(checked) => updateField('strokeHistory', checked)}
            />
            <span>Инсульт в анамнезе</span>
          </Label>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Сердечно-сосудистые риски у женщин</h4>
        <p className="text-sm text-blue-800">
          У женщин сердечно-сосудистые заболевания часто развиваются после менопаузы 
          из-за снижения уровня эстрогенов. Важно контролировать давление, холестерин 
          и регулярно проходить обследования, особенно при наличии семейной истории.
        </p>
      </div>
    </div>
  );
};

export default CardiovascularHealthStep;
