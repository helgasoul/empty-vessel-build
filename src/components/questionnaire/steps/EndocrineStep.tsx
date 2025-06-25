
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EndocrineData } from '../../../types/health';

interface EndocrineStepProps {
  data?: EndocrineData;
  onComplete: (data: EndocrineData) => void;
}

const EndocrineStep: React.FC<EndocrineStepProps> = ({ data, onComplete }) => {
  const [formData, setFormData] = useState<EndocrineData>({
    diabetes: { type: 'none', diagnosisAge: null, medications: [], lastHbA1c: null },
    thyroid: { hasDisease: false, diseaseType: '', medications: [], lastTSH: null, lastT4: null },
    reproductive: { pcos: false, endometriosis: false, fibroids: false, fertilityIssues: false },
    ...data
  });

  const handleSubmit = () => {
    onComplete(formData);
  };

  const updateDiabetes = (field: keyof typeof formData.diabetes, value: any) => {
    setFormData(prev => ({
      ...prev,
      diabetes: { ...prev.diabetes, [field]: value }
    }));
  };

  const updateThyroid = (field: keyof typeof formData.thyroid, value: any) => {
    setFormData(prev => ({
      ...prev,
      thyroid: { ...prev.thyroid, [field]: value }
    }));
  };

  const updateReproductive = (condition: keyof typeof formData.reproductive, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      reproductive: { ...prev.reproductive, [condition]: value }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {/* Сахарный диабет */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Сахарный диабет</CardTitle>
            <CardDescription>Информация о диабете и контроле сахара</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Тип диабета</Label>
              <RadioGroup
                value={formData.diabetes.type}
                onValueChange={(value) => updateDiabetes('type', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="noDiabetes" />
                  <Label htmlFor="noDiabetes">Нет диабета</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="type1" id="type1" />
                  <Label htmlFor="type1">Диабет 1 типа</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="type2" id="type2" />
                  <Label htmlFor="type2">Диабет 2 типа</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="gestational" id="gestational" />
                  <Label htmlFor="gestational">Гестационный диабет</Label>
                </div>
              </RadioGroup>
            </div>

            {formData.diabetes.type !== 'none' && (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="diagnosisAge">Возраст постановки диагноза</Label>
                  <Input
                    id="diagnosisAge"
                    type="number"
                    value={formData.diabetes.diagnosisAge || ''}
                    onChange={(e) => updateDiabetes('diagnosisAge', e.target.value ? parseInt(e.target.value) : null)}
                    min="1"
                    max="100"
                    placeholder="25"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastHbA1c">Последний HbA1c (%)</Label>
                  <Input
                    id="lastHbA1c"
                    type="number"
                    value={formData.diabetes.lastHbA1c || ''}
                    onChange={(e) => updateDiabetes('lastHbA1c', e.target.value ? parseFloat(e.target.value) : null)}
                    step="0.1"
                    min="4"
                    max="15"
                    placeholder="6.5"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Щитовидная железа */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Щитовидная железа</CardTitle>
            <CardDescription>Заболевания и функция щитовидной железы</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="thyroidDisease"
                checked={formData.thyroid.hasDisease}
                onCheckedChange={(checked) => updateThyroid('hasDisease', !!checked)}
              />
              <Label htmlFor="thyroidDisease">Заболевания щитовидной железы</Label>
            </div>

            {formData.thyroid.hasDisease && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="thyroidType">Тип заболевания</Label>
                  <Select value={formData.thyroid.diseaseType} onValueChange={(value) => updateThyroid('diseaseType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите заболевание" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hypothyroidism">Гипотиреоз</SelectItem>
                      <SelectItem value="hyperthyroidism">Гипертиреоз</SelectItem>
                      <SelectItem value="nodules">Узлы щитовидной железы</SelectItem>
                      <SelectItem value="autoimmune">Аутоиммунный тиреоидит</SelectItem>
                      <SelectItem value="other">Другое</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lastTSH">Последний ТТГ (мЕд/л)</Label>
                    <Input
                      id="lastTSH"
                      type="number"
                      value={formData.thyroid.lastTSH || ''}
                      onChange={(e) => updateThyroid('lastTSH', e.target.value ? parseFloat(e.target.value) : null)}
                      step="0.01"
                      min="0"
                      max="50"
                      placeholder="2.5"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastT4">Последний Т4 свободный (пмоль/л)</Label>
                    <Input
                      id="lastT4"
                      type="number"
                      value={formData.thyroid.lastT4 || ''}
                      onChange={(e) => updateThyroid('lastT4', e.target.value ? parseFloat(e.target.value) : null)}
                      step="0.1"
                      min="0"
                      max="50"
                      placeholder="15.0"
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Репродуктивные заболевания */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Репродуктивная система</CardTitle>
            <CardDescription>Гинекологические заболевания и нарушения</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="pcos"
                checked={formData.reproductive.pcos}
                onCheckedChange={(checked) => updateReproductive('pcos', !!checked)}
              />
              <Label htmlFor="pcos">Синдром поликистозных яичников (СПКЯ)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="endometriosis"
                checked={formData.reproductive.endometriosis}
                onCheckedChange={(checked) => updateReproductive('endometriosis', !!checked)}
              />
              <Label htmlFor="endometriosis">Эндометриоз</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="fibroids"
                checked={formData.reproductive.fibroids}
                onCheckedChange={(checked) => updateReproductive('fibroids', !!checked)}
              />
              <Label htmlFor="fibroids">Миома матки</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="fertilityIssues"
                checked={formData.reproductive.fertilityIssues}
                onCheckedChange={(checked) => updateReproductive('fertilityIssues', !!checked)}
              />
              <Label htmlFor="fertilityIssues">Проблемы с фертильностью</Label>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} className="px-8">Продолжить</Button>
      </div>
    </div>
  );
};

export default EndocrineStep;
