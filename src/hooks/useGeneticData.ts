
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface GeneticFile {
  id: string;
  user_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  upload_date: string;
  analysis_status: 'pending' | 'processing' | 'completed' | 'failed';
  analysis_results?: any;
}

interface GeneticRisk {
  condition: string;
  risk_level: 'low' | 'moderate' | 'high';
  confidence: number;
  details: string;
}

export const useGeneticData = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [uploadProgress, setUploadProgress] = useState(0);

  // Mock data since genetic_files table doesn't exist in Supabase
  const mockGeneticFiles: GeneticFile[] = [
    {
      id: '1',
      user_id: user?.id || '',
      file_name: 'genetic_results_23andme.txt',
      file_type: 'text/plain',
      file_size: 1024000,
      upload_date: new Date().toISOString(),
      analysis_status: 'completed',
      analysis_results: {
        risks: [
          { condition: 'Breast Cancer', risk_level: 'moderate', confidence: 0.75, details: 'BRCA1/BRCA2 variants detected' },
          { condition: 'Alzheimer\'s Disease', risk_level: 'low', confidence: 0.65, details: 'No significant risk variants' }
        ]
      }
    }
  ];

  const {
    data: geneticFiles = mockGeneticFiles,
    isLoading: isLoadingFiles,
    error: filesError
  } = useQuery({
    queryKey: ['genetic-files', user?.id],
    queryFn: async () => {
      if (!user?.id) return mockGeneticFiles;
      
      // Since genetic_files table doesn't exist, return mock data
      return mockGeneticFiles;
    },
    enabled: !!user?.id
  });

  const uploadGeneticFile = useMutation({
    mutationFn: async (file: File) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Mock upload process
      setUploadProgress(0);
      
      // Simulate upload progress
      const uploadInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(uploadInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      clearInterval(uploadInterval);
      setUploadProgress(100);

      // Return mock uploaded file data
      const newFile: GeneticFile = {
        id: Date.now().toString(),
        user_id: user.id,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        upload_date: new Date().toISOString(),
        analysis_status: 'pending'
      };

      return newFile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['genetic-files'] });
      toast.success('Genetic file uploaded successfully');
      setUploadProgress(0);
    },
    onError: (error) => {
      toast.error('Failed to upload genetic file');
      console.error('Upload error:', error);
      setUploadProgress(0);
    }
  });

  const deleteGeneticFile = useMutation({
    mutationFn: async (fileId: string) => {
      // Mock deletion since table doesn't exist
      await new Promise(resolve => setTimeout(resolve, 500));
      return fileId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['genetic-files'] });
      toast.success('Genetic file deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete genetic file');
    }
  });

  const getGeneticRisks = () => {
    const completedFiles = geneticFiles.filter(file => file.analysis_status === 'completed');
    const allRisks: GeneticRisk[] = [];

    completedFiles.forEach(file => {
      if (file.analysis_results?.risks) {
        allRisks.push(...file.analysis_results.risks);
      }
    });

    return allRisks;
  };

  return {
    geneticFiles,
    isLoadingFiles,
    filesError,
    uploadGeneticFile,
    deleteGeneticFile,
    uploadProgress,
    geneticRisks: getGeneticRisks()
  };
};
