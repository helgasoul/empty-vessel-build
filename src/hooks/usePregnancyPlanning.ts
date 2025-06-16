
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface PregnancyPlan {
  id: string;
  user_id: string;
  planning_start_date: string;
  target_conception_date?: string;
  prenatal_vitamins: boolean;
  folic_acid_intake: boolean;
  lifestyle_changes?: string[];
  medical_checkups?: string[];
  partner_health_check: boolean;
  fertility_tracking: boolean;
  ovulation_prediction: boolean;
  notes?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const usePregnancyPlanning = () => {
  const [plans, setPlans] = useState<PregnancyPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchPlans = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('pregnancy_planning')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error('Error fetching pregnancy plans:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [user]);

  const addPlan = async (planData: Omit<PregnancyPlan, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('pregnancy_planning')
        .insert({
          ...planData,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      setPlans(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding pregnancy plan:', error);
      throw error;
    }
  };

  const updatePlan = async (id: string, planData: Partial<PregnancyPlan>) => {
    try {
      const { data, error } = await supabase
        .from('pregnancy_planning')
        .update(planData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setPlans(prev => prev.map(plan => plan.id === id ? data : plan));
      return data;
    } catch (error) {
      console.error('Error updating pregnancy plan:', error);
      throw error;
    }
  };

  const deletePlan = async (id: string) => {
    try {
      const { error } = await supabase
        .from('pregnancy_planning')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setPlans(prev => prev.filter(plan => plan.id !== id));
    } catch (error) {
      console.error('Error deleting pregnancy plan:', error);
      throw error;
    }
  };

  return {
    plans,
    loading,
    addPlan,
    updatePlan,
    deletePlan,
    fetchPlans
  };
};
