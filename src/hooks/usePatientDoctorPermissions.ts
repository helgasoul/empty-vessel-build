
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface PatientDataPermission {
  id: string;
  patient_id: string;
  granted_to_id: string;
  granted_to_role: 'doctor' | 'clinic' | 'laboratory';
  permission_type: 'read' | 'write' | 'full';
  data_types: string[];
  expires_at?: string;
  is_active: boolean;
  granted_at: string;
  revoked_at?: string;
  created_at: string;
  updated_at: string;
  patient?: {
    full_name?: string;
    email?: string;
  };
}

export const usePatientPermissions = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['patient-permissions', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await (supabase as any)
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

export const useDoctorPermissions = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['doctor-permissions', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Get permissions first
      const { data: permissions, error: permissionsError } = await (supabase as any)
        .from('patient_data_permissions')
        .select('*')
        .eq('granted_to_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (permissionsError) {
        throw new Error(permissionsError.message);
      }

      // Get patient profiles separately
      if (permissions && permissions.length > 0) {
        const patientIds = permissions.map((p: any) => p.patient_id);
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', patientIds);

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
        }

        // Combine permissions with profiles
        const permissionsWithProfiles = permissions.map((permission: any) => ({
          ...permission,
          patient: profiles?.find((profile: any) => profile.id === permission.patient_id) || null
        }));

        return permissionsWithProfiles as PatientDataPermission[];
      }

      return permissions as PatientDataPermission[];
    },
    enabled: !!user,
  });
};

export const useGrantPermission = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (permissionData: {
      granted_to_id: string;
      granted_to_role: 'doctor' | 'clinic' | 'laboratory';
      permission_type: 'read' | 'write' | 'full';
      data_types: string[];
      expires_at?: string;
    }) => {
      const { data, error } = await (supabase as any)
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
      queryClient.invalidateQueries({ queryKey: ['patient-permissions'] });
      toast({
        title: "Разрешение предоставлено",
        description: "Врач получил доступ к вашим данным",
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

export const useRevokePermission = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (permissionId: string) => {
      const { data, error } = await (supabase as any)
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
      queryClient.invalidateQueries({ queryKey: ['patient-permissions'] });
      queryClient.invalidateQueries({ queryKey: ['doctor-permissions'] });
      toast({
        title: "Разрешение отозвано",
        description: "Доступ к данным был отозван",
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
