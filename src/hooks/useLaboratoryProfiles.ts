
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface LaboratoryProfile {
  id: string;
  user_id: string;
  laboratory_name: string;
  license_number?: string;
  accreditation?: string[];
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  test_types_offered?: string[];
  working_hours?: any;
  is_active: boolean;
  api_access_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export const useLaboratoryProfiles = () => {
  return useQuery({
    queryKey: ['laboratory-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('laboratory_profiles')
        .select('*')
        .eq('is_active', true)
        .order('laboratory_name');

      if (error) {
        throw new Error(error.message);
      }

      return data as LaboratoryProfile[];
    },
  });
};

export const useMyLaboratoryProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['my-laboratory-profile', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('laboratory_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw new Error(error.message);
      }

      return data as LaboratoryProfile | null;
    },
    enabled: !!user,
  });
};

export const useCreateLaboratoryProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (profileData: Omit<LaboratoryProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('laboratory_profiles')
        .insert(profileData)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['laboratory-profiles'] });
      queryClient.invalidateQueries({ queryKey: ['my-laboratory-profile'] });
      toast({
        title: "Профиль лаборатории создан",
        description: "Профиль лаборатории успешно создан",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: `Не удалось создать профиль лаборатории: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateLaboratoryProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<LaboratoryProfile> }) => {
      const { data, error } = await supabase
        .from('laboratory_profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['laboratory-profiles'] });
      queryClient.invalidateQueries({ queryKey: ['my-laboratory-profile'] });
      toast({
        title: "Профиль обновлен",
        description: "Профиль лаборатории успешно обновлен",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: `Не удалось обновить профиль: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};
