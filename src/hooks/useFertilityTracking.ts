
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface FertilityRecord {
  id: string;
  user_id: string;
  tracking_date: string;
  basal_body_temperature?: number;
  cervical_mucus_type?: 'dry' | 'sticky' | 'creamy' | 'egg_white' | 'watery';
  cervical_position?: 'low' | 'medium' | 'high';
  cervical_firmness?: 'firm' | 'medium' | 'soft';
  cervical_opening?: 'closed' | 'slightly_open' | 'open';
  ovulation_test_result?: 'negative' | 'positive' | 'peak';
  fertility_symptoms?: string[];
  intercourse_timing: boolean;
  sperm_friendly_lubricant?: boolean;
  stress_level?: number;
  sleep_quality?: number;
  exercise_intensity?: 'none' | 'light' | 'moderate' | 'intense';
  predicted_ovulation_date?: string;
  fertile_window_start?: string;
  fertile_window_end?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const useFertilityTracking = () => {
  const [records, setRecords] = useState<FertilityRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchRecords = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('fertility_tracking')
        .select('*')
        .eq('user_id', user.id)
        .order('tracking_date', { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error('Error fetching fertility records:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [user]);

  const addRecord = async (recordData: Omit<FertilityRecord, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('fertility_tracking')
        .insert({
          ...recordData,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      setRecords(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding fertility record:', error);
      throw error;
    }
  };

  const updateRecord = async (id: string, recordData: Partial<FertilityRecord>) => {
    try {
      const { data, error } = await supabase
        .from('fertility_tracking')
        .update(recordData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setRecords(prev => prev.map(record => record.id === id ? data : record));
      return data;
    } catch (error) {
      console.error('Error updating fertility record:', error);
      throw error;
    }
  };

  const deleteRecord = async (id: string) => {
    try {
      const { error } = await supabase
        .from('fertility_tracking')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setRecords(prev => prev.filter(record => record.id !== id));
    } catch (error) {
      console.error('Error deleting fertility record:', error);
      throw error;
    }
  };

  return {
    records,
    loading,
    addRecord,
    updateRecord,
    deleteRecord,
    fetchRecords
  };
};
