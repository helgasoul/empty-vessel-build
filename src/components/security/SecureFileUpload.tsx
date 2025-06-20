
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, FileText, Image, FileIcon, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useSecurityContext } from './SecurityProvider';

interface SecureFileUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  maxSizeBytes?: number;
  acceptedFileTypes?: string[];
  allowedMimeTypes?: string[];
}

const SecureFileUpload: React.FC<SecureFileUploadProps> = ({
  files,
  onFilesChange,
  maxFiles = 5,
  maxSizeBytes = 50 * 1024 * 1024, // 50MB
  acceptedFileTypes = ['image/*', 'application/pdf', '.doc', '.docx', '.txt'],
  allowedMimeTypes = [
    'image/jpeg',
    'image/png', 
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ]
}) => {
  const { validateFile, logSecurityEvent, checkRateLimit } = useSecurityContext();

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: maxFiles - files.length,
    maxSize: maxSizeBytes,
    accept: acceptedFileTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>)
  });

  const removeFile = (index: number) => {
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
  };

  const isFileNameSafe = (fileName: string): boolean => {
    // Check for dangerous characters and patterns
    const dangerousPatterns = [
      /[<>:"|?*]/,  // Windows forbidden characters
      /\.\./,       // Directory traversal
      /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i, // Windows reserved names
      /^\./,        // Hidden files
      /\s+$/        // Trailing whitespace
    ];
    
    return !dangerousPatterns.some(pattern => pattern.test(fileName));
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension || '')) {
      return <Image className="w-4 h-4" />;
    } else if (['pdf'].includes(extension || '')) {
      return <FileText className="w-4 h-4" />;
    }
    return <FileIcon className="w-4 h-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {files.length < maxFiles && (
        <Card>
          <CardContent className="p-6">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
              {isDragActive ? (
                <p className="text-blue-600">Drop files here...</p>
              ) : (
                <div>
                  <p className="text-gray-600 mb-2">
                    Drag & drop files here, or click to select
                  </p>
                  <p className="text-sm text-gray-500">
                    Max {maxFiles} files, up to {formatFileSize(maxSizeBytes)} each
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Supported: Images, PDF, DOC, DOCX, TXT
                  </p>
                  <div className="flex items-center justify-center mt-2 text-xs text-amber-600">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    <span>Files are scanned for security</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {files.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="text-sm font-medium mb-3">Uploaded Files ({files.length}):</h4>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    {getFileIcon(file.name)}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFile(index)}
                    className="text-gray-500 hover:text-red-500 p-1"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SecureFileUpload;
