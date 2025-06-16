
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface MedicalRecord {
  id: string;
  user_id: string;
  record_type: 'diagnosis' | 'prescription' | 'lab_result' | 'imaging' | 'vaccination' | 'allergy' | 'surgery' | 'consultation';
  title: string;
  description?: string;
  doctor_name?: string;
  clinic_name?: string;
  record_date: string;
  attachments?: any[];
  metadata?: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useMedicalRecords = () => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecords = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('medical_records')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('record_date', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedRecords: MedicalRecord[] = (data || []).map(record => ({
        ...record,
        record_type: record.record_type as MedicalRecord['record_type'],
        attachments: Array.isArray(record.attachments) ? record.attachments : [],
        metadata: (record.metadata as Record<string, any>) || {}
      }));
      
      setRecords(transformedRecords);
    } catch (error) {
      console.error('Ошибка при загрузке медицинских записей:', error);
      toast.error('Не удалось загрузить медицинские записи');
    } finally {
      setLoading(false);
    }
  };

  const createRecord = async (recordData: Partial<MedicalRecord>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Пользователь не авторизован');

      const { data, error } = await supabase
        .from('medical_records')
        .insert({
          user_id: user.id,
          record_type: recordData.record_type!,
          title: recordData.title!,
          description: recordData.description,
          doctor_name: recordData.doctor_name,
          clinic_name: recordData.clinic_name,
          record_date: recordData.record_date!,
          attachments: recordData.attachments || [],
          metadata: recordData.metadata || {}
        })
        .select()
        .single();

      if (error) throw error;

      // Transform the returned data to match our interface
      const transformedRecord: MedicalRecord = {
        ...data,
        record_type: data.record_type as MedicalRecord['record_type'],
        attachments: Array.isArray(data.attachments) ? data.attachments : [],
        metadata: (data.metadata as Record<string, any>) || {}
      };

      setRecords(prev => [transformedRecord, ...prev]);
      toast.success('Медицинская запись добавлена');
      return transformedRecord;
    } catch (error) {
      console.error('Ошибка при создании записи:', error);
      toast.error('Не удалось создать медицинскую запись');
      throw error;
    }
  };

  const updateRecord = async (id: string, updates: Partial<MedicalRecord>) => {
    try {
      const { data, error } = await supabase
        .from('medical_records')
        .update({
          record_type: updates.record_type,
          title: updates.title,
          description: updates.description,
          doctor_name: updates.doctor_name,
          clinic_name: updates.clinic_name,
          record_date: updates.record_date,
          attachments: updates.attachments,
          metadata: updates.metadata
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Transform the returned data to match our interface
      const transformedRecord: MedicalRecord = {
        ...data,
        record_type: data.record_type as MedicalRecord['record_type'],
        attachments: Array.isArray(data.attachments) ? data.attachments : [],
        metadata: (data.metadata as Record<string, any>) || {}
      };

      setRecords(prev => prev.map(record => 
        record.id === id ? transformedRecord : record
      ));
      toast.success('Запись обновлена');
      return transformedRecord;
    } catch (error) {
      console.error('Ошибка при обновлении записи:', error);
      toast.error('Не удалось обновить запись');
      throw error;
    }
  };

  const deleteRecord = async (id: string) => {
    try {
      const { error } = await supabase
        .from('medical_records')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;

      setRecords(prev => prev.filter(record => record.id !== id));
      toast.success('Запись удалена');
    } catch (error) {
      console.error('Ошибка при удалении записи:', error);
      toast.error('Не удалось удалить запись');
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return {
    records,
    loading,
    fetchRecords,
    createRecord,
    updateRecord,
    deleteRecord
  };
};
