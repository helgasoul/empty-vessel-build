
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, Sparkles } from 'lucide-react';
import { UserRoleSwitch } from './UserRoleSwitch';
import { CategoryFilter } from './CategoryFilter';
import { CompletedStats } from './CompletedStats';
import { CalculatorCard } from './CalculatorCard';
import { DemoCalculator } from './calculators/DemoCalculator';
import { calculatorsConfig } from '../../data/calculators-config';
import { UserRole, Category, Calculator as CalculatorType } from '../../types/risk-calculator.types';

export const RiskCalculatorHub: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<UserRole>('patient');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [completedCalculators, setCompletedCalculators] = useState<Set<string>>(new Set());
  const [activeCalculator, setActiveCalculator] = useState<CalculatorType | null>(null);

  // Filter calculators based on category
  const filteredCalculators = useMemo(() => {
    if (selectedCategory === 'all') {
      return calculatorsConfig;
    }
    return calculatorsConfig.filter(calc => calc.category === selectedCategory);
  }, [selectedCategory]);

  const handleCalculatorClick = (calculator: CalculatorType) => {
    setActiveCalculator(calculator);
    // Simulate completion for demo
    setCompletedCalculators(prev => new Set([...prev, calculator.id]));
  };

  const handleBackToHub = () => {
    setActiveCalculator(null);
  };

  if (activeCalculator) {
    return (
      <DemoCalculator 
        calculator={activeCalculator} 
        onBack={handleBackToHub} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center"
            >
              <Calculator className="w-6 h-6 text-white" />
            </motion.div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Калькуляторы рисков
            </h1>
            <Sparkles className="w-6 h-6 text-yellow-500" />
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Персонализированная оценка рисков заболеваний на основе современных клинических алгоритмов
          </p>
        </motion.div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <UserRoleSwitch 
            currentRole={currentRole} 
            onRoleChange={setCurrentRole} 
          />
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2 text-sm text-gray-600"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Основано на актуальных клинических рекомендациях</span>
          </motion.div>
        </div>

        {/* Category Filter */}
        <CategoryFilter 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Stats */}
        <div className="mb-8">
          <CompletedStats 
            completedCount={completedCalculators.size}
            totalCount={filteredCalculators.length}
          />
        </div>

        {/* Calculators Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredCalculators.map((calculator, index) => (
            <motion.div
              key={calculator.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <CalculatorCard
                calculator={calculator}
                userRole={currentRole}
                isCompleted={completedCalculators.has(calculator.id)}
                onClick={() => handleCalculatorClick(calculator)}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="bg-white rounded-xl p-6 shadow-md max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Важная информация
            </h3>
            <p className="text-sm text-gray-600">
              Калькуляторы рисков предназначены для информационных целей и не заменяют 
              консультацию врача. Результаты должны интерпретироваться медицинским специалистом 
              с учетом индивидуальных особенностей пациента.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
