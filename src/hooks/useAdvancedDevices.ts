
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AdvancedDevice {
  id: string;
  user_id: string;
  device_type: 'apple_health' | 'google_fit' | 'apple_watch' | 'oura_ring' | 'whoop' | 'libra';
  device_name: string;
  is_connected: boolean;
  connection_status: 'connected' | 'disconnected' | 'pending' | 'error' | 'syncing';
  last_sync_at?: string;
  sync_frequency: 'manual' | 'hourly' | 'daily' | 'real_time';
  auto_sync_enabled: boolean;
  battery_level?: number;
  firmware_version?: string;
  data_types: string[];
  sync_settings: {
    syncSteps: boolean;
    syncHeartRate: boolean;
    syncSleep: boolean;
    syncActivity: boolean;
    syncGlucose: boolean;
    syncCalories: boolean;
  };
  device_settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface DeviceMetrics {
  totalSyncs: number;
  lastSyncSuccess: boolean;
  avgSyncTime: number;
  dataPointsToday: number;
  batteryStatus: 'good' | 'low' | 'critical' | 'charging';
}

export const useAdvancedDevices = () => {
  const [devices, setDevices] = useState<AdvancedDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingDevices, setSyncingDevices] = useState<Set<string>>(new Set());

  const fetchDevices = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('user_devices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const deviceData = (data || []).map((item): AdvancedDevice => ({
        id: item.id,
        user_id: item.user_id,
        device_type: item.device_type as AdvancedDevice['device_type'],
        device_name: item.device_name,
        is_connected: item.is_connected,
        connection_status: item.connection_status as AdvancedDevice['connection_status'],
        last_sync_at: item.last_sync_at,
        sync_frequency: 'daily',
        auto_sync_enabled: true,
        battery_level: Math.floor(Math.random() * 100),
        firmware_version: '1.0.0',
        data_types: getDeviceDataTypes(item.device_type),
        sync_settings: {
          syncSteps: true,
          syncHeartRate: true,
          syncSleep: true,
          syncActivity: true,
          syncGlucose: item.device_type === 'libra',
          syncCalories: true,
        },
        device_settings: (item.device_settings as Record<string, any>) || {},
        created_at: item.created_at,
        updated_at: item.updated_at,
      }));
      
      setDevices(deviceData);
    } catch (error) {
      console.error('Ошибка при загрузке устройств:', error);
      toast.error('Не удалось загрузить устройства');
    } finally {
      setLoading(false);
    }
  }, []);

  const getDeviceDataTypes = (deviceType: string): string[] => {
    const typeMap = {
      'apple_health': ['steps', 'heart_rate', 'sleep', 'activity', 'calories'],
      'apple_watch': ['steps', 'heart_rate', 'activity', 'calories', 'workouts'],
      'google_fit': ['steps', 'activity', 'calories', 'heart_rate'],
      'oura_ring': ['sleep', 'heart_rate', 'activity', 'readiness', 'temperature'],
      'whoop': ['heart_rate', 'sleep', 'recovery', 'strain', 'calories'],
      'libra': ['glucose', 'ketones', 'trends']
    };
    return typeMap[deviceType] || [];
  };

  const connectAdvancedDevice = async (
    deviceType: AdvancedDevice['device_type'], 
    deviceName: string,
    syncSettings?: Partial<AdvancedDevice['sync_settings']>
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Пользователь не авторизован');

      const defaultSyncSettings = {
        syncSteps: true,
        syncHeartRate: true,
        syncSleep: true,
        syncActivity: true,
        syncGlucose: deviceType === 'libra',
        syncCalories: true,
        ...syncSettings
      };

      const { data, error } = await supabase
        .from('user_devices')
        .insert({
          user_id: user.id,
          device_type: deviceType,
          device_name: deviceName,
          is_connected: false,
          connection_status: 'pending',
          device_settings: {
            sync_settings: defaultSyncSettings,
            auto_sync_enabled: true,
            sync_frequency: 'daily'
          }
        })
        .select()
        .single();

      if (error) throw error;

      await fetchDevices();
      toast.success(`Устройство ${deviceName} добавлено`);
      
      // Симулируем подключение
      await simulateAdvancedConnection(data.id, deviceType);
      
      return data;
    } catch (error) {
      console.error('Ошибка при подключении устройства:', error);
      toast.error('Не удалось подключить устройство');
      throw error;
    }
  };

  const simulateAdvancedConnection = async (deviceId: string, deviceType: string) => {
    // Симуляция процесса подключения с обновлением статуса
    setSyncingDevices(prev => new Set(prev).add(deviceId));
    
    setTimeout(async () => {
      try {
        const { error } = await supabase
          .from('user_devices')
          .update({
            is_connected: true,
            connection_status: 'connected',
            last_sync_at: new Date().toISOString()
          })
          .eq('id', deviceId);

        if (error) throw error;

        // Генерируем тестовые данные для нового устройства
        await generateTestData(deviceId, deviceType);
        
        await fetchDevices();
        setSyncingDevices(prev => {
          const newSet = new Set(prev);
          newSet.delete(deviceId);
          return newSet;
        });
        
        toast.success('Устройство успешно подключено и синхронизировано!');
      } catch (error) {
        console.error('Ошибка при подключении:', error);
        setSyncingDevices(prev => {
          const newSet = new Set(prev);
          newSet.delete(deviceId);
          return newSet;
        });
        toast.error('Ошибка подключения устройства');
      }
    }, 3000);
  };

  const generateTestData = async (deviceId: string, deviceType: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const now = new Date();
    const testData = [];

    // Генерируем данные за последние 7 дней
    for (let i = 0; i < 7; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      switch (deviceType) {
        case 'oura_ring':
          testData.push(
            {
              user_id: user.id,
              device_id: deviceId,
              data_type: 'sleep',
              data_value: 6.5 + Math.random() * 2,
              data_unit: 'hours',
              recorded_at: date.toISOString(),
              data_details: { quality: 'good', rem_sleep: 1.5 + Math.random() * 0.5 }
            },
            {
              user_id: user.id,
              device_id: deviceId,
              data_type: 'readiness',
              data_value: 70 + Math.random() * 30,
              data_unit: 'score',
              recorded_at: date.toISOString(),
              data_details: { recovery: 'high', hrv: 35 + Math.random() * 10 }
            }
          );
          break;

        case 'whoop':
          testData.push(
            {
              user_id: user.id,
              device_id: deviceId,
              data_type: 'strain',
              data_value: 10 + Math.random() * 11,
              data_unit: 'score',
              recorded_at: date.toISOString(),
              data_details: { cardiovascular_load: 'moderate' }
            },
            {
              user_id: user.id,
              device_id: deviceId,
              data_type: 'recovery',
              data_value: 60 + Math.random() * 40,
              data_unit: 'percentage',
              recorded_at: date.toISOString(),
              data_details: { hrv: 30 + Math.random() * 20 }
            }
          );
          break;

        case 'libra':
          // Генерируем несколько измерений глюкозы в день
          for (let hour = 8; hour < 22; hour += 4) {
            const measurementTime = new Date(date);
            measurementTime.setHours(hour);
            
            testData.push({
              user_id: user.id,
              device_id: deviceId,
              data_type: 'glucose',
              data_value: 80 + Math.random() * 60,
              data_unit: 'mg/dL',
              recorded_at: measurementTime.toISOString(),
              data_details: { trend: 'stable', alert: false }
            });
          }
          break;

        default:
          testData.push(
            {
              user_id: user.id,
              device_id: deviceId,
              data_type: 'steps',
              data_value: 8000 + Math.random() * 4000,
              data_unit: 'steps',
              recorded_at: date.toISOString()
            },
            {
              user_id: user.id,
              device_id: deviceId,
              data_type: 'heart_rate',
              data_value: 60 + Math.random() * 40,
              data_unit: 'bpm',
              recorded_at: date.toISOString()
            }
          );
      }
    }

    await supabase.from('health_device_data').insert(testData);
  };

  const syncDevice = async (deviceId: string) => {
    setSyncingDevices(prev => new Set(prev).add(deviceId));
    
    try {
      const device = devices.find(d => d.id === deviceId);
      if (!device) throw new Error('Устройство не найдено');

      // Обновляем статус синхронизации
      await supabase
        .from('user_devices')
        .update({ connection_status: 'syncing' })
        .eq('id', deviceId);

      // Симулируем синхронизацию данных
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Генерируем новые данные
      await generateTestData(deviceId, device.device_type);

      const { error } = await supabase
        .from('user_devices')
        .update({
          last_sync_at: new Date().toISOString(),
          connection_status: 'connected'
        })
        .eq('id', deviceId);

      if (error) throw error;

      await fetchDevices();
      toast.success('Синхронизация завершена');
    } catch (error) {
      console.error('Ошибка при синхронизации:', error);
      toast.error('Ошибка синхронизации');
    } finally {
      setSyncingDevices(prev => {
        const newSet = new Set(prev);
        newSet.delete(deviceId);
        return newSet;
      });
    }
  };

  const updateSyncSettings = async (
    deviceId: string, 
    settings: Partial<AdvancedDevice['sync_settings']>
  ) => {
    try {
      const device = devices.find(d => d.id === deviceId);
      if (!device) throw new Error('Устройство не найдено');

      const updatedSettings = {
        ...device.device_settings,
        sync_settings: { ...device.sync_settings, ...settings }
      };

      const { error } = await supabase
        .from('user_devices')
        .update({ device_settings: updatedSettings })
        .eq('id', deviceId);

      if (error) throw error;

      await fetchDevices();
      toast.success('Настройки синхронизации обновлены');
    } catch (error) {
      console.error('Ошибка при обновлении настроек:', error);
      toast.error('Не удалось обновить настройки');
    }
  };

  const getDeviceMetrics = (deviceId: string): DeviceMetrics => {
    const device = devices.find(d => d.id === deviceId);
    if (!device) {
      return {
        totalSyncs: 0,
        lastSyncSuccess: false,
        avgSyncTime: 0,
        dataPointsToday: 0,
        batteryStatus: 'good'
      };
    }

    return {
      totalSyncs: Math.floor(Math.random() * 100) + 20,
      lastSyncSuccess: device.connection_status === 'connected',
      avgSyncTime: 2.5 + Math.random() * 2,
      dataPointsToday: Math.floor(Math.random() * 50) + 10,
      batteryStatus: device.battery_level && device.battery_level > 20 ? 'good' : 'low'
    };
  };

  const disconnectDevice = async (deviceId: string) => {
    try {
      const { error } = await supabase
        .from('user_devices')
        .update({
          is_connected: false,
          connection_status: 'disconnected'
        })
        .eq('id', deviceId);

      if (error) throw error;

      await fetchDevices();
      toast.success('Устройство отключено');
    } catch (error) {
      console.error('Ошибка при отключении устройства:', error);
      toast.error('Не удалось отключить устройство');
    }
  };

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  return {
    devices,
    loading,
    syncingDevices,
    connectAdvancedDevice,
    syncDevice,
    updateSyncSettings,
    getDeviceMetrics,
    disconnectDevice,
    refetch: fetchDevices
  };
};
