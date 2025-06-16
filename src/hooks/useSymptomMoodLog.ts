
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SymptomMoodLog {
  id: string;
  user_id: string;
  log_date: string;
  symptoms?: string[];
  mood_rating?: number;
  mood_tags?: string[];
  energy_level?: number;
  sleep_quality?: number;
  stress_level?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const useSymptomMoodLog = () => {
  const [logs, setLogs] = useState<SymptomMoodLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async (days = 30) => {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('symptom_mood_logs')
        .select('*')
        .gte('log_date', startDate.toISOString().split('T')[0])
        .order('log_date', { ascending: false });

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Ошибка при загрузке записей:', error);
      toast.error('Не удалось загрузить записи о симптомах и настроении');
    } finally {
      setLoading(false);
    }
  };

  const addLog = async (logData: Omit<SymptomMoodLog, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Пользователь не авторизован');

      const { data, error } = await supabase
        .from('symptom_mood_logs')
        .insert({
          user_id: user.id,
          ...logData
        })
        .select()
        .single();

      if (error) throw error;

      setLogs(prev => [data, ...prev]);
      toast.success('Запись добавлена');
      return data;
    } catch (error) {
      console.error('Ошибка при добавлении записи:', error);
      toast.error('Не удалось добавить запись');
      throw error;
    }
  };

  const updateLog = async (id: string, updates: Partial<SymptomMoodLog>) => {
    try {
      const { data, error } = await supabase
        .from('symptom_mood_logs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setLogs(prev => prev.map(log => 
        log.id === id ? data : log
      ));
      toast.success('Запись обновлена');
      return data;
    } catch (error) {
      console.error('Ошибка при обновлении записи:', error);
      toast.error('Не удалось обновить запись');
      throw error;
    }
  };

  const deleteLog = async (id: string) => {
    try {
      const { error } = await supabase
        .from('symptom_mood_logs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setLogs(prev => prev.filter(log => log.id !== id));
      toast.success('Запись удалена');
    } catch (error) {
      console.error('Ошибка при удалении записи:', error);
      toast.error('Не удалось удалить запись');
      throw error;
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return {
    logs,
    loading,
    addLog,
    updateLog,
    deleteLog,
    refetch: fetchLogs
  };
};
