
export interface FileAttachment {
  name: string;
  url: string;
  size: number;
  type: string;
}

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
  file_attachments?: FileAttachment[];
  metadata?: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
