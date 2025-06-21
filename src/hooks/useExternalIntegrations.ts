
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface ExternalIntegration {
  id: string;
  user_id: string;
  integration_type: 'calendar' | 'fitness_tracker' | 'lab_results';
  provider_name: string;
  integration_status: 'active' | 'inactive' | 'error';
  access_token_encrypted?: string;
  refresh_token_encrypted?: string;
  token_expires_at?: string;
  last_sync_at?: string;
  sync_frequency: 'hourly' | 'daily' | 'weekly';
  sync_settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export const useExternalIntegrations = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['external-integrations', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('external_api_integrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return (data || []) as ExternalIntegration[];
    },
    enabled: !!user?.id,
  });
};

export const useCreateIntegration = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (integrationData: {
      integration_type: ExternalIntegration['integration_type'];
      provider_name: string;
      sync_frequency?: ExternalIntegration['sync_frequency'];
      sync_settings?: Record<string, any>;
    }) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('external_api_integrations')
        .insert({
          ...integrationData,
          user_id: user.id,
          sync_frequency: integrationData.sync_frequency || 'daily',
          sync_settings: integrationData.sync_settings || {},
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as ExternalIntegration;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['external-integrations'] });
      toast({
        title: "Интеграция создана",
        description: "Новая интеграция успешно добавлена",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка создания интеграции",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateIntegration = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ExternalIntegration> }) => {
      const { data, error } = await supabase
        .from('external_api_integrations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as ExternalIntegration;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['external-integrations'] });
      toast({
        title: "Интеграция обновлена",
        description: "Настройки интеграции сохранены",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка обновления",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteIntegration = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (integrationId: string) => {
      const { error } = await supabase
        .from('external_api_integrations')
        .delete()
        .eq('id', integrationId);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['external-integrations'] });
      toast({
        title: "Интеграция удалена",
        description: "Интеграция успешно удалена",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка удаления",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
