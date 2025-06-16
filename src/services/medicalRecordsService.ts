
import { supabase } from '@/integrations/supabase/client';
import type { MedicalRecord, FileAttachment } from '@/types/medicalRecords';

export class MedicalRecordsService {
  static async fetchRecords(): Promise<MedicalRecord[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('medical_records')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('record_date', { ascending: false });

    if (error) throw error;
    
    return (data || []).map(record => ({
      ...record,
      record_type: record.record_type as MedicalRecord['record_type'],
      attachments: Array.isArray(record.attachments) ? record.attachments : [],
      file_attachments: Array.isArray(record.file_attachments) 
        ? (record.file_attachments as unknown as FileAttachment[])
        : [],
      metadata: (record.metadata as Record<string, any>) || {}
    }));
  }

  static async createRecord(
    recordData: Partial<MedicalRecord>, 
    fileAttachments: FileAttachment[]
  ): Promise<MedicalRecord> {
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
        file_attachments: fileAttachments as any,
        metadata: recordData.metadata || {}
      })
      .select()
      .single();

    if (error) throw error;

    return {
      ...data,
      record_type: data.record_type as MedicalRecord['record_type'],
      attachments: Array.isArray(data.attachments) ? data.attachments : [],
      file_attachments: Array.isArray(data.file_attachments) 
        ? (data.file_attachments as unknown as FileAttachment[])
        : [],
      metadata: (data.metadata as Record<string, any>) || {}
    };
  }

  static async updateRecord(
    id: string, 
    updates: Partial<MedicalRecord>, 
    fileAttachments: FileAttachment[]
  ): Promise<MedicalRecord> {
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
        file_attachments: fileAttachments as any,
        metadata: updates.metadata
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      ...data,
      record_type: data.record_type as MedicalRecord['record_type'],
      attachments: Array.isArray(data.attachments) ? data.attachments : [],
      file_attachments: Array.isArray(data.file_attachments) 
        ? (data.file_attachments as unknown as FileAttachment[])
        : [],
      metadata: (data.metadata as Record<string, any>) || {}
    };
  }

  static async deleteRecord(id: string): Promise<void> {
    const { error } = await supabase
      .from('medical_records')
      .update({ is_active: false })
      .eq('id', id);

    if (error) throw error;
  }
}
