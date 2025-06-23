
import React from 'react';
import { FileText, ExternalLink } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  href: string;
}

interface SearchResultsProps {
  query: string;
  results: SearchResult[];
  isSearching: boolean;
  onClose: () => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ 
  query, 
  results, 
  isSearching,
  onClose 
}) => {
  if (isSearching) {
    return (
      <div className="p-6 text-center">
        <div className="w-6 h-6 border-2 border-[#FF6B9D] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm text-neutral-500">Поиск...</p>
      </div>
    );
  }
  
  if (results.length === 0) {
    return (
      <div className="p-6 text-center">
        <FileText className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
        <p className="text-sm text-neutral-500">
          Ничего не найдено по запросу "{query}"
        </p>
        <p className="text-xs text-neutral-400 mt-1">
          Попробуйте изменить поисковый запрос
        </p>
      </div>
    );
  }
  
  return (
    <div className="p-4">
      <div className="text-xs text-neutral-500 mb-3 px-2">
        Найдено {results.length} результатов
      </div>
      
      <div className="space-y-2">
        {results.map((result) => (
          <a
            key={result.id}
            href={result.href}
            onClick={onClose}
            className="block p-3 rounded-lg hover:bg-neutral-100 transition-colors group"
          >
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-medium text-neutral-900 mb-1 group-hover:text-[#FF6B9D] transition-colors">
                  {result.title}
                </h4>
                <p className="text-sm text-neutral-600 mb-2 line-clamp-2">
                  {result.description}
                </p>
                <div className="flex items-center space-x-2">
                  <span className="inline-block px-2 py-1 text-xs bg-neutral-100 text-neutral-600 rounded">
                    {result.category}
                  </span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-neutral-400 ml-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
