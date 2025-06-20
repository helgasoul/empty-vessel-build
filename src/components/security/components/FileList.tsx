
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, FileText, Image, FileIcon } from 'lucide-react';
import { formatFileSize, getFileIcon } from '../utils/fileUtils';

interface FileListProps {
  files: File[];
  onRemoveFile: (index: number) => void;
}

const FileList: React.FC<FileListProps> = ({ files, onRemoveFile }) => {
  if (files.length === 0) {
    return null;
  }

  const renderFileIcon = (fileName: string) => {
    const { isImage, isPdf } = getFileIcon(fileName);
    
    if (isImage) {
      return <Image className="w-4 h-4" />;
    } else if (isPdf) {
      return <FileText className="w-4 h-4" />;
    }
    return <FileIcon className="w-4 h-4" />;
  };

  return (
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
                {renderFileIcon(file.name)}
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
                onClick={() => onRemoveFile(index)}
                className="text-gray-500 hover:text-red-500 p-1"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FileList;
