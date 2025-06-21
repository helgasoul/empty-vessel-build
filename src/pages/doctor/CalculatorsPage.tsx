
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, Search, Heart, Activity, Brain, Droplets } from 'lucide-react';

const CalculatorsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Все', icon: Calculator, color: 'bg-gray-500' },
    { id: 'thyroid', name: 'Щитовидная железа', icon: Heart, color: 'bg-rose-500' },
    { id: 'metabolic', name: 'Метаболизм', icon: Activity, color: 'bg-orange-500' },
    { id: 'hormones', name: 'Гормоны', icon: Droplets, color: 'bg-pink-500' },
    { id: 'inflammation', name: 'Воспаление', icon: Brain, color: 'bg-purple-500' }
  ];

  const calculators = [
    {
      id: 1,
      name: 'FT3/FT4 ratio',
      description: 'Оценка конверсии T4 в T3',
      category: 'thyroid',
      icon: '🦋'
    },
    {
      id: 2,
      name: 'HOMA-IR',
      description: 'Индекс инсулинорезистентности',
      category: 'metabolic',
      icon: '🌸'
    },
    {
      id: 3,
      name: 'Free Androgen Index',
      description: 'Индекс свободных андрогенов',
      category: 'hormones',
      icon: '💗'
    },
    {
      id: 4,
      name: 'NLR',
      description: 'Нейтрофильно-лимфоцитарное соотношение',
      category: 'inflammation',
      icon: '🧠'
    },
    {
      id: 5,
      name: 'TSH/FT4 ratio',
      description: 'Соотношение ТТГ к свободному Т4',
      category: 'thyroid',
      icon: '🦋'
    },
    {
      id: 6,
      name: 'TG/HDL ratio',
      description: 'Соотношение триглицеридов к ЛПВП',
      category: 'metabolic',
      icon: '🌸'
    }
  ];

  const filteredCalculators = calculators.filter(calc => {
    const matchesSearch = calc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         calc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || calc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-rose-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-rose-600 hover:text-rose-700 font-medium"
              >
                ← Назад к дашборду
              </button>
              <h1 className="text-2xl font-bold text-gray-800">
                🧮 Медицинские калькуляторы
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Поиск калькуляторов..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                    selectedCategory === category.id
                      ? `${category.color} text-white shadow-lg`
                      : 'bg-white/80 text-gray-700 hover:bg-rose-50 border border-rose-100'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="font-medium">{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Calculators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCalculators.map((calculator) => (
            <div key={calculator.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-rose-100 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
              <div className="text-center">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {calculator.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {calculator.name}
                </h3>
                <p className="text-gray-600 mb-6">
                  {calculator.description}
                </p>
                <button className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 rounded-xl hover:from-rose-600 hover:to-pink-600 transition-all duration-200 font-medium">
                  Открыть калькулятор
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredCalculators.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Калькуляторы не найдены
            </h3>
            <p className="text-gray-600">
              Попробуйте изменить поисковый запрос или выберите другую категорию
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default CalculatorsPage;
