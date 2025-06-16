
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { MedicalRecordsService } from '@/services/medicalRecordsService';
import { FileUploadService } from '@/services/fileUploadService';
import type { MedicalRecord } from '@/types/medicalRecords';

export const useMedicalRecords = () => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecords = async () => {
    try {
      const fetchedRecords = await MedicalRecordsService.fetchRecords();
      setRecords(fetchedRecords);
    } catch (error) {
      console.error('Ошибка при загрузке медицинских записей:', error);
      toast.error('Не удалось загрузить медицинские записи');
    } finally {
      setLoading(false);
    }
  };

  const createRecord = async (recordData: Partial<MedicalRecord>, files?: File[]) => {
    try {
      let fileAttachments = [];

      if (files && files.length > 0) {
        fileAttachments = await FileUploadService.uploadMultipleFiles(files);
      }

      const newRecord = await MedicalRecordsService.createRecord(recordData, fileAttachments);
      setRecords(prev => [newRecord, ...prev]);
      toast.success('Медицинская запись добавлена');
      return newRecord;
    } catch (error) {
      console.error('Ошибка при создании записи:', error);
      toast.error('Не удалось создать медицинскую запись');
      throw error;
    }
  };

  const updateRecord = async (id: string, updates: Partial<MedicalRecord>, newFiles?: File[]) => {
    try {
      let fileAttachments = updates.file_attachments || [];

      if (newFiles && newFiles.length > 0) {
        const newFileAttachments = await FileUploadService.uploadMultipleFiles(newFiles, id);
        fileAttachments = [...fileAttachments, ...newFileAttachments];
      }

      const updatedRecord = await MedicalRecordsService.updateRecord(id, updates, fileAttachments);
      setRecords(prev => prev.map(record => 
        record.id === id ? updatedRecord : record
      ));
      toast.success('Запись обновлена');
      return updatedRecord;
    } catch (error) {
      console.error('Ошибка при обновлении записи:', error);
      toast.error('Не удалось обновить запись');
      throw error;
    }
  };

  const deleteRecord = async (id: string) => {
    try {
      await MedicalRecordsService.deleteRecord(id);
      setRecords(prev => prev.filter(record => record.id !== id));
      toast.success('Запись удалена');
    } catch (error) {
      console.error('Ошибка при удалении записи:', error);
      toast.error('Не удалось удалить запись');
    }
  };

  const deleteFile = async (recordId: string, fileUrl: string) => {
    try {
      const record = records.find(r => r.id === recordId);
      if (!record) return;

      const updatedFiles = record.file_attachments?.filter(file => file.url !== fileUrl) || [];
      
      await updateRecord(recordId, { 
        ...record, 
        file_attachments: updatedFiles 
      });

      await FileUploadService.deleteFile(fileUrl);
      toast.success('Файл удален');
    } catch (error) {
      console.error('Ошибка при удалении файла:', error);
      toast.error('Не удалось удалить файл');
    }
  };

  const uploadFile = async (file: File, recordId?: string): Promise<string> => {
    return FileUploadService.uploadFile(file, recordId);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return {
    records,
    loading,
    fetchRecords,
    createRecord,
    updateRecord,
    deleteRecord,
    uploadFile,
    deleteFile
  };
};
