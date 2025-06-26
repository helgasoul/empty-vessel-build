
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Brain, Shield, Bone } from 'lucide-react';
import { Category } from '../../types/risk-calculator.types';

interface CategoryFilterProps {
  selectedCategory: Category | 'all';
  onCategoryChange: (category: Category | 'all') => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange
}) => {
  const categories = [
    { id: 'all', label: 'Все категории', icon: Shield, color: 'gray' },
    { id: 'oncology', label: 'Онкология', icon: Heart, color: 'pink' },
    { id: 'cardiovascular', label: 'Сердце и сосуды', icon: Heart, color: 'red' },
    { id: 'bone', label: 'Костная система', icon: Bone, color: 'orange' },
    { id: 'neurological', label: 'Неврология', icon: Brain, color: 'purple' }
  ];

  const getColorClasses = (color: string, isActive: boolean) => {
    if (isActive) {
      switch (color) {
        case 'pink':
          return 'bg-pink-500 text-white shadow-lg shadow-pink-200';
        case 'red':
          return 'bg-red-500 text-white shadow-lg shadow-red-200';
        case 'orange':
          return 'bg-orange-500 text-white shadow-lg shadow-orange-200';
        case 'purple':
          return 'bg-purple-500 text-white shadow-lg shadow-purple-200';
        case 'gray':
          return 'bg-gray-700 text-white shadow-lg shadow-gray-200';
        default:
          return 'bg-gray-500 text-white shadow-lg';
      }
    }
    return 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-2 justify-center mb-6"
    >
      {categories.map(({ id, label, icon: Icon, color }) => (
        <motion.button
          key={id}
          onClick={() => onCategoryChange(id as Category | 'all')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`
            flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200
            ${getColorClasses(color, selectedCategory === id)}
          `}
        >
          <Icon className="w-4 h-4" />
          <span className="text-sm font-medium">{label}</span>
        </motion.button>
      ))}
    </motion.div>
  );
};
