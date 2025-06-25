
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, BarChart3 } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Calculator, UserRole } from '../../types/risk-calculator.types';

interface CalculatorCardProps {
  calculator: Calculator;
  userRole: UserRole;
  isCompleted: boolean;
  onClick: () => void;
}

export const CalculatorCard: React.FC<CalculatorCardProps> = ({ 
  calculator, 
  userRole, 
  isCompleted, 
  onClick 
}) => {
  const IconComponent = Icons[calculator.icon as keyof typeof Icons] as React.ComponentType<any>;
  
  const getEvidenceBadge = () => {
    const badges = {
      high: { bg: 'bg-green-100', text: 'text-green-800', label: 'Высокая доказательность' },
      moderate: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Умеренная доказательность' },
      low: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Ограниченная доказательность' }
    };
    return badges[calculator.evidenceLevel];
  };

  const getCategoryName = (category: string) => {
    const categories = {
      oncology: 'Онкология',
      cardiovascular: 'Кардиология',
      bone: 'Остеопороз',
      neurological: 'Неврология'
    };
    return categories[category as keyof typeof categories] || category;
  };

  const badge = getEvidenceBadge();

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="bg-white rounded-2xl border border-gray-200 p-6 cursor-pointer hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
    >
      {/* Background gradient */}
      <div 
        className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300"
        style={{ background: `linear-gradient(135deg, ${calculator.color.primary}, transparent)` }}
      />
      
      {/* Header */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: calculator.color.bg }}
        >
          <IconComponent 
            className="w-6 h-6" 
            style={{ color: calculator.color.text }} 
          />
        </motion.div>
        
        <div className="flex flex-col items-end space-y-2">
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
            {badge.label}
          </div>
          {isCompleted && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
            >
              <CheckCircle className="w-3 h-3" />
              <span>Завершен</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {calculator.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {calculator.description[userRole]}
        </p>

        {/* Metadata */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Временной горизонт:</span>
            <span className="font-medium text-gray-700">{calculator.timeframe}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-1 text-gray-500">
              <Clock className="w-3 h-3" />
              <span>Время заполнения:</span>
            </div>
            <span className="font-medium text-gray-700">{calculator.estimatedTime}</span>
          </div>
        </div>

        {/* Required data tags for doctors/specialists */}
        {userRole !== 'patient' && (
          <div className="mb-4">
            <span className="text-xs text-gray-500 mb-2 block">Требуемые данные:</span>
            <div className="flex flex-wrap gap-1">
              {calculator.requiredData[userRole === 'specialist' ? 'advanced' : 'standard']
                .slice(0, 3)
                .map((data, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                  >
                    {data}
                  </span>
                ))
              }
              {calculator.requiredData[userRole === 'specialist' ? 'advanced' : 'standard'].length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{calculator.requiredData[userRole === 'specialist' ? 'advanced' : 'standard'].length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500">
              {getCategoryName(calculator.category)}
            </span>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            style={{ 
              backgroundColor: calculator.color.primary,
              color: 'white'
            }}
          >
            {userRole === 'patient' ? 'Пройти тест' : 'Открыть калькулятор'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
