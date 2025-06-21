
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Activity, Calculator, Zap, BookOpen } from "lucide-react";

interface ThyroidResult {
  value: number;
  interpretation: string;
  status: 'normal' | 'borderline' | 'abnormal';
  reference: string;
}

const ThyroidCalculators = () => {
  const [ft3, setFt3] = useState('');
  const [ft4, setFt4] = useState('');
  const [rt3, setRt3] = useState('');
  const [tsh, setTsh] = useState('');
  const [results, setResults] = useState<Record<string, ThyroidResult>>({});

  const calculateRatios = () => {
    const newResults: Record<string, ThyroidResult> = {};

    // FT3/FT4 ratio
    if (ft3 && ft4) {
      const ratio = parseFloat(ft3) / parseFloat(ft4);
      newResults.ft3ft4 = {
        value: ratio,
        interpretation: ratio < 0.2 ? 'Низкая конверсия T4 в T3' : 
                      ratio > 0.4 ? 'Возможный гипертиреоз' : 'Нормальная конверсия',
        status: ratio >= 0.2 && ratio <= 0.4 ? 'normal' : 'abnormal',
        reference: '0.2 - 0.4'
      };
    }

    // FT3/rT3 ratio
    if (ft3 && rt3) {
      const ratio = parseFloat(ft3) / parseFloat(rt3);
      newResults.ft3rt3 = {
        value: ratio,
        interpretation: ratio < 20 ? 'Тиреоидная резистентность' : 'Нормальное соотношение',
        status: ratio >= 20 ? 'normal' : 'abnormal',
        reference: '> 20'
      };
    }

    // TSH/FT4 ratio
    if (tsh && ft4) {
      const ratio = parseFloat(tsh) / parseFloat(ft4);
      newResults.tshft4 = {
        value: ratio,
        interpretation: 'Оценка центральной резистентности к тиреоидным гормонам',
        status: 'normal',
        reference: 'Клиническая интерпретация'
      };
    }

    // SPINA-GT
    if (tsh && ft4) {
      const tshVal = parseFloat(tsh);
      const ft4Val = parseFloat(ft4);
      const spinaGT = (tshVal * ft4Val) / (2.7 + 0.676 * ft4Val);
      newResults.spinaGT = {
        value: spinaGT,
        interpretation: spinaGT >= 1.41 && spinaGT <= 8.67 ? 'Нормальная секреция ЩЖ' : 'Нарушение секреции ЩЖ',
        status: spinaGT >= 1.41 && spinaGT <= 8.67 ? 'normal' : 'abnormal',
        reference: '1.41 - 8.67 пмоль/с'
      };
    }

    // Jostel's TSH index
    if (tsh && ft4) {
      const jostel = Math.log(parseFloat(tsh)) + 0.1345 * parseFloat(ft4);
      newResults.jostel = {
        value: jostel,
        interpretation: jostel >= 2.7 && jostel <= 4.2 ? 'Нормальная функция ЩЖ' : 'Нарушение функции ЩЖ',
        status: jostel >= 2.7 && jostel <= 4.2 ? 'normal' : 'abnormal',
        reference: '2.7 - 4.2'
      };
    }

    setResults(newResults);
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
      {/* Input Section */}
      <Card className="border-feminine-lavender-200 bg-gradient-to-r from-feminine-lavender-50 to-white">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2 text-feminine-lavender-700">
            <Activity className="w-5 h-5" />
            <span>Тиреоидные показатели</span>
          </CardTitle>
          <CardDescription>
            Введите результаты лабораторных исследований для расчета тиреоидных индексов
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ft3" className="text-sm font-medium">FT3 (пмоль/л)</Label>
              <Input
                id="ft3"
                type="number"
                step="0.01"
                placeholder="3.1-6.8"
                value={ft3}
                onChange={(e) => setFt3(e.target.value)}
                className="border-feminine-lavender-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ft4" className="text-sm font-medium">FT4 (пмоль/л)</Label>
              <Input
                id="ft4"
                type="number"
                step="0.01"
                placeholder="12.0-22.0"
                value={ft4}
                onChange={(e) => setFt4(e.target.value)}
                className="border-feminine-lavender-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rt3" className="text-sm font-medium">rT3 (нг/дл)</Label>
              <Input
                id="rt3"
                type="number"
                step="0.01"
                placeholder="9.2-24.1"
                value={rt3}
                onChange={(e) => setRt3(e.target.value)}
                className="border-feminine-lavender-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tsh" className="text-sm font-medium">TSH (мЕд/л)</Label>
              <Input
                id="tsh"
                type="number"
                step="0.001"
                placeholder="0.27-4.2"
                value={tsh}
                onChange={(e) => setTsh(e.target.value)}
                className="border-feminine-lavender-200"
              />
            </div>
          </div>
          
          <Button 
            onClick={calculateRatios} 
            className="w-full md:w-auto bg-feminine-lavender-500 hover:bg-feminine-lavender-600"
          >
            <Calculator className="w-4 h-4 mr-2" />
            Рассчитать индексы
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      {Object.keys(results).length > 0 && (
        <Card className="border-feminine-pink-200 bg-gradient-to-r from-feminine-pink-50 to-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-feminine-pink-700">
              <Zap className="w-5 h-5" />
              <span>Результаты расчетов</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.ft3ft4 && (
              <div className="p-4 rounded-lg border border-gray-200 bg-white">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-800">FT3/FT4 соотношение</h4>
                  <Badge className={getStatusColor(results.ft3ft4.status)}>
                    {results.ft3ft4.value.toFixed(3)}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-1">{results.ft3ft4.interpretation}</p>
                <p className="text-xs text-gray-500">Референс: {results.ft3ft4.reference}</p>
              </div>
            )}

            {results.ft3rt3 && (
              <div className="p-4 rounded-lg border border-gray-200 bg-white">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-800">FT3/rT3 соотношение</h4>
                  <Badge className={getStatusColor(results.ft3rt3.status)}>
                    {results.ft3rt3.value.toFixed(1)}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-1">{results.ft3rt3.interpretation}</p>
                <p className="text-xs text-gray-500">Референс: {results.ft3rt3.reference}</p>
              </div>
            )}

            {results.tshft4 && (
              <div className="p-4 rounded-lg border border-gray-200 bg-white">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-800">TSH/FT4 соотношение</h4>
                  <Badge className={getStatusColor(results.tshft4.status)}>
                    {results.tshft4.value.toFixed(4)}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-1">{results.tshft4.interpretation}</p>
                <p className="text-xs text-gray-500">Референс: {results.tshft4.reference}</p>
              </div>
            )}

            {results.spinaGT && (
              <div className="p-4 rounded-lg border border-gray-200 bg-white">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-800">SPINA-GT (секреция ЩЖ)</h4>
                  <Badge className={getStatusColor(results.spinaGT.status)}>
                    {results.spinaGT.value.toFixed(2)}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-1">{results.spinaGT.interpretation}</p>
                <p className="text-xs text-gray-500">Референс: {results.spinaGT.reference}</p>
              </div>
            )}

            {results.jostel && (
              <div className="p-4 rounded-lg border border-gray-200 bg-white">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-800">Индекс Jostel's TSH</h4>
                  <Badge className={getStatusColor(results.jostel.status)}>
                    {results.jostel.value.toFixed(2)}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-1">{results.jostel.interpretation}</p>
                <p className="text-xs text-gray-500">Референс: {results.jostel.reference}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Educational Content */}
      <Card className="border-mint-200 bg-gradient-to-r from-mint-50 to-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-mint-700">
            <BookOpen className="w-5 h-5" />
            <span>Клиническое значение</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <div className="space-y-3 text-sm text-gray-700">
            <p>
              <strong>FT3/FT4 соотношение</strong> отражает эффективность конверсии T4 в T3. 
              Снижение может указывать на нарушение дейодирования.
            </p>
            <p>
              <strong>SPINA-GT</strong> оценивает секреторную способность щитовидной железы 
              независимо от обратной связи с гипофизом.
            </p>
            <p>
              <strong>Индекс Jostel's</strong> помогает выявить центральную резистентность 
              к тиреоидным гормонам и оценить гипоталамо-гипофизарно-тиреоидную ось.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThyroidCalculators;
