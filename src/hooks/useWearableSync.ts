
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface WearableDevice {
  id: string;
  deviceType: 'apple_health' | 'google_fit' | 'fitbit' | 'oura_ring' | 'whoop';
  deviceName: string;
  isConnected: boolean;
  lastSyncAt: string | null;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  dataTypes: string[];
}

interface SyncProgress {
  current: number;
  total: number;
  currentDataType: string;
}

interface HealthData {
  steps?: number;
  heartRate?: number;
  sleepHours?: number;
  calories?: number;
  distance?: number;
  weight?: number;
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  [key: string]: any;
}

interface UseWearableSyncReturn {
  connectedDevices: WearableDevice[];
  connectDevice: (deviceType: string, deviceName: string) => Promise<boolean>;
  disconnectDevice: (deviceId: string) => Promise<boolean>;
  syncDevice: (deviceType: string, data: HealthData) => Promise<boolean>;
  syncAllDevices: () => Promise<void>;
  
  isSyncing: boolean;
  syncProgress: SyncProgress | null;
  lastSyncTime: string | null;
  error: string | null;
  
  utils: {
    getSupportedDevices: () => Array<{ type: string; name: string; icon: string }>;
    getDeviceIcon: (deviceType: string) => string;
    formatLastSync: (timestamp: string) => string;
  };
}

const SUPPORTED_DEVICES = [
  { type: 'apple_health', name: 'Apple Health', icon: '📱' },
  { type: 'google_fit', name: 'Google Fit', icon: '🏃' },
  { type: 'fitbit', name: 'Fitbit', icon: '📊' },
  { type: 'oura_ring', name: 'Oura Ring', icon: '💍' },
  { type: 'whoop', name: 'WHOOP', icon: '⌚' },
];

export const useWearableSync = (userId: string): UseWearableSyncReturn => {
  const [connectedDevices, setConnectedDevices] = useState<WearableDevice[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState<SyncProgress | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load connected devices on mount
  useEffect(() => {
    if (userId) {
      loadConnectedDevices();
    }
  }, [userId]);

  const loadConnectedDevices = useCallback(async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('external_api_integrations')
        .select('*')
        .eq('user_id', userId)
        .eq('integration_type', 'wearable');

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      const devices: WearableDevice[] = data?.map(integration => ({
        id: integration.id,
        deviceType: integration.provider_name as any,
        deviceName: integration.provider_name,
        isConnected: integration.integration_status === 'active',
        lastSyncAt: integration.last_sync_at,
        syncStatus: 'idle',
        dataTypes: integration.sync_settings?.dataTypes || [],
      })) || [];

      setConnectedDevices(devices);
    } catch (err) {
      console.error('Error loading devices:', err);
    }
  }, [userId]);

  const connectDevice = useCallback(async (deviceType: string, deviceName: string): Promise<boolean> => {
    try {
      setError(null);

      // Check if device is already connected
      const existingDevice = connectedDevices.find(d => d.deviceType === deviceType);
      if (existingDevice?.isConnected) {
        toast.error('Устройство уже подключено');
        return false;
      }

      // In a real implementation, this would handle OAuth flow for each device
      // For now, we'll simulate the connection
      const { data, error: insertError } = await supabase
        .from('external_api_integrations')
        .insert({
          user_id: userId,
          provider_name: deviceType,
          integration_type: 'wearable',
          integration_status: 'active',
          sync_settings: {
            dataTypes: ['steps', 'heart_rate', 'sleep', 'calories'],
            syncFrequency: 'hourly',
          },
        })
        .select()
        .single();

      if (insertError) {
        throw new Error(insertError.message);
      }

      const newDevice: WearableDevice = {
        id: data.id,
        deviceType: deviceType as any,
        deviceName: deviceName,
        isConnected: true,
        lastSyncAt: null,
        syncStatus: 'idle',
        dataTypes: ['steps', 'heart_rate', 'sleep', 'calories'],
      };

      setConnectedDevices(prev => [...prev.filter(d => d.deviceType !== deviceType), newDevice]);
      toast.success(`${deviceName} успешно подключен`);
      return true;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка подключения устройства';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    }
  }, [userId, connectedDevices]);

  const disconnectDevice = useCallback(async (deviceId: string): Promise<boolean> => {
    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('external_api_integrations')
        .delete()
        .eq('id', deviceId);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      setConnectedDevices(prev => prev.filter(d => d.id !== deviceId));
      toast.success('Устройство отключено');
      return true;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка отключения устройства';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    }
  }, []);

  const syncDevice = useCallback(async (deviceType: string, data: HealthData): Promise<boolean> => {
    try {
      setError(null);
      setIsSyncing(true);

      const device = connectedDevices.find(d => d.deviceType === deviceType);
      if (!device) {
        throw new Error('Устройство не подключено');
      }

      // Update device sync status
      setConnectedDevices(prev => 
        prev.map(d => d.id === device.id ? { ...d, syncStatus: 'syncing' } : d)
      );

      const dataTypes = Object.keys(data);
      
      for (let i = 0; i < dataTypes.length; i++) {
        const dataType = dataTypes[i];
        setSyncProgress({
          current: i + 1,
          total: dataTypes.length,
          currentDataType: dataType,
        });

        // Save health data to database
        await supabase
          .from('health_data')
          .insert({
            user_id: userId,
            data_type: dataType,
            data_value: typeof data[dataType] === 'object' 
              ? JSON.stringify(data[dataType]) 
              : data[dataType],
            recorded_at: new Date().toISOString(),
            source: deviceType,
          });

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Update last sync time
      await supabase
        .from('external_api_integrations')
        .update({ last_sync_at: new Date().toISOString() })
        .eq('id', device.id);

      setConnectedDevices(prev => 
        prev.map(d => d.id === device.id 
          ? { ...d, syncStatus: 'success', lastSyncAt: new Date().toISOString() } 
          : d
        )
      );

      setLastSyncTime(new Date().toISOString());
      toast.success('Синхронизация завершена');
      return true;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка синхронизации';
      setError(errorMessage);
      toast.error(errorMessage);
      
      // Update device sync status to error
      const device = connectedDevices.find(d => d.deviceType === deviceType);
      if (device) {
        setConnectedDevices(prev => 
          prev.map(d => d.id === device.id ? { ...d, syncStatus: 'error' } : d)
        );
      }
      
      return false;
    } finally {
      setIsSyncing(false);
      setSyncProgress(null);
    }
  }, [userId, connectedDevices]);

  const syncAllDevices = useCallback(async () => {
    const activeDevices = connectedDevices.filter(d => d.isConnected);
    
    for (const device of activeDevices) {
      // In a real implementation, you would fetch data from each device's API
      const mockData: HealthData = {
        steps: Math.floor(Math.random() * 10000) + 5000,
        heartRate: Math.floor(Math.random() * 40) + 60,
        sleepHours: Math.random() * 4 + 6,
        calories: Math.floor(Math.random() * 1000) + 1500,
      };

      await syncDevice(device.deviceType, mockData);
    }
  }, [connectedDevices, syncDevice]);

  const utils = {
    getSupportedDevices: () => [...SUPPORTED_DEVICES],
    
    getDeviceIcon: (deviceType: string): string => {
      const device = SUPPORTED_DEVICES.find(d => d.type === deviceType);
      return device?.icon || '📱';
    },
    
    formatLastSync: (timestamp: string): string => {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      
      if (diffHours < 1) {
        return 'только что';
      } else if (diffHours < 24) {
        return `${diffHours} ч. назад`;
      } else {
        return date.toLocaleDateString('ru-RU');
      }
    },
  };

  return {
    connectedDevices,
    connectDevice,
    disconnectDevice,
    syncDevice,
    syncAllDevices,
    isSyncing,
    syncProgress,
    lastSyncTime,
    error,
    utils,
  };
};
