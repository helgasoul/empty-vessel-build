
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

// Simplified badge component
const Badge = ({ children, variant = 'default' }: { 
  children: React.ReactNode; 
  variant?: 'default' | 'success' | 'warning' | 'destructive';
}) => {
  const variants = {
    default: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    destructive: 'bg-red-100 text-red-800'
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};

interface MetricData {
  name: string;
  value: string | number;
  unit?: string;
  status: 'excellent' | 'good' | 'attention' | 'concern';
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
}

interface MetricsGridProps {
  metrics?: MetricData[];
}

const MetricsGridWidget: React.FC<MetricsGridProps> = ({ 
  metrics = [
    {
      name: 'ИМТ',
      value: 22.5,
      unit: 'кг/м²',
      status: 'good',
      trend: 'stable',
      lastUpdated: '2 дня назад'
    },
    {
      name: 'Артериальное давление',
      value: '120/80',
      unit: 'мм рт.ст.',
      status: 'excellent',
      trend: 'stable',
      lastUpdated: '1 день назад'
    },
    {
      name: 'Пульс покоя',
      value: 68,
      unit: 'уд/мин',
      status: 'good',
      trend: 'up',
      lastUpdated: 'Сегодня'
    },
    {
      name: 'Уровень стресса',
      value: 6,
      unit: '/10',
      status: 'attention',
      trend: 'down',
      lastUpdated: 'Сегодня'
    }
  ]
}) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      case 'stable': return <div className="h-4 w-4 rounded-full bg-gray-400" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'excellent': return <Badge variant="success">Отлично</Badge>;
      case 'good': return <Badge variant="default">Норма</Badge>;
      case 'attention': return <Badge variant="warning">Внимание</Badge>;
      case 'concern': return <Badge variant="destructive">Требует контроля</Badge>;
      default: return <Badge variant="default">Неизвестно</Badge>;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <Card key={index} className="hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-700">{metric.name}</h3>
              {getTrendIcon(metric.trend)}
            </div>
            <div className="mb-2">
              <span className="text-2xl font-bold text-gray-800">
                {metric.value}
              </span>
              {metric.unit && (
                <span className="text-sm text-gray-500 ml-1">{metric.unit}</span>
              )}
            </div>
            <div className="flex items-center justify-between">
              {getStatusBadge(metric.status)}
              <span className="text-xs text-gray-500">{metric.lastUpdated}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MetricsGridWidget;
