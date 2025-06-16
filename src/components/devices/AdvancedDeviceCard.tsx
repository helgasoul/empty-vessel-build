
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Battery,
  Wifi,
  WifiOff,
  RefreshCw,
  Settings,
  TrendingUp,
  Moon,
  Footprints,
  Flame
} from 'lucide-react';
import { useAdvancedDevices, type AdvancedDevice } from '@/hooks/useAdvancedDevices';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

interface AdvancedDeviceCardProps {
  device: AdvancedDevice;
}

const deviceIcons = {
  apple_health: Smartphone,
  apple_watch: Watch,
  google_fit: Activity,
  oura_ring: Heart,
  whoop: Zap,
  libra: Droplets
};

const deviceColors = {
  apple_health: 'bg-gray-100 text-gray-600',
  apple_watch: 'bg-blue-100 text-blue-600',
  google_fit: 'bg-green-100 text-green-600',
  oura_ring: 'bg-purple-100 text-purple-600',
  whoop: 'bg-yellow-100 text-yellow-600',
  libra: 'bg-pink-100 text-pink-600'
};

const AdvancedDeviceCard: React.FC<AdvancedDeviceCardProps> = ({ device }) => {
  const { syncDevice, updateSyncSettings, getDeviceMetrics, disconnectDevice, syncingDevices } = useAdvancedDevices();
  const [showSettings, setShowSettings] = useState(false);
  
  const IconComponent = deviceIcons[device.device_type] || Smartphone;
  const colorClasses = deviceColors[device.device_type] || 'bg-gray-100 text-gray-600';
  const metrics = getDeviceMetrics(device.id);
  const isSyncing = syncingDevices.has(device.id) || device.connection_status === 'syncing';

  const getStatusIcon = () => {
    if (isSyncing) return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
    
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
    if (isSyncing) return <Badge className="bg-blue-100 text-blue-700">Синхронизация</Badge>;
    
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

  const getBatteryColor = () => {
    if (!device.battery_level) return 'bg-gray-200';
    if (device.battery_level > 50) return 'bg-green-500';
    if (device.battery_level > 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleSyncSettingChange = async (setting: keyof AdvancedDevice['sync_settings'], value: boolean) => {
    await updateSyncSettings(device.id, { [setting]: value });
  };

  const getDataTypeIcon = (dataType: string) => {
    const icons = {
      steps: Footprints,
      heart_rate: Heart,
      sleep: Moon,
      activity: Activity,
      calories: Flame,
      glucose: Droplets,
      readiness: TrendingUp,
      strain: Zap,
      recovery: Heart
    };
    return icons[dataType] || Activity;
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${colorClasses}`}>
              <IconComponent className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <CardTitle className="text-lg">{device.device_name}</CardTitle>
                {getStatusIcon()}
              </div>
              <p className="text-sm text-gray-600 capitalize">
                {device.device_type.replace('_', ' ')}
              </p>
              {device.last_sync_at && (
                <p className="text-xs text-gray-500">
                  Синхронизация: {formatDistanceToNow(new Date(device.last_sync_at), { 
                    addSuffix: true, 
                    locale: ru 
                  })}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-end space-y-2">
            {getStatusBadge()}
            
            <div className="flex items-center space-x-2">
              {device.is_connected ? (
                <Wifi className="w-3 h-3 text-green-500" />
              ) : (
                <WifiOff className="w-3 h-3 text-gray-400" />
              )}
              
              {device.battery_level && (
                <div className="flex items-center space-x-1">
                  <Battery className="w-3 h-3 text-gray-500" />
                  <div className="w-6 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getBatteryColor()} transition-all duration-300`}
                      style={{ width: `${device.battery_level}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{device.battery_level}%</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Tabs value={showSettings ? "settings" : "overview"} onValueChange={(value) => setShowSettings(value === "settings")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Обзор</TabsTrigger>
            <TabsTrigger value="settings">Настройки</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Метрики устройства */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-gray-600">Всего синхронизаций</p>
                <p className="font-semibold">{metrics.totalSyncs}</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-600">Точек данных сегодня</p>
                <p className="font-semibold">{metrics.dataPointsToday}</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-600">Среднее время синхронизации</p>
                <p className="font-semibold">{metrics.avgSyncTime.toFixed(1)}с</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-600">Последняя синхронизация</p>
                <p className={`font-semibold ${metrics.lastSyncSuccess ? 'text-green-600' : 'text-red-600'}`}>
                  {metrics.lastSyncSuccess ? 'Успешно' : 'Ошибка'}
                </p>
              </div>
            </div>

            {/* Типы данных */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Типы данных</p>
              <div className="flex flex-wrap gap-2">
                {device.data_types.map((dataType) => {
                  const Icon = getDataTypeIcon(dataType);
                  return (
                    <Badge key={dataType} variant="secondary" className="flex items-center space-x-1">
                      <Icon className="w-3 h-3" />
                      <span className="capitalize">{dataType.replace('_', ' ')}</span>
                    </Badge>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            {/* Настройки синхронизации */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700">Синхронизация данных</p>
              
              <div className="space-y-2">
                {Object.entries(device.sync_settings).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm capitalize">
                      {key.replace('sync', '').replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </span>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) => handleSyncSettingChange(key as keyof AdvancedDevice['sync_settings'], checked)}
                      disabled={!device.is_connected}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Частота синхронизации */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Частота синхронизации</p>
              <Badge variant="outline">{device.sync_frequency}</Badge>
            </div>

            {/* Версия прошивки */}
            {device.firmware_version && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Версия прошивки</p>
                <p className="text-sm text-gray-600">{device.firmware_version}</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Действия */}
        {device.connection_status === 'connected' && (
          <div className="flex justify-between items-center pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => syncDevice(device.id)}
              disabled={isSyncing}
              className="flex items-center space-x-1"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Синхронизация...' : 'Синхронизировать'}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => disconnectDevice(device.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Отключить
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdvancedDeviceCard;
