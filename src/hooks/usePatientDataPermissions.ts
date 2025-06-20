
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { AppRole } from './useUserRoles';

export interface PatientDataPermission {
  id: string;
  patient_id: string;
  granted_to_id: string;
  granted_to_role: AppRole;
  permission_type: 'read' | 'write' | 'full';
  data_types: string[];
  expires_at?: string;
  is_active: boolean;
  granted_at: string;
  revoked_at?: string;
  created_at: string;
  updated_at: string;
}

export const useMyPatientDataPermissions = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['my-patient-data-permissions', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('patient_data_permissions')
        .select('*')
        .eq('patient_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data as PatientDataPermission[];
    },
    enabled: !!user,
  });
};

export const useGrantedToMePermissions = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['granted-to-me-permissions', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('patient_data_permissions')
        .select('*')
        .eq('granted_to_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data as PatientDataPermission[];
    },
    enabled: !!user,
  });
};

export const useGrantPatientDataPermission = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (permissionData: Omit<PatientDataPermission, 'id' | 'granted_at' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('patient_data_permissions')
        .insert(permissionData)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-patient-data-permissions'] });
      queryClient.invalidateQueries({ queryKey: ['granted-to-me-permissions'] });
      toast({
        title: "Разрешение предоставлено",
        description: "Разрешение на доступ к данным успешно предоставлено",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: `Не удалось предоставить разрешение: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useRevokePatientDataPermission = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (permissionId: string) => {
      const { data, error } = await supabase
        .from('patient_data_permissions')
        .update({ 
          is_active: false, 
          revoked_at: new Date().toISOString() 
        })
        .eq('id', permissionId)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-patient-data-permissions'] });
      queryClient.invalidateQueries({ queryKey: ['granted-to-me-permissions'] });
      toast({
        title: "Разрешение отозвано",
        description: "Разрешение на доступ к данным успешно отозвано",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: `Не удалось отозвать разрешение: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};
