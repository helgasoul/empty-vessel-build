
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface CalculatorResult {
  id: string;
  patient_id: string;
  calculator_type: string;
  calculator_name: string;
  input_parameters: Record<string, any>;
  result_value?: number;
  result_text?: string;
  interpretation: string;
  reference_range?: string;
  units?: string;
  is_critical: boolean;
  calculated_at: string;
  lab_result_id?: string;
  calculated_by?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const usePatientCalculatorResults = (patientId?: string) => {
  const { user } = useAuth();
  const targetPatientId = patientId || user?.id;

  return useQuery({
    queryKey: ['calculator-results', targetPatientId],
    queryFn: async () => {
      if (!targetPatientId) return [];

      const { data, error } = await supabase
        .from('calculator_results')
        .select('*')
        .eq('patient_id', targetPatientId)
        .order('calculated_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data as CalculatorResult[];
    },
    enabled: !!targetPatientId,
  });
};

export const useSaveCalculatorResult = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (resultData: {
      patient_id: string;
      calculator_type: string;
      calculator_name: string;
      input_parameters: Record<string, any>;
      result_value?: number;
      result_text?: string;
      interpretation: string;
      reference_range?: string;
      units?: string;
      is_critical?: boolean;
      lab_result_id?: string;
      notes?: string;
    }) => {
      const { data, error } = await supabase
        .from('calculator_results')
        .insert(resultData)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ 
        queryKey: ['calculator-results', data.patient_id] 
      });
      toast({
        title: "Результат сохранен",
        description: "Результат расчета успешно сохранен",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка сохранения",
        description: `Не удалось сохранить результат: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useCalculatorResultsByType = (calculatorType: string, patientId?: string) => {
  const { user } = useAuth();
  const targetPatientId = patientId || user?.id;

  return useQuery({
    queryKey: ['calculator-results', targetPatientId, calculatorType],
    queryFn: async () => {
      if (!targetPatientId) return [];

      const { data, error } = await supabase
        .from('calculator_results')
        .select('*')
        .eq('patient_id', targetPatientId)
        .eq('calculator_type', calculatorType)
        .order('calculated_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data as CalculatorResult[];
    },
    enabled: !!targetPatientId,
  });
};
