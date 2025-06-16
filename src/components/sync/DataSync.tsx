
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Wifi, 
  WifiOff,
  Database,
  Cloud
} from 'lucide-react';
import { useDevices } from '@/hooks/useDevices';
import { useHealthData } from '@/hooks/useHealthData';

export const DataSync = () => {
  const { devices, syncDevice } = useDevices();
  const { generateDailySummary } = useHealthData();
  const [syncing, setSyncing] = React.useState(false);
  const [lastSyncTime, setLastSyncTime] = React.useState<Date | null>(null);

  const connectedDevices = devices.filter(d => d.is_connected);
  const syncProgress = syncing ? 65 : 100;

  const handleFullSync = async () => {
    setSyncing(true);
    try {
      // Синхронизируем все подключенные устройства
      for (const device of connectedDevices) {
        await syncDevice(device.id);
      }
      
      // Генерируем дневную сводку
      await generateDailySummary();
      
      setLastSyncTime(new Date());
    } finally {
      setSyncing(false);
    }
  };

  const getSyncStatus = () => {
    if (syncing) return 'syncing';
    if (connectedDevices.length === 0) return 'no-devices';
    return 'ready';
  };

  const getStatusIcon = () => {
    switch (getSyncStatus()) {
      case 'syncing':
        return <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />;
      case 'no-devices':
        return <WifiOff className="w-4 h-4 text-gray-400" />;
      default:
        return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  const getStatusBadge = () => {
    switch (getSyncStatus()) {
      case 'syncing':
        return <Badge className="bg-blue-100 text-blue-700">Синхронизация</Badge>;
      case 'no-devices':
        return <Badge variant="outline">Нет устройств</Badge>;
      default:
        return <Badge className="bg-green-100 text-green-700">Готово</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Database className="w-5 h-5 text-primary" />
              <span>Синхронизация данных</span>
            </CardTitle>
            <CardDescription>
              Управление синхронизацией данных с устройств
            </CardDescription>
          </div>
          {getStatusIcon()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Cloud className="w-5 h-5 text-gray-500" />
            <div>
              <p className="font-medium">Статус синхронизации</p>
              <p className="text-sm text-muted-foreground">
                {connectedDevices.length} устройств подключено
              </p>
            </div>
          </div>
          {getStatusBadge()}
        </div>

        {syncing && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Синхронизация данных</span>
              <span>{syncProgress}%</span>
            </div>
            <Progress value={syncProgress} className="h-2" />
          </div>
        )}

        {lastSyncTime && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>
              Последняя синхронизация: {lastSyncTime.toLocaleString('ru-RU')}
            </span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleFullSync}
            disabled={syncing || connectedDevices.length === 0}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Синхронизация...' : 'Синхронизировать все'}</span>
          </Button>
          
          <Button variant="outline" size="sm">
            Настройки синхронизации
          </Button>
        </div>

        {connectedDevices.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Подключенные устройства:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {connectedDevices.map((device) => (
                <div key={device.id} className="flex items-center space-x-2 p-2 bg-muted/50 rounded-lg">
                  <Wifi className="w-3 h-3 text-green-500" />
                  <span className="text-sm">{device.device_name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
