
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface DoctorProfile {
  id: string;
  user_id: string;
  full_name: string;
  specialization: string;
  qualification?: string;
  experience_years?: number;
  bio?: string;
  photo_url?: string;
  consultation_fee: number;
  is_available: boolean;
  working_hours: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export const useDoctorProfiles = () => {
  return useQuery({
    queryKey: ['doctor-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('doctor_profiles')
        .select('*')
        .eq('is_available', true)
        .order('full_name');

      if (error) {
        throw new Error(error.message);
      }

      return data as DoctorProfile[];
    },
  });
};

export const useDoctorProfile = (doctorId?: string) => {
  return useQuery({
    queryKey: ['doctor-profile', doctorId],
    queryFn: async () => {
      if (!doctorId) return null;

      const { data, error } = await supabase
        .from('doctor_profiles')
        .select('*')
        .eq('id', doctorId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as DoctorProfile;
    },
    enabled: !!doctorId,
  });
};

export const useMyDoctorProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['my-doctor-profile', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('doctor_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        throw new Error(error.message);
      }

      return data as DoctorProfile | null;
    },
    enabled: !!user,
  });
};

export const useCreateDoctorProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileData: Omit<DoctorProfile, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('doctor_profiles')
        .insert(profileData)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor-profiles'] });
      queryClient.invalidateQueries({ queryKey: ['my-doctor-profile'] });
    },
  });
};

export const useUpdateDoctorProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...profileData }: Partial<DoctorProfile> & { id: string }) => {
      const { data, error } = await supabase
        .from('doctor_profiles')
        .update(profileData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor-profiles'] });
      queryClient.invalidateQueries({ queryKey: ['my-doctor-profile'] });
    },
  });
};
