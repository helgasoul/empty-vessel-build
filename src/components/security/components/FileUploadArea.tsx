
import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, AlertTriangle } from 'lucide-react';
import { formatFileSize } from '../utils/fileUtils';

interface FileUploadAreaProps {
  onDrop: (acceptedFiles: File[], rejectedFiles: any[]) => void;
  maxFiles: number;
  maxSizeBytes: number;
  acceptedFileTypes: string[];
  currentFileCount: number;
}

const FileUploadArea: React.FC<FileUploadAreaProps> = ({
  onDrop,
  maxFiles,
  maxSizeBytes,
  acceptedFileTypes,
  currentFileCount
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: maxFiles - currentFileCount,
    maxSize: maxSizeBytes,
    accept: acceptedFileTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>)
  });

  if (currentFileCount >= maxFiles) {
    return null;
  }

  return (
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
  );
};

export default FileUploadArea;
