
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { BreastHealthData } from '../../../types/health';

interface BreastHealthStepProps {
  data?: BreastHealthData;
  onComplete: (data: BreastHealthData) => void;
}

const BreastHealthStep: React.FC<BreastHealthStepProps> = ({ data, onComplete }) => {
  const [formData, setFormData] = useState<BreastHealthData>({
    selfExamination: {
      frequency: 'monthly',
      lastExam: null
    },
    screening: {
      lastMammography: null,
      lastUltrasound: null,
      mammographyFrequency: 'annual'
    },
    breastDensity: 'unknown',
    breastSurgery: {
      hasSurgery: false,
      surgeryType: '',
      surgeryDate: null
    },
    familyHistory: {
      motherBreastCancer: false,
      sisterBreastCancer: false,
      otherRelativesBreastCancer: 0,
      ovarianCancerFamily: false
    },
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
            <Label>Частота самообследования</Label>
            <RadioGroup
              value={formData.selfExamination.frequency}
              onValueChange={(value: any) => setFormData(prev => ({ 
                ...prev, 
                selfExamination: { ...prev.selfExamination, frequency: value } 
              }))}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="monthly" id="monthly" />
                <Label htmlFor="monthly">Ежемесячно</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="occasionally" id="occasionally" />
                <Label htmlFor="occasionally">Иногда</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="never" id="never" />
                <Label htmlFor="never">Никогда</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Плотность молочной железы (по данным маммографии)</Label>
            <RadioGroup
              value={formData.breastDensity}
              onValueChange={(value: any) => setFormData(prev => ({ ...prev, breastDensity: value }))}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="low" />
                <Label htmlFor="low">Низкая плотность</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="scattered" id="scattered" />
                <Label htmlFor="scattered">Рассеянные включения</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="heterogeneous" id="heterogeneous" />
                <Label htmlFor="heterogeneous">Неоднородная</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dense" id="dense" />
                <Label htmlFor="dense">Высокая плотность</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="unknown" id="unknown" />
                <Label htmlFor="unknown">Неизвестно</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-3">
            <Label className="text-base font-medium">Семейная история</Label>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="motherBC"
                checked={formData.familyHistory.motherBreastCancer}
                onCheckedChange={(checked) => setFormData(prev => ({
                  ...prev,
                  familyHistory: { ...prev.familyHistory, motherBreastCancer: checked as boolean }
                }))}
              />
              <Label htmlFor="motherBC">Рак молочной железы у матери</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="sisterBC"
                checked={formData.familyHistory.sisterBreastCancer}
                onCheckedChange={(checked) => setFormData(prev => ({
                  ...prev,
                  familyHistory: { ...prev.familyHistory, sisterBreastCancer: checked as boolean }
                }))}
              />
              <Label htmlFor="sisterBC">Рак молочной железы у сестры</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="ovarianBC"
                checked={formData.familyHistory.ovarianCancerFamily}
                onCheckedChange={(checked) => setFormData(prev => ({
                  ...prev,
                  familyHistory: { ...prev.familyHistory, ovarianCancerFamily: checked as boolean }
                }))}
              />
              <Label htmlFor="ovarianBC">Рак яичников в семье</Label>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="breastSurgery"
              checked={formData.breastSurgery.hasSurgery}
              onCheckedChange={(checked) => setFormData(prev => ({
                ...prev,
                breastSurgery: { ...prev.breastSurgery, hasSurgery: checked as boolean }
              }))}
            />
            <Label htmlFor="breastSurgery">Операции на молочной железе в анамнезе</Label>
          </div>
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

export default BreastHealthStep;
