
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface WearableDevice {
  id: string;
  user_id: string;
  device_type: 'apple_watch' | 'fitbit' | 'garmin' | 'oura' | 'whoop';
  device_name: string;
  is_connected: boolean;
  last_sync: string;
  sync_frequency: 'realtime' | 'hourly' | 'daily';
  data_types: string[];
}

interface HealthDataPoint {
  id: string;
  user_id: string;
  device_id: string;
  data_type: string;
  value: number;
  unit: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export const useWearableSync = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');

  // Mock data since health_data table doesn't exist
  const mockDevices: WearableDevice[] = [
    {
      id: '1',
      user_id: user?.id || '',
      device_type: 'apple_watch',
      device_name: 'Apple Watch Series 9',
      is_connected: true,
      last_sync: new Date().toISOString(),
      sync_frequency: 'hourly',
      data_types: ['heart_rate', 'steps', 'sleep', 'activity']
    }
  ];

  const mockHealthData: HealthDataPoint[] = [
    {
      id: '1',
      user_id: user?.id || '',
      device_id: '1',
      data_type: 'heart_rate',
      value: 72,
      unit: 'bpm',
      timestamp: new Date().toISOString()
    },
    {
      id: '2',
      user_id: user?.id || '',
      device_id: '1',
      data_type: 'steps',
      value: 8543,
      unit: 'steps',
      timestamp: new Date().toISOString()
    }
  ];

  const {
    data: devices = mockDevices,
    isLoading: isLoadingDevices,
    error: devicesError
  } = useQuery({
    queryKey: ['wearable-devices', user?.id],
    queryFn: async () => {
      if (!user?.id) return mockDevices;
      return mockDevices;
    },
    enabled: !!user?.id
  });

  const {
    data: healthData = mockHealthData,
    isLoading: isLoadingData,
    error: dataError
  } = useQuery({
    queryKey: ['health-data', user?.id],
    queryFn: async () => {
      if (!user?.id) return mockHealthData;
      return mockHealthData;
    },
    enabled: !!user?.id
  });

  const syncDevice = useMutation({
    mutationFn: async (deviceId: string) => {
      setSyncStatus('syncing');
      
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful sync
      setSyncStatus('success');
      return { success: true, synced_records: Math.floor(Math.random() * 100) + 1 };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['health-data'] });
      toast.success(`Synced ${data.synced_records} new data points`);
      setSyncStatus('idle');
    },
    onError: () => {
      toast.error('Failed to sync device data');
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 3000);
    }
  });

  const connectDevice = useMutation({
    mutationFn: async (deviceData: Partial<WearableDevice>) => {
      // Mock device connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newDevice: WearableDevice = {
        id: Date.now().toString(),
        user_id: user?.id || '',
        device_type: deviceData.device_type || 'apple_watch',
        device_name: deviceData.device_name || 'New Device',
        is_connected: true,
        last_sync: new Date().toISOString(),
        sync_frequency: 'hourly',
        data_types: deviceData.data_types || ['heart_rate', 'steps']
      };

      return newDevice;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wearable-devices'] });
      toast.success('Device connected successfully');
    },
    onError: () => {
      toast.error('Failed to connect device');
    }
  });

  const disconnectDevice = useMutation({
    mutationFn: async (deviceId: string) => {
      // Mock device disconnection
      await new Promise(resolve => setTimeout(resolve, 500));
      return deviceId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wearable-devices'] });
      toast.success('Device disconnected');
    },
    onError: () => {
      toast.error('Failed to disconnect device');
    }
  });

  const getLatestDataByType = (dataType: string) => {
    return healthData
      .filter(point => point.data_type === dataType)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
  };

  return {
    devices,
    healthData,
    isLoadingDevices,
    isLoadingData,
    devicesError,
    dataError,
    syncStatus,
    syncDevice,
    connectDevice,
    disconnectDevice,
    getLatestDataByType
  };
};
