
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Smartphone, Watch, Heart, Activity, Zap, Droplets } from 'lucide-react';
import { useDevices } from '@/hooks/useDevices';
import type { Device } from '@/hooks/useDevices';

interface DeviceConnectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const deviceOptions = [
  { value: 'apple_health', label: 'Apple Health', icon: Smartphone },
  { value: 'apple_watch', label: 'Apple Watch', icon: Watch },
  { value: 'google_fit', label: 'Google Fit', icon: Activity },
  { value: 'oura_ring', label: 'Oura Ring', icon: Heart },
  { value: 'whoop', label: 'Whoop', icon: Zap },
  { value: 'libra', label: 'Libra (Glucose)', icon: Droplets }
];

const DeviceConnectionModal: React.FC<DeviceConnectionModalProps> = ({ open, onOpenChange }) => {
  const [deviceType, setDeviceType] = useState<Device['device_type'] | ''>('');
  const [deviceName, setDeviceName] = useState('');
  const [connecting, setConnecting] = useState(false);
  
  const { connectDevice } = useDevices();

  const handleConnect = async () => {
    if (!deviceType || !deviceName.trim()) return;

    setConnecting(true);
    try {
      await connectDevice(deviceType, deviceName.trim());
      onOpenChange(false);
      setDeviceType('');
      setDeviceName('');
    } catch (error) {
      // Ошибка уже обработана в хуке
    } finally {
      setConnecting(false);
    }
  };

  const selectedDevice = deviceOptions.find(d => d.value === deviceType);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Smartphone className="w-5 h-5 text-primary" />
            <span>Подключить устройство</span>
          </DialogTitle>
          <DialogDescription>
            Выберите тип устройства и введите его название для подключения к вашему профилю.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="device-type">Тип устройства</Label>
            <Select value={deviceType} onValueChange={(value) => setDeviceType(value as Device['device_type'])}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите устройство" />
              </SelectTrigger>
              <SelectContent>
                {deviceOptions.map((device) => (
                  <SelectItem key={device.value} value={device.value}>
                    <div className="flex items-center space-x-2">
                      <device.icon className="w-4 h-4" />
                      <span>{device.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="device-name">Название устройства</Label>
            <Input
              id="device-name"
              placeholder={selectedDevice ? `Мой ${selectedDevice.label}` : "Введите название"}
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={connecting}
            >
              Отмена
            </Button>
            <Button
              onClick={handleConnect}
              disabled={!deviceType || !deviceName.trim() || connecting}
              className="bg-primary hover:bg-primary/90"
            >
              {connecting ? 'Подключение...' : 'Подключить'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeviceConnectionModal;
