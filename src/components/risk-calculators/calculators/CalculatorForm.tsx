
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, Calculator } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Calculator as CalculatorType, UserRole } from '../../../types/risk-calculator.types';
import { calculateRisk, formatRiskPercentage, getRiskColor } from '../../../utils/risk-calculations';

const formSchema = z.object({
  age: z.number().min(18).max(100),
  weight: z.number().min(30).max(300),
  height: z.number().min(100).max(250),
  // Add more fields based on calculator requirements
});

type FormData = z.infer<typeof formSchema>;

interface CalculatorFormProps {
  calculator: CalculatorType;
  userRole: UserRole;
  onBack: () => void;
}

export const CalculatorForm: React.FC<CalculatorFormProps> = ({
  calculator,
  userRole,
  onBack
}) => {
  const [result, setResult] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = async (data: FormData) => {
    setIsCalculating(true);
    
    // Simulate calculation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const calculationResult = calculateRisk(calculator.id, data);
    setResult(calculationResult);
    setIsCalculating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-4 mb-6"
        >
          <Button 
            onClick={onBack}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Назад</span>
          </Button>
          <h2 className="text-2xl font-bold text-gray-800">{calculator.name}</h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="w-5 h-5" />
                  <span>Данные для расчета</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Возраст (лет)
                    </label>
                    <input
                      type="number"
                      {...register('age', { valueAsNumber: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Введите возраст"
                    />
                    {errors.age && (
                      <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Вес (кг)
                    </label>
                    <input
                      type="number"
                      {...register('weight', { valueAsNumber: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Введите вес"
                    />
                    {errors.weight && (
                      <p className="text-red-500 text-sm mt-1">{errors.weight.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Рост (см)
                    </label>
                    <input
                      type="number"
                      {...register('height', { valueAsNumber: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Введите рост"
                    />
                    {errors.height && (
                      <p className="text-red-500 text-sm mt-1">{errors.height.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isCalculating}
                    className="w-full"
                    style={{ backgroundColor: calculator.color.primary }}
                  >
                    {isCalculating ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
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
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {result ? (
              <Card>
                <CardHeader>
                  <CardTitle>Результаты расчета</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-6 rounded-lg" style={{ backgroundColor: calculator.color.bg }}>
                      <div className="text-3xl font-bold mb-2" style={{ color: getRiskColor(result.category) }}>
                        {formatRiskPercentage(result.value)}
                      </div>
                      <div className="text-sm text-gray-600">
                        Риск в течение {calculator.timeframe}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Интерпретация</h4>
                      <p className="text-sm text-gray-600">
                        {result.explanation[userRole]}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Рекомендации</h4>
                      <ul className="space-y-1">
                        {result.recommendations.map((rec: string, index: number) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center">
                            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2"></div>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-64 text-gray-500">
                  <div className="text-center">
                    <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Заполните форму для расчета риска</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
