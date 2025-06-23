
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface GynecologyAppointment {
  id: string;
  user_id: string;
  partner_id?: string;
  appointment_type: 'consultation' | 'screening' | 'procedure' | 'diagnostics';
  service_code?: string;
  service_name?: string;
  appointment_date: string;
  appointment_time: string;
  estimated_duration: number;
  timezone: string;
  doctor_id?: string;
  doctor_name?: string;
  doctor_specialization?: string;
  cycle_day?: number;
  cycle_phase?: 'menstrual' | 'follicular' | 'ovulation' | 'luteal';
  cycle_considerations: Record<string, any>;
  preparation_required: boolean;
  preparation_instructions: any[];
  preparation_completed: boolean;
  booking_status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  booking_confirmation?: string;
  external_appointment_id?: string;
  appointment_notes?: string;
  results_available: boolean;
  results_summary: Record<string, any>;
  follow_up_required: boolean;
  follow_up_date?: string;
  estimated_cost?: number;
  actual_cost?: number;
  insurance_covered: boolean;
  created_at: string;
  updated_at: string;
}

export const useGynecologyAppointments = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['gynecology-appointments', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('gynecology_appointments')
        .select(`
          *,
          medical_partner:partner_id(partner_name, phone, address)
        `)
        .order('appointment_date', { ascending: true });

      if (error) {
        console.error('Error fetching gynecology appointments:', error);
        throw error;
      }

      return (data || []) as GynecologyAppointment[];
    },
    enabled: !!user?.id,
  });
};

export const useCreateGynecologyAppointment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (appointmentData: Omit<GynecologyAppointment, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'booking_status'>) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('gynecology_appointments')
        .insert({
          user_id: user.id,
          appointment_type: appointmentData.appointment_type,
          appointment_date: appointmentData.appointment_date,
          appointment_time: appointmentData.appointment_time,
          partner_id: appointmentData.partner_id,
          service_code: appointmentData.service_code,
          service_name: appointmentData.service_name,
          estimated_duration: appointmentData.estimated_duration,
          timezone: appointmentData.timezone,
          doctor_id: appointmentData.doctor_id,
          doctor_name: appointmentData.doctor_name,
          doctor_specialization: appointmentData.doctor_specialization,
          cycle_day: appointmentData.cycle_day,
          cycle_phase: appointmentData.cycle_phase,
          cycle_considerations: appointmentData.cycle_considerations,
          preparation_required: appointmentData.preparation_required,
          preparation_instructions: appointmentData.preparation_instructions,
          preparation_completed: appointmentData.preparation_completed,
          booking_confirmation: appointmentData.booking_confirmation,
          external_appointment_id: appointmentData.external_appointment_id,
          appointment_notes: appointmentData.appointment_notes,
          results_available: appointmentData.results_available,
          results_summary: appointmentData.results_summary,
          follow_up_required: appointmentData.follow_up_required,
          follow_up_date: appointmentData.follow_up_date,
          estimated_cost: appointmentData.estimated_cost,
          actual_cost: appointmentData.actual_cost,
          insurance_covered: appointmentData.insurance_covered,
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as GynecologyAppointment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gynecology-appointments'] });
      toast({
        title: "Запись создана",
        description: "Ваша запись к врачу успешно создана",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка записи",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
