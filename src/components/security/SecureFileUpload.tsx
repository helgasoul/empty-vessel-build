
import React from 'react';
import { useSecureFileUpload } from './hooks/useSecureFileUpload';
import FileUploadArea from './components/FileUploadArea';
import FileList from './components/FileList';

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
  const { handleFilesAdded, removeFile } = useSecureFileUpload({
    files,
    onFilesChange,
    maxFiles,
    maxSizeBytes,
    allowedMimeTypes
  });

  return (
    <div className="space-y-4">
      <FileUploadArea
        onDrop={handleFilesAdded}
        maxFiles={maxFiles}
        maxSizeBytes={maxSizeBytes}
        acceptedFileTypes={acceptedFileTypes}
        currentFileCount={files.length}
      />
      
      <FileList
        files={files}
        onRemoveFile={removeFile}
      />
    </div>
  );
};

export default SecureFileUpload;
