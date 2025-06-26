
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calculator, Info, AlertTriangle } from 'lucide-react';
import { Calculator as CalculatorType } from '../../../types/risk-calculator.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface DemoCalculatorProps {
  calculator: CalculatorType;
  onBack: () => void;
}

export const DemoCalculator: React.FC<DemoCalculatorProps> = ({
  calculator,
  onBack
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [results, setResults] = useState<any>(null);

  const steps = [
    'Личная информация',
    'Факторы риска',
    'Медицинский анамнез',
    'Результаты'
  ];

  const handleNextStep = () => {
    if (currentStep < steps.length - 2) {
      setCurrentStep(currentStep + 1);
    } else {
      // Simulate calculation
      setIsCalculating(true);
      setTimeout(() => {
        setResults({
          riskScore: Math.floor(Math.random() * 30) + 5,
          category: 'moderate',
          recommendations: [
            'Регулярные обследования каждые 6 месяцев',
            'Здоровое питание и физическая активность',
            'Консультация специалиста'
          ]
        });
        setIsCalculating(false);
        setCurrentStep(steps.length - 1);
      }, 2000);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Button 
            onClick={onBack}
            variant="ghost"
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к калькуляторам
          </Button>
          
          <div className="flex items-center space-x-3 mb-4">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: calculator.color.primary }}
            >
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {calculator.name}
              </h1>
              <p className="text-gray-600">
                Временные рамки: {calculator.timeframe} • {calculator.estimatedTime}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Progress */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Шаг {currentStep + 1} из {steps.length}</span>
                <span>{steps[currentStep]}</span>
              </div>
              <Progress value={progress} className="h-2" />
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          {currentStep < steps.length - 1 && !isCalculating && (
            <Card>
              <CardHeader>
                <CardTitle>{steps[currentStep]}</CardTitle>
                <CardDescription>
                  Заполните информацию для расчета вашего риска
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Demo form fields */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Возраст
                    </label>
                    <input 
                      type="number" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Введите ваш возраст"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Пол
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                      <option>Женский</option>
                      <option>Мужской</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-between pt-6">
                  <Button 
                    variant="outline"
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                  >
                    Назад
                  </Button>
                  <Button onClick={handleNextStep}>
                    {currentStep === steps.length - 2 ? 'Рассчитать риск' : 'Далее'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {isCalculating && (
            <Card>
              <CardContent className="text-center py-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-4 border-purple-200 border-t-purple-500 rounded-full mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Анализируем ваши данные...
                </h3>
                <p className="text-gray-600">
                  Пожалуйста, подождите, пока мы рассчитываем ваш персональный риск
                </p>
              </CardContent>
            </Card>
          )}

          {results && currentStep === steps.length - 1 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calculator className="w-5 h-5" />
                    <span>Результаты расчета</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div 
                      className="text-4xl font-bold mb-2"
                      style={{ color: calculator.color.primary }}
                    >
                      {results.riskScore}%
                    </div>
                    <p className="text-gray-600">
                      Ваш {calculator.timeframe} риск
                    </p>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-800">Важно помнить</h4>
                        <p className="text-sm text-yellow-700 mt-1">
                          Это демонстрационный калькулятор. Результаты носят информационный характер 
                          и не заменяют консультацию врача.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Рекомендации:</h4>
                    <ul className="space-y-2">
                      {results.recommendations.map((rec: string, index: number) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-700">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-center space-x-4">
                <Button variant="outline" onClick={onBack}>
                  Вернуться к калькуляторам
                </Button>
                <Button onClick={() => window.print()}>
                  Сохранить результат
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
