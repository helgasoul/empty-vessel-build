
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
  file_attachments?: Array<{
    name: string;
    url: string;
    size: number;
    type: string;
  }>;
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
        file_attachments: Array.isArray(record.file_attachments) ? record.file_attachments : [],
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

  const uploadFile = async (file: File, recordId?: string): Promise<string> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Пользователь не авторизован');

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('medical-records')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('medical-records')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Ошибка при загрузке файла:', error);
      toast.error('Не удалось загрузить файл');
      throw error;
    }
  };

  const createRecord = async (recordData: Partial<MedicalRecord>, files?: File[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Пользователь не авторизован');

      let fileAttachments: Array<{
        name: string;
        url: string;
        size: number;
        type: string;
      }> = [];

      // Upload files if provided
      if (files && files.length > 0) {
        for (const file of files) {
          try {
            const url = await uploadFile(file);
            fileAttachments.push({
              name: file.name,
              url,
              size: file.size,
              type: file.type
            });
          } catch (error) {
            console.error(`Ошибка при загрузке файла ${file.name}:`, error);
          }
        }
      }

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
          file_attachments: fileAttachments,
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
        file_attachments: Array.isArray(data.file_attachments) ? data.file_attachments : [],
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

  const updateRecord = async (id: string, updates: Partial<MedicalRecord>, newFiles?: File[]) => {
    try {
      let fileAttachments = updates.file_attachments || [];

      // Upload new files if provided
      if (newFiles && newFiles.length > 0) {
        for (const file of newFiles) {
          try {
            const url = await uploadFile(file, id);
            fileAttachments.push({
              name: file.name,
              url,
              size: file.size,
              type: file.type
            });
          } catch (error) {
            console.error(`Ошибка при загрузке файла ${file.name}:`, error);
          }
        }
      }

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
          file_attachments: fileAttachments,
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
        file_attachments: Array.isArray(data.file_attachments) ? data.file_attachments : [],
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

  const deleteFile = async (recordId: string, fileUrl: string) => {
    try {
      const record = records.find(r => r.id === recordId);
      if (!record) return;

      const updatedFiles = record.file_attachments?.filter(file => file.url !== fileUrl) || [];
      
      await updateRecord(recordId, { 
        ...record, 
        file_attachments: updatedFiles 
      });

      // Extract file path from URL and delete from storage
      const urlParts = fileUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const filePath = `${user.id}/${fileName}`;
        await supabase.storage
          .from('medical-records')
          .remove([filePath]);
      }

      toast.success('Файл удален');
    } catch (error) {
      console.error('Ошибка при удалении файла:', error);
      toast.error('Не удалось удалить файл');
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
    deleteRecord,
    uploadFile,
    deleteFile
  };
};
