
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface GeneticFileInfo {
  id: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  laboratory: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
}

interface GeneticAnalysisResult {
  riskVariants: Array<{
    gene: string;
    variant: string;
    risk: number;
    description: string;
  }>;
  protectiveVariants: Array<{
    gene: string;
    variant: string;
    protection: number;
    description: string;
  }>;
  polygeneticScore: number;
  recommendations: string[];
}

interface UseGeneticDataReturn {
  uploadGeneticFile: (file: File, userId: string, laboratory: string) => Promise<string | null>;
  analyzeGeneticData: (fileId: string) => Promise<GeneticAnalysisResult | null>;
  deleteGeneticFile: (fileId: string) => Promise<boolean>;
  
  geneticFiles: GeneticFileInfo[];
  currentAnalysis: GeneticAnalysisResult | null;
  isUploading: boolean;
  isAnalyzing: boolean;
  uploadProgress: number;
  error: string | null;
  
  utils: {
    isFileSupported: (fileName: string) => boolean;
    getSupportedFormats: () => string[];
    getSupportedLaboratories: () => string[];
    formatFileSize: (bytes: number) => string;
  };
}

const SUPPORTED_FORMATS = ['.txt', '.vcf', '.23andme', '.csv', '.tsv'];
const SUPPORTED_LABORATORIES = ['genotek', 'genetico', '23andme', 'ancestrydna', 'myheritage', 'other'];

export const useGeneticData = (): UseGeneticDataReturn => {
  const { user } = useAuth();
  const [geneticFiles, setGeneticFiles] = useState<GeneticFileInfo[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<GeneticAnalysisResult | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadGeneticFile = useCallback(async (
    file: File,
    userId: string,
    laboratory: string
  ): Promise<string | null> => {
    if (!user) {
      setError('Необходимо войти в систему');
      return null;
    }

    try {
      setError(null);
      setIsUploading(true);
      setUploadProgress(0);

      // Validate file
      if (!utils.isFileSupported(file.name)) {
        throw new Error('Неподдерживаемый формат файла');
      }

      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        throw new Error('Файл слишком большой (максимум 50 МБ)');
      }

      // Create file path
      const fileExt = file.name.split('.').pop();
      const fileName = `genetic-data-${Date.now()}.${fileExt}`;
      const filePath = `genetic-data/${userId}/${fileName}`;

      setUploadProgress(20);

      // Upload file to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('medical-files')
        .upload(filePath, file, {
          onUploadProgress: (progress) => {
            setUploadProgress(20 + (progress.loaded / progress.total) * 60);
          },
        });

      if (uploadError) {
        throw new Error(`Ошибка загрузки: ${uploadError.message}`);
      }

      setUploadProgress(80);

      // Save file info to database
      const { data: fileData, error: dbError } = await supabase
        .from('genetic_files')
        .insert({
          user_id: userId,
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          laboratory: laboratory,
          status: 'uploaded',
        })
        .select()
        .single();

      if (dbError) {
        throw new Error(`Ошибка сохранения в базе данных: ${dbError.message}`);
      }

      setUploadProgress(100);

      const newFile: GeneticFileInfo = {
        id: fileData.id,
        fileName: file.name,
        fileSize: file.size,
        uploadedAt: fileData.created_at,
        laboratory: laboratory,
        status: 'completed',
      };

      setGeneticFiles(prev => [...prev, newFile]);
      
      toast.success('Генетический файл успешно загружен');
      return fileData.id;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка при загрузке';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [user]);

  const analyzeGeneticData = useCallback(async (fileId: string): Promise<GeneticAnalysisResult | null> => {
    try {
      setError(null);
      setIsAnalyzing(true);

      // In a real implementation, this would call your genetic analysis service
      // For now, we'll simulate the analysis
      await new Promise(resolve => setTimeout(resolve, 3000));

      const mockResult: GeneticAnalysisResult = {
        riskVariants: [
          {
            gene: 'BRCA1',
            variant: 'rs80357906',
            risk: 0.15,
            description: 'Повышенный риск рака молочной железы',
          },
          {
            gene: 'APOE',
            variant: 'rs429358',
            risk: 0.08,
            description: 'Умеренно повышенный риск болезни Альцгеймера',
          },
        ],
        protectiveVariants: [
          {
            gene: 'LDLR',
            variant: 'rs6511720',
            protection: 0.12,
            description: 'Сниженный риск сердечно-сосудистых заболеваний',
          },
        ],
        polygeneticScore: 0.75,
        recommendations: [
          'Рекомендуется ежегодная маммография с 40 лет',
          'Консультация генетика для планирования семьи',
          'Поддержание здорового образа жизни для снижения рисков',
        ],
      };

      setCurrentAnalysis(mockResult);
      toast.success('Анализ генетических данных завершен');
      return mockResult;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка анализа генетических данных';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const deleteGeneticFile = useCallback(async (fileId: string): Promise<boolean> => {
    try {
      setError(null);

      const { error: dbError } = await supabase
        .from('genetic_files')
        .delete()
        .eq('id', fileId);

      if (dbError) {
        throw new Error(`Ошибка удаления: ${dbError.message}`);
      }

      setGeneticFiles(prev => prev.filter(file => file.id !== fileId));
      toast.success('Генетический файл удален');
      return true;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка удаления файла';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    }
  }, []);

  const utils = {
    isFileSupported: (fileName: string): boolean => {
      const extension = '.' + fileName.split('.').pop()?.toLowerCase();
      return SUPPORTED_FORMATS.includes(extension);
    },

    getSupportedFormats: (): string[] => {
      return [...SUPPORTED_FORMATS];
    },

    getSupportedLaboratories: (): string[] => {
      return [...SUPPORTED_LABORATORIES];
    },

    formatFileSize: (bytes: number): string => {
      if (bytes === 0) return '0 Б';
      const k = 1024;
      const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
  };

  return {
    uploadGeneticFile,
    analyzeGeneticData,
    deleteGeneticFile,
    geneticFiles,
    currentAnalysis,
    isUploading,
    isAnalyzing,
    uploadProgress,
    error,
    utils,
  };
};
