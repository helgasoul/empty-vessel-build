
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Baby, Calculator, Calendar } from "lucide-react";
import { addDays, format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface FertilityResult {
  ovulationDate: Date;
  fertilityWindow: {
    start: Date;
    end: Date;
  };
  conception_probability: number;
  amhInterpretation: string;
  fertilityStatus: 'high' | 'moderate' | 'low' | 'very_low';
}

const GynecologyCalculators = () => {
  const [gynData, setGynData] = useState({
    lastPeriodDate: '',
    cycleLength: '28',
    amh: '',
    age: '',
    fsh: '',
    lh: '',
    antralFollicles: ''
  });

  const [result, setResult] = useState<FertilityResult | null>(null);

  const calculateFertility = () => {
    const lastPeriod = new Date(gynData.lastPeriodDate);
    const cycleLength = parseInt(gynData.cycleLength);
    const amh = parseFloat(gynData.amh);
    const age = parseInt(gynData.age);
    const afc = parseInt(gynData.antralFollicles);

    // Расчет овуляции (примерно за 14 дней до следующей менструации)
    const ovulationDate = addDays(lastPeriod, cycleLength - 14);

    // Фертильное окно (5 дней до и 1 день после овуляции)
    const fertilityWindow = {
      start: addDays(ovulationDate, -5),
      end: addDays(ovulationDate, 1)
    };

    // Интерпретация AMH
    let amhInterpretation = '';
    let fertilityStatus: 'high' | 'moderate' | 'low' | 'very_low' = 'moderate';

    if (amh > 3.0) {
      amhInterpretation = 'Высокий овариальный резерв (возможен СПКЯ)';
      fertilityStatus = 'high';
    } else if (amh > 1.5) {
      amhInterpretation = 'Нормальный овариальный резерв';
      fertilityStatus = 'high';
    } else if (amh > 0.7) {
      amhInterpretation = 'Умеренно сниженный овариальный резерв';
      fertilityStatus = 'moderate';
    } else if (amh > 0.3) {
      amhInterpretation = 'Низкий овариальный резерв';
      fertilityStatus = 'low';
    } else {
      amhInterpretation = 'Очень низкий овариальный резерв';
      fertilityStatus = 'very_low';
    }

    // Расчет вероятности зачатия (упрощенная формула)
    let conception_probability = 25; // базовая вероятность в фертильное окно

    if (age > 35) {
      conception_probability *= 0.8;
    }
    if (age > 40) {
      conception_probability *= 0.6;
    }
    if (amh < 1.0) {
      conception_probability *= 0.7;
    }
    if (afc < 7) {
      conception_probability *= 0.8;
    }

    conception_probability = Math.min(conception_probability, 30);

    setResult({
      ovulationDate,
      fertilityWindow,
      conception_probability,
      amhInterpretation,
      fertilityStatus
    });
  };

  const getFertilityColor = (status: string) => {
    switch (status) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-orange-100 text-orange-800';
      case 'very_low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  value={gynData.lastPeriodDate}
                  onChange={(e) => setGynData({...gynData, lastPeriodDate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="cycleLength">Длина цикла (дни)</Label>
                <Input
                  id="cycleLength"
                  type="number"
                  value={gynData.cycleLength}
                  onChange={(e) => setGynData({...gynData, cycleLength: e.target.value})}
                  placeholder="28"
                />
              </div>
              <div>
                <Label htmlFor="age">Возраст</Label>
                <Input
                  id="age"
                  type="number"
                  value={gynData.age}
                  onChange={(e) => setGynData({...gynData, age: e.target.value})}
                  placeholder="30"
                />
              </div>
              <div>
                <Label htmlFor="amh">AMH (нг/мл)</Label>
                <Input
                  id="amh"
                  type="number"
                  step="0.1"
                  value={gynData.amh}
                  onChange={(e) => setGynData({...gynData, amh: e.target.value})}
                  placeholder="1.5-3.0"
                />
              </div>
              <div>
                <Label htmlFor="afc">Количество антральных фолликулов</Label>
                <Input
                  id="afc"
                  type="number"
                  value={gynData.antralFollicles}
                  onChange={(e) => setGynData({...gynData, antralFollicles: e.target.value})}
                  placeholder="8-15"
                />
              </div>
              <div>
                <Label htmlFor="fsh">ФСГ (мЕд/л)</Label>
                <Input
                  id="fsh"
                  type="number"
                  step="0.1"
                  value={gynData.fsh}
                  onChange={(e) => setGynData({...gynData, fsh: e.target.value})}
                  placeholder="3-9"
                />
              </div>
              <div>
                <Label htmlFor="lh">ЛГ (мЕд/л)</Label>
                <Input
                  id="lh"
                  type="number"
                  step="0.1"
                  value={gynData.lh}
                  onChange={(e) => setGynData({...gynData, lh: e.target.value})}
                  placeholder="2-10"
                />
              </div>
            </div>

            <Button onClick={calculateFertility} className="w-full">
              <Calculator className="w-4 h-4 mr-2" />
              Рассчитать фертильность
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                <span>Результаты расчета</span>
                <Badge className={getFertilityColor(result.fertilityStatus)}>
                  {result.fertilityStatus === 'high' ? 'Высокая фертильность' :
                   result.fertilityStatus === 'moderate' ? 'Умеренная фертильность' :
                   result.fertilityStatus === 'low' ? 'Сниженная фертильность' : 'Очень низкая фертильность'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-600 font-medium">Предполагаемая овуляция</p>
                  <p className="text-lg font-bold">
                    {format(result.ovulationDate, 'dd MMMM yyyy', { locale: ru })}
                  </p>
                  <p className="text-xs text-gray-600">
                    {format(result.ovulationDate, 'EEEE', { locale: ru })}
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">Фертильное окно</p>
                  <p className="text-sm font-semibold">
                    {format(result.fertilityWindow.start, 'dd MMM', { locale: ru })} - {format(result.fertilityWindow.end, 'dd MMM yyyy', { locale: ru })}
                  </p>
                  <p className="text-xs text-gray-600">Оптимальное время для зачатия</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Вероятность зачатия</p>
                  <p className="text-lg font-bold">{result.conception_probability.toFixed(1)}%</p>
                  <p className="text-xs text-gray-600">В фертильном окне</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Оценка овариального резерва:</h4>
                <p className="text-sm text-gray-700">{result.amhInterpretation}</p>
                
                {result.fertilityStatus === 'low' || result.fertilityStatus === 'very_low' ? (
                  <div className="mt-3 p-3 bg-orange-100 rounded-lg">
                    <p className="text-sm text-orange-800 font-medium">Рекомендации:</p>
                    <ul className="text-sm text-orange-700 mt-1 space-y-1">
                      <li>• Консультация репродуктолога</li>
                      <li>• Рассмотреть криоконсервацию ооцитов</li>
                      <li>• Коэнзим Q10, фолиевая кислота</li>
                      <li>• Контроль веса и стресса</li>
                    </ul>
                  </div>
                ) : (
                  <div className="mt-3 p-3 bg-green-100 rounded-lg">
                    <p className="text-sm text-green-800 font-medium">Рекомендации:</p>
                    <ul className="text-sm text-green-700 mt-1 space-y-1">
                      <li>• Регулярное отслеживание цикла</li>
                      <li>• Фолиевая кислота 400 мкг/день</li>
                      <li>• Здоровый образ жизни</li>
                      <li>• Контроль ежегодно</li>
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

export default GynecologyCalculators;
