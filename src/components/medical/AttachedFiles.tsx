
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Image, FileIcon, Download, Trash2, ExternalLink } from 'lucide-react';

interface AttachedFile {
  name: string;
  url: string;
  size: number;
  type: string;
}

interface AttachedFilesProps {
  files: AttachedFile[];
  onDeleteFile?: (fileUrl: string) => void;
  canDelete?: boolean;
}

const AttachedFiles: React.FC<AttachedFilesProps> = ({
  files,
  onDeleteFile,
  canDelete = false
}) => {
  if (!files || files.length === 0) {
    return null;
  }

  const getFileIcon = (fileName: string, fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <Image className="w-4 h-4 text-blue-600" />;
    } else if (fileType === 'application/pdf' || fileName.toLowerCase().endsWith('.pdf')) {
      return <FileText className="w-4 h-4 text-red-600" />;
    }
    return <FileIcon className="w-4 h-4 text-gray-600" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = (file: AttachedFile) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = (file: AttachedFile) => {
    window.open(file.url, '_blank');
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">
          Прикрепленные файлы ({files.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {getFileIcon(file.name, file.type)}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleView(file)}
                  className="text-gray-600 hover:text-blue-600 p-1"
                  title="Просмотреть"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDownload(file)}
                  className="text-gray-600 hover:text-green-600 p-1"
                  title="Скачать"
                >
                  <Download className="w-4 h-4" />
                </Button>
                
                {canDelete && onDeleteFile && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDeleteFile(file.url)}
                    className="text-gray-600 hover:text-red-600 p-1"
                    title="Удалить"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AttachedFiles;
