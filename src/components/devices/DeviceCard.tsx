
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Smartphone, 
  Watch, 
  Heart, 
  Activity, 
  Zap, 
  Droplets,
  CheckCircle, 
  AlertCircle, 
  Clock,
  Wifi,
  WifiOff,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { useDevices, type Device } from '@/hooks/useDevices';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

interface DeviceCardProps {
  device: Device;
}

const deviceIcons = {
  apple_health: Smartphone,
  apple_watch: Watch,
  google_fit: Activity,
  oura_ring: Heart,
  whoop: Zap,
  libra: Droplets
};

const DeviceCard: React.FC<DeviceCardProps> = ({ device }) => {
  const { disconnectDevice, syncDevice } = useDevices();
  const [syncing, setSyncing] = React.useState(false);

  const IconComponent = deviceIcons[device.device_type] || Smartphone;

  const getStatusIcon = () => {
    switch (device.connection_status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = () => {
    switch (device.connection_status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-700">Подключено</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700">Настройка</Badge>;
      case 'error':
        return <Badge variant="destructive">Ошибка</Badge>;
      default:
        return <Badge variant="outline">Не подключено</Badge>;
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      await syncDevice(device.id);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <IconComponent className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h4 className="font-medium text-gray-900">{device.device_name}</h4>
                {getStatusIcon()}
              </div>
              <p className="text-sm text-gray-600 capitalize">
                {device.device_type.replace('_', ' ')}
              </p>
              {device.last_sync_at && (
                <p className="text-xs text-gray-500">
                  Последняя синхронизация: {formatDistanceToNow(new Date(device.last_sync_at), { 
                    addSuffix: true, 
                    locale: ru 
                  })}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-end space-y-2">
            {getStatusBadge()}
            
            <div className="flex items-center space-x-1">
              {device.is_connected ? (
                <Wifi className="w-3 h-3 text-green-500" />
              ) : (
                <WifiOff className="w-3 h-3 text-gray-400" />
              )}
            </div>
          </div>
        </div>

        {device.connection_status === 'connected' && (
          <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSync}
              disabled={syncing}
              className="flex items-center space-x-1"
            >
              <RefreshCw className={`w-3 h-3 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'Синхронизация...' : 'Синхронизировать'}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => disconnectDevice(device.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Отключить
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeviceCard;
