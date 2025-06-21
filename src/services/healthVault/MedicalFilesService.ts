
import { supabase } from '@/integrations/supabase/client';
import { MedicalFile, FileUploadData } from '@/types/healthVault';

export class MedicalFilesService {
  static async uploadFile(uploadData: FileUploadData): Promise<MedicalFile> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { file, ...metadata } = uploadData;
    
    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const timestamp = Date.now();
    const uniqueFilename = `${timestamp}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
    const filePath = `medical-files/${user.id}/${uniqueFilename}`;
    
    // Upload file to storage
    const { data: storageData, error: storageError } = await supabase.storage
      .from('medical-records')
      .upload(filePath, file);
      
    if (storageError) {
      throw new Error(`Ошибка загрузки файла: ${storageError.message}`);
    }
    
    // Create database record with user_id
    const dataToInsert = {
      user_id: user.id,
      filename: uniqueFilename,
      original_filename: file.name,
      file_type: fileExtension || 'unknown',
      file_size: file.size,
      mime_type: file.type,
      storage_path: filePath,
      document_type: metadata.document_type,
      organ_system: metadata.organ_system,
      medical_category: metadata.medical_category,
      examination_date: metadata.examination_date,
      doctor_name: metadata.doctor_name,
      clinic_name: metadata.clinic_name,
      description: metadata.description,
      tags: JSON.stringify(metadata.tags || []),
      custom_tags: JSON.stringify([]),
      is_encrypted: true,
      ocr_completed: false,
      ai_analysis_completed: false,
      processing_status: 'uploaded'
    };

    const { data, error } = await supabase
      .from('medical_files')
      .insert(dataToInsert)
      .select()
      .single();
      
    if (error) {
      // Clean up uploaded file if database insert fails
      await supabase.storage.from('medical-records').remove([filePath]);
      throw new Error(`Ошибка сохранения данных файла: ${error.message}`);
    }
    
    // Convert JSON strings back to arrays
    return this.transformMedicalFileFromDb(data);
  }
  
  static async getUserFiles(userId: string): Promise<MedicalFile[]> {
    const { data, error } = await supabase
      .from('medical_files')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      throw new Error(`Ошибка получения файлов: ${error.message}`);
    }
    
    // Convert JSON strings back to arrays
    return (data || []).map(file => this.transformMedicalFileFromDb(file));
  }
  
  static async getFileById(fileId: string): Promise<MedicalFile | null> {
    const { data, error } = await supabase
      .from('medical_files')
      .select('*')
      .eq('id', fileId)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') return null; // No rows returned
      throw new Error(`Ошибка получения файла: ${error.message}`);
    }
    
    // Convert JSON strings back to arrays
    return this.transformMedicalFileFromDb(data);
  }
  
  static async getFileUrl(filePath: string): Promise<string> {
    const { data } = await supabase.storage
      .from('medical-records')
      .createSignedUrl(filePath, 3600); // 1 hour expiry
      
    if (!data?.signedUrl) {
      throw new Error('Не удалось получить URL файла');
    }
    
    return data.signedUrl;
  }
  
  static async updateFileMetadata(fileId: string, updates: Partial<MedicalFile>): Promise<MedicalFile> {
    // Convert arrays to JSON strings if they exist in updates
    const updatesWithJson = {
      ...updates,
      ...(updates.tags && { tags: JSON.stringify(updates.tags) }),
      ...(updates.custom_tags && { custom_tags: JSON.stringify(updates.custom_tags) })
    };

    const { data, error } = await supabase
      .from('medical_files')
      .update(updatesWithJson)
      .eq('id', fileId)
      .select()
      .single();
      
    if (error) {
      throw new Error(`Ошибка обновления файла: ${error.message}`);
    }
    
    // Convert JSON strings back to arrays
    return this.transformMedicalFileFromDb(data);
  }
  
  static async deleteFile(fileId: string): Promise<void> {
    // First get file info to delete from storage
    const file = await this.getFileById(fileId);
    if (!file) {
      throw new Error('Файл не найден');
    }
    
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('medical-records')
      .remove([file.storage_path]);
      
    if (storageError) {
      console.warn(`Предупреждение: не удалось удалить файл из хранилища: ${storageError.message}`);
    }
    
    // Delete from database
    const { error } = await supabase
      .from('medical_files')
      .delete()
      .eq('id', fileId);
      
    if (error) {
      throw new Error(`Ошибка удаления файла: ${error.message}`);
    }
  }
  
  static async searchFiles(userId: string, query: string): Promise<MedicalFile[]> {
    const { data, error } = await supabase
      .from('medical_files')
      .select('*')
      .eq('user_id', userId)
      .or(`original_filename.ilike.%${query}%,description.ilike.%${query}%,doctor_name.ilike.%${query}%,clinic_name.ilike.%${query}%`)
      .order('created_at', { ascending: false });
      
    if (error) {
      throw new Error(`Ошибка поиска файлов: ${error.message}`);
    }
    
    // Convert JSON strings back to arrays
    return (data || []).map(file => this.transformMedicalFileFromDb(file));
  }

  private static transformMedicalFileFromDb(data: any): MedicalFile {
    return {
      ...data,
      tags: this.safeJsonParse(data.tags, []),
      custom_tags: this.safeJsonParse(data.custom_tags, [])
    };
  }

  private static safeJsonParse(value: any, defaultValue: string[] = []): string[] {
    if (Array.isArray(value)) {
      return value;
    }
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : defaultValue;
      } catch {
        return defaultValue;
      }
    }
    return defaultValue;
  }
}
