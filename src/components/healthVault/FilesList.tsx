
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { MedicalFilesService } from '@/services/healthVault/MedicalFilesService';
import { MedicalFile } from '@/types/healthVault';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Image, 
  File, 
  Download, 
  Search, 
  Calendar,
  User,
  Building,
  Trash2,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface FilesListProps {
  refreshTrigger?: number;
}

const FilesList: React.FC<FilesListProps> = ({ refreshTrigger }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [files, setFiles] = useState<MedicalFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) {
      loadFiles();
    }
  }, [user, refreshTrigger]);

  const loadFiles = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userFiles = await MedicalFilesService.getUserFiles(user.id);
      setFiles(userFiles);
    } catch (error) {
      console.error('Error loading files:', error);
      toast({
        title: 'Ошибка загрузки',
        description: 'Не удалось загрузить список файлов',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!user || !searchQuery.trim()) {
      loadFiles();
      return;
    }

    try {
      setLoading(true);
      const searchResults = await MedicalFilesService.searchFiles(user.id, searchQuery);
      setFiles(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: 'Ошибка поиска',
        description: 'Не удалось выполнить поиск',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (file: MedicalFile) => {
    try {
      const url = await MedicalFilesService.getFileUrl(file.storage_path);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.original_filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: 'Ошибка скачивания',
        description: 'Не удалось скачать файл',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (file: MedicalFile) => {
    if (!confirm('Вы уверены, что хотите удалить этот файл?')) return;

    try {
      await MedicalFilesService.deleteFile(file.id);
      toast({
        title: 'Файл удален',
        description: 'Документ успешно удален из хранилища',
      });
      loadFiles();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: 'Ошибка удаления',
        description: 'Не удалось удалить файл',
        variant: 'destructive',
      });
    }
  };

  const getFileIcon = (file: MedicalFile) => {
    if (file.mime_type?.startsWith('image/')) return <Image className="h-5 w-5" />;
    if (file.mime_type?.includes('pdf')) return <FileText className="h-5 w-5" />;
    return <File className="h-5 w-5" />;
  };

  const getDocumentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'lab_results': 'Анализы',
      'imaging': 'Снимки',
      'prescription': 'Рецепт',
      'discharge_summary': 'Выписка',
      'consultation_notes': 'Консультация',
      'vaccination_record': 'Прививки',
      'insurance_document': 'Страховка',
      'other': 'Другое'
    };
    return labels[type] || type;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploaded': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Загрузка файлов...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Мои медицинские документы</CardTitle>
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="Поиск документов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch} variant="outline">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {files.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchQuery ? 'По вашему запросу ничего не найдено' : 'У вас пока нет загруженных документов'}
          </div>
        ) : (
          <div className="space-y-4">
            {files.map((file) => (
              <div key={file.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getFileIcon(file)}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{file.original_filename}</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {file.document_type && (
                          <Badge variant="secondary" className="text-xs">
                            {getDocumentTypeLabel(file.document_type)}
                          </Badge>
                        )}
                        <Badge className={`text-xs ${getStatusColor(file.processing_status)}`}>
                          {file.processing_status === 'uploaded' && 'Загружен'}
                          {file.processing_status === 'processing' && 'Обработка'}
                          {file.processing_status === 'completed' && 'Готов'}
                          {file.processing_status === 'error' && 'Ошибка'}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                        {file.examination_date && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(file.examination_date), 'dd.MM.yyyy', { locale: ru })}
                          </div>
                        )}
                        {file.doctor_name && (
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {file.doctor_name}
                          </div>
                        )}
                        {file.clinic_name && (
                          <div className="flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            {file.clinic_name}
                          </div>
                        )}
                      </div>
                      {file.description && (
                        <p className="text-sm text-gray-600 mt-2">{file.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownload(file)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(file)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FilesList;
