
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AppleWatchHealthData {
  currentHeartRate?: number;
  restingHeartRate?: number;
  maxHeartRate?: number;
  hrv?: number;
  avgHrv?: number;
  todaySteps?: number;
  activeMinutes?: number;
  caloriesBurned?: number;
  lastNightSleep?: number;
  sleepQuality?: 'poor' | 'fair' | 'good' | 'excellent';
}

interface WorkoutData {
  id: string;
  name: string;
  date: string;
  duration: number;
  calories: number;
  avgHeartRate?: number;
  maxHeartRate?: number;
  workoutType: string;
}

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'syncing' | 'error';

export const useAppleWatch = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [healthData, setHealthData] = useState<AppleWatchHealthData | null>(null);
  const [workoutData, setWorkoutData] = useState<WorkoutData[]>([]);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Проверяем существующее подключение при загрузке
  useEffect(() => {
    checkExistingConnection();
  }, []);

  const checkExistingConnection = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: device } = await supabase
        .from('user_devices')
        .select('*')
        .eq('user_id', user.id)
        .eq('device_type', 'apple_watch')
        .eq('is_connected', true)
        .single();

      if (device) {
        setIsConnected(true);
        setConnectionStatus('connected');
        setLastSync(device.last_sync_at);
        await loadHealthData();
        console.log('✅ Apple Watch уже подключены');
      }
    } catch (error) {
      console.log('ℹ️ Apple Watch не подключены');
    }
  };

  const connectToAppleWatch = async () => {
    console.log('🔗 Начинаем подключение к Apple Watch...');
    setIsLoading(true);
    setConnectionStatus('connecting');

    try {
      // Проверяем доступность HealthKit
      if (!window.webkit?.messageHandlers?.healthKit) {
        console.log('🌐 HealthKit недоступен, используем веб-симуляцию');
        await simulateWebConnection();
        return;
      }

      // Запрашиваем разрешения HealthKit
      const permissions = [
        'HKQuantityTypeIdentifierHeartRate',
        'HKQuantityTypeIdentifierStepCount',
        'HKQuantityTypeIdentifierActiveEnergyBurned',
        'HKQuantityTypeIdentifierDistanceWalkingRunning',
        'HKCategoryTypeIdentifierSleepAnalysis',
        'HKQuantityTypeIdentifierHeartRateVariabilitySDNN'
      ];

      const permissionRequest = {
        action: 'requestPermissions',
        permissions: permissions
      };

      window.webkit.messageHandlers.healthKit.postMessage(permissionRequest);

      // Симулируем ответ от iOS (в реальном приложении это будет callback)
      setTimeout(async () => {
        await handleHealthKitPermissionResponse(true);
      }, 2000);

    } catch (error) {
      console.error('❌ Ошибка подключения к Apple Watch:', error);
      setConnectionStatus('error');
      toast.error('Не удалось подключить Apple Watch');
    } finally {
      setIsLoading(false);
    }
  };

  const simulateWebConnection = async () => {
    console.log('🔄 Симулируем подключение Apple Watch для веб-версии...');
    
    // Симулируем процесс подключения
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Пользователь не авторизован');

    // Создаем запись устройства
    const { data: device, error } = await supabase
      .from('user_devices')
      .insert({
        user_id: user.id,
        device_type: 'apple_watch',
        device_name: 'Apple Watch (Симуляция)',
        is_connected: true,
        connection_status: 'connected',
        last_sync_at: new Date().toISOString(),
        device_settings: {
          sync_heart_rate: true,
          sync_steps: true,
          sync_sleep: true,
          sync_workouts: true
        }
      })
      .select()
      .single();

    if (error) throw error;

    // Генерируем тестовые данные
    await generateMockHealthData(user.id, device.id);
    
    setIsConnected(true);
    setConnectionStatus('connected');
    setLastSync(new Date().toISOString());
    setBatteryLevel(85); // Симулируем уровень батареи
    
    await loadHealthData();
    
    toast.success('Apple Watch успешно подключены!');
    console.log('✅ Apple Watch подключены (симуляция)');
  };

  const handleHealthKitPermissionResponse = async (granted: boolean) => {
    if (!granted) {
      setConnectionStatus('error');
      toast.error('Необходимо разрешить доступ к данным здоровья');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Пользователь не авторизован');

      // Создаем запись устройства в базе данных
      const { data: device, error } = await supabase
        .from('user_devices')
        .insert({
          user_id: user.id,
          device_type: 'apple_watch',
          device_name: 'Apple Watch',
          is_connected: true,
          connection_status: 'connected',
          last_sync_at: new Date().toISOString(),
          device_settings: {
            sync_heart_rate: true,
            sync_steps: true,
            sync_sleep: true,
            sync_workouts: true
          }
        })
        .select()
        .single();

      if (error) throw error;

      setIsConnected(true);
      setConnectionStatus('connected');
      setLastSync(new Date().toISOString());
      
      // Запускаем первую синхронизацию
      await syncHealthData();
      
      toast.success('Apple Watch успешно подключены!');
      console.log('✅ Apple Watch успешно подключены');

    } catch (error) {
      console.error('❌ Ошибка сохранения подключения:', error);
      setConnectionStatus('error');
      toast.error('Ошибка при сохранении подключения');
    }
  };

  const generateMockHealthData = async (userId: string, deviceId: string) => {
    const now = new Date();
    const mockData = [
      {
        user_id: userId,
        device_id: deviceId,
        data_type: 'heart_rate',
        data_value: 72 + Math.floor(Math.random() * 20),
        data_unit: 'bpm',
        recorded_at: now.toISOString()
      },
      {
        user_id: userId,
        device_id: deviceId,
        data_type: 'steps',
        data_value: 8500 + Math.floor(Math.random() * 3000),
        data_unit: 'steps',
        recorded_at: now.toISOString()
      },
      {
        user_id: userId,
        device_id: deviceId,
        data_type: 'active_minutes',
        data_value: 25 + Math.floor(Math.random() * 15),
        data_unit: 'minutes',
        recorded_at: now.toISOString()
      },
      {
        user_id: userId,
        device_id: deviceId,
        data_type: 'calories',
        data_value: 300 + Math.floor(Math.random() * 200),
        data_unit: 'kcal',
        recorded_at: now.toISOString()
      },
      {
        user_id: userId,
        device_id: deviceId,
        data_type: 'sleep_hours',
        data_value: 7.5 + Math.random() * 1.5,
        data_unit: 'hours',
        recorded_at: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    await supabase.from('health_device_data').insert(mockData);
  };

  const loadHealthData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Загружаем последние данные о здоровье
      const { data: healthRecords } = await supabase
        .from('health_device_data')
        .select('*')
        .eq('user_id', user.id)
        .gte('recorded_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('recorded_at', { ascending: false });

      if (healthRecords && healthRecords.length > 0) {
        const processedData: AppleWatchHealthData = {};

        healthRecords.forEach(record => {
          switch (record.data_type) {
            case 'heart_rate':
              if (!processedData.currentHeartRate) {
                processedData.currentHeartRate = record.data_value;
              }
              if (!processedData.restingHeartRate || record.data_value < processedData.restingHeartRate) {
                processedData.restingHeartRate = record.data_value;
              }
              if (!processedData.maxHeartRate || record.data_value > processedData.maxHeartRate) {
                processedData.maxHeartRate = record.data_value;
              }
              break;
            case 'steps':
              processedData.todaySteps = record.data_value;
              break;
            case 'active_minutes':
              processedData.activeMinutes = record.data_value;
              break;
            case 'calories':
              processedData.caloriesBurned = record.data_value;
              break;
            case 'sleep_hours':
              processedData.lastNightSleep = record.data_value;
              break;
          }
        });

        setHealthData(processedData);
      }

      // Симулируем данные тренировок
      const mockWorkouts: WorkoutData[] = [
        {
          id: '1',
          name: 'Утренняя пробежка',
          date: new Date().toISOString(),
          duration: 30,
          calories: 250,
          avgHeartRate: 140,
          workoutType: 'running'
        },
        {
          id: '2',
          name: 'Йога',
          date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          duration: 45,
          calories: 120,
          avgHeartRate: 85,
          workoutType: 'yoga'
        }
      ];

      setWorkoutData(mockWorkouts);

    } catch (error) {
      console.error('❌ Ошибка загрузки данных здоровья:', error);
    }
  };

  const syncHealthData = useCallback(async () => {
    if (!isConnected) return;

    console.log('🔄 Синхронизация данных Apple Watch...');
    setConnectionStatus('syncing');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Пользователь не авторизован');

      // Обновляем время последней синхронизации
      await supabase
        .from('user_devices')
        .update({ last_sync_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('device_type', 'apple_watch');

      // Перезагружаем данные
      await loadHealthData();
      
      setLastSync(new Date().toISOString());
      setConnectionStatus('connected');
      
      toast.success('Данные успешно синхронизированы');
      console.log('✅ Синхронизация завершена');

    } catch (error) {
      console.error('❌ Ошибка синхронизации:', error);
      setConnectionStatus('error');
      toast.error('Ошибка синхронизации данных');
    }
  }, [isConnected]);

  const disconnectAppleWatch = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('user_devices')
        .update({
          is_connected: false,
          connection_status: 'disconnected'
        })
        .eq('user_id', user.id)
        .eq('device_type', 'apple_watch');

      setIsConnected(false);
      setConnectionStatus('disconnected');
      setHealthData(null);
      setWorkoutData([]);
      setBatteryLevel(null);
      setLastSync(null);

      toast.success('Apple Watch отключены');
      console.log('✅ Apple Watch отключены');

    } catch (error) {
      console.error('❌ Ошибка отключения:', error);
      toast.error('Ошибка при отключении');
    }
  };

  return {
    isConnected,
    connectionStatus,
    healthData,
    workoutData,
    batteryLevel,
    lastSync,
    isLoading,
    connectToAppleWatch,
    syncHealthData,
    disconnectAppleWatch
  };
};
