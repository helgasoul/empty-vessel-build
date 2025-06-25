
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CardiovascularData } from '../../../types/health';

interface CardiovascularStepProps {
  data?: CardiovascularData;
  onComplete: (data: CardiovascularData) => void;
}

const CardiovascularStep: React.FC<CardiovascularStepProps> = ({ data, onComplete }) => {
  const [formData, setFormData] = useState<CardiovascularData>({
    bloodPressure: { systolic: 120, diastolic: 80, measurementDate: null },
    heartRate: { resting: 70, measurementDate: null },
    cholesterol: { total: null, hdl: null, ldl: null, triglycerides: null, lastTest: null },
    conditions: { hypertension: false, heartDisease: false, stroke: false, diabetes: false },
    familyHistory: { heartDisease: false, stroke: false, diabetes: false },
    ...data
  });

  const handleSubmit = () => {
    onComplete(formData);
  };

  const updateBloodPressure = (field: 'systolic' | 'diastolic', value: number) => {
    setFormData(prev => ({
      ...prev,
      bloodPressure: { ...prev.bloodPressure, [field]: value }
    }));
  };

  const updateCholesterol = (field: keyof typeof formData.cholesterol, value: number | null) => {
    setFormData(prev => ({
      ...prev,
      cholesterol: { ...prev.cholesterol, [field]: value }
    }));
  };

  const updateCondition = (condition: keyof typeof formData.conditions, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      conditions: { ...prev.conditions, [condition]: value }
    }));
  };

  const updateFamilyHistory = (condition: keyof typeof formData.familyHistory, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      familyHistory: { ...prev.familyHistory, [condition]: value }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {/* Кровяное давление */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Кровяное давление</CardTitle>
            <CardDescription>Последние измерения артериального давления</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="systolic">Систолическое (верхнее)</Label>
              <Input
                id="systolic"
                type="number"
                value={formData.bloodPressure.systolic}
                onChange={(e) => updateBloodPressure('systolic', parseInt(e.target.value) || 0)}
                min="80"
                max="200"
                placeholder="120"
              />
              <span className="text-sm text-gray-500">мм рт. ст.</span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="diastolic">Диастолическое (нижнее)</Label>
              <Input
                id="diastolic"
                type="number"
                value={formData.bloodPressure.diastolic}
                onChange={(e) => updateBloodPressure('diastolic', parseInt(e.target.value) || 0)}
                min="40"
                max="120"
                placeholder="80"
              />
              <span className="text-sm text-gray-500">мм рт. ст.</span>
            </div>
          </CardContent>
        </Card>

        {/* Пульс */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Пульс в покое</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="heartRate">Частота сердечных сокращений</Label>
              <Input
                id="heartRate"
                type="number"
                value={formData.heartRate.resting}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  heartRate: { ...prev.heartRate, resting: parseInt(e.target.value) || 0 }
                }))}
                min="40"
                max="120"
                placeholder="70"
              />
              <span className="text-sm text-gray-500">ударов в минуту</span>
            </div>
          </CardContent>
        </Card>

        {/* Холестерин */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Уровень холестерина</CardTitle>
            <CardDescription>Результаты последних анализов (необязательно)</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalCholesterol">Общий холестерин</Label>
              <Input
                id="totalCholesterol"
                type="number"
                value={formData.cholesterol.total || ''}
                onChange={(e) => updateCholesterol('total', e.target.value ? parseFloat(e.target.value) : null)}
                placeholder="5.2"
                step="0.1"
              />
              <span className="text-sm text-gray-500">ммоль/л</span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hdl">ЛПВП (хороший)</Label>
              <Input
                id="hdl"
                type="number"
                value={formData.cholesterol.hdl || ''}
                onChange={(e) => updateCholesterol('hdl', e.target.value ? parseFloat(e.target.value) : null)}
                placeholder="1.3"
                step="0.1"
              />
              <span className="text-sm text-gray-500">ммоль/л</span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ldl">ЛПНП (плохой)</Label>
              <Input
                id="ldl"
                type="number"
                value={formData.cholesterol.ldl || ''}
                onChange={(e) => updateCholesterol('ldl', e.target.value ? parseFloat(e.target.value) : null)}
                placeholder="3.0"
                step="0.1"
              />
              <span className="text-sm text-gray-500">ммоль/л</span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="triglycerides">Триглицериды</Label>
              <Input
                id="triglycerides"
                type="number"
                value={formData.cholesterol.triglycerides || ''}
                onChange={(e) => updateCholesterol('triglycerides', e.target.value ? parseFloat(e.target.value) : null)}
                placeholder="1.7"
                step="0.1"
              />
              <span className="text-sm text-gray-500">ммоль/л</span>
            </div>
          </CardContent>
        </Card>

        {/* Заболевания */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Заболевания</CardTitle>
            <CardDescription>Отметьте, если у вас есть следующие заболевания</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hypertension"
                checked={formData.conditions.hypertension}
                onCheckedChange={(checked) => updateCondition('hypertension', !!checked)}
              />
              <Label htmlFor="hypertension">Гипертония (высокое артериальное давление)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="heartDisease"
                checked={formData.conditions.heartDisease}
                onCheckedChange={(checked) => updateCondition('heartDisease', !!checked)}
              />
              <Label htmlFor="heartDisease">Болезни сердца</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="stroke"
                checked={formData.conditions.stroke}
                onCheckedChange={(checked) => updateCondition('stroke', !!checked)}
              />
              <Label htmlFor="stroke">Инсульт</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="diabetes"
                checked={formData.conditions.diabetes}
                onCheckedChange={(checked) => updateCondition('diabetes', !!checked)}
              />
              <Label htmlFor="diabetes">Сахарный диабет</Label>
            </div>
          </CardContent>
        </Card>

        {/* Семейный анамнез */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Семейный анамнез</CardTitle>
            <CardDescription>Заболевания у близких родственников</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="familyHeartDisease"
                checked={formData.familyHistory.heartDisease}
                onCheckedChange={(checked) => updateFamilyHistory('heartDisease', !!checked)}
              />
              <Label htmlFor="familyHeartDisease">Болезни сердца у родственников</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="familyStroke"
                checked={formData.familyHistory.stroke}
                onCheckedChange={(checked) => updateFamilyHistory('stroke', !!checked)}
              />
              <Label htmlFor="familyStroke">Инсульт у родственников</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="familyDiabetes"
                checked={formData.familyHistory.diabetes}
                onCheckedChange={(checked) => updateFamilyHistory('diabetes', !!checked)}
              />
              <Label htmlFor="familyDiabetes">Диабет у родственников</Label>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} className="px-8">
          Продолжить
        </Button>
      </div>
    </div>
  );
};

export default CardiovascularStep;
