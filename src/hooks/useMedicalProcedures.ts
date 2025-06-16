
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface MedicalProcedure {
  id: string;
  user_id: string;
  procedure_name: string;
  procedure_type: string;
  scheduled_date: string;
  scheduled_time?: string;
  duration_minutes?: number;
  doctor_name?: string;
  clinic_name?: string;
  location?: string;
  preparation_instructions?: string;
  notes?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  reminder_sent: boolean;
  is_recurring: boolean;
  recurrence_pattern?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export const useMedicalProcedures = () => {
  const [procedures, setProcedures] = useState<MedicalProcedure[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProcedures = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('medical_procedures')
        .select('*')
        .eq('user_id', user.id)
        .order('scheduled_date', { ascending: true });

      if (error) throw error;
      
      const transformedProcedures: MedicalProcedure[] = (data || []).map(procedure => ({
        ...procedure,
        status: procedure.status as MedicalProcedure['status'],
        recurrence_pattern: procedure.recurrence_pattern as Record<string, any>
      }));
      
      setProcedures(transformedProcedures);
    } catch (error) {
      console.error('Ошибка при загрузке процедур:', error);
      toast.error('Не удалось загрузить медицинские процедуры');
    } finally {
      setLoading(false);
    }
  };

  const createProcedure = async (procedureData: Omit<MedicalProcedure, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Пользователь не авторизован');

      const { data, error } = await supabase
        .from('medical_procedures')
        .insert({
          user_id: user.id,
          ...procedureData
        })
        .select()
        .single();

      if (error) throw error;

      const transformedProcedure: MedicalProcedure = {
        ...data,
        status: data.status as MedicalProcedure['status'],
        recurrence_pattern: data.recurrence_pattern as Record<string, any>
      };

      setProcedures(prev => [transformedProcedure, ...prev]);
      toast.success('Процедура запланирована');
      return transformedProcedure;
    } catch (error) {
      console.error('Ошибка при создании процедуры:', error);
      toast.error('Не удалось запланировать процедуру');
      throw error;
    }
  };

  const updateProcedure = async (id: string, updates: Partial<MedicalProcedure>) => {
    try {
      const { data, error } = await supabase
        .from('medical_procedures')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const transformedProcedure: MedicalProcedure = {
        ...data,
        status: data.status as MedicalProcedure['status'],
        recurrence_pattern: data.recurrence_pattern as Record<string, any>
      };

      setProcedures(prev => prev.map(procedure => 
        procedure.id === id ? transformedProcedure : procedure
      ));
      toast.success('Процедура обновлена');
      return transformedProcedure;
    } catch (error) {
      console.error('Ошибка при обновлении процедуры:', error);
      toast.error('Не удалось обновить процедуру');
      throw error;
    }
  };

  const deleteProcedure = async (id: string) => {
    try {
      const { error } = await supabase
        .from('medical_procedures')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProcedures(prev => prev.filter(procedure => procedure.id !== id));
      toast.success('Процедура удалена');
    } catch (error) {
      console.error('Ошибка при удалении процедуры:', error);
      toast.error('Не удалось удалить процедуру');
    }
  };

  useEffect(() => {
    fetchProcedures();
  }, []);

  return {
    procedures,
    loading,
    createProcedure,
    updateProcedure,
    deleteProcedure,
    refetch: fetchProcedures
  };
};
