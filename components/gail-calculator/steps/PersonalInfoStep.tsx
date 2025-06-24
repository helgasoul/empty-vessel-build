/**
 * components/gail-calculator/steps/PersonalInfoStep.tsx
 * 
 * Шаг 1: Персональная информация
 * 💖 Заботливое оформление с теплыми цветами
 */

import React from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, Ruler, Weight } from 'lucide-react';

// Типы для данных и ошибок валидации
interface PersonalInfo {
  age?: number;
  race?: string;
  height?: number;
  weight?: number;
}

interface ValidationError {
  field: string;
  message: string;
}

interface PersonalInfoStepProps {
  data: Partial<PersonalInfo>;
  onChange: (data: Partial<PersonalInfo>) => void;
  errors: ValidationError[];
}

export const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  data,
  onChange,
  errors,
}) => {
  const handleChange = (field: keyof PersonalInfo, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const getFieldError = (field: string) => {
    return errors.find(error => error.field.includes(field))?.message;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Возраст */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <Calendar className="w-4 h-4 text-pink-500" />
            <span>Возраст <span className="text-red-500">*</span></span>
          </label>
          <input
            type="number"
            min="35"
            max="85"
            value={data.age || ''}
            onChange={(e) => handleChange('age', parseInt(e.target.value))}
            className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all ${
              getFieldError('age') ? 'border-red-300 bg-red-50' : 'border-gray-200'
            }`}
            placeholder="Введите ваш возраст"
          />
          {getFieldError('age') && (
            <p className="text-red-600 text-sm">{getFieldError('age')}</p>
          )}
          <p className="text-gray-500 text-xs">
            Модель Gail рассчитана для женщин 35-85 лет
          </p>
        </div>

        {/* Этническая принадлежность */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <User className="w-4 h-4 text-pink-500" />
            <span>Этническая принадлежность <span className="text-red-500">*</span></span>
          </label>
          <select
            value={data.race || ''}
            onChange={(e) => handleChange('race', e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all ${
              getFieldError('race') ? 'border-red-300 bg-red-50' : 'border-gray-200'
            }`}
          >
            <option value="">Выберите</option>
            <option value="caucasian">Европеоидная</option>
            <option value="african_american">Афроамериканская</option>
            <option value="hispanic">Латиноамериканская</option>
            <option value="asian">Азиатская</option>
            <option value="other">Другая</option>
          </select>
          {getFieldError('race') && (
            <p className="text-red-600 text-sm">{getFieldError('race')}</p>
          )}
        </div>

        {/* Рост */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <Ruler className="w-4 h-4 text-pink-500" />
            <span>Рост (см)</span>
          </label>
          <input
            type="number"
            min="100"
            max="250"
            value={data.height || ''}
            onChange={(e) => handleChange('height', parseInt(e.target.value))}
            className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all ${
              getFieldError('height') ? 'border-red-300 bg-red-50' : 'border-gray-200'
            }`}
            placeholder="165"
          />
          {getFieldError('height') && (
            <p className="text-red-600 text-sm">{getFieldError('height')}</p>
          )}
        </div>

        {/* Вес */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <Weight className="w-4 h-4 text-pink-500" />
            <span>Вес (кг)</span>
          </label>
          <input
            type="number"
            min="30"
            max="300"
            value={data.weight || ''}
            onChange={(e) => handleChange('weight', parseInt(e.target.value))}
            className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all ${
              getFieldError('weight') ? 'border-red-300 bg-red-50' : 'border-gray-200'
            }`}
            placeholder="60"
          />
          {getFieldError('weight') && (
            <p className="text-red-600 text-sm">{getFieldError('weight')}</p>
          )}
        </div>
      </div>

      {/* Информационная панель */}
      <div className="bg-pink-50 rounded-xl p-4 border border-pink-200">
        <h4 className="font-medium text-pink-800 mb-2">💖 Почему эти данные важны?</h4>
        <ul className="text-sm text-pink-700 space-y-1">
          <li>• <strong>Возраст</strong> - основной фактор риска рака молочной железы</li>
          <li>• <strong>Этническая принадлежность</strong> - влияет на базовые риски</li>
          <li>• <strong>Рост и вес</strong> - помогают оценить гормональные факторы</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default PersonalInfoStep;