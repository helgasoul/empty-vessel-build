
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Eye,
  Calendar,
  Clock
} from 'lucide-react';
import { useHealthData } from '@/hooks/useHealthData';

interface ActivityItem {
  id: string;
  type: 'health_data' | 'sync' | 'risk_assessment' | 'profile_update';
  title: string;
  description: string;
  timestamp: Date;
  status: 'success' | 'warning' | 'error' | 'info';
  trend?: 'up' | 'down' | 'stable';
}

export const ActivityMonitor = () => {
  const { getHealthMetrics, dailySummary } = useHealthData();
  const metrics = getHealthMetrics();

  // Mock activity data - в реальном проекте это будет из API
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'health_data',
      title: 'Данные о здоровье обновлены',
      description: `Зафиксировано ${metrics.steps || 0} шагов`,
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      status: 'success',
      trend: metrics.steps > 5000 ? 'up' : 'down'
    },
    {
      id: '2',
      type: 'sync',
      title: 'Синхронизация завершена',
      description: 'Данные с устройств успешно синхронизированы',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      status: 'success'
    },
    {
      id: '3',
      type: 'risk_assessment',
      title: 'Оценка рисков',
      description: 'Проведена оценка сердечно-сосудистых рисков',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'info'
    },
    {
      id: '4',
      type: 'profile_update',
      title: 'Профиль обновлен',
      description: 'Обновлены настройки уведомлений',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      status: 'info'
    }
  ];

  const getStatusColor = (status: ActivityItem['status']) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-700';
      case 'warning': return 'bg-yellow-100 text-yellow-700';
      case 'error': return 'bg-red-100 text-red-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  const getTrendIcon = (trend?: ActivityItem['trend']) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3 text-green-500" />;
      case 'down': return <TrendingDown className="w-3 h-3 text-red-500" />;
      case 'stable': return <Minus className="w-3 h-3 text-gray-500" />;
      default: return null;
    }
  };

  const getTypeIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'health_data': return <Activity className="w-4 h-4" />;
      case 'sync': return <Clock className="w-4 h-4" />;
      case 'risk_assessment': return <TrendingUp className="w-4 h-4" />;
      case 'profile_update': return <Eye className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (minutes < 1) return 'только что';
    if (minutes < 60) return `${minutes} мин назад`;
    if (hours < 24) return `${hours} ч назад`;
    return date.toLocaleDateString('ru-RU');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-primary" />
              <span>Мониторинг активности</span>
            </CardTitle>
            <CardDescription>
              Отслеживание активности и изменений в системе
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            История
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
              <div className="flex-shrink-0 p-2 bg-white rounded-lg shadow-sm">
                {getTypeIcon(activity.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {activity.title}
                  </h4>
                  {activity.trend && getTrendIcon(activity.trend)}
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {activity.description}
                </p>
                <div className="flex items-center space-x-2">
                  <Badge className={`text-xs ${getStatusColor(activity.status)}`}>
                    {activity.status === 'success' && 'Успешно'}
                    {activity.status === 'warning' && 'Внимание'}
                    {activity.status === 'error' && 'Ошибка'}
                    {activity.status === 'info' && 'Информация'}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatTimeAgo(activity.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <Button variant="outline" className="w-full">
            Показать все активности
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
