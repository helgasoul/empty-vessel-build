
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Star, Users } from 'lucide-react';
import { Calculator, UserRole } from '../../types/risk-calculator.types';
import { adaptContentForRole, getRequiredDataForRole } from '../../utils/role-adaptations';

interface CalculatorCardProps {
  calculator: Calculator;
  userRole: UserRole;
  isCompleted?: boolean;
  onClick: () => void;
}

export const CalculatorCard: React.FC<CalculatorCardProps> = ({
  calculator,
  userRole,
  isCompleted = false,
  onClick
}) => {
  const description = adaptContentForRole(calculator.description, userRole);
  const requiredData = getRequiredDataForRole(calculator, userRole);
  
  const evidenceLevelColors = {
    high: 'bg-green-100 text-green-800',
    moderate: 'bg-yellow-100 text-yellow-800',
    low: 'bg-red-100 text-red-800'
  };

  const complexityIcons = {
    simple: '●',
    moderate: '●●',
    complex: '●●●'
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer"
      onClick={onClick}
    >
      <div 
        className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 h-full transition-all duration-300 hover:shadow-xl relative overflow-hidden"
        style={{ 
          borderTop: `4px solid ${calculator.color.primary}`,
          backgroundColor: isCompleted ? `${calculator.color.bg}20` : 'white'
        }}
      >
        {/* Completion Badge */}
        {isCompleted && (
          <div className="absolute top-4 right-4">
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
            style={{ backgroundColor: calculator.color.primary }}
          >
            {calculator.name.charAt(0)}
          </div>
          
          <div className="text-right">
            <span 
              className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${evidenceLevelColors[calculator.evidenceLevel]}`}
            >
              {calculator.evidenceLevel === 'high' ? 'Высокая достоверность' : 
               calculator.evidenceLevel === 'moderate' ? 'Средняя достоверность' : 'Низкая достоверность'}
            </span>
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {calculator.name}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {description}
        </p>

        {/* Metadata */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-2" />
            <span>{calculator.estimatedTime} • {calculator.timeframe}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <Users className="w-4 h-4 mr-2" />
            <span>Сложность: {complexityIcons[calculator.complexity]}</span>
          </div>
        </div>

        {/* Required Data Preview */}
        <div className="mb-4">
          <h4 className="text-xs font-medium text-gray-700 mb-2">Необходимые данные:</h4>
          <div className="flex flex-wrap gap-1">
            {requiredData.slice(0, 3).map((item, index) => (
              <span 
                key={index}
                className="inline-flex px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600"
              >
                {item}
              </span>
            ))}
            {requiredData.length > 3 && (
              <span className="inline-flex px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                +{requiredData.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Guidelines */}
        <div className="flex items-center text-xs text-gray-500">
          <Star className="w-3 h-3 mr-1" />
          <span>Основано на: {calculator.guidelines.join(', ')}</span>
        </div>

        {/* Action Button Area */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
              isCompleted 
                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {isCompleted ? 'Просмотреть результат' : 'Начать оценку'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
