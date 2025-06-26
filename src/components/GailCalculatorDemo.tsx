
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useGailCalculator, type GailInputs } from '../hooks/useGailCalculator';

const GailCalculatorDemo: React.FC = () => {
  const gailCalculator = useGailCalculator();
  const [formData, setFormData] = useState<GailInputs>({
    age: 35,
    ageFirstPeriod: 13,
    ageFirstBirth: null,
    numberOfRelatives: 0,
    numberOfBiopsies: 0,
    atypicalHyperplasia: false,
    race: 'white'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await gailCalculator.calculateRisk(formData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Калькулятор риска рака молочной железы (Модель Gail)</CardTitle>
          <CardDescription>
            Оценка персонального риска развития рака молочной железы
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="age" className="text-sm font-medium">
                  Возраст
                </label>
                <input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-input rounded-md"
                  min="35"
                  max="85"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="ageFirstPeriod" className="text-sm font-medium">
                  Возраст первой менструации
                </label>
                <input
                  id="ageFirstPeriod"
                  type="number"
                  value={formData.ageFirstPeriod}
                  onChange={(e) => setFormData(prev => ({ ...prev, ageFirstPeriod: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-input rounded-md"
                  min="7"
                  max="17"
                />
              </div>
            </div>

            <Button type="submit" disabled={gailCalculator.isCalculating} className="w-full">
              {gailCalculator.isCalculating ? 'Вычисляем риск...' : 'Рассчитать риск'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {gailCalculator.results && (
        <Card>
          <CardHeader>
            <CardTitle>Результаты оценки риска</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-background rounded-lg border">
                <div className="text-2xl font-bold text-primary">
                  {gailCalculator.results.fiveYearRisk}%
                </div>
                <div className="text-sm text-muted-foreground">5-летний риск</div>
              </div>
              <div className="text-center p-4 bg-background rounded-lg border">
                <div className="text-2xl font-bold text-primary">
                  {gailCalculator.results.lifetimeRisk}%
                </div>
                <div className="text-sm text-muted-foreground">Пожизненный риск</div>
              </div>
              <div className="text-center p-4 bg-background rounded-lg border">
                <div className="text-lg font-semibold text-muted-foreground">
                  {gailCalculator.results.averageRisk}%
                </div>
                <div className="text-sm text-muted-foreground">Средний популяционный риск</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Категория риска:</span>
                <span className="font-semibold">
                  {gailCalculator.results.riskCategory === 'low' ? 'Низкий' : 
                   gailCalculator.results.riskCategory === 'average' ? 'Средний' : 'Высокий'}
                </span>
              </div>
              <Progress 
                value={gailCalculator.results.fiveYearRisk} 
                max={10}
              />
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Рекомендации</h4>
              <ul className="space-y-2">
                {gailCalculator.results.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GailCalculatorDemo;
