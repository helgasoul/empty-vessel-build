
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { GynecologicalData } from '../../../types/health';

interface GynecologicalStepProps {
  data?: GynecologicalData;
  onComplete: (data: GynecologicalData) => void;
}

const GynecologicalStep: React.FC<GynecologicalStepProps> = ({ data, onComplete }) => {
  const [formData, setFormData] = useState<GynecologicalData>({
    ageFirstPeriod: 13,
    menstrualCycleLength: 28,
    menstrualCycleRegular: true,
    lastMenstrualPeriod: null,
    pregnanciesCount: 0,
    liveBirthsCount: 0,
    miscarriagesCount: 0,
    ageFirstPregnancy: null,
    breastfeedingDuration: 0,
    contraception: {
      current: 'none',
      hormonal: false,
      duration: 0
    },
    menopauseStatus: 'premenopausal',
    ...data
  });

  const handleSubmit = () => {
    onComplete(formData);
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ageFirstPeriod">Возраст первой менструации</Label>
            <Input
              id="ageFirstPeriod"
              type="number"
              value={formData.ageFirstPeriod}
              onChange={(e) => setFormData(prev => ({ ...prev, ageFirstPeriod: parseInt(e.target.value) || 0 }))}
              min="8"
              max="18"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cycleLength">Длительность цикла (дни)</Label>
            <Input
              id="cycleLength"
              type="number"
              value={formData.menstrualCycleLength}
              onChange={(e) => setFormData(prev => ({ ...prev, menstrualCycleLength: parseInt(e.target.value) || 0 }))}
              min="21"
              max="35"
            />
          </div>

          <div className="space-y-2">
            <Label>Регулярность цикла</Label>
            <RadioGroup
              value={formData.menstrualCycleRegular.toString()}
              onValueChange={(value) => setFormData(prev => ({ ...prev, menstrualCycleRegular: value === 'true' }))}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="regular" />
                <Label htmlFor="regular">Регулярный</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="irregular" />
                <Label htmlFor="irregular">Нерегулярный</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pregnancies">Количество беременностей</Label>
            <Input
              id="pregnancies"
              type="number"
              value={formData.pregnanciesCount}
              onChange={(e) => setFormData(prev => ({ ...prev, pregnanciesCount: parseInt(e.target.value) || 0 }))}
              min="0"
              max="10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="births">Количество родов</Label>
            <Input
              id="births"
              type="number"
              value={formData.liveBirthsCount}
              onChange={(e) => setFormData(prev => ({ ...prev, liveBirthsCount: parseInt(e.target.value) || 0 }))}
              min="0"
              max="10"
            />
          </div>

          {formData.liveBirthsCount > 0 && (
            <div className="space-y-2">
              <Label htmlFor="ageFirstPregnancy">Возраст первых родов</Label>
              <Input
                id="ageFirstPregnancy"
                type="number"
                value={formData.ageFirstPregnancy || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, ageFirstPregnancy: parseInt(e.target.value) || null }))}
                min="15"
                max="50"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} className="px-8">
          Продолжить
        </Button>
      </div>
    </div>
  );
};

export default GynecologicalStep;
