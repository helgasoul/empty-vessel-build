/**
 * EnhancedGailCalculatorDemo.tsx
 * 
 * Демонстрационный компонент Enhanced Gail Calculator
 * Исправление: DNA -> Dna (правильный импорт из lucide-react)
 */

import React, { useState } from 'react';
import { 
  Heart, 
  Dna, // Исправлено: было DNA, стало Dna
  Activity, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Info,
  Calendar,
  User,
  Family,
  Pill
} from 'lucide-react';

interface DemoProps {
  className?: string;
}

export const EnhancedGailCalculatorDemo: React.FC<DemoProps> = ({ className }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleCalculate = async () => {
    setIsCalculating(true);
    // Симуляция расчета
    setTimeout(() => {
      setIsCalculating(false);
      setShowResults(true);
    }, 3000);
  };

  return (
    <div className={`max-w-4xl mx-auto p-6 ${className}`}>
      <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 rounded-2xl shadow-lg overflow-hidden">
        
        {/* Заголовок */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Heart className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Enhanced Gail Calculator</h2>
              <p className="text-pink-100">Персонализированная оценка рисков для женского здоровья</p>
            </div>
          </div>
        </div>

        {/* Прогресс */}
        {isCalculating && (
          <div className="p-6 bg-white border-b">
            <div className="flex items-center space-x-4">
              <div className="animate-spin">
                <Dna className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">Анализируем ваши данные...</p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full animate-pulse w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Основной контент */}
        <div className="p-6">
          {!showResults ? (
            <div className="space-y-6">
              
              {/* Разделы ввода данных */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                
                {/* Личная информация */}
                <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-pink-300 transition-colors">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-pink-100 rounded-lg">
                      <User className="h-5 w-5 text-pink-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800">Личные данные</h3>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• Возраст: 45 лет</p>
                    <p>• Рост: 165 см</p>
                    <p>• Вес: 65 кг</p>
                    <p>• Этническая группа: Европеоидная</p>
                  </div>
                </div>

                {/* Семейная история */}
                <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-purple-300 transition-colors">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Family className="h-5 w-5 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800">Семейная история</h3>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• Мать: рак молочной железы в 52 года</p>
                    <p>• Сестра: здорова</p>
                    <p>• Бабушка: рак яичников в 68 лет</p>
                    <p>• Генетика: тест не проводился</p>
                  </div>
                </div>

                {/* Медицинская история */}
                <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Pill className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800">Медицинская история</h3>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• Менархе: 12 лет</p>
                    <p>• Первые роды: 28 лет</p>
                    <p>• Количество детей: 2</p>
                    <p>• Биопсии: 0</p>
                  </div>
                </div>

              </div>

              {/* Дополнительные факторы */}
              <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Activity className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800">Образ жизни</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-700">Физическая активность</p>
                    <p className="text-green-600">Регулярная</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Курение</p>
                    <p className="text-green-600">Никогда</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Алкоголь</p>
                    <p className="text-yellow-600">Умеренно</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Питание</p>
                    <p className="text-green-600">Сбалансированное</p>
                  </div>
                </div>
              </div>

              {/* Кнопка расчета */}
              <div className="text-center">
                <button
                  onClick={handleCalculate}
                  disabled={isCalculating}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCalculating ? 'Анализируем...' : '🧮 Рассчитать риски'}
                </button>
              </div>

            </div>
          ) : (
            
            /* Результаты */
            <div className="space-y-6">
              
              {/* Основные результаты */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 5-летний риск */}
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-800">5-летний риск</h3>
                    <TrendingUp className="h-5 w-5 text-orange-500" />
                  </div>
                  <div className="text-3xl font-bold text-orange-500 mb-2">3.2%</div>
                  <p className="text-sm text-gray-600">Выше среднего для возрастной группы (2.1%)</p>
                  <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full w-1/3"></div>
                  </div>
                </div>

                {/* Пожизненный риск */}
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-800">Пожизненный риск</h3>
                    <Calendar className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="text-3xl font-bold text-red-500 mb-2">18.7%</div>
                  <p className="text-sm text-gray-600">Умеренно повышен (средний 12.5%)</p>
                  <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full w-1/2"></div>
                  </div>
                </div>

              </div>

              {/* Факторы риска */}
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4">Анализ факторов риска</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Семейная история</span>
                    <div className="flex items-center space-x-2">
                      <div className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm">Высокий</div>
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Возраст</span>
                    <div className="flex items-center space-x-2">
                      <div className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-sm">Умеренный</div>
                      <Info className="h-4 w-4 text-yellow-500" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Репродуктивная история</span>
                    <div className="flex items-center space-x-2">
                      <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">Низкий</div>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Образ жизни</span>
                    <div className="flex items-center space-x-2">
                      <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">Защитный</div>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Рекомендации */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                <h3 className="font-semibold text-gray-800 mb-4">🎯 Персональные рекомендации</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-blue-800 mb-2">Скрининг</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Маммография: ежегодно</li>
                      <li>• УЗИ молочных желез: каждые 6 месяцев</li>
                      <li>• Генетическое тестирование: рекомендовано</li>
                      <li>• МРТ: по показаниям</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-800 mb-2">Профилактика</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Продолжать регулярные тренировки</li>
                      <li>• Средиземноморская диета</li>
                      <li>• Ограничение алкоголя</li>
                      <li>• Консультация генетика</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Кнопка нового расчета */}
              <div className="text-center">
                <button
                  onClick={() => {
                    setShowResults(false);
                    setCurrentStep(1);
                  }}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Новый расчет
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default EnhancedGailCalculatorDemo;