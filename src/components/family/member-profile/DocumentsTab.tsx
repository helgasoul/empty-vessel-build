
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, Download, Trash2, Plus, Image, File } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import FileUpload from "../../medical/FileUpload";

interface FamilyMemberDocument {
  id: string;
  family_member_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  document_type: string;
  title?: string;
  description?: string;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
}

interface DocumentsTabProps {
  memberId: string;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ memberId }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<FamilyMemberDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [documentType, setDocumentType] = useState('medical');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    loadDocuments();
  }, [memberId]);

  const loadDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('family_member_documents')
        .select('*')
        .eq('family_member_id', memberId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить документы",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadFiles = async () => {
    if (!user || files.length === 0) return;

    setUploading(true);
    try {
      for (const file of files) {
        // Upload file to storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${user.id}/${memberId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('family-documents')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Save document record to database
        const { error: dbError } = await supabase
          .from('family_member_documents')
          .insert({
            family_member_id: memberId,
            file_name: file.name,
            file_path: filePath,
            file_type: file.type,
            file_size: file.size,
            document_type: documentType,
            title: title || file.name,
            description,
            uploaded_by: user.id
          });

        if (dbError) throw dbError;
      }

      toast({
        title: "Успешно",
        description: "Документы загружены"
      });

      // Reset form
      setFiles([]);
      setTitle('');
      setDescription('');
      loadDocuments();
    } catch (error) {
      console.error('Error uploading documents:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить документы",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const downloadFile = async (document: FamilyMemberDocument) => {
    try {
      const { data, error } = await supabase.storage
        .from('family-documents')
        .download(document.file_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = document.file_name;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось скачать файл",
        variant: "destructive"
      });
    }
  };

  const deleteDocument = async (document: FamilyMemberDocument) => {
    try {
      // Delete from storage
      await supabase.storage
        .from('family-documents')
        .remove([document.file_path]);

      // Delete from database
      const { error } = await supabase
        .from('family_member_documents')
        .delete()
        .eq('id', document.id);

      if (error) throw error;

      toast({
        title: "Успешно",
        description: "Документ удален"
      });

      loadDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить документ",
        variant: "destructive"
      });
    }
  };

  const getDocumentIcon = (fileType: string, documentType: string) => {
    if (fileType.startsWith('image/')) {
      return <Image className="w-4 h-4" />;
    } else if (fileType === 'application/pdf') {
      return <FileText className="w-4 h-4" />;
    }
    return <File className="w-4 h-4" />;
  };

  const getDocumentTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'medical': 'bg-red-100 text-red-800',
      'photo': 'bg-blue-100 text-blue-800',
      'certificate': 'bg-green-100 text-green-800',
      'other': 'bg-gray-100 text-gray-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка документов...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="w-5 h-5 text-blue-600" />
            <span>Загрузить документы</span>
          </CardTitle>
          <CardDescription>
            Загружайте медицинские документы, фотографии и другие файлы
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="document_type">Тип документа</Label>
              <select
                id="document_type"
                className="w-full p-2 border rounded"
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
              >
                <option value="medical">Медицинский документ</option>
                <option value="photo">Фотография</option>
                <option value="certificate">Справка/Сертификат</option>
                <option value="other">Другое</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Название (необязательно)</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Название документа"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание (необязательно)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Описание документа"
              rows={3}
            />
          </div>

          <FileUpload
            files={files}
            onFilesChange={setFiles}
            maxFiles={5}
            acceptedFileTypes={['image/*', 'application/pdf']}
          />

          {files.length > 0 && (
            <Button 
              onClick={uploadFiles} 
              disabled={uploading}
              className="w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? 'Загружается...' : 'Загрузить документы'}
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-green-600" />
            <span>Загруженные документы</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Нет документов
              </h3>
              <p className="text-gray-600">
                Загрузите первый документ для этого члена семьи
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((document) => (
                <div
                  key={document.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    {getDocumentIcon(document.file_type, document.document_type)}
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-medium truncate">
                        {document.title || document.file_name}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getDocumentTypeColor(document.document_type)}>
                          {document.document_type === 'medical' && 'Медицинский'}
                          {document.document_type === 'photo' && 'Фотография'}
                          {document.document_type === 'certificate' && 'Справка'}
                          {document.document_type === 'other' && 'Другое'}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {formatFileSize(document.file_size)}
                        </span>
                      </div>
                      {document.description && (
                        <p className="text-xs text-gray-600 mt-1">
                          {document.description}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadFile(document)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteDocument(document)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentsTab;
