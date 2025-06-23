
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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
