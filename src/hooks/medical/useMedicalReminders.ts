
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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
