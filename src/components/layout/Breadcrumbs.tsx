
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  
  const getBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
    const routeMap: Record<string, string> = {
      '/dashboard': 'Обзор здоровья',
      '/risk-assessment': 'Оценка рисков',
      '/recommendations': 'Рекомендации',
      '/health-vault': 'Мои данные',
      '/ai-health': 'ИИ-помощник',
      '/medical-calendar': 'Календарь здоровья',
      '/medical-integrations': 'Интеграции',
      '/environmental-health': 'Экологическое здоровье',
      '/womens-health': 'Женское здоровье',
      '/menstrual-cycle-tracker': 'Отслеживание цикла',
      '/pregnancy-planning': 'Планирование беременности',
      '/family-data-bank': 'Семейный банк данных',
      '/genetic-risks': 'Генетические риски',
      '/medications': 'Лекарства',
      '/experts': 'Врачи-эксперты',
      '/partners': 'Партнеры',
      '/community': 'Сообщество',
      '/gamification': 'Достижения'
    };

    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Главная', href: '/dashboard' }
    ];

    if (pathname !== '/dashboard' && pathname !== '/') {
      const currentPageLabel = routeMap[pathname] || pathname.split('/').pop();
      if (currentPageLabel) {
        breadcrumbs.push({ label: currentPageLabel });
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs(location.pathname);

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm">
      {breadcrumbs.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          )}
          {item.href ? (
            <Link 
              to={item.href}
              className="text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-neutral-900 font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
