
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, TrendingUp } from 'lucide-react';

interface CompletedStatsProps {
  completedCount: number;
  totalCount: number;
}

export const CompletedStats: React.FC<CompletedStatsProps> = ({
  completedCount,
  totalCount
}) => {
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Прогресс оценки рисков
            </h3>
            <p className="text-sm text-gray-600">
              Завершено {completedCount} из {totalCount} калькуляторов
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-800">
            {completionPercentage}%
          </div>
          <div className="text-sm text-gray-500 flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" />
            Завершено
          </div>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div 
            className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>
      
      {completedCount < totalCount && (
        <div className="mt-3 flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-1" />
          Продолжите оценку для получения полной картины рисков
        </div>
      )}
    </motion.div>
  );
};
