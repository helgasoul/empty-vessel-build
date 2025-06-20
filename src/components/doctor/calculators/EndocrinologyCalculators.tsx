
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TestTube, Calculator, AlertTriangle, CheckCircle } from "lucide-react";

interface ThyroidResult {
  t4ToT3Ratio: number;
  freeAndroogenIndex: number;
  interpretation: string;
  recommendations: string[];
  riskLevel: 'low' | 'moderate' | 'high';
}

const EndocrinologyCalculators = () => {
  const [thyroidData, setThyroidData] = useState({
    tsh: '',
    ft4: '',
    ft3: '',
    rt3: '',
    totalTestosterone: '',
    shbg: '',
    age: '',
    phase: 'follicular'
  });

  const [result, setResult] = useState<ThyroidResult | null>(null);

  const calculateThyroidFunction = () => {
    const tsh = parseFloat(thyroidData.tsh);
    const ft4 = parseFloat(thyroidData.ft4);
    const ft3 = parseFloat(thyroidData.ft3);
    const rt3 = parseFloat(thyroidData.rt3);
    const testosterone = parseFloat(thyroidData.totalTestosterone);
    const shbg = parseFloat(thyroidData.shbg);
    const age = parseInt(thyroidData.age);

    // Расчет конверсии T4 в T3
    const t4ToT3Ratio = ft3 / ft4;

    // Расчет индекса свободных андрогенов (FAI)
    const freeAndroogenIndex = (testosterone / shbg) * 100;

    // Интерпретация результатов
    let interpretation = '';
    let recommendations: string[] = [];
    let riskLevel: 'low' | 'moderate' | 'high' = 'low';

    if (tsh > 4.0) {
      interpretation = 'Повышенный ТТГ может указывать на гипотиреоз';
      recommendations.push('Рекомендуется консультация эндокринолога');
      recommendations.push('Контроль антител к ТПО');
      riskLevel = 'high';
    } else if (tsh < 0.4) {
      interpretation = 'Пониженный ТТГ может указывать на гипертиреоз';
      recommendations.push('Рекомендуется УЗИ щитовидной железы');
      recommendations.push('Исключить тиреотоксикоз');
      riskLevel = 'moderate';
    } else if (t4ToT3Ratio < 0.2) {
      interpretation = 'Снижена конверсия T4 в T3, возможна периферическая резистентность';
      recommendations.push('Оценить уровень селена и цинка');
      recommendations.push('Рассмотреть коррекцию питания');
      riskLevel = 'moderate';
    } else {
      interpretation = 'Функция щитовидной железы в пределах нормы';
      recommendations.push('Контроль через 6-12 месяцев');
      riskLevel = 'low';
    }

    if (freeAndroogenIndex > 5 && age < 40) {
      recommendations.push('Исключить синдром поликистозных яичников');
      recommendations.push('Оценить инсулинорезистентность');
      if (riskLevel === 'low') riskLevel = 'moderate';
    }

    setResult({
      t4ToT3Ratio,
      freeAndroogenIndex,
      interpretation,
      recommendations,
      riskLevel
    });
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ввод данных */}
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
                  onChange={(e) => setThyroidData({...thyroidData, tsh: e.target.value})}
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
                  onChange={(e) => setThyroidData({...thyroidData, ft4: e.target.value})}
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
                  onChange={(e) => setThyroidData({...thyroidData, ft3: e.target.value})}
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
                  onChange={(e) => setThyroidData({...thyroidData, rt3: e.target.value})}
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
                  onChange={(e) => setThyroidData({...thyroidData, totalTestosterone: e.target.value})}
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
                  onChange={(e) => setThyroidData({...thyroidData, shbg: e.target.value})}
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
                  onChange={(e) => setThyroidData({...thyroidData, age: e.target.value})}
                  placeholder="25"
                />
              </div>
              <div>
                <Label htmlFor="phase">Фаза цикла</Label>
                <Select value={thyroidData.phase} onValueChange={(value) => setThyroidData({...thyroidData, phase: value})}>
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

            <Button onClick={calculateThyroidFunction} className="w-full">
              <Calculator className="w-4 h-4 mr-2" />
              Рассчитать
            </Button>
          </CardContent>
        </Card>

        {/* Результаты */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Результаты расчета</span>
                <Badge className={getRiskColor(result.riskLevel)}>
                  {result.riskLevel === 'low' ? 'Низкий риск' :
                   result.riskLevel === 'moderate' ? 'Умеренный риск' : 'Высокий риск'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Соотношение T4/T3</p>
                  <p className="text-lg font-bold">{result.t4ToT3Ratio.toFixed(2)}</p>
                  <p className="text-xs text-gray-600">Норма: 0.2-0.4</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-sm text-purple-600 font-medium">Индекс свободных андрогенов</p>
                  <p className="text-lg font-bold">{result.freeAndroogenIndex.toFixed(1)}</p>
                  <p className="text-xs text-gray-600">Норма: &lt;5</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Интерпретация:</h4>
                <p className="text-sm text-gray-700">{result.interpretation}</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-1 text-orange-500" />
                  Рекомендации:
                </h4>
                <ul className="space-y-1">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EndocrinologyCalculators;
