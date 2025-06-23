
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

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
