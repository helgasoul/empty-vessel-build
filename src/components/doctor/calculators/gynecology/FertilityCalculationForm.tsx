
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Baby, Calculator } from "lucide-react";

interface FertilityData {
  lastPeriodDate: string;
  cycleLength: string;
  amh: string;
  age: string;
  fsh: string;
  lh: string;
  antralFollicles: string;
}

interface FertilityCalculationFormProps {
  fertilityData: FertilityData;
  onDataChange: (data: FertilityData) => void;
  onCalculate: () => void;
}

export const FertilityCalculationForm: React.FC<FertilityCalculationFormProps> = ({
  fertilityData,
  onDataChange,
  onCalculate
}) => {
  const updateField = (field: keyof FertilityData, value: string) => {
    onDataChange({ ...fertilityData, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Baby className="w-5 h-5 text-pink-600" />
          <span>Калькулятор фертильности</span>
        </CardTitle>
        <CardDescription>
          Расчет овуляции и оценка овариального резерва
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Label htmlFor="lastPeriod">Дата последней менструации</Label>
            <Input
              id="lastPeriod"
              type="date"
              value={fertilityData.lastPeriodDate}
              onChange={(e) => updateField('lastPeriodDate', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="cycleLength">Длина цикла (дни)</Label>
            <Input
              id="cycleLength"
              type="number"
              value={fertilityData.cycleLength}
              onChange={(e) => updateField('cycleLength', e.target.value)}
              placeholder="28"
            />
          </div>
          <div>
            <Label htmlFor="age">Возраст</Label>
            <Input
              id="age"
              type="number"
              value={fertilityData.age}
              onChange={(e) => updateField('age', e.target.value)}
              placeholder="30"
            />
          </div>
          <div>
            <Label htmlFor="amh">AMH (нг/мл)</Label>
            <Input
              id="amh"
              type="number"
              step="0.1"
              value={fertilityData.amh}
              onChange={(e) => updateField('amh', e.target.value)}
              placeholder="1.5-3.0"
            />
          </div>
          <div>
            <Label htmlFor="afc">Количество антральных фолликулов</Label>
            <Input
              id="afc"
              type="number"
              value={fertilityData.antralFollicles}
              onChange={(e) => updateField('antralFollicles', e.target.value)}
              placeholder="8-15"
            />
          </div>
          <div>
            <Label htmlFor="fsh">ФСГ (мЕд/л)</Label>
            <Input
              id="fsh"
              type="number"
              step="0.1"
              value={fertilityData.fsh}
              onChange={(e) => updateField('fsh', e.target.value)}
              placeholder="3-9"
            />
          </div>
          <div>
            <Label htmlFor="lh">ЛГ (мЕд/л)</Label>
            <Input
              id="lh"
              type="number"
              step="0.1"
              value={fertilityData.lh}
              onChange={(e) => updateField('lh', e.target.value)}
              placeholder="2-10"
            />
          </div>
        </div>

        <Button onClick={onCalculate} className="w-full">
          <Calculator className="w-4 h-4 mr-2" />
          Рассчитать фертильность
        </Button>
      </CardContent>
    </Card>
  );
};
