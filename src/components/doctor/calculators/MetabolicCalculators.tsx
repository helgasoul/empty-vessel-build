
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Activity, Calculator, TrendingUp } from "lucide-react";

interface MetabolicResult {
  homaIR: number;
  bmr: number;
  ironNeeds: number;
  vitaminDNeeds: number;
  interpretation: string;
  riskLevel: 'low' | 'moderate' | 'high';
}

const MetabolicCalculators = () => {
  const [metabolicData, setMetabolicData] = useState({
    glucose: '',
    insulin: '',
    weight: '',
    height: '',
    age: '',
    gender: 'female',
    activityLevel: 'sedentary',
    pregnancyStatus: 'none'
  });

  const [result, setResult] = useState<MetabolicResult | null>(null);

  const calculateMetabolic = () => {
    const glucose = parseFloat(metabolicData.glucose);
    const insulin = parseFloat(metabolicData.insulin);
    const weight = parseFloat(metabolicData.weight);
    const height = parseFloat(metabolicData.height);
    const age = parseInt(metabolicData.age);

    // Расчет HOMA-IR
    const homaIR = (glucose * insulin) / 22.5;

    // Расчет базального метаболизма (Mifflin-St Jeor)
    let bmr: number;
    if (metabolicData.gender === 'female') {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    } else {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    }

    // Корректировка на активность
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };
    
    bmr *= activityMultipliers[metabolicData.activityLevel as keyof typeof activityMultipliers];

    // Расчет потребности в железе
    let ironNeeds = 18; // базовая потребность для женщин
    if (metabolicData.pregnancyStatus === 'pregnant') {
      ironNeeds = 27;
    } else if (metabolicData.pregnancyStatus === 'lactating') {
      ironNeeds = 9;
    } else if (metabolicData.gender === 'male') {
      ironNeeds = 8;
    }

    // Расчет потребности в витамине D
    let vitaminDNeeds = 600; // базовая потребность
    if (age > 70) {
      vitaminDNeeds = 800;
    }

    // Интерпретация
    let interpretation = '';
    let riskLevel: 'low' | 'moderate' | 'high' = 'low';

    if (homaIR > 2.5) {
      interpretation = 'Повышена инсулинорезистентность';
      riskLevel = 'high';
    } else if (homaIR > 1.9) {
      interpretation = 'Умеренная инсулинорезистентность';
      riskLevel = 'moderate';
    } else {
      interpretation = 'Нормальная чувствительность к инсулину';
      riskLevel = 'low';
    }

    setResult({
      homaIR,
      bmr,
      ironNeeds,
      vitaminDNeeds,
      interpretation,
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-green-600" />
              <span>Метаболические показатели</span>
            </CardTitle>
            <CardDescription>
              Расчет HOMA-IR, BMR и потребности в нутриентах
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="glucose">Глюкоза натощак (ммоль/л)</Label>
                <Input
                  id="glucose"
                  type="number"
                  step="0.1"
                  value={metabolicData.glucose}
                  onChange={(e) => setMetabolicData({...metabolicData, glucose: e.target.value})}
                  placeholder="4.0-6.0"
                />
              </div>
              <div>
                <Label htmlFor="insulin">Инсулин (мкЕд/мл)</Label>
                <Input
                  id="insulin"
                  type="number"
                  step="0.1"
                  value={metabolicData.insulin}
                  onChange={(e) => setMetabolicData({...metabolicData, insulin: e.target.value})}
                  placeholder="2-25"
                />
              </div>
              <div>
                <Label htmlFor="weight">Вес (кг)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={metabolicData.weight}
                  onChange={(e) => setMetabolicData({...metabolicData, weight: e.target.value})}
                  placeholder="60"
                />
              </div>
              <div>
                <Label htmlFor="height">Рост (см)</Label>
                <Input
                  id="height"
                  type="number"
                  value={metabolicData.height}
                  onChange={(e) => setMetabolicData({...metabolicData, height: e.target.value})}
                  placeholder="165"
                />
              </div>
              <div>
                <Label htmlFor="age">Возраст</Label>
                <Input
                  id="age"
                  type="number"
                  value={metabolicData.age}
                  onChange={(e) => setMetabolicData({...metabolicData, age: e.target.value})}
                  placeholder="30"
                />
              </div>
              <div>
                <Label htmlFor="gender">Пол</Label>
                <Select value={metabolicData.gender} onValueChange={(value) => setMetabolicData({...metabolicData, gender: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Женский</SelectItem>
                    <SelectItem value="male">Мужской</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="activity">Уровень активности</Label>
              <Select value={metabolicData.activityLevel} onValueChange={(value) => setMetabolicData({...metabolicData, activityLevel: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Малоподвижный</SelectItem>
                  <SelectItem value="light">Легкая активность</SelectItem>
                  <SelectItem value="moderate">Умеренная активность</SelectItem>
                  <SelectItem value="active">Высокая активность</SelectItem>
                  <SelectItem value="very_active">Очень высокая активность</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="pregnancy">Статус беременности</Label>
              <Select value={metabolicData.pregnancyStatus} onValueChange={(value) => setMetabolicData({...metabolicData, pregnancyStatus: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Нет</SelectItem>
                  <SelectItem value="pregnant">Беременность</SelectItem>
                  <SelectItem value="lactating">Лактация</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={calculateMetabolic} className="w-full">
              <Calculator className="w-4 h-4 mr-2" />
              Рассчитать метаболические показатели
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span>Результаты расчета</span>
                <Badge className={getRiskColor(result.riskLevel)}>
                  {result.riskLevel === 'low' ? 'Норма' :
                   result.riskLevel === 'moderate' ? 'Внимание' : 'Риск'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 p-3 rounded-lg">
                  <p className="text-sm text-red-600 font-medium">HOMA-IR</p>
                  <p className="text-lg font-bold">{result.homaIR.toFixed(2)}</p>
                  <p className="text-xs text-gray-600">Норма: &lt;1.9</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">BMR (ккал/день)</p>
                  <p className="text-lg font-bold">{Math.round(result.bmr)}</p>
                  <p className="text-xs text-gray-600">С учетом активности</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="text-sm text-orange-600 font-medium">Железо (мг/день)</p>
                  <p className="text-lg font-bold">{result.ironNeeds}</p>
                  <p className="text-xs text-gray-600">Рекомендованная доза</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-sm text-yellow-600 font-medium">Витамин D (МЕ/день)</p>
                  <p className="text-lg font-bold">{result.vitaminDNeeds}</p>
                  <p className="text-xs text-gray-600">Минимальная потребность</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Интерпретация HOMA-IR:</h4>
                <p className="text-sm text-gray-700">{result.interpretation}</p>
                
                {result.riskLevel === 'high' && (
                  <div className="mt-3 p-3 bg-red-100 rounded-lg">
                    <p className="text-sm text-red-800 font-medium">Рекомендации:</p>
                    <ul className="text-sm text-red-700 mt-1 space-y-1">
                      <li>• Диета с низким гликемическим индексом</li>
                      <li>• Увеличение физической активности</li>
                      <li>• Контроль веса</li>
                      <li>• Рассмотреть метформин</li>
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MetabolicCalculators;
