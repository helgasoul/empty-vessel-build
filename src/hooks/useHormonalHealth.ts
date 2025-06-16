
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface HormonalHealthRecord {
  id: string;
  user_id: string;
  tracking_date: string;
  hormone_type: 'estrogen' | 'progesterone' | 'lh' | 'fsh' | 'testosterone' | 'cortisol' | 'thyroid';
  level_value?: number;
  level_unit?: string;
  test_type?: 'blood' | 'saliva' | 'urine' | 'home_test';
  lab_name?: string;
  reference_range_min?: number;
  reference_range_max?: number;
  is_within_range?: boolean;
  symptoms?: string[];
  prescribed_by?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const useHormonalHealth = () => {
  const [records, setRecords] = useState<HormonalHealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchRecords = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('hormonal_health_tracking')
        .select('*')
        .eq('user_id', user.id)
        .order('tracking_date', { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error('Error fetching hormonal health records:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [user]);

  const addRecord = async (recordData: Omit<HormonalHealthRecord, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('hormonal_health_tracking')
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
      console.error('Error adding hormonal health record:', error);
      throw error;
    }
  };

  const updateRecord = async (id: string, recordData: Partial<HormonalHealthRecord>) => {
    try {
      const { data, error } = await supabase
        .from('hormonal_health_tracking')
        .update(recordData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setRecords(prev => prev.map(record => record.id === id ? data : record));
      return data;
    } catch (error) {
      console.error('Error updating hormonal health record:', error);
      throw error;
    }
  };

  const deleteRecord = async (id: string) => {
    try {
      const { error } = await supabase
        .from('hormonal_health_tracking')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setRecords(prev => prev.filter(record => record.id !== id));
    } catch (error) {
      console.error('Error deleting hormonal health record:', error);
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
