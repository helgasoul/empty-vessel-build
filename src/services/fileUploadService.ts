
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { FileAttachment } from '@/types/medicalRecords';

export class FileUploadService {
  static async uploadFile(file: File, recordId?: string): Promise<string> {
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
  }

  static async uploadMultipleFiles(files: File[], recordId?: string): Promise<FileAttachment[]> {
    const fileAttachments: FileAttachment[] = [];

    for (const file of files) {
      try {
        const url = await this.uploadFile(file, recordId);
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

    return fileAttachments;
  }

  static async deleteFile(fileUrl: string): Promise<void> {
    try {
      const urlParts = fileUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const filePath = `${user.id}/${fileName}`;
        await supabase.storage
          .from('medical-records')
          .remove([filePath]);
      }
    } catch (error) {
      console.error('Ошибка при удалении файла из хранилища:', error);
    }
  }
}
