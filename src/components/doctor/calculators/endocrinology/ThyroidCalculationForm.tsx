
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TestTube, Calculator } from "lucide-react";

interface ThyroidData {
  tsh: string;
  ft4: string;
  ft3: string;
  rt3: string;
  totalTestosterone: string;
  shbg: string;
  age: string;
  phase: string;
}

interface ThyroidCalculationFormProps {
  thyroidData: ThyroidData;
  onDataChange: (data: ThyroidData) => void;
  onCalculate: () => void;
}

export const ThyroidCalculationForm: React.FC<ThyroidCalculationFormProps> = ({
  thyroidData,
  onDataChange,
  onCalculate
}) => {
  const updateField = (field: keyof ThyroidData, value: string) => {
    onDataChange({ ...thyroidData, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TestTube className="w-5 h-5 text-blue-600" />
          <span>Гормональный профиль</span>
        </CardTitle>
        <CardDescription>
          Введите лабораторные показатели для расчета
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="tsh">ТТГ (мЕд/л)</Label>
            <Input
              id="tsh"
              type="number"
              step="0.01"
              value={thyroidData.tsh}
              onChange={(e) => updateField('tsh', e.target.value)}
              placeholder="0.4-4.0"
            />
          </div>
          <div>
            <Label htmlFor="ft4">Св.Т4 (пмоль/л)</Label>
            <Input
              id="ft4"
              type="number"
              step="0.01"
              value={thyroidData.ft4}
              onChange={(e) => updateField('ft4', e.target.value)}
              placeholder="10-25"
            />
          </div>
          <div>
            <Label htmlFor="ft3">Св.Т3 (пмоль/л)</Label>
            <Input
              id="ft3"
              type="number"
              step="0.01"
              value={thyroidData.ft3}
              onChange={(e) => updateField('ft3', e.target.value)}
              placeholder="3.5-6.5"
            />
          </div>
          <div>
            <Label htmlFor="rt3">rT3 (нг/дл)</Label>
            <Input
              id="rt3"
              type="number"
              step="0.01"
              value={thyroidData.rt3}
              onChange={(e) => updateField('rt3', e.target.value)}
              placeholder="10-24"
            />
          </div>
          <div>
            <Label htmlFor="testosterone">Общий тестостерон (нмоль/л)</Label>
            <Input
              id="testosterone"
              type="number"
              step="0.01"
              value={thyroidData.totalTestosterone}
              onChange={(e) => updateField('totalTestosterone', e.target.value)}
              placeholder="0.5-2.5"
            />
          </div>
          <div>
            <Label htmlFor="shbg">ГСПГ (нмоль/л)</Label>
            <Input
              id="shbg"
              type="number"
              step="0.01"
              value={thyroidData.shbg}
              onChange={(e) => updateField('shbg', e.target.value)}
              placeholder="15-120"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="age">Возраст</Label>
            <Input
              id="age"
              type="number"
              value={thyroidData.age}
              onChange={(e) => updateField('age', e.target.value)}
              placeholder="25"
            />
          </div>
          <div>
            <Label htmlFor="phase">Фаза цикла</Label>
            <Select value={thyroidData.phase} onValueChange={(value) => updateField('phase', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="follicular">Фолликулярная</SelectItem>
                <SelectItem value="ovulatory">Овуляторная</SelectItem>
                <SelectItem value="luteal">Лютеиновая</SelectItem>
                <SelectItem value="postmenopausal">Постменопауза</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={onCalculate} className="w-full">
          <Calculator className="w-4 h-4 mr-2" />
          Рассчитать
        </Button>
      </CardContent>
    </Card>
  );
};
