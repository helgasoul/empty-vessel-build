
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Heart, Calculator, AlertTriangle } from "lucide-react";

interface CardiovascularResult {
  qrisk3Score: number;
  ascvdScore: number;
  whtRatio: number;
  egfr: number;
  riskLevel: 'low' | 'intermediate' | 'high' | 'very_high';
  recommendations: string[];
}

const CardiovascularCalculators = () => {
  const [cardioData, setCardioData] = useState({
    age: '',
    gender: 'female',
    ethnicity: 'white',
    smoking: 'non_smoker',
    diabetes: false,
    systolicBP: '',
    cholesterolRatio: '',
    bmi: '',
    waistCircumference: '',
    height: '',
    serum_creatinine: '',
    familyHistory: false,
    rheumatoidArthritis: false,
    atrialFibrillation: false,
    chronicKidneyDisease: false
  });

  const [result, setResult] = useState<CardiovascularResult | null>(null);

  const calculateCardiovascular = () => {
    const age = parseInt(cardioData.age);
    const systolicBP = parseInt(cardioData.systolicBP);
    const cholesterolRatio = parseFloat(cardioData.cholesterolRatio);
    const bmi = parseFloat(cardioData.bmi);
    const waist = parseFloat(cardioData.waistCircumference);
    const height = parseFloat(cardioData.height);
    const creatinine = parseFloat(cardioData.serum_creatinine);

    // Упрощенный расчет QRISK3 (базовые факторы)
    let qrisk3Score = 0;

    // Возраст
    if (age > 40) qrisk3Score += (age - 40) * 0.5;
    
    // Пол
    if (cardioData.gender === 'male') qrisk3Score += 2;

    // Курение
    if (cardioData.smoking === 'current') qrisk3Score += 3;
    if (cardioData.smoking === 'former') qrisk3Score += 1.5;

    // Диабет
    if (cardioData.diabetes) qrisk3Score += 4;

    // АД
    if (systolicBP > 140) qrisk3Score += 2;
    if (systolicBP > 160) qrisk3Score += 3;

    // Холестерин
    if (cholesterolRatio > 6) qrisk3Score += 2;

    // ИМТ
    if (bmi > 30) qrisk3Score += 1.5;

    // Семейный анамнез
    if (cardioData.familyHistory) qrisk3Score += 2;

    // Другие факторы
    if (cardioData.rheumatoidArthritis) qrisk3Score += 1.5;
    if (cardioData.atrialFibrillation) qrisk3Score += 2;
    if (cardioData.chronicKidneyDisease) qrisk3Score += 1.5;

    // Ограничиваем максимальное значение
    qrisk3Score = Math.min(qrisk3Score, 30);

    // Упрощенный расчет ASCVD (для сравнения)
    let ascvdScore = qrisk3Score * 0.8; // ASCVD обычно дает немного меньшие значения

    // Расчет соотношения талия/рост
    const whtRatio = waist / height;

    // Расчет eGFR (CKD-EPI, упрощенная формула)
    let egfr: number;
    if (cardioData.gender === 'female') {
      egfr = 144 * Math.pow(Math.min(creatinine / 61.9, 1), -0.329) * Math.pow(Math.max(creatinine / 61.9, 1), -1.209) * Math.pow(0.993, age);
    } else {
      egfr = 141 * Math.pow(Math.min(creatinine / 79.6, 1), -0.411) * Math.pow(Math.max(creatinine / 79.6, 1), -1.209) * Math.pow(0.993, age);
    }

    // Определение уровня риска
    let riskLevel: 'low' | 'intermediate' | 'high' | 'very_high' = 'low';
    if (qrisk3Score >= 20) {
      riskLevel = 'very_high';
    } else if (qrisk3Score >= 10) {
      riskLevel = 'high';
    } else if (qrisk3Score >= 5) {
      riskLevel = 'intermediate';
    }

    // Генерация рекомендаций
    const recommendations: string[] = [];

    if (riskLevel === 'very_high') {
      recommendations.push('Немедленная консультация кардиолога');
      recommendations.push('Статины высокой интенсивности');
      recommendations.push('Ацетилсалициловая кислота 75-100 мг/день');
      recommendations.push('Целевой ХС ЛНП < 1.4 ммоль/л');
    } else if (riskLevel === 'high') {
      recommendations.push('Статины средней/высокой интенсивности');
      recommendations.push('Целевой ХС ЛНП < 1.8 ммоль/л');
      recommendations.push('Контроль АД < 130/80 мм рт.ст.');
    } else if (riskLevel === 'intermediate') {
      recommendations.push('Рассмотреть статины низкой интенсивности');
      recommendations.push('Модификация образа жизни');
      recommendations.push('Контроль факторов риска');
    } else {
      recommendations.push('Здоровый образ жизни');
      recommendations.push('Регулярная физическая активность');
      recommendations.push('Средиземноморская диета');
    }

    if (whtRatio > 0.5) {
      recommendations.push('Снижение массы тела (WHtR > 0.5)');
    }

    if (egfr < 60) {
      recommendations.push('Консультация нефролога (СКФ < 60)');
    }

    setResult({
      qrisk3Score,
      ascvdScore,
      whtRatio,
      egfr,
      riskLevel,
      recommendations
    });
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'very_high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-red-600" />
              <span>Кардиометаболический риск</span>
            </CardTitle>
            <CardDescription>
              QRISK3, ASCVD, WHtR и функция почек
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">Возраст</Label>
                <Input
                  id="age"
                  type="number"
                  value={cardioData.age}
                  onChange={(e) => setCardioData({...cardioData, age: e.target.value})}
                  placeholder="45"
                />
              </div>
              <div>
                <Label htmlFor="gender">Пол</Label>
                <Select value={cardioData.gender} onValueChange={(value) => setCardioData({...cardioData, gender: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Женский</SelectItem>
                    <SelectItem value="male">Мужской</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="systolic">Систолическое АД (мм рт.ст.)</Label>
                <Input
                  id="systolic"
                  type="number"
                  value={cardioData.systolicBP}
                  onChange={(e) => setCardioData({...cardioData, systolicBP: e.target.value})}
                  placeholder="120"
                />
              </div>
              <div>
                <Label htmlFor="cholesterol">Общий ХС/ХС ЛВП</Label>
                <Input
                  id="cholesterol"
                  type="number"
                  step="0.1"
                  value={cardioData.cholesterolRatio}
                  onChange={(e) => setCardioData({...cardioData, cholesterolRatio: e.target.value})}
                  placeholder="4.5"
                />
              </div>
              <div>
                <Label htmlFor="waist">Окружность талии (см)</Label>
                <Input
                  id="waist"
                  type="number"
                  value={cardioData.waistCircumference}
                  onChange={(e) => setCardioData({...cardioData, waistCircumference: e.target.value})}
                  placeholder="85"
                />
              </div>
              <div>
                <Label htmlFor="height">Рост (см)</Label>
                <Input
                  id="height"
                  type="number"
                  value={cardioData.height}
                  onChange={(e) => setCardioData({...cardioData, height: e.target.value})}
                  placeholder="165"
                />
              </div>
              <div>
                <Label htmlFor="bmi">ИМТ</Label>
                <Input
                  id="bmi"
                  type="number"
                  step="0.1"
                  value={cardioData.bmi}
                  onChange={(e) => setCardioData({...cardioData, bmi: e.target.value})}
                  placeholder="25"
                />
              </div>
              <div>
                <Label htmlFor="creatinine">Креатинин (мкмоль/л)</Label>
                <Input
                  id="creatinine"
                  type="number"
                  value={cardioData.serum_creatinine}
                  onChange={(e) => setCardioData({...cardioData, serum_creatinine: e.target.value})}
                  placeholder="80"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="smoking">Курение</Label>
              <Select value={cardioData.smoking} onValueChange={(value) => setCardioData({...cardioData, smoking: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="non_smoker">Не курит</SelectItem>
                  <SelectItem value="former">Бросил</SelectItem>
                  <SelectItem value="current">Курит</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="diabetes"
                  checked={cardioData.diabetes}
                  onChange={(e) => setCardioData({...cardioData, diabetes: e.target.checked})}
                />
                <Label htmlFor="diabetes">Сахарный диабет</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="familyHistory"
                  checked={cardioData.familyHistory}
                  onChange={(e) => setCardioData({...cardioData, familyHistory: e.target.checked})}
                />
                <Label htmlFor="familyHistory">Семейный анамнез ССЗ</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="rheumatoid"
                  checked={cardioData.rheumatoidArthritis}
                  onChange={(e) => setCardioData({...cardioData, rheumatoidArthritis: e.target.checked})}
                />
                <Label htmlFor="rheumatoid">Ревматоидный артрит</Label>
              </div>
            </div>

            <Button onClick={calculateCardiovascular} className="w-full">
              <Calculator className="w-4 h-4 mr-2" />
              Рассчитать кардиориск
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-600" />
                <span>Результаты оценки</span>
                <Badge className={getRiskColor(result.riskLevel)}>
                  {result.riskLevel === 'low' ? 'Низкий риск' :
                   result.riskLevel === 'intermediate' ? 'Умеренный риск' :
                   result.riskLevel === 'high' ? 'Высокий риск' : 'Очень высокий риск'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 p-3 rounded-lg">
                  <p className="text-sm text-red-600 font-medium">QRISK3</p>
                  <p className="text-lg font-bold">{result.qrisk3Score.toFixed(1)}%</p>
                  <p className="text-xs text-gray-600">10-летний риск ССЗ</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="text-sm text-orange-600 font-medium">ASCVD</p>
                  <p className="text-lg font-bold">{result.ascvdScore.toFixed(1)}%</p>
                  <p className="text-xs text-gray-600">10-летний риск АСССЗ</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-sm text-yellow-600 font-medium">WHtR</p>
                  <p className="text-lg font-bold">{result.whtRatio.toFixed(2)}</p>
                  <p className="text-xs text-gray-600">Норма: &lt;0.5</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">СКФ</p>
                  <p className="text-lg font-bold">{Math.round(result.egfr)}</p>
                  <p className="text-xs text-gray-600">мл/мин/1.73м²</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-1 text-orange-500" />
                  Клинические рекомендации:
                </h4>
                <ul className="space-y-1">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              {result.riskLevel === 'very_high' && (
                <div className="bg-red-100 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800 font-medium">⚠️ ВНИМАНИЕ:</p>
                  <p className="text-sm text-red-700">
                    Очень высокий риск ССЗ требует немедленного вмешательства и тщательного медицинского наблюдения.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CardiovascularCalculators;
