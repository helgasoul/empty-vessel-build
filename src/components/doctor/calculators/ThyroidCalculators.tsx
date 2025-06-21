
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Activity, Calculator, AlertTriangle } from "lucide-react";
import { useSaveCalculatorResult } from '@/hooks/useCalculatorResults';
import { useToast } from '@/hooks/use-toast';

const ThyroidCalculators = () => {
  const { toast } = useToast();
  const saveResult = useSaveCalculatorResult();
  
  const [tshValues, setTshValues] = useState({
    tsh: '',
    t4: '',
    t3: '',
    patientId: ''
  });

  const [thyroidResults, setThyroidResults] = useState<any>(null);

  const calculateThyroidFunction = () => {
    const tsh = parseFloat(tshValues.tsh);
    const t4 = parseFloat(tshValues.t4);
    const t3 = parseFloat(tshValues.t3);

    if (!tsh || !t4 || !t3) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля для расчета",
        variant: "destructive",
      });
      return;
    }

    // Простая логика интерпретации (в реальности более сложная)
    let interpretation = 'normal';
    let isCritical = false;
    let resultText = '';

    if (tsh < 0.4) {
      interpretation = 'hyperthyroid';
      resultText = 'Гипертиреоз - снижен ТТГ';
      isCritical = tsh < 0.1;
    } else if (tsh > 4.0) {
      interpretation = 'hypothyroid';
      resultText = 'Гипотиреоз - повышен ТТГ';
      isCritical = tsh > 10.0;
    } else {
      interpretation = 'normal';
      resultText = 'Функция щитовидной железы в норме';
    }

    const result = {
      tsh,
      t4,
      t3,
      interpretation,
      resultText,
      isCritical,
      referenceRanges: {
        tsh: '0.4-4.0 мкМЕ/мл',
        t4: '9.0-24.0 пмоль/л',
        t3: '2.6-5.7 пмоль/л'
      }
    };

    setThyroidResults(result);
  };

  const handleSaveResult = async () => {
    if (!thyroidResults || !tshValues.patientId) {
      toast({
        title: "Ошибка",
        description: "Выполните расчет и укажите ID пациента",
        variant: "destructive",
      });
      return;
    }

    await saveResult.mutateAsync({
      patient_id: tshValues.patientId,
      calculator_type: 'thyroid_function',
      calculator_name: 'Оценка функции щитовидной железы',
      input_parameters: {
        tsh: thyroidResults.tsh,
        t4: thyroidResults.t4,
        t3: thyroidResults.t3
      },
      result_text: thyroidResults.resultText,
      interpretation: thyroidResults.interpretation,
      reference_range: `ТТГ: ${thyroidResults.referenceRanges.tsh}, Т4: ${thyroidResults.referenceRanges.t4}, Т3: ${thyroidResults.referenceRanges.t3}`,
      is_critical: thyroidResults.isCritical,
      notes: 'Автоматический расчет функции щитовидной железы'
    });

    setThyroidResults(null);
    setTshValues({ tsh: '', t4: '', t3: '', patientId: '' });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <span>Оценка функции щитовидной железы</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label htmlFor="tsh">ТТГ (мкМЕ/мл)</Label>
                <Input
                  id="tsh"
                  type="number"
                  step="0.01"
                  placeholder="0.4-4.0"
                  value={tshValues.tsh}
                  onChange={(e) => setTshValues(prev => ({ ...prev, tsh: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="t4">Т4 свободный (пмоль/л)</Label>
                <Input
                  id="t4"
                  type="number"
                  step="0.1"
                  placeholder="9.0-24.0"
                  value={tshValues.t4}
                  onChange={(e) => setTshValues(prev => ({ ...prev, t4: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="t3">Т3 свободный (пмоль/л)</Label>
                <Input
                  id="t3"
                  type="number"
                  step="0.1"
                  placeholder="2.6-5.7"
                  value={tshValues.t3}
                  onChange={(e) => setTshValues(prev => ({ ...prev, t3: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="patient-id">ID пациента</Label>
                <Input
                  id="patient-id"
                  placeholder="Введите ID пациента"
                  value={tshValues.patientId}
                  onChange={(e) => setTshValues(prev => ({ ...prev, patientId: e.target.value }))}
                />
              </div>
            </div>
            
            <Button onClick={calculateThyroidFunction} className="w-full">
              <Calculator className="w-4 h-4 mr-2" />
              Рассчитать
            </Button>
          </CardContent>
        </Card>

        {thyroidResults && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-green-600" />
                <span>Результат расчета</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Интерпретация</h3>
                  <Badge variant={thyroidResults.isCritical ? "destructive" : 
                                thyroidResults.interpretation === 'normal' ? "default" : "secondary"}>
                    {thyroidResults.interpretation === 'normal' ? 'Норма' :
                     thyroidResults.interpretation === 'hyperthyroid' ? 'Гипертиреоз' : 'Гипотиреоз'}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-700 mb-3">
                  {thyroidResults.resultText}
                </p>

                {thyroidResults.isCritical && (
                  <div className="flex items-center space-x-2 p-2 bg-red-50 border border-red-200 rounded">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-700">Критическое значение - требует немедленного внимания</span>
                  </div>
                )}

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>ТТГ:</span>
                    <span>{thyroidResults.tsh} мкМЕ/мл</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Т4 свободный:</span>
                    <span>{thyroidResults.t4} пмоль/л</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Т3 свободный:</span>
                    <span>{thyroidResults.t3} пмоль/л</span>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleSaveResult} 
                className="w-full"
                disabled={saveResult.isPending}
              >
                {saveResult.isPending ? 'Сохранение...' : 'Сохранить результат'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Референсные значения</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-blue-50 rounded">
              <h4 className="font-semibold text-blue-900">ТТГ</h4>
              <p className="text-blue-700">0.4-4.0 мкМЕ/мл</p>
            </div>
            <div className="p-3 bg-green-50 rounded">
              <h4 className="font-semibold text-green-900">Т4 свободный</h4>
              <p className="text-green-700">9.0-24.0 пмоль/л</p>
            </div>
            <div className="p-3 bg-purple-50 rounded">
              <h4 className="font-semibold text-purple-900">Т3 свободный</h4>
              <p className="text-purple-700">2.6-5.7 пмоль/л</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThyroidCalculators;
