
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Smartphone, Sync, Trash2, Plus, CheckCircle, AlertCircle, Clock, XCircle } from 'lucide-react';
import { useHealthAppIntegrations } from '@/hooks/useHealthAppIntegrations';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const HealthAppIntegrations = () => {
  const { 
    integrations, 
    externalData, 
    loading, 
    createIntegration, 
    deleteIntegration, 
    syncData 
  } = useHealthAppIntegrations();
  
  const [syncing, setSyncing] = useState<string | null>(null);

  const appInfo = {
    flo: {
      name: 'Flo',
      description: 'Популярное приложение для отслеживания менструального цикла',
      color: 'bg-pink-500'
    },
    maam: {
      name: 'MAAM',
      description: 'Российское приложение для женского здоровья',
      color: 'bg-purple-500'
    },
    clue: {
      name: 'Clue',
      description: 'Научно обоснованный трекер менструального цикла',
      color: 'bg-red-500'
    },
    period_tracker: {
      name: 'Period Tracker',
      description: 'Простой и удобный трекер месячных',
      color: 'bg-blue-500'
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'disconnected':
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected':
        return 'Подключено';
      case 'pending':
        return 'Ожидание';
      case 'error':
        return 'Ошибка';
      case 'disconnected':
        return 'Отключено';
      default:
        return 'Неизвестно';
    }
  };

  const handleSync = async (integrationId: string) => {
    setSyncing(integrationId);
    try {
      await syncData(integrationId);
    } finally {
      setSyncing(null);
    }
  };

  const getConnectedApps = () => {
    return integrations.map(integration => integration.app_name);
  };

  const getAvailableApps = () => {
    const connectedApps = getConnectedApps();
    return Object.keys(appInfo).filter(app => !connectedApps.includes(app as any));
  };

  if (loading) {
    return <div className="flex justify-center p-8">Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-#F0A1C0">Интеграции с приложениями</h2>
      </div>

      {/* Доступные приложения для подключения */}
      {getAvailableApps().length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Доступные приложения
            </CardTitle>
            <CardDescription>
              Подключите свои любимые приложения для автоматической синхронизации данных
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getAvailableApps().map(appName => {
                const app = appInfo[appName as keyof typeof appInfo];
                return (
                  <div key={appName} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${app.color} rounded-lg flex items-center justify-center`}>
                        <Smartphone className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium">{app.name}</h4>
                        <p className="text-sm text-gray-600">{app.description}</p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => createIntegration(appName as any)}
                      className="bg-#F0A1C0 hover:bg-#F0A1C0/90"
                    >
                      Подключить
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Подключенные приложения */}
      {integrations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Подключенные приложения
            </CardTitle>
            <CardDescription>
              Управляйте интеграциями и синхронизируйте данные
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {integrations.map(integration => {
                const app = appInfo[integration.app_name];
                return (
                  <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${app.color} rounded-lg flex items-center justify-center`}>
                        <Smartphone className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{app.name}</h4>
                          <Badge variant="outline" className="flex items-center gap-1">
                            {getStatusIcon(integration.integration_status)}
                            {getStatusText(integration.integration_status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {integration.last_sync_at ? 
                            `Последняя синхронизация: ${format(new Date(integration.last_sync_at), 'dd.MM.yyyy HH:mm', { locale: ru })}` :
                            'Синхронизация не проводилась'
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSync(integration.id)}
                        disabled={syncing === integration.id}
                        className="flex items-center gap-1"
                      >
                        <Sync className={`w-4 h-4 ${syncing === integration.id ? 'animate-spin' : ''}`} />
                        {syncing === integration.id ? 'Синхронизация...' : 'Синхронизировать'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteIntegration(integration.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Синхронизированные данные */}
      {externalData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Синхронизированные данные</CardTitle>
            <CardDescription>
              Данные, полученные из подключенных приложений
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {externalData.slice(0, 10).map(data => (
                <div key={data.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <Badge variant="secondary">{data.data_type}</Badge>
                      <p className="text-sm text-gray-600 mt-1">
                        {format(new Date(data.recorded_date), 'dd MMMM yyyy', { locale: ru })}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">
                      {format(new Date(data.synced_at), 'dd.MM.yyyy HH:mm', { locale: ru })}
                    </p>
                  </div>
                  <div className="text-sm">
                    {data.data_type === 'menstrual_cycle' && (
                      <div className="space-y-1">
                        {data.data_payload.period_length && (
                          <p>Продолжительность: {data.data_payload.period_length} дней</p>
                        )}
                        {data.data_payload.flow_intensity && (
                          <p>Интенсивность: {data.data_payload.flow_intensity}</p>
                        )}
                        {data.data_payload.symptoms && data.data_payload.symptoms.length > 0 && (
                          <p>Симптомы: {data.data_payload.symptoms.join(', ')}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Пустое состояние */}
      {integrations.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Smartphone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Нет подключенных приложений</h3>
            <p className="text-gray-600 mb-4">
              Подключите свои приложения для автоматической синхронизации данных о здоровье
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HealthAppIntegrations;
