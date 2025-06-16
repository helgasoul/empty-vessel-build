
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Device {
  id: string;
  user_id: string;
  device_type: 'apple_health' | 'google_fit' | 'apple_watch' | 'oura_ring' | 'whoop' | 'libra';
  device_name: string;
  is_connected: boolean;
  connection_status: 'connected' | 'disconnected' | 'pending' | 'error';
  last_sync_at?: string;
  access_token?: string;
  refresh_token?: string;
  token_expires_at?: string;
  device_settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export const useDevices = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDevices = async () => {
    try {
      const { data, error } = await supabase
        .from('user_devices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type-safe conversion from Supabase data to our Device interface
      const deviceData = (data || []).map((item): Device => ({
        id: item.id,
        user_id: item.user_id,
        device_type: item.device_type as Device['device_type'],
        device_name: item.device_name,
        is_connected: item.is_connected,
        connection_status: item.connection_status as Device['connection_status'],
        last_sync_at: item.last_sync_at,
        access_token: item.access_token,
        refresh_token: item.refresh_token,
        token_expires_at: item.token_expires_at,
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
  };

  const connectDevice = async (deviceType: Device['device_type'], deviceName: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Пользователь не авторизован');

      const { data, error } = await supabase
        .from('user_devices')
        .insert({
          user_id: user.id,
          device_type: deviceType,
          device_name: deviceName,
          is_connected: false,
          connection_status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      // Type-safe conversion
      const newDevice: Device = {
        id: data.id,
        user_id: data.user_id,
        device_type: data.device_type as Device['device_type'],
        device_name: data.device_name,
        is_connected: data.is_connected,
        connection_status: data.connection_status as Device['connection_status'],
        last_sync_at: data.last_sync_at,
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        token_expires_at: data.token_expires_at,
        device_settings: (data.device_settings as Record<string, any>) || {},
        created_at: data.created_at,
        updated_at: data.updated_at,
      };

      setDevices(prev => [newDevice, ...prev]);
      toast.success(`Устройство ${deviceName} добавлено`);
      
      // Здесь можно добавить логику для реального подключения к API устройства
      await simulateDeviceConnection(data.id);
      
      return newDevice;
    } catch (error) {
      console.error('Ошибка при подключении устройства:', error);
      toast.error('Не удалось подключить устройство');
      throw error;
    }
  };

  const simulateDeviceConnection = async (deviceId: string) => {
    // Симуляция процесса подключения
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

        await fetchDevices();
        toast.success('Устройство успешно подключено!');
      } catch (error) {
        console.error('Ошибка при обновлении статуса устройства:', error);
        await supabase
          .from('user_devices')
          .update({ connection_status: 'error' })
          .eq('id', deviceId);
        
        await fetchDevices();
        toast.error('Ошибка подключения устройства');
      }
    }, 3000);
  };

  const disconnectDevice = async (deviceId: string) => {
    try {
      const { error } = await supabase
        .from('user_devices')
        .update({
          is_connected: false,
          connection_status: 'disconnected',
          access_token: null,
          refresh_token: null
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

  const syncDevice = async (deviceId: string) => {
    try {
      const { error } = await supabase
        .from('user_devices')
        .update({
          last_sync_at: new Date().toISOString()
        })
        .eq('id', deviceId);

      if (error) throw error;

      // Здесь можно добавить логику синхронизации данных
      await simulateDataSync(deviceId);
      
      await fetchDevices();
      toast.success('Синхронизация завершена');
    } catch (error) {
      console.error('Ошибка при синхронизации:', error);
      toast.error('Ошибка синхронизации');
    }
  };

  const simulateDataSync = async (deviceId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Генерируем тестовые данные о здоровье
    const healthData = [
      {
        user_id: user.id,
        device_id: deviceId,
        data_type: 'steps',
        data_value: Math.floor(Math.random() * 15000) + 5000,
        data_unit: 'steps',
        recorded_at: new Date().toISOString()
      },
      {
        user_id: user.id,
        device_id: deviceId,
        data_type: 'heart_rate',
        data_value: Math.floor(Math.random() * 40) + 60,
        data_unit: 'bpm',
        recorded_at: new Date().toISOString()
      }
    ];

    await supabase.from('health_device_data').insert(healthData);
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  return {
    devices,
    loading,
    connectDevice,
    disconnectDevice,
    syncDevice,
    refetch: fetchDevices
  };
};
