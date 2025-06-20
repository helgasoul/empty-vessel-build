
import React from 'react';
import SecureFileUpload from '@/components/security/SecureFileUpload';

interface FileUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  maxSizeBytes?: number;
  acceptedFileTypes?: string[];
}

const FileUpload: React.FC<FileUploadProps> = (props) => {
  return <SecureFileUpload {...props} />;
};

export default FileUpload;
