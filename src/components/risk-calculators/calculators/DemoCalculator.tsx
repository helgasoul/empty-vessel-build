
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Info, Clock, Users, BookOpen } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Calculator } from '../../../types/risk-calculator.types';

interface DemoCalculatorProps {
  calculator: Calculator;
  onBack: () => void;
}

export const DemoCalculator: React.FC<DemoCalculatorProps> = ({ calculator, onBack }) => {
  const IconComponent = Icons[calculator.icon as keyof typeof Icons] as React.ComponentType<any>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-4 mb-6"
        >
          <motion.button 
            onClick={onBack}
            whileHover={{ scale: 1.05, x: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Назад</span>
          </motion.button>
          <h2 className="text-2xl font-bold text-gray-800">{calculator.name}</h2>
        </motion.div>
        
        {/* Demo content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-8 shadow-lg text-center"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: calculator.color.bg }}
          >
            <IconComponent 
              className="w-10 h-10" 
              style={{ color: calculator.color.text }} 
            />
          </motion.div>
          
          <motion.h3 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-semibold mb-4 text-gray-800"
          >
            Калькулятор в разработке
          </motion.h3>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed"
          >
            {calculator.name} будет доступен в следующих обновлениях платформы.
            Мы работаем над интеграцией самых современных алгоритмов оценки рисков.
          </motion.p>
          
          {/* Feature preview */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid md:grid-cols-3 gap-4 mb-8"
          >
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <h4 className="font-medium text-blue-800 mb-2">Быстрая оценка</h4>
              <p className="text-sm text-blue-700">Всего {calculator.estimatedTime}</p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <h4 className="font-medium text-green-800 mb-2">Доказательная база</h4>
              <p className="text-sm text-green-700 capitalize">{calculator.evidenceLevel === 'high' ? 'Высокая' : calculator.evidenceLevel === 'moderate' ? 'Умеренная' : 'Ограниченная'}</p>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <BookOpen className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <h4 className="font-medium text-purple-800 mb-2">Клинические рекомендации</h4>
              <p className="text-sm text-purple-700">{calculator.guidelines.length} источников</p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mb-6 max-w-md mx-auto"
          >
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <h4 className="font-medium text-blue-800 mb-2">Планируемые возможности:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  {calculator.requiredData.basic.map((data, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                    >
                      • {data}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
          
          <motion.button 
            onClick={onBack}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            style={{ 
              backgroundColor: calculator.color.primary,
              color: 'white'
            }}
          >
            Вернуться к списку калькуляторов
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};
