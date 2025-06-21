
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Zap, Calculator, Users } from "lucide-react";

interface CalculationResult {
  value: number;
  interpretation: string;
  status: 'normal' | 'borderline' | 'abnormal';
  reference: string;
}

const HormonalMetabolicCalculators = () => {
  // Insulin resistance inputs
  const [glucose, setGlucose] = useState('');
  const [insulin, setInsulin] = useState('');
  const [triglycerides, setTriglycerides] = useState('');

  // Female hormones inputs
  const [lh, setLh] = useState('');
  const [fsh, setFsh] = useState('');
  const [testosterone, setTestosterone] = useState('');
  const [shbg, setShbg] = useState('');

  // Adrenal inputs
  const [cortisol, setCortisol] = useState('');
  const [dheas, setDheas] = useState('');

  const [results, setResults] = useState<Record<string, CalculationResult>>({});

  const calculateInsulinResistance = () => {
    const newResults: Record<string, CalculationResult> = {};

    if (glucose && insulin) {
      // HOMA-IR
      const homaIR = (parseFloat(glucose) * parseFloat(insulin)) / 22.5;
      newResults.homaIR = {
        value: homaIR,
        interpretation: homaIR < 2.7 ? 'Нормальная чувствительность к инсулину' : 'Инсулинорезистентность',
        status: homaIR < 2.7 ? 'normal' : 'abnormal',
        reference: '< 2.7'
      };

      // QUICKI (converting glucose to mg/dl if needed)
      const glucoseMgDl = parseFloat(glucose) * 18.016; // convert mmol/L to mg/dL
      const quicki = 1 / (Math.log10(parseFloat(insulin)) + Math.log10(glucoseMgDl));
      newResults.quicki = {
        value: quicki,
        interpretation: quicki > 0.33 ? 'Нормальная чувствительность к инсулину' : 'Инсулинорезистентность',
        status: quicki > 0.33 ? 'normal' : 'abnormal',
        reference: '> 0.33'
      };

      // FIRI
      const firi = parseFloat(insulin) / 25;
      newResults.firi = {
        value: firi,
        interpretation: firi < 2.0 ? 'Нормальная чувствительность к инсулину' : 'Инсулинорезистентность',
        status: firi < 2.0 ? 'normal' : 'abnormal',
        reference: '< 2.0'
      };
    }

    if (insulin && triglycerides) {
      // McAuley Index
      const mcauley = Math.exp(2.63 - 0.28 * Math.log(parseFloat(insulin)) - 0.31 * Math.log(parseFloat(triglycerides)));
      newResults.mcauley = {
        value: mcauley,
        interpretation: mcauley > 5.8 ? 'Нормальная чувствительность к инсулину' : 'Инсулинорезистентность',
        status: mcauley > 5.8 ? 'normal' : 'abnormal',
        reference: '> 5.8'
      };
    }

    setResults(prevResults => ({ ...prevResults, ...newResults }));
  };

  const calculateFemaleHormones = () => {
    const newResults: Record<string, CalculationResult> = {};

    if (lh && fsh) {
      const lhFshRatio = parseFloat(lh) / parseFloat(fsh);
      newResults.lhFshRatio = {
        value: lhFshRatio,
        interpretation: lhFshRatio > 2.5 ? 'Возможен СПКЯ' : 
                       lhFshRatio < 2 ? 'Нормальное соотношение' : 'Пограничное значение',
        status: lhFshRatio < 2 ? 'normal' : lhFshRatio > 2.5 ? 'abnormal' : 'borderline',
        reference: '< 2 (фолликулярная фаза)'
      };
    }

    if (testosterone && shbg) {
      const fai = (parseFloat(testosterone) / parseFloat(shbg)) * 100;
      newResults.fai = {
        value: fai,
        interpretation: fai < 5 ? 'Нормальный уровень андрогенов' : 'Гиперандрогения',
        status: fai < 5 ? 'normal' : 'abnormal',
        reference: '< 5'
      };
    }

    setResults(prevResults => ({ ...prevResults, ...newResults }));
  };

  const calculateAdrenalFunction = () => {
    const newResults: Record<string, CalculationResult> = {};

    if (cortisol && dheas) {
      const cortisolDheasRatio = parseFloat(cortisol) / parseFloat(dheas);
      newResults.cortisolDheas = {
        value: cortisolDheasRatio,
        interpretation: 'Оценка баланса стресс-гормонов и адаптационных резервов',
        status: 'normal',
        reference: 'Клиническая интерпретация'
      };
    }

    setResults(prevResults => ({ ...prevResults, ...newResults }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-green-100 text-green-800 border-green-200';
      case 'borderline': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'abnormal': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="insulin" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="insulin" className="flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>Инсулинорезистентность</span>
          </TabsTrigger>
          <TabsTrigger value="hormones" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Женские гормоны</span>
          </TabsTrigger>
          <TabsTrigger value="adrenal" className="flex items-center space-x-2">
            <Heart className="w-4 h-4" />
            <span>Надпочечники</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="insulin" className="space-y-4">
          <Card className="border-feminine-peach-200 bg-gradient-to-r from-feminine-peach-50 to-white">
            <CardHeader>
              <CardTitle className="text-feminine-peach-700">Оценка инсулинорезистентности</CardTitle>
              <CardDescription>
                Расчет индексов для оценки чувствительности к инсулину
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="glucose">Глюкоза натощак (ммоль/л)</Label>
                  <Input
                    id="glucose"
                    type="number"
                    step="0.1"
                    placeholder="3.9-6.1"
                    value={glucose}
                    onChange={(e) => setGlucose(e.target.value)}
                    className="border-feminine-peach-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insulin">Инсулин (мкЕд/мл)</Label>
                  <Input
                    id="insulin"
                    type="number"
                    step="0.1"
                    placeholder="2.6-24.9"
                    value={insulin}
                    onChange={(e) => setInsulin(e.target.value)}
                    className="border-feminine-peach-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="triglycerides">Триглицериды (ммоль/л)</Label>
                  <Input
                    id="triglycerides"
                    type="number"
                    step="0.1"
                    placeholder="< 1.7"
                    value={triglycerides}
                    onChange={(e) => setTriglycerides(e.target.value)}
                    className="border-feminine-peach-200"
                  />
                </div>
              </div>
              <Button 
                onClick={calculateInsulinResistance}
                className="bg-feminine-peach-500 hover:bg-feminine-peach-600"
              >
                <Calculator className="w-4 h-4 mr-2" />
                Рассчитать индексы ИР
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hormones" className="space-y-4">
          <Card className="border-feminine-pink-200 bg-gradient-to-r from-feminine-pink-50 to-white">
            <CardHeader>
              <CardTitle className="text-feminine-pink-700">Женские гормоны</CardTitle>
              <CardDescription>
                Оценка гормонального баланса и андрогенного статуса
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lh">LH (мЕд/мл)</Label>
                  <Input
                    id="lh"
                    type="number"
                    step="0.1"
                    placeholder="2.4-12.6"
                    value={lh}
                    onChange={(e) => setLh(e.target.value)}
                    className="border-feminine-pink-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fsh">FSH (мЕд/мл)</Label>
                  <Input
                    id="fsh"
                    type="number"
                    step="0.1"
                    placeholder="3.5-12.5"
                    value={fsh}
                    onChange={(e) => setFsh(e.target.value)}
                    className="border-feminine-pink-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="testosterone">Тестостерон (нмоль/л)</Label>
                  <Input
                    id="testosterone"
                    type="number"
                    step="0.1"
                    placeholder="0.4-2.0"
                    value={testosterone}
                    onChange={(e) => setTestosterone(e.target.value)}
                    className="border-feminine-pink-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shbg">SHBG (нмоль/л)</Label>
                  <Input
                    id="shbg"
                    type="number"
                    step="0.1"
                    placeholder="32.4-128.0"
                    value={shbg}
                    onChange={(e) => setShbg(e.target.value)}
                    className="border-feminine-pink-200"
                  />
                </div>
              </div>
              <Button 
                onClick={calculateFemaleHormones}
                className="bg-feminine-pink-500 hover:bg-feminine-pink-600"
              >
                <Calculator className="w-4 h-4 mr-2" />
                Рассчитать гормональные индексы
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="adrenal" className="space-y-4">
          <Card className="border-prevent-lavender bg-gradient-to-r from-prevent-light-gray to-white">
            <CardHeader>
              <CardTitle className="text-purple-700">Функция надпочечников</CardTitle>
              <CardDescription>
                Оценка баланса стресс-гормонов и адаптационных резервов
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cortisol">Кортизол (нмоль/л)</Label>
                  <Input
                    id="cortisol"
                    type="number"
                    step="1"
                    placeholder="171-536"
                    value={cortisol}
                    onChange={(e) => setCortisol(e.target.value)}
                    className="border-purple-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dheas">DHEA-S (мкг/дл)</Label>
                  <Input
                    id="dheas"
                    type="number"
                    step="1"
                    placeholder="65-380"
                    value={dheas}
                    onChange={(e) => setDheas(e.target.value)}
                    className="border-purple-200"
                  />
                </div>
              </div>
              <Button 
                onClick={calculateAdrenalFunction}
                className="bg-purple-500 hover:bg-purple-600"
              >
                <Calculator className="w-4 h-4 mr-2" />
                Рассчитать адренальные индексы
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Results Section */}
      {Object.keys(results).length > 0 && (
        <Card className="border-mint-200 bg-gradient-to-r from-mint-50 to-white">
          <CardHeader>
            <CardTitle className="text-mint-700">Результаты расчетов</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(results).map(([key, result]) => (
              <div key={key} className="p-4 rounded-lg border border-gray-200 bg-white">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-800">
                    {key === 'homaIR' && 'HOMA-IR'}
                    {key === 'quicki' && 'QUICKI'}
                    {key === 'firi' && 'FIRI'}
                    {key === 'mcauley' && 'McAuley Index'}
                    {key === 'lhFshRatio' && 'LH/FSH соотношение'}
                    {key === 'fai' && 'Free Androgen Index (FAI)'}
                    {key === 'cortisolDheas' && 'Кортизол/DHEA-S соотношение'}
                  </h4>
                  <Badge className={getStatusColor(result.status)}>
                    {result.value.toFixed(2)}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-1">{result.interpretation}</p>
                <p className="text-xs text-gray-500">Референс: {result.reference}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HormonalMetabolicCalculators;
