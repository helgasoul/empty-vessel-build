
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface ClinicProfile {
  id: string;
  user_id: string;
  clinic_name: string;
  clinic_type?: string;
  license_number?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  services_offered?: string[];
  working_hours?: any;
  is_active: boolean;
  api_access_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export const useClinicProfiles = () => {
  return useQuery({
    queryKey: ['clinic-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clinic_profiles')
        .select('*')
        .eq('is_active', true)
        .order('clinic_name');

      if (error) {
        throw new Error(error.message);
      }

      return data as ClinicProfile[];
    },
  });
};

export const useMyClinicProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['my-clinic-profile', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('clinic_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw new Error(error.message);
      }

      return data as ClinicProfile | null;
    },
    enabled: !!user,
  });
};

export const useCreateClinicProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (profileData: Omit<ClinicProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('clinic_profiles')
        .insert(profileData)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinic-profiles'] });
      queryClient.invalidateQueries({ queryKey: ['my-clinic-profile'] });
      toast({
        title: "Профиль клиники создан",
        description: "Профиль клиники успешно создан",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: `Не удалось создать профиль клиники: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateClinicProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ClinicProfile> }) => {
      const { data, error } = await supabase
        .from('clinic_profiles')
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
      queryClient.invalidateQueries({ queryKey: ['clinic-profiles'] });
      queryClient.invalidateQueries({ queryKey: ['my-clinic-profile'] });
      toast({
        title: "Профиль обновлен",
        description: "Профиль клиники успешно обновлен",
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
