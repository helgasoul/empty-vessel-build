
import { useCallback } from 'react';
import { toast } from 'sonner';
import { useSecurityContext } from '../SecurityProvider';
import { isFileNameSafe } from '../utils/fileUtils';

interface UseSecureFileUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  maxFiles: number;
  maxSizeBytes: number;
  allowedMimeTypes: string[];
}

export const useSecureFileUpload = ({
  files,
  onFilesChange,
  maxFiles,
  maxSizeBytes,
  allowedMimeTypes
}: UseSecureFileUploadProps) => {
  const { validateFile, logSecurityEvent, checkRateLimit } = useSecurityContext();

  const handleFilesAdded = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    // Check rate limit for file uploads
    if (!checkRateLimit('file_upload', 20, 15)) { // 20 uploads per 15 minutes
      toast.error('Too many upload attempts. Please try again later.');
      return;
    }

    // Handle rejected files
    if (rejectedFiles.length > 0) {
      rejectedFiles.forEach(({ file, errors }) => {
        errors.forEach((error: any) => {
          let message = `File ${file.name} was rejected: `;
          let severity: 'low' | 'medium' | 'high' = 'low';
          
          switch (error.code) {
            case 'file-too-large':
              message += `File size exceeds ${formatFileSize(maxSizeBytes)} limit`;
              severity = 'low';
              break;
            case 'file-invalid-type':
              message += `File type not supported`;
              severity = 'medium';
              break;
            case 'too-many-files':
              message += `Maximum ${maxFiles} files allowed`;
              severity = 'low';
              break;
            default:
              message += error.message;
          }
          
          toast.error(message);
          
          logSecurityEvent({
            actionType: 'file_upload_rejected',
            resourceType: 'file',
            details: { 
              fileName: file.name, 
              fileSize: file.size, 
              fileType: file.type,
              errorCode: error.code 
            },
            severity
          });
        });
      });
    }

    // Validate accepted files with additional security checks
    const validFiles: File[] = [];
    
    for (const file of acceptedFiles) {
      if (validateFile(file, allowedMimeTypes, maxSizeBytes)) {
        // Additional security checks
        if (isFileNameSafe(file.name)) {
          validFiles.push(file);
          
          logSecurityEvent({
            actionType: 'file_upload_accepted',
            resourceType: 'file',
            details: { 
              fileName: file.name, 
              fileSize: file.size, 
              fileType: file.type 
            },
            severity: 'low'
          });
        } else {
          toast.error(`File name "${file.name}" contains invalid characters`);
        }
      } else {
        toast.error(`File "${file.name}" failed security validation`);
      }
    }

    if (validFiles.length > 0) {
      const newFiles = [...files, ...validFiles].slice(0, maxFiles);
      onFilesChange(newFiles);
      toast.success(`${validFiles.length} file(s) added successfully`);
    }
  }, [files, onFilesChange, maxFiles, maxSizeBytes, allowedMimeTypes, validateFile, logSecurityEvent, checkRateLimit]);

  const removeFile = useCallback((index: number) => {
    const removedFile = files[index];
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
    
    logSecurityEvent({
      actionType: 'file_removed',
      resourceType: 'file',
      details: { fileName: removedFile.name },
      severity: 'low'
    });
    
    toast.success('File removed');
  }, [files, onFilesChange, logSecurityEvent]);

  return {
    handleFilesAdded,
    removeFile
  };
};

// Helper function for formatting file size
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
