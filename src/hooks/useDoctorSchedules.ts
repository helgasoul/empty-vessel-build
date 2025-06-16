
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DoctorSchedule {
  id: string;
  doctor_id: string;
  date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  consultation_type: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const useDoctorSchedules = (doctorId?: string, date?: string) => {
  return useQuery({
    queryKey: ['doctor-schedules', doctorId, date],
    queryFn: async () => {
      let query = supabase
        .from('doctor_schedules')
        .select('*')
        .order('date', { ascending: true })
        .order('start_time', { ascending: true });

      if (doctorId) {
        query = query.eq('doctor_id', doctorId);
      }

      if (date) {
        query = query.eq('date', date);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return data as DoctorSchedule[];
    },
    enabled: !!doctorId,
  });
};

export const useAvailableSlots = (doctorId?: string, date?: string) => {
  return useQuery({
    queryKey: ['available-slots', doctorId, date],
    queryFn: async () => {
      if (!doctorId || !date) return [];

      const { data, error } = await supabase
        .from('doctor_schedules')
        .select('*')
        .eq('doctor_id', doctorId)
        .eq('date', date)
        .eq('is_available', true)
        .order('start_time', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return data as DoctorSchedule[];
    },
    enabled: !!doctorId && !!date,
  });
};

export const useCreateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (scheduleData: Omit<DoctorSchedule, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('doctor_schedules')
        .insert(scheduleData)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor-schedules'] });
      queryClient.invalidateQueries({ queryKey: ['available-slots'] });
    },
  });
};

export const useUpdateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...scheduleData }: Partial<DoctorSchedule> & { id: string }) => {
      const { data, error } = await supabase
        .from('doctor_schedules')
        .update(scheduleData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor-schedules'] });
      queryClient.invalidateQueries({ queryKey: ['available-slots'] });
    },
  });
};

export const useDeleteSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (scheduleId: string) => {
      const { error } = await supabase
        .from('doctor_schedules')
        .delete()
        .eq('id', scheduleId);

      if (error) {
        throw new Error(error.message);
      }

      return scheduleId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor-schedules'] });
      queryClient.invalidateQueries({ queryKey: ['available-slots'] });
    },
  });
};
