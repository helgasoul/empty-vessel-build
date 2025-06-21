
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface DataExport {
  id: string;
  user_id: string;
  export_type: 'full' | 'health_data' | 'cycles' | 'family_history';
  export_format: 'pdf' | 'csv' | 'json';
  date_range_start?: string;
  date_range_end?: string;
  file_path?: string;
  file_size?: number;
  export_status: 'pending' | 'processing' | 'completed' | 'failed';
  requested_at: string;
  completed_at?: string;
  download_expires_at?: string;
  metadata: Record<string, any>;
}

export const useDataExports = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['data-exports', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('data_exports')
        .select('*')
        .order('requested_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return (data || []) as DataExport[];
    },
    enabled: !!user?.id,
  });
};

export const useCreateExport = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (exportData: {
      export_type: DataExport['export_type'];
      export_format: DataExport['export_format'];
      date_range_start?: string;
      date_range_end?: string;
      metadata?: Record<string, any>;
    }) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('data_exports')
        .insert({
          ...exportData,
          user_id: user.id,
          metadata: exportData.metadata || {},
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as DataExport;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data-exports'] });
      toast({
        title: "Экспорт запущен",
        description: "Экспорт данных добавлен в очередь обработки",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка экспорта",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDownloadExport = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (exportId: string) => {
      // Здесь будет логика скачивания файла
      // Пока что заглушка
      console.log('Downloading export:', exportId);
      
      // В реальном приложении здесь будет вызов API для скачивания
      throw new Error('Download functionality not implemented yet');
    },
    onError: (error) => {
      toast({
        title: "Ошибка скачивания",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
