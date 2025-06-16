
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface HealthDataPoint {
  id: string;
  user_id: string;
  device_id: string;
  data_type: string;
  data_value: number;
  data_unit: string;
  data_details: Record<string, any>;
  recorded_at: string;
  synced_at: string;
  created_at: string;
}

export interface DailyHealthSummary {
  id: string;
  user_id: string;
  summary_date: string;
  total_steps: number;
  avg_heart_rate?: number;
  max_heart_rate?: number;
  min_heart_rate?: number;
  sleep_hours?: number;
  sleep_quality?: string;
  calories_burned?: number;
  distance_km?: number;
  active_minutes: number;
  glucose_avg?: number;
  glucose_readings_count: number;
  additional_metrics: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export const useHealthData = () => {
  const [healthData, setHealthData] = useState<HealthDataPoint[]>([]);
  const [dailySummary, setDailySummary] = useState<DailyHealthSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHealthData = async (days = 7) => {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('health_device_data')
        .select(`
          *,
          user_devices(device_name, device_type)
        `)
        .gte('recorded_at', startDate.toISOString())
        .order('recorded_at', { ascending: false });

      if (error) throw error;
      setHealthData(data || []);
    } catch (error) {
      console.error('Ошибка при загрузке данных о здоровье:', error);
      toast.error('Не удалось загрузить данные о здоровье');
    }
  };

  const fetchTodaySummary = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('daily_health_summary')
        .select('*')
        .eq('summary_date', today)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setDailySummary(data);
    } catch (error) {
      console.error('Ошибка при загрузке дневной сводки:', error);
    }
  };

  const generateDailySummary = async (date?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Пользователь не авторизован');

      const targetDate = date || new Date().toISOString().split('T')[0];
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);

      // Получаем данные за день
      const { data: dayData, error } = await supabase
        .from('health_device_data')
        .select('*')
        .gte('recorded_at', targetDate)
        .lt('recorded_at', nextDay.toISOString());

      if (error) throw error;

      // Вычисляем агрегированные данные
      const stepsData = dayData?.filter(d => d.data_type === 'steps') || [];
      const heartRateData = dayData?.filter(d => d.data_type === 'heart_rate') || [];
      const sleepData = dayData?.filter(d => d.data_type === 'sleep') || [];

      const totalSteps = stepsData.reduce((sum, d) => sum + (d.data_value || 0), 0);
      const avgHeartRate = heartRateData.length > 0 
        ? heartRateData.reduce((sum, d) => sum + (d.data_value || 0), 0) / heartRateData.length 
        : null;
      const maxHeartRate = heartRateData.length > 0 
        ? Math.max(...heartRateData.map(d => d.data_value || 0)) 
        : null;
      const minHeartRate = heartRateData.length > 0 
        ? Math.min(...heartRateData.map(d => d.data_value || 0)) 
        : null;
      const sleepHours = sleepData.reduce((sum, d) => sum + (d.data_value || 0), 0);

      // Сохраняем или обновляем дневную сводку
      const { data: summary, error: upsertError } = await supabase
        .from('daily_health_summary')
        .upsert({
          user_id: user.id,
          summary_date: targetDate,
          total_steps: totalSteps,
          avg_heart_rate: avgHeartRate,
          max_heart_rate: maxHeartRate,
          min_heart_rate: minHeartRate,
          sleep_hours: sleepHours,
          active_minutes: Math.floor(totalSteps / 100), // Простая формула
          glucose_readings_count: 0
        })
        .select()
        .single();

      if (upsertError) throw upsertError;

      setDailySummary(summary);
      toast.success('Дневная сводка обновлена');
    } catch (error) {
      console.error('Ошибка при генерации дневной сводки:', error);
      toast.error('Не удалось создать дневную сводку');
    }
  };

  const getHealthMetrics = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayData = healthData.filter(d => 
      d.recorded_at.startsWith(today)
    );

    const steps = todayData
      .filter(d => d.data_type === 'steps')
      .reduce((sum, d) => sum + (d.data_value || 0), 0);

    const heartRateData = todayData.filter(d => d.data_type === 'heart_rate');
    const avgHeartRate = heartRateData.length > 0 
      ? Math.round(heartRateData.reduce((sum, d) => sum + (d.data_value || 0), 0) / heartRateData.length)
      : 0;

    const sleepHours = todayData
      .filter(d => d.data_type === 'sleep')
      .reduce((sum, d) => sum + (d.data_value || 0), 0);

    return {
      steps,
      avgHeartRate,
      sleepHours: Math.round(sleepHours * 10) / 10
    };
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchHealthData(),
      fetchTodaySummary()
    ]).finally(() => setLoading(false));
  }, []);

  return {
    healthData,
    dailySummary,
    loading,
    fetchHealthData,
    generateDailySummary,
    getHealthMetrics,
    refetch: () => {
      fetchHealthData();
      fetchTodaySummary();
    }
  };
};
