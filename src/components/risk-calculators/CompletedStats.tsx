
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, BarChart3, TrendingUp } from 'lucide-react';

interface CompletedStatsProps {
  completedCount: number;
  totalCount: number;
}

export const CompletedStats: React.FC<CompletedStatsProps> = ({ 
  completedCount, 
  totalCount 
}) => {
  const completionPercentage = Math.round((completedCount / totalCount) * 100);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Прогресс оценки рисков</h3>
        </div>
        <TrendingUp className="w-5 h-5 text-green-500" />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Завершенные калькуляторы</span>
          <span className="font-semibold text-gray-800">{completedCount} из {totalCount}</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Готовность: {completionPercentage}%</span>
          </div>
          
          {completionPercentage === 100 && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full"
            >
              Все тесты пройдены!
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
