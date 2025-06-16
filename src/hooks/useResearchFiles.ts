
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface ResearchFile {
  id: string;
  user_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  title: string;
  description?: string;
  research_type: 'genetic' | 'blood_test' | 'imaging' | 'clinical_study' | 'other';
  research_date: string;
  lab_name?: string;
  doctor_name?: string;
  tags: string[];
  is_shared: boolean;
  created_at: string;
  updated_at: string;
}

export const useResearchFiles = () => {
  const [files, setFiles] = useState<ResearchFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();

  const fetchFiles = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('research_files')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFiles(data || []);
    } catch (error) {
      console.error('Error fetching research files:', error);
      toast.error('Не удалось загрузить файлы исследований');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [user]);

  const uploadFile = async (
    file: File, 
    metadata: {
      title: string;
      description?: string;
      research_type: ResearchFile['research_type'];
      research_date: string;
      lab_name?: string;
      doctor_name?: string;
      tags: string[];
    }
  ) => {
    if (!user) {
      toast.error('Необходимо войти в систему');
      return;
    }

    if (!file.type.includes('pdf')) {
      toast.error('Поддерживаются только PDF файлы');
      return;
    }

    setUploading(true);
    try {
      // Создаем уникальное имя файла
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Загружаем файл в Storage
      const { error: uploadError } = await supabase.storage
        .from('research-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Сохраняем метаданные в базу данных
      const { data, error: dbError } = await supabase
        .from('research_files')
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          file_type: file.type,
          title: metadata.title,
          description: metadata.description,
          research_type: metadata.research_type,
          research_date: metadata.research_date,
          lab_name: metadata.lab_name,
          doctor_name: metadata.doctor_name,
          tags: metadata.tags,
          is_shared: false
        })
        .select()
        .single();

      if (dbError) throw dbError;

      setFiles(prev => [data, ...prev]);
      toast.success('Файл успешно загружен');
      return data;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Ошибка при загрузке файла');
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (fileId: string) => {
    try {
      const fileToDelete = files.find(f => f.id === fileId);
      if (!fileToDelete) return;

      // Удаляем файл из Storage
      const { error: storageError } = await supabase.storage
        .from('research-files')
        .remove([fileToDelete.file_path]);

      if (storageError) throw storageError;

      // Удаляем запись из базы данных
      const { error: dbError } = await supabase
        .from('research_files')
        .delete()
        .eq('id', fileId);

      if (dbError) throw dbError;

      setFiles(prev => prev.filter(f => f.id !== fileId));
      toast.success('Файл удален');
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Ошибка при удалении файла');
    }
  };

  const getFileUrl = async (filePath: string) => {
    try {
      const { data } = await supabase.storage
        .from('research-files')
        .createSignedUrl(filePath, 3600); // URL действителен 1 час

      return data?.signedUrl;
    } catch (error) {
      console.error('Error getting file URL:', error);
      return null;
    }
  };

  const updateFile = async (fileId: string, updates: Partial<ResearchFile>) => {
    try {
      const { data, error } = await supabase
        .from('research_files')
        .update(updates)
        .eq('id', fileId)
        .select()
        .single();

      if (error) throw error;

      setFiles(prev => prev.map(f => f.id === fileId ? data : f));
      toast.success('Файл обновлен');
      return data;
    } catch (error) {
      console.error('Error updating file:', error);
      toast.error('Ошибка при обновлении файла');
      throw error;
    }
  };

  return {
    files,
    loading,
    uploading,
    uploadFile,
    deleteFile,
    getFileUrl,
    updateFile,
    fetchFiles
  };
};
