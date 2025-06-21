import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Users } from "lucide-react";
import { FamilyHistoryData, OnboardingData } from '@/types/onboarding';

interface FamilyHistoryStepProps {
  data: Partial<OnboardingData>;
  onUpdate: (stepKey: keyof OnboardingData, data: any) => void;
}

const FamilyHistoryStep: React.FC<FamilyHistoryStepProps> = ({ data, onUpdate }) => {
  const familyHistory = data.familyHistory || [];
  const [currentRelative, setCurrentRelative] = useState<Partial<FamilyHistoryData>>({
    relationship: '',
    breastCancer: false,
    breastCancerAge: null,
    ovarianCancer: false,
    ovarianCancerAge: null,
    colorectalCancer: false,
    colorectalCancerAge: null,
    lungCancer: false,
    lungCancerAge: null,
    otherCancer: '',
    otherCancerAge: null,
    heartAttack: false,
    heartAttackAge: null,
    stroke: false,
    strokeAge: null,
    hypertension: false,
    diabetes: false,
    diabetesAge: null,
    osteoporosis: false,
    alzheimer: false,
    alzheimerAge: null
  });

  const updateCurrentField = (field: keyof FamilyHistoryData, value: any) => {
    setCurrentRelative(prev => ({ ...prev, [field]: value }));
  };

  const addRelative = () => {
    if (!currentRelative.relationship) {
      return;
    }
    
    const newFamilyHistory = [...familyHistory, currentRelative as FamilyHistoryData];
    onUpdate('familyHistory', newFamilyHistory);
    
    // Reset form
    setCurrentRelative({
      relationship: '',
      breastCancer: false,
      breastCancerAge: null,
      ovarianCancer: false,
      ovarianCancerAge: null,
      colorectalCancer: false,
      colorectalCancerAge: null,
      lungCancer: false,
      lungCancerAge: null,
      otherCancer: '',
      otherCancerAge: null,
      heartAttack: false,
      heartAttackAge: null,
      stroke: false,
      strokeAge: null,
      hypertension: false,
      diabetes: false,
      diabetesAge: null,
      osteoporosis: false,
      alzheimer: false,
      alzheimerAge: null
    });
  };

  const removeRelative = (index: number) => {
    const newFamilyHistory = familyHistory.filter((_, i) => i !== index);
    onUpdate('familyHistory', newFamilyHistory);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-gray-600">
          Добавьте информацию о заболеваниях у ваших близких родственников. 
          Семейная история помогает оценить генетические риски.
        </p>
      </div>

      {/* Existing relatives */}
      {familyHistory.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Добавленные родственники</span>
          </h4>
          
          {familyHistory.map((relative, index) => (
            <Card key={index} className="bg-gray-50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base">{relative.relationship}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeRelative(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">
                  {[
                    relative.breastCancer && `Рак молочной железы${relative.breastCancerAge ? ` (${relative.breastCancerAge} лет)` : ''}`,
                    relative.ovarianCancer && `Рак яичников${relative.ovarianCancerAge ? ` (${relative.ovarianCancerAge} лет)` : ''}`,
                    relative.colorectalCancer && `Колоректальный рак${relative.colorectalCancerAge ? ` (${relative.colorectalCancerAge} лет)` : ''}`,
                    relative.lungCancer && `Рак легких${relative.lungCancerAge ? ` (${relative.lungCancerAge} лет)` : ''}`,
                    relative.otherCancer && `${relative.otherCancer}${relative.otherCancerAge ? ` (${relative.otherCancerAge} лет)` : ''}`,
                    relative.heartAttack && `Инфаркт${relative.heartAttackAge ? ` (${relative.heartAttackAge} лет)` : ''}`,
                    relative.stroke && `Инсульт${relative.strokeAge ? ` (${relative.strokeAge} лет)` : ''}`,
                    relative.hypertension && 'Гипертония',
                    relative.diabetes && `Диабет${relative.diabetesAge ? ` (${relative.diabetesAge} лет)` : ''}`,
                    relative.osteoporosis && 'Остеопороз',
                    relative.alzheimer && `Болезнь Альцгеймера${relative.alzheimerAge ? ` (${relative.alzheimerAge} лет)` : ''}`
                  ].filter(Boolean).join(', ') || 'Заболевания не указаны'}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add new relative form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Добавить родственника</span>
          </CardTitle>
          <CardDescription>
            Укажите степень родства и заболевания
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Relationship */}
          <div className="space-y-2">
            <Label>Степень родства *</Label>
            <Select value={currentRelative.relationship || ''} onValueChange={(value) => updateCurrentField('relationship', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите родственника" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mother">Мать</SelectItem>
                <SelectItem value="father">Отец</SelectItem>
                <SelectItem value="sister">Сестра</SelectItem>
                <SelectItem value="brother">Брат</SelectItem>
                <SelectItem value="maternal_grandmother">Бабушка по маме</SelectItem>
                <SelectItem value="paternal_grandmother">Бабушка по папе</SelectItem>
                <SelectItem value="maternal_grandfather">Дедушка по маме</SelectItem>
                <SelectItem value="paternal_grandfather">Дедушка по папе</SelectItem>
                <SelectItem value="maternal_aunt">Тетя по маме</SelectItem>
                <SelectItem value="paternal_aunt">Тетя по папе</SelectItem>
                <SelectItem value="maternal_uncle">Дядя по маме</SelectItem>
                <SelectItem value="paternal_uncle">Дядя по папе</SelectItem>
                <SelectItem value="daughter">Дочь</SelectItem>
                <SelectItem value="son">Сын</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Cancer history */}
          <div className="space-y-4">
            <h5 className="font-medium text-gray-900">Онкологические заболевания</h5>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <Checkbox
                    checked={currentRelative.breastCancer || false}
                    onCheckedChange={(checked) => updateCurrentField('breastCancer', checked)}
                  />
                  <span>Рак молочной железы</span>
                </Label>
                {currentRelative.breastCancer && (
                  <Input
                    type="number"
                    placeholder="Возраст диагноза"
                    value={currentRelative.breastCancerAge || ''}
                    onChange={(e) => updateCurrentField('breastCancerAge', e.target.value ? Number(e.target.value) : null)}
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <Checkbox
                    checked={currentRelative.ovarianCancer || false}
                    onCheckedChange={(checked) => updateCurrentField('ovarianCancer', checked)}
                  />
                  <span>Рак яичников</span>
                </Label>
                {currentRelative.ovarianCancer && (
                  <Input
                    type="number"
                    placeholder="Возраст диагноза"
                    value={currentRelative.ovarianCancerAge || ''}
                    onChange={(e) => updateCurrentField('ovarianCancerAge', e.target.value ? Number(e.target.value) : null)}
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <Checkbox
                    checked={currentRelative.colorectalCancer || false}
                    onCheckedChange={(checked) => updateCurrentField('colorectalCancer', checked)}
                  />
                  <span>Колоректальный рак</span>
                </Label>
                {currentRelative.colorectalCancer && (
                  <Input
                    type="number"
                    placeholder="Возраст диагноза"
                    value={currentRelative.colorectalCancerAge || ''}
                    onChange={(e) => updateCurrentField('colorectalCancerAge', e.target.value ? Number(e.target.value) : null)}
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <Checkbox
                    checked={currentRelative.lungCancer || false}
                    onCheckedChange={(checked) => updateCurrentField('lungCancer', checked)}
                  />
                  <span>Рак легких</span>
                </Label>
                {currentRelative.lungCancer && (
                  <Input
                    type="number"
                    placeholder="Возраст диагноза"
                    value={currentRelative.lungCancerAge || ''}
                    onChange={(e) => updateCurrentField('lungCancerAge', e.target.value ? Number(e.target.value) : null)}
                  />
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Input
                placeholder="Другой тип рака"
                value={currentRelative.otherCancer || ''}
                onChange={(e) => updateCurrentField('otherCancer', e.target.value)}
              />
              {currentRelative.otherCancer && (
                <Input
                  type="number"
                  placeholder="Возраст диагноза"
                  value={currentRelative.otherCancerAge || ''}
                  onChange={(e) => updateCurrentField('otherCancerAge', e.target.value ? Number(e.target.value) : null)}
                />
              )}
            </div>
          </div>

          {/* Cardiovascular diseases */}
          <div className="space-y-4">
            <h5 className="font-medium text-gray-900">Сердечно-сосудистые заболевания</h5>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <Checkbox
                    checked={currentRelative.heartAttack || false}
                    onCheckedChange={(checked) => updateCurrentField('heartAttack', checked)}
                  />
                  <span>Инфаркт миокарда</span>
                </Label>
                {currentRelative.heartAttack && (
                  <Input
                    type="number"
                    placeholder="Возраст"
                    value={currentRelative.heartAttackAge || ''}
                    onChange={(e) => updateCurrentField('heartAttackAge', e.target.value ? Number(e.target.value) : null)}
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <Checkbox
                    checked={currentRelative.stroke || false}
                    onCheckedChange={(checked) => updateCurrentField('stroke', checked)}
                  />
                  <span>Инсульт</span>
                </Label>
                {currentRelative.stroke && (
                  <Input
                    type="number"
                    placeholder="Возраст"
                    value={currentRelative.strokeAge || ''}
                    onChange={(e) => updateCurrentField('strokeAge', e.target.value ? Number(e.target.value) : null)}
                  />
                )}
              </div>
            </div>

            <Label className="flex items-center space-x-2">
              <Checkbox
                checked={currentRelative.hypertension || false}
                onCheckedChange={(checked) => updateCurrentField('hypertension', checked)}
              />
              <span>Артериальная гипертензия</span>
            </Label>
          </div>

          {/* Other diseases */}
          <div className="space-y-4">
            <h5 className="font-medium text-gray-900">Другие заболевания</h5>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <Checkbox
                    checked={currentRelative.diabetes || false}
                    onCheckedChange={(checked) => updateCurrentField('diabetes', checked)}
                  />
                  <span>Сахарный диабет</span>
                </Label>
                {currentRelative.diabetes && (
                  <Input
                    type="number"
                    placeholder="Возраст диагноза"
                    value={currentRelative.diabetesAge || ''}
                    onChange={(e) => updateCurrentField('diabetesAge', e.target.value ? Number(e.target.value) : null)}
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <Checkbox
                    checked={currentRelative.alzheimer || false}
                    onCheckedChange={(checked) => updateCurrentField('alzheimer', checked)}
                  />
                  <span>Болезнь Альцгеймера</span>
                </Label>
                {currentRelative.alzheimer && (
                  <Input
                    type="number"
                    placeholder="Возраст диагноза"
                    value={currentRelative.alzheimerAge || ''}
                    onChange={(e) => updateCurrentField('alzheimerAge', e.target.value ? Number(e.target.value) : null)}
                  />
                )}
              </div>
            </div>

            <Label className="flex items-center space-x-2">
              <Checkbox
                checked={currentRelative.osteoporosis || false}
                onCheckedChange={(checked) => updateCurrentField('osteoporosis', checked)}
              />
              <span>Остеопороз</span>
            </Label>
          </div>

          <Button
            onClick={addRelative}
            disabled={!currentRelative.relationship}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Добавить родственника
          </Button>
        </CardContent>
      </Card>

      <div className="bg-yellow-50 p-4 rounded-lg">
        <h4 className="font-medium text-yellow-900 mb-2">Семейная история и генетические риски</h4>
        <p className="text-sm text-yellow-800">
          Наличие заболеваний у близких родственников может указывать на генетическую 
          предрасположенность. Особенно важна информация о раке молочной железы, 
          яичников, колоректальном раке, а также сердечно-сосудистых заболеваниях 
          и диабете у родственников первой степени родства.
        </p>
      </div>
    </div>
  );
};

export default FamilyHistoryStep;
