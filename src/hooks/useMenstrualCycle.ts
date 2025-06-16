
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface MenstrualCycle {
  id: string;
  user_id: string;
  cycle_start_date: string;
  cycle_end_date?: string;
  cycle_length?: number;
  period_length?: number;
  flow_intensity?: 'light' | 'moderate' | 'heavy';
  symptoms?: string[];
  notes?: string;
  predicted_next_cycle?: string;
  created_at: string;
  updated_at: string;
}

export const useMenstrualCycle = () => {
  const [cycles, setCycles] = useState<MenstrualCycle[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCycles = async () => {
    try {
      const { data, error } = await supabase
        .from('menstrual_cycles')
        .select('*')
        .order('cycle_start_date', { ascending: false });

      if (error) throw error;
      setCycles(data || []);
    } catch (error) {
      console.error('Ошибка при загрузке циклов:', error);
      toast.error('Не удалось загрузить данные о циклах');
    } finally {
      setLoading(false);
    }
  };

  const addCycle = async (cycleData: Omit<MenstrualCycle, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Пользователь не авторизован');

      const { data, error } = await supabase
        .from('menstrual_cycles')
        .insert({
          user_id: user.id,
          ...cycleData
        })
        .select()
        .single();

      if (error) throw error;

      setCycles(prev => [data, ...prev]);
      toast.success('Цикл добавлен');
      return data;
    } catch (error) {
      console.error('Ошибка при добавлении цикла:', error);
      toast.error('Не удалось добавить цикл');
      throw error;
    }
  };

  const updateCycle = async (id: string, updates: Partial<MenstrualCycle>) => {
    try {
      const { data, error } = await supabase
        .from('menstrual_cycles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setCycles(prev => prev.map(cycle => 
        cycle.id === id ? data : cycle
      ));
      toast.success('Цикл обновлен');
      return data;
    } catch (error) {
      console.error('Ошибка при обновлении цикла:', error);
      toast.error('Не удалось обновить цикл');
      throw error;
    }
  };

  const deleteCycle = async (id: string) => {
    try {
      const { error } = await supabase
        .from('menstrual_cycles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCycles(prev => prev.filter(cycle => cycle.id !== id));
      toast.success('Цикл удален');
    } catch (error) {
      console.error('Ошибка при удалении цикла:', error);
      toast.error('Не удалось удалить цикл');
      throw error;
    }
  };

  useEffect(() => {
    fetchCycles();
  }, []);

  return {
    cycles,
    loading,
    addCycle,
    updateCycle,
    deleteCycle,
    refetch: fetchCycles
  };
};
