
import React, { useState } from 'react';
import { Plus, MessageCircle, Calendar, FileText, X } from 'lucide-react';

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  href: string;
  color: string;
}

export const FloatingActionButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const quickActions: QuickAction[] = [
    {
      icon: <MessageCircle className="w-5 h-5" />,
      label: 'Чат с ИИ',
      href: '/ai-health',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: 'Записаться на прием',
      href: '/medical-calendar',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      icon: <FileText className="w-5 h-5" />,
      label: 'Добавить документ',
      href: '/health-vault',
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ];
  
  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Quick Action Items */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 space-y-3">
          {quickActions.map((action, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <span className="bg-white text-neutral-700 px-3 py-1 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap">
                {action.label}
              </span>
              <a
                href={action.href}
                className={`w-12 h-12 ${action.color} text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110`}
                onClick={() => setIsOpen(false)}
              >
                {action.icon}
              </a>
            </div>
          ))}
        </div>
      )}
      
      {/* Main FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 bg-gradient-to-r from-[#FF6B9D] to-[#9B59B6] text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 ${
          isOpen ? 'rotate-45' : ''
        }`}
        aria-label={isOpen ? 'Закрыть быстрые действия' : 'Открыть быстрые действия'}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
      </button>
    </div>
  );
};
