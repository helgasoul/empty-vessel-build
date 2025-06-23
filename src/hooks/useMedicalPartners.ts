import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface MedicalPartner {
  id: string;
  partner_name: string;
  partner_type: 'gynecology_clinic' | 'laboratory' | 'diagnostic_center' | 'hospital';
  legal_entity?: string;
  license_number?: string;
  specializations: string[];
  women_health_focus: boolean;
  age_groups_served: string[];
  address: {
    city: string;
    district: string;
    address: string;
  };
  phone?: string;
  email?: string;
  website?: string;
  api_endpoint?: string;
  api_version?: string;
  integration_status: 'pending' | 'active' | 'suspended' | 'inactive';
  last_sync?: string;
  quality_rating?: number;
  patient_reviews_count: number;
  women_health_expertise?: number;
  available_services: string[];
  appointment_booking_available: boolean;
  online_results_available: boolean;
  telemedicine_available: boolean;
  service_areas: string[];
  coordinates?: any;
  created_at: string;
  updated_at: string;
}

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

export interface LabTest {
  id: string;
  user_id: string;
  partner_id?: string;
  test_code: string;
  test_name: string;
  test_category: 'hormones' | 'oncology_markers' | 'genetics' | 'microbiome' | 'general';
  collection_date?: string;
  collection_time?: string;
  optimal_cycle_phase?: 'menstrual' | 'follicular' | 'ovulation' | 'luteal';
  preparation_instructions: any[];
  preparation_completed: boolean;
  status: 'scheduled' | 'collected' | 'processing' | 'completed' | 'cancelled';
  results: Record<string, any>;
  reference_ranges: Record<string, any>;
  interpretation?: string;
  cost?: number;
  processing_duration?: string;
  created_at: string;
  updated_at: string;
}

export interface ScreeningPlan {
  id: string;
  user_id: string;
  plan_name: string;
  plan_type: 'comprehensive' | 'risk_based' | 'age_based' | 'symptom_based';
  recommended_services: any[];
  total_estimated_cost?: number;
  recommended_frequency?: string;
  risk_factors: any[];
  age_considerations: Record<string, any>;
  cycle_considerations: Record<string, any>;
  next_appointment_date?: string;
  priority_level: 'low' | 'medium' | 'high' | 'urgent';
  completion_status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  completion_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface MedicalReminder {
  id: string;
  user_id: string;
  appointment_id?: string;
  lab_test_id?: string;
  reminder_type: 'planning' | 'preparation' | 'day_of' | 'proximity' | 'follow_up';
  title: string;
  message: string;
  trigger_date: string;
  trigger_time?: string;
  status: 'scheduled' | 'sent' | 'read' | 'dismissed';
  sent_at?: string;
  read_at?: string;
  available_actions: any[];
  created_at: string;
  updated_at: string;
}

export const useMedicalPartners = () => {
  return useQuery({
    queryKey: ['medical-partners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medical_partners')
        .select('*')
        .eq('integration_status', 'active')
        .order('quality_rating', { ascending: false });

      if (error) {
        console.error('Error fetching medical partners:', error);
        throw error;
      }

      return (data || []) as MedicalPartner[];
    },
  });
};

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

export const useLabTests = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['lab-tests', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('lab_tests')
        .select(`
          *,
          medical_partner:partner_id(partner_name, phone, address)
        `)
        .order('collection_date', { ascending: true });

      if (error) {
        console.error('Error fetching lab tests:', error);
        throw error;
      }

      return (data || []) as LabTest[];
    },
    enabled: !!user?.id,
  });
};

export const useCreateLabTest = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (testData: Omit<LabTest, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'status'>) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('lab_tests')
        .insert({
          user_id: user.id,
          test_code: testData.test_code,
          test_name: testData.test_name,
          test_category: testData.test_category,
          partner_id: testData.partner_id,
          collection_date: testData.collection_date,
          collection_time: testData.collection_time,
          optimal_cycle_phase: testData.optimal_cycle_phase,
          preparation_instructions: testData.preparation_instructions,
          preparation_completed: testData.preparation_completed,
          results: testData.results,
          reference_ranges: testData.reference_ranges,
          interpretation: testData.interpretation,
          cost: testData.cost,
          processing_duration: testData.processing_duration,
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as LabTest;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lab-tests'] });
      toast({
        title: "Анализ запланирован",
        description: "Лабораторный анализ успешно запланирован",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка планирования",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useScreeningPlans = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['screening-plans', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('screening_plans')
        .select('*')
        .order('priority_level', { ascending: false });

      if (error) {
        console.error('Error fetching screening plans:', error);
        throw error;
      }

      return (data || []) as ScreeningPlan[];
    },
    enabled: !!user?.id,
  });
};

export const useMedicalReminders = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['medical-reminders', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('medical_reminders')
        .select('*')
        .order('trigger_date', { ascending: true });

      if (error) {
        console.error('Error fetching medical reminders:', error);
        throw error;
      }

      return (data || []) as MedicalReminder[];
    },
    enabled: !!user?.id,
  });
};
