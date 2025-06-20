
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { SecurityService } from './securityService';
import type { FileAttachment } from '@/types/medicalRecords';

export class FileUploadService {
  private static readonly ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/png', 
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];

  private static readonly MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

  static async uploadFile(file: File, recordId?: string): Promise<string> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Security validation
      if (!SecurityService.validateFile(file, this.ALLOWED_MIME_TYPES, this.MAX_FILE_SIZE)) {
        throw new Error('File failed security validation');
      }

      // Rate limiting check
      if (!SecurityService.checkRateLimit('file_upload', 10, 15)) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }

      // Log upload attempt
      SecurityService.logSecurityEvent({
        actionType: 'file_upload_started',
        resourceType: 'file',
        details: { 
          fileName: file.name, 
          fileSize: file.size, 
          fileType: file.type,
          recordId 
        },
        severity: 'low'
      });

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('medical-records')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        SecurityService.logSecurityEvent({
          actionType: 'file_upload_failed',
          resourceType: 'file',
          details: { 
            fileName: file.name,
            error: uploadError.message 
          },
          severity: 'medium'
        });
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('medical-records')
        .getPublicUrl(filePath);

      // Log successful upload
      SecurityService.logSecurityEvent({
        actionType: 'file_upload_completed',
        resourceType: 'file',
        details: { 
          fileName: file.name,
          filePath,
          recordId 
        },
        severity: 'low'
      });

      return publicUrl;
    } catch (error) {
      console.error('File upload error:', error);
      toast.error('Failed to upload file');
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
        console.error(`Error uploading file ${file.name}:`, error);
        SecurityService.logSecurityEvent({
          actionType: 'file_upload_error',
          resourceType: 'file',
          details: { 
            fileName: file.name,
            error: error instanceof Error ? error.message : 'Unknown error' 
          },
          severity: 'medium'
        });
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
        
        const { error } = await supabase.storage
          .from('medical-records')
          .remove([filePath]);

        if (error) {
          SecurityService.logSecurityEvent({
            actionType: 'file_delete_failed',
            resourceType: 'file',
            details: { filePath, error: error.message },
            severity: 'medium'
          });
          throw error;
        }

        SecurityService.logSecurityEvent({
          actionType: 'file_deleted',
          resourceType: 'file',
          details: { filePath },
          severity: 'low'
        });
      }
    } catch (error) {
      console.error('Error deleting file from storage:', error);
      throw error;
    }
  }
}
