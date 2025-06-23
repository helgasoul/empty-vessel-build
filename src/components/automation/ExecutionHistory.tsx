
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WorkflowExecution } from '@/hooks/useAutomationWorkflows';
import { Clock, CheckCircle, XCircle, AlertCircle, Play } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface ExecutionHistoryProps {
  executions?: WorkflowExecution[];
  isLoading: boolean;
}

const ExecutionHistory: React.FC<ExecutionHistoryProps> = ({ 
  executions, 
  isLoading 
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'running': return <Play className="w-4 h-4 text-blue-600" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4 text-orange-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: { variant: 'default' as const, label: 'Завершено', className: 'bg-green-100 text-green-800' },
      failed: { variant: 'destructive' as const, label: 'Ошибка', className: 'bg-red-100 text-red-800' },
      running: { variant: 'default' as const, label: 'Выполняется', className: 'bg-blue-100 text-blue-800' },
      cancelled: { variant: 'default' as const, label: 'Отменено', className: 'bg-orange-100 text-orange-800' },
      pending: { variant: 'secondary' as const, label: 'Ожидание', className: 'bg-gray-100 text-gray-600' }
    };

    const config = variants[status as keyof typeof variants] || variants.pending;
    
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A';
    if (seconds < 60) return `${seconds}с`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}м ${seconds % 60}с`;
    return `${Math.floor(seconds / 3600)}ч ${Math.floor((seconds % 3600) / 60)}м`;
  };

  if (isLoading) {
    return <div className="text-center py-8">Загрузка истории выполнений...</div>;
  }

  if (!executions || executions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Clock className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Нет выполнений
          </h3>
          <p className="text-gray-500 text-center">
            История выполнений workflow будет отображаться здесь
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {executions.map((execution) => (
        <Card key={execution.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(execution.execution_status)}
                </div>
                <div>
                  <CardTitle className="text-base">
                    Выполнение от {format(new Date(execution.started_at), 'dd.MM.yyyy HH:mm', { locale: ru })}
                  </CardTitle>
                  <CardDescription>
                    ID: {execution.id.substring(0, 8)}...
                  </CardDescription>
                </div>
              </div>
              {getStatusBadge(execution.execution_status)}
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Статус</p>
                <p className="font-medium">{execution.execution_status}</p>
              </div>
              <div>
                <p className="text-gray-600">Действий</p>
                <p className="font-medium">
                  {execution.successful_actions}/{execution.total_actions}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Длительность</p>
                <p className="font-medium">
                  {formatDuration(execution.execution_duration_seconds)}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Завершено</p>
                <p className="font-medium">
                  {execution.completed_at 
                    ? format(new Date(execution.completed_at), 'HH:mm', { locale: ru })
                    : 'N/A'
                  }
                </p>
              </div>
            </div>

            {/* Error Details */}
            {execution.error_details && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="text-sm font-medium text-red-800 mb-1">Детали ошибки:</h4>
                <p className="text-sm text-red-700">
                  {JSON.stringify(execution.error_details, null, 2)}
                </p>
              </div>
            )}

            {/* Execution Log Preview */}
            {execution.execution_log && execution.execution_log.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Лог выполнения:</h4>
                <div className="bg-gray-50 border rounded-lg p-3 max-h-32 overflow-y-auto">
                  <pre className="text-xs text-gray-600">
                    {execution.execution_log.slice(-3).map((log, index) => (
                      <div key={index}>{JSON.stringify(log)}</div>
                    ))}
                  </pre>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ExecutionHistory;
