
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Watch, Heart, Activity, Zap, Droplets, CheckCircle } from 'lucide-react';
import { useAdvancedDevices, type AdvancedDevice } from '@/hooks/useAdvancedDevices';

interface DeviceConnectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const deviceOptions = [
  { 
    value: 'apple_health', 
    label: 'Apple Health', 
    icon: Smartphone,
    description: 'Синхронизация с приложением Здоровье на iPhone',
    dataTypes: ['steps', 'heart_rate', 'sleep', 'activity', 'calories'],
    complexity: 'Простая'
  },
  { 
    value: 'apple_watch', 
    label: 'Apple Watch', 
    icon: Watch,
    description: 'Умные часы Apple с расширенным мониторингом здоровья',
    dataTypes: ['steps', 'heart_rate', 'activity', 'calories', 'workouts'],
    complexity: 'Простая'
  },
  { 
    value: 'google_fit', 
    label: 'Google Fit', 
    icon: Activity,
    description: 'Платформа Google для отслеживания активности',
    dataTypes: ['steps', 'activity', 'calories', 'heart_rate'],
    complexity: 'Простая'
  },
  { 
    value: 'oura_ring', 
    label: 'Oura Ring', 
    icon: Heart,
    description: 'Умное кольцо для глубокого анализа сна и восстановления',
    dataTypes: ['sleep', 'heart_rate', 'activity', 'readiness', 'temperature'],
    complexity: 'Продвинутая'
  },
  { 
    value: 'whoop', 
    label: 'Whoop', 
    icon: Zap,
    description: 'Носимое устройство для анализа нагрузки и восстановления',
    dataTypes: ['heart_rate', 'sleep', 'recovery', 'strain', 'calories'],
    complexity: 'Продвинутая'
  },
  { 
    value: 'libra', 
    label: 'Libra (CGM)', 
    icon: Droplets,
    description: 'Непрерывный мониторинг глюкозы для диабетиков',
    dataTypes: ['glucose', 'ketones', 'trends'],
    complexity: 'Медицинская'
  }
];

const DeviceConnectionModal: React.FC<DeviceConnectionModalProps> = ({ open, onOpenChange }) => {
  const [step, setStep] = useState<'select' | 'configure' | 'connecting'>('select');
  const [deviceType, setDeviceType] = useState<AdvancedDevice['device_type'] | ''>('');
  const [deviceName, setDeviceName] = useState('');
  const [syncSettings, setSyncSettings] = useState({
    syncSteps: true,
    syncHeartRate: true,
    syncSleep: true,
    syncActivity: true,
    syncGlucose: false,
    syncCalories: true,
  });
  
  const { connectAdvancedDevice } = useAdvancedDevices();

  const selectedDevice = deviceOptions.find(d => d.value === deviceType);

  const handleDeviceSelect = (type: AdvancedDevice['device_type']) => {
    setDeviceType(type);
    const device = deviceOptions.find(d => d.value === type);
    if (device) {
      setDeviceName(`Мой ${device.label}`);
      setSyncSettings(prev => ({
        ...prev,
        syncGlucose: type === 'libra'
      }));
    }
    setStep('configure');
  };

  const handleConnect = async () => {
    if (!deviceType || !deviceName.trim()) return;

    setStep('connecting');
    try {
      await connectAdvancedDevice(deviceType, deviceName.trim(), syncSettings);
      onOpenChange(false);
      resetModal();
    } catch (error) {
      setStep('configure');
    }
  };

  const resetModal = () => {
    setStep('select');
    setDeviceType('');
    setDeviceName('');
    setSyncSettings({
      syncSteps: true,
      syncHeartRate: true,
      syncSleep: true,
      syncActivity: true,
      syncGlucose: false,
      syncCalories: true,
    });
  };

  const handleClose = () => {
    onOpenChange(false);
    resetModal();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Smartphone className="w-5 h-5 text-primary" />
            <span>
              {step === 'select' && 'Выберите устройство'}
              {step === 'configure' && 'Настройка подключения'}
              {step === 'connecting' && 'Подключение устройства'}
            </span>
          </DialogTitle>
          <DialogDescription>
            {step === 'select' && 'Выберите тип устройства для подключения к вашему профилю здоровья'}
            {step === 'configure' && 'Настройте параметры синхронизации данных'}
            {step === 'connecting' && 'Подключаем ваше устройство...'}
          </DialogDescription>
        </DialogHeader>

        {step === 'select' && (
          <div className="space-y-4">
            <div className="grid gap-3">
              {deviceOptions.map((device) => (
                <div
                  key={device.value}
                  className="p-4 border rounded-lg hover:border-primary cursor-pointer transition-colors"
                  onClick={() => handleDeviceSelect(device.value as AdvancedDevice['device_type'])}
                >
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <device.icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium">{device.label}</h4>
                        <Badge variant={
                          device.complexity === 'Простая' ? 'default' : 
                          device.complexity === 'Продвинутая' ? 'secondary' : 
                          'outline'
                        }>
                          {device.complexity}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{device.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {device.dataTypes.map((type) => (
                          <Badge key={type} variant="outline" className="text-xs">
                            {type.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 'configure' && selectedDevice && (
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <selectedDevice.icon className="w-6 h-6 text-primary" />
                <div>
                  <h3 className="font-medium">{selectedDevice.label}</h3>
                  <p className="text-sm text-gray-600">{selectedDevice.description}</p>
                </div>
              </div>
            </div>

            <Tabs defaultValue="basic" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Основные настройки</TabsTrigger>
                <TabsTrigger value="sync">Синхронизация данных</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="device-name">Название устройства</Label>
                  <Input
                    id="device-name"
                    placeholder={`Мой ${selectedDevice.label}`}
                    value={deviceName}
                    onChange={(e) => setDeviceName(e.target.value)}
                  />
                </div>
              </TabsContent>

              <TabsContent value="sync" className="space-y-4">
                <div className="space-y-4">
                  <h4 className="font-medium">Типы данных для синхронизации</h4>
                  
                  {selectedDevice.dataTypes.includes('steps') && (
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-sm font-medium">Шаги</label>
                        <p className="text-xs text-gray-600">Количество шагов и дистанция</p>
                      </div>
                      <Switch
                        checked={syncSettings.syncSteps}
                        onCheckedChange={(checked) => setSyncSettings(prev => ({ ...prev, syncSteps: checked }))}
                      />
                    </div>
                  )}

                  {selectedDevice.dataTypes.includes('heart_rate') && (
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-sm font-medium">Пульс</label>
                        <p className="text-xs text-gray-600">Частота сердечных сокращений</p>
                      </div>
                      <Switch
                        checked={syncSettings.syncHeartRate}
                        onCheckedChange={(checked) => setSyncSettings(prev => ({ ...prev, syncHeartRate: checked }))}
                      />
                    </div>
                  )}

                  {selectedDevice.dataTypes.includes('sleep') && (
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-sm font-medium">Сон</label>
                        <p className="text-xs text-gray-600">Продолжительность и качество сна</p>
                      </div>
                      <Switch
                        checked={syncSettings.syncSleep}
                        onCheckedChange={(checked) => setSyncSettings(prev => ({ ...prev, syncSleep: checked }))}
                      />
                    </div>
                  )}

                  {selectedDevice.dataTypes.includes('activity') && (
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-sm font-medium">Активность</label>
                        <p className="text-xs text-gray-600">Тренировки и активные минуты</p>
                      </div>
                      <Switch
                        checked={syncSettings.syncActivity}
                        onCheckedChange={(checked) => setSyncSettings(prev => ({ ...prev, syncActivity: checked }))}
                      />
                    </div>
                  )}

                  {selectedDevice.dataTypes.includes('calories') && (
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-sm font-medium">Калории</label>
                        <p className="text-xs text-gray-600">Сожженные калории</p>
                      </div>
                      <Switch
                        checked={syncSettings.syncCalories}
                        onCheckedChange={(checked) => setSyncSettings(prev => ({ ...prev, syncCalories: checked }))}
                      />
                    </div>
                  )}

                  {selectedDevice.dataTypes.includes('glucose') && (
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-sm font-medium">Глюкоза</label>
                        <p className="text-xs text-gray-600">Уровень глюкозы в крови</p>
                      </div>
                      <Switch
                        checked={syncSettings.syncGlucose}
                        onCheckedChange={(checked) => setSyncSettings(prev => ({ ...prev, syncGlucose: checked }))}
                      />
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => setStep('select')}
              >
                Назад
              </Button>
              <Button
                onClick={handleConnect}
                disabled={!deviceName.trim()}
                className="bg-primary hover:bg-primary/90"
              >
                Подключить устройство
              </Button>
            </div>
          </div>
        )}

        {step === 'connecting' && (
          <div className="text-center py-8">
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
            <h3 className="text-lg font-medium mb-2">Подключаем {selectedDevice?.label}</h3>
            <p className="text-gray-600 mb-4">
              Устанавливаем соединение и настраиваем синхронизацию данных...
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Проверка совместимости</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-pulse w-4 h-4 bg-blue-500 rounded-full"></div>
                <span>Настройка синхронизации</span>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DeviceConnectionModal;
