
export interface MedicalFile {
  id: string;
  user_id: string;
  filename: string;
  original_filename: string;
  file_type: string;
  file_size: number;
  mime_type?: string;
  file_hash?: string;
  document_type?: string;
  organ_system?: string;
  medical_category?: string;
  examination_date?: string;
  doctor_name?: string;
  clinic_name?: string;
  storage_path: string;
  encryption_key_id?: string;
  is_encrypted: boolean;
  ocr_completed: boolean;
  ai_analysis_completed: boolean;
  processing_status: string;
  tags: string[];
  custom_tags: string[];
  description?: string;
  notes?: string;
  related_event_id?: string;
  parent_file_id?: string;
  created_at: string;
  updated_at: string;
}

export interface MedicalEvent {
  id: string;
  user_id: string;
  event_type: string;
  event_subtype?: string;
  title: string;
  description?: string;
  event_date: string;
  event_time?: string;
  duration_minutes?: number;
  clinic_name?: string;
  doctor_name?: string;
  doctor_specialty?: string;
  location?: string;
  organ_system?: string;
  icd_codes: string[];
  symptoms: string[];
  diagnosis?: string;
  treatment?: string;
  medications: Array<{
    name: string;
    dosage?: string;
    frequency?: string;
  }>;
  results: Record<string, any>;
  recommendations?: string;
  follow_up_required: boolean;
  follow_up_date?: string;
  status: string;
  priority: string;
  attached_files: string[];
  created_at: string;
  updated_at: string;
}

export interface LabResult {
  id: string;
  user_id: string;
  source_file_id?: string;
  medical_event_id?: string;
  test_date: string;
  lab_name?: string;
  test_category?: string;
  test_panel?: string;
  test_name: string;
  test_code?: string;
  result_value?: string;
  result_numeric?: number;
  unit?: string;
  reference_range?: string;
  status?: string;
  flag?: string;
  interpretation?: string;
  methodology?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DataRelationship {
  id: string;
  user_id: string;
  primary_type: string;
  primary_id: string;
  secondary_type: string;
  secondary_id: string;
  relationship_type: string;
  relationship_strength: number;
  description?: string;
  auto_detected: boolean;
  confidence_score?: number;
  created_at: string;
  created_by: string;
}

export interface FileUploadData {
  file: File;
  document_type?: string;
  organ_system?: string;
  medical_category?: string;
  examination_date?: string;
  doctor_name?: string;
  clinic_name?: string;
  description?: string;
  tags?: string[];
}
