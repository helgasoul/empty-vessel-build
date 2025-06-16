
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ConsultationBooking {
  id: string;
  patient_id: string;
  doctor_id: string;
  schedule_id: string;
  booking_date: string;
  booking_time: string;
  consultation_type: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  reason?: string;
  notes?: string;
  meeting_link?: string;
  payment_amount: number;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  created_at: string;
  updated_at: string;
  doctor_profiles?: {
    full_name: string;
    specialization: string;
    photo_url?: string;
  };
}

export const useConsultationBookings = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['consultation-bookings', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('consultation_bookings')
        .select(`
          *,
          doctor_profiles (
            full_name,
            specialization,
            photo_url
          )
        `)
        .eq('patient_id', user.id)
        .order('booking_date', { ascending: true })
        .order('booking_time', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return data as ConsultationBooking[];
    },
    enabled: !!user,
  });
};

export const useDoctorBookings = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['doctor-bookings', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Сначала получаем профиль врача
      const { data: doctorProfile } = await supabase
        .from('doctor_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!doctorProfile) return [];

      const { data, error } = await supabase
        .from('consultation_bookings')
        .select(`
          *,
          doctor_profiles (
            full_name,
            specialization,
            photo_url
          )
        `)
        .eq('doctor_id', doctorProfile.id)
        .order('booking_date', { ascending: true })
        .order('booking_time', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return data as ConsultationBooking[];
    },
    enabled: !!user,
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingData: Omit<ConsultationBooking, 'id' | 'created_at' | 'updated_at' | 'doctor_profiles'>) => {
      const { data, error } = await supabase
        .from('consultation_bookings')
        .insert(bookingData)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultation-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['doctor-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['available-slots'] });
    },
  });
};

export const useUpdateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...bookingData }: Partial<ConsultationBooking> & { id: string }) => {
      const { data, error } = await supabase
        .from('consultation_bookings')
        .update(bookingData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultation-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['doctor-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['available-slots'] });
    },
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId: string) => {
      const { data, error } = await supabase
        .from('consultation_bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultation-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['doctor-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['available-slots'] });
    },
  });
};
