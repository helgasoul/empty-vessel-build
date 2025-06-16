
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
  // Новые поля из миграции
  basal_temperature?: number;
  cervical_mucus?: string;
  ovulation_test_result?: boolean;
  ovulation_date?: string;
  mood_rating?: number;
  pain_level?: number;
  breast_tenderness?: boolean;
  bloating?: boolean;
  cycle_type?: 'regular' | 'irregular' | 'anovulatory';
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
      
      // Type cast the data to ensure flow_intensity matches our interface
      const typedData = (data || []).map(cycle => ({
        ...cycle,
        flow_intensity: cycle.flow_intensity as 'light' | 'moderate' | 'heavy' | undefined,
        cycle_type: cycle.cycle_type as 'regular' | 'irregular' | 'anovulatory' | undefined
      }));
      
      setCycles(typedData);
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

      // Type cast the returned data
      const typedData = {
        ...data,
        flow_intensity: data.flow_intensity as 'light' | 'moderate' | 'heavy' | undefined,
        cycle_type: data.cycle_type as 'regular' | 'irregular' | 'anovulatory' | undefined
      };

      setCycles(prev => [typedData, ...prev]);
      toast.success('Цикл добавлен');
      return typedData;
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

      // Type cast the returned data
      const typedData = {
        ...data,
        flow_intensity: data.flow_intensity as 'light' | 'moderate' | 'heavy' | undefined,
        cycle_type: data.cycle_type as 'regular' | 'irregular' | 'anovulatory' | undefined
      };

      setCycles(prev => prev.map(cycle => 
        cycle.id === id ? typedData : cycle
      ));
      toast.success('Цикл обновлен');
      return typedData;
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
