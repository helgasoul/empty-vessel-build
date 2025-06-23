
import React, { useState, useEffect } from 'react';
import { Search, X, Sparkles, FileText, Shield, MessageCircle } from 'lucide-react';
import { SearchResults } from '../navigation/SearchResults';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const searchCategories: SearchCategory[] = [
    { 
      id: 'recommendations', 
      label: 'Рекомендации', 
      icon: <Sparkles className="w-4 h-4" />,
      href: '/recommendations'
    },
    { 
      id: 'health-data', 
      label: 'Медицинские данные', 
      icon: <FileText className="w-4 h-4" />,
      href: '/health-vault'
    },
    { 
      id: 'risks', 
      label: 'Риски', 
      icon: <Shield className="w-4 h-4" />,
      href: '/risk-assessment'
    },
    { 
      id: 'chat', 
      label: 'Чат с ИИ', 
      icon: <MessageCircle className="w-4 h-4" />,
      href: '/ai-health'
    }
  ];

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (query.length > 0) {
      setIsSearching(true);
      // Имитация поиска
      const timer = setTimeout(() => {
        setResults([
          {
            id: '1',
            title: 'Оценка рисков сердечно-сосудистых заболеваний',
            description: 'Персонализированная оценка на основе ваших данных',
            category: 'Риски',
            href: '/risk-assessment'
          },
          {
            id: '2',
            title: 'Рекомендации по питанию',
            description: 'Индивидуальный план питания для улучшения здоровья',
            category: 'Рекомендации',
            href: '/recommendations'
          }
        ]);
        setIsSearching(false);
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setResults([]);
      setIsSearching(false);
    }
  }, [query]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-16">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-96 overflow-hidden">
        {/* Search Input */}
        <div className="p-4 border-b border-neutral-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Поиск по платформе..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-12 py-3 text-lg border-0 focus:ring-0 focus:outline-none placeholder-neutral-400"
              autoFocus
            />
            <button 
              onClick={onClose}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-neutral-100 rounded transition-colors"
              aria-label="Закрыть поиск"
            >
              <X className="w-5 h-5 text-neutral-400" />
            </button>
          </div>
        </div>
        
        {/* Search Results */}
        <div className="max-h-80 overflow-y-auto">
          {query.length === 0 ? (
            <div className="p-6">
              <h3 className="text-sm font-medium text-neutral-500 mb-3">Быстрый доступ</h3>
              <div className="grid grid-cols-2 gap-3">
                {searchCategories.map((category) => (
                  <a 
                    key={category.id}
                    href={category.href}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-neutral-100 text-left transition-colors"
                    onClick={onClose}
                  >
                    <div className="text-[#FF6B9D]">
                      {category.icon}
                    </div>
                    <span className="text-sm font-medium text-neutral-900">{category.label}</span>
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <SearchResults 
              query={query} 
              results={results} 
              isSearching={isSearching}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
};
