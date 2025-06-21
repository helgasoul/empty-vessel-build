
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { EndocrineHealthData, OnboardingData } from '@/types/onboarding';

interface EndocrineHealthStepProps {
  data: Partial<OnboardingData>;
  onUpdate: (stepKey: keyof OnboardingData, data: any) => void;
}

const EndocrineHealthStep: React.FC<EndocrineHealthStepProps> = ({ data, onUpdate }) => {
  const endocrineHealth = data.endocrineHealth || {} as EndocrineHealthData;

  const updateField = (field: keyof EndocrineHealthData, value: any) => {
    onUpdate('endocrineHealth', { ...endocrineHealth, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Диабет */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">Сахарный диабет</h4>
        
        <div className="space-y-2">
          <Label>Тип диабета</Label>
          <Select value={endocrineHealth.diabetesType || ''} onValueChange={(value) => updateField('diabetesType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите тип диабета" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Нет диабета</SelectItem>
              <SelectItem value="type1">Сахарный диабет 1 типа</SelectItem>
              <SelectItem value="type2">Сахарный диабет 2 типа</SelectItem>
              <SelectItem value="gestational">Гестационный диабет</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {endocrineHealth.diabetesType && endocrineHealth.diabetesType !== 'none' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="diabetesAge">Возраст на момент диагноза</Label>
              <Input
                id="diabetesAge"
                type="number"
                min="1"
                max="100"
                value={endocrineHealth.diabetesDiagnósedAge || ''}
                onChange={(e) => updateField('diabetesDiagnósedAge', e.target.value ? Number(e.target.value) : null)}
                placeholder="30"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hba1c">Последний HbA1c (%)</Label>
              <Input
                id="hba1c"
                type="number"
                min="4"
                max="20"
                step="0.1"
                value={endocrineHealth.lastHbA1c || ''}
                onChange={(e) => updateField('lastHbA1c', e.target.value ? Number(e.target.value) : null)}
                placeholder="6.5"
              />
              <p className="text-xs text-gray-500">Норма: менее 6.0%</p>
            </div>
          </div>
        )}
      </div>

      {/* Щитовидная железа */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">Щитовидная железа</h4>
        
        <div className="space-y-2">
          <Label className="flex items-center space-x-2">
            <Checkbox
              checked={endocrineHealth.thyroidDisease || false}
              onCheckedChange={(checked) => updateField('thyroidDisease', checked)}
            />
            <span>Заболевания щитовидной железы</span>
          </Label>
        </div>

        {endocrineHealth.thyroidDisease && (
          <div className="space-y-2">
            <Label htmlFor="thyroidType">Тип заболевания</Label>
            <Select value={endocrineHealth.thyroidDiseaseType || ''} onValueChange={(value) => updateField('thyroidDiseaseType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите тип заболевания" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hypothyroidism">Гипотиреоз</SelectItem>
                <SelectItem value="hyperthyroidism">Гипертиреоз</SelectItem>
                <SelectItem value="autoimmune">Аутоиммунный тиреоидит</SelectItem>
                <SelectItem value="nodules">Узлы щитовидной железы</SelectItem>
                <SelectItem value="cancer">Рак щитовидной железы</SelectItem>
                <SelectItem value="other">Другое</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Гормональные расстройства */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">Гормональные расстройства</h4>
        
        <div className="space-y-4">
          <Label className="flex items-center space-x-2">
            <Checkbox
              checked={endocrineHealth.pcos || false}
              onCheckedChange={(checked) => updateField('pcos', checked)}
            />
            <span>Синдром поликистозных яичников (СПКЯ)</span>
          </Label>
          
          <Label className="flex items-center space-x-2">
            <Checkbox
              checked={endocrineHealth.insulinResistance || false}
              onCheckedChange={(checked) => updateField('insulinResistance', checked)}
            />
            <span>Инсулинорезистентность</span>
          </Label>
        </div>
      </div>

      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="font-medium text-green-900 mb-2">Эндокринная система у женщин</h4>
        <p className="text-sm text-green-800">
          Эндокринные заболевания у женщин часто связаны с репродуктивной функцией. 
          СПКЯ может повышать риск диабета 2 типа и сердечно-сосудистых заболеваний. 
          Заболевания щитовидной железы влияют на менструальный цикл и фертильность.
        </p>
      </div>
    </div>
  );
};

export default EndocrineHealthStep;
