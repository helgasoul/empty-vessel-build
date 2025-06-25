
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Calculator, Dna, Heart, Info, TrendingUp } from "lucide-react";
import { useEnhancedGailCalculator, type GailInputs } from '../../hooks/useEnhancedGailCalculator';

const EnhancedGailCalculatorDemo: React.FC = () => {
  const { calculateRisk, isCalculating, results } = useEnhancedGailCalculator();
  const [formData, setFormData] = useState<GailInputs>({
    age: 35,
    ageFirstPeriod: 13,
    ageFirstBirth: null,
    numRelatives: 0,
    numBiopsies: 0,
    hasAtypicalHyperplasia: false,
    race: 'white'
  });

  const [errors, setErrors] = useState<Partial<Record<keyof GailInputs, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof GailInputs, string>> = {};

    if (formData.age < 35) {
      newErrors.age = 'Модель Gail применима для женщин от 35 лет';
    }

    if (formData.ageFirstPeriod < 7 || formData.ageFirstPeriod > 17) {
      newErrors.ageFirstPeriod = 'Возраст должен быть от 7 до 17 лет';
    }

    if (formData.ageFirstBirth !== null && (formData.ageFirstBirth < 15 || formData.ageFirstBirth > 50)) {
      newErrors.ageFirstBirth = 'Возраст должен быть от 15 до 50 лет';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await calculateRisk(formData);
    }
  };

  const getRiskColor = (category: string) => {
    switch (category) {
      case 'low': return 'text-green-600';
      case 'moderate': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskBgColor = (category: string) => {
    switch (category) {
      case 'low': return 'bg-green-50 border-green-200';
      case 'moderate': return 'bg-yellow-50 border-yellow-200';
      case 'high': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="w-6 h-6 text-pink-600" />
            <span>Калькулятор риска рака молочной железы (Модель Gail)</span>
          </CardTitle>
          <CardDescription>
            Оценка персонального риска развития рака молочной железы на основе клинически валидированной модели NCI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Age */}
              <div className="space-y-2">
                <Label htmlFor="age" className="flex items-center space-x-1">
                  <span>Возраст</span>
                  <Info className="w-4 h-4 text-gray-400" />
                </Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                  min="35"
                  max="85"
                  className={errors.age ? 'border-red-500' : ''}
                />
                {errors.age && <p className="text-sm text-red-600">{errors.age}</p>}
              </div>

              {/* Age at first period */}
              <div className="space-y-2">
                <Label htmlFor="ageFirstPeriod">Возраст первой менструации</Label>
                <Input
                  id="ageFirstPeriod"
                  type="number"
                  value={formData.ageFirstPeriod}
                  onChange={(e) => setFormData(prev => ({ ...prev, ageFirstPeriod: parseInt(e.target.value) || 0 }))}
                  min="7"
                  max="17"
                  className={errors.ageFirstPeriod ? 'border-red-500' : ''}
                />
                {errors.ageFirstPeriod && <p className="text-sm text-red-600">{errors.ageFirstPeriod}</p>}
              </div>

              {/* Age at first birth */}
              <div className="space-y-2">
                <Label>Возраст первых родов</Label>
                <RadioGroup
                  value={formData.ageFirstBirth?.toString() || 'nulliparous'}
                  onValueChange={(value) => {
                    if (value === 'nulliparous') {
                      setFormData(prev => ({ ...prev, ageFirstBirth: null }));
                    } else {
                      setFormData(prev => ({ ...prev, ageFirstBirth: parseInt(value) }));
                    }
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="nulliparous" id="nulliparous" />
                    <Label htmlFor="nulliparous">Нерожавшая</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="20" id="age20" />
                    <Label htmlFor="age20">До 20 лет</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="25" id="age25" />
                    <Label htmlFor="age25">20-24 года</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="30" id="age30" />
                    <Label htmlFor="age30">25-29 лет</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="35" id="age35" />
                    <Label htmlFor="age35">30+ лет</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Number of relatives */}
              <div className="space-y-2">
                <Label htmlFor="relatives">Родственники первой линии с раком молочной железы</Label>
                <Select value={formData.numRelatives.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, numRelatives: parseInt(value) }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3 или более</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Number of biopsies */}
              <div className="space-y-2">
                <Label htmlFor="biopsies">Количество биопсий молочной железы</Label>
                <Select value={formData.numBiopsies.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, numBiopsies: parseInt(value) }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2 или более</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Atypical hyperplasia */}
              <div className="space-y-2">
                <Label>Атипичная гиперплазия в анамнезе</Label>
                <RadioGroup
                  value={formData.hasAtypicalHyperplasia.toString()}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, hasAtypicalHyperplasia: value === 'true' }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id="no-hyperplasia" />
                    <Label htmlFor="no-hyperplasia">Нет</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id="has-hyperplasia" />
                    <Label htmlFor="has-hyperplasia">Да</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Race */}
              <div className="space-y-2">
                <Label htmlFor="race">Раса/этническая принадлежность</Label>
                <Select value={formData.race} onValueChange={(value: any) => setFormData(prev => ({ ...prev, race: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="white">Европеоидная</SelectItem>
                    <SelectItem value="black">Негроидная</SelectItem>
                    <SelectItem value="hispanic">Латиноамериканская</SelectItem>
                    <SelectItem value="asian">Азиатская</SelectItem>
                    <SelectItem value="other">Другая</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" disabled={isCalculating} className="w-full">
              {isCalculating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Вычисляем риск...
                </>
              ) : (
                <>
                  <Calculator className="w-4 h-4 mr-2" />
                  Рассчитать риск
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {results && (
        <Card className={`border-2 ${getRiskBgColor(results.riskCategory)}`}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className={`w-6 h-6 ${getRiskColor(results.riskCategory)}`} />
              <span>Результаты оценки риска</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className={`text-2xl font-bold ${getRiskColor(results.riskCategory)}`}>
                  {(results.fiveYearRisk * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">5-летний риск</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className={`text-2xl font-bold ${getRiskColor(results.riskCategory)}`}>
                  {(results.lifetimeRisk * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Пожизненный риск</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-lg font-semibold text-gray-600">
                  {(results.averageRisk * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Средний популяционный риск</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Категория риска:</span>
                <span className={`font-semibold ${getRiskColor(results.riskCategory)}`}>
                  {results.riskCategory === 'low' ? 'Низкий' : 
                   results.riskCategory === 'moderate' ? 'Умеренный' : 'Высокий'}
                </span>
              </div>
              <Progress 
                value={results.fiveYearRisk * 100} 
                className="h-2"
              />
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold flex items-center space-x-2">
                <Heart className="w-4 h-4 text-pink-600" />
                <span>Рекомендации</span>
              </h4>
              <ul className="space-y-2">
                {results.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-pink-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Важное примечание:</p>
                  <p>
                    Модель Gail предназначена для оценки риска у женщин без мутаций BRCA1/2 
                    и без отягощенного семейного анамнеза. Результаты следует обсуждать с врачом 
                    в контексте индивидуальной клинической ситуации.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedGailCalculatorDemo;
