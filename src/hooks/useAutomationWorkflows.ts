
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface AutomationWorkflow {
  id: string;
  user_id: string;
  workflow_name: string;
  workflow_description?: string;
  workflow_type: 'cycle_support' | 'screening_automation' | 'pregnancy_support' | 'menopause_support' | 'contraception_management';
  trigger_type: 'cycle_phase_change' | 'schedule' | 'user_goal_set' | 'health_data_change' | 'pregnancy_confirmed' | 'menopause_transition_detected';
  trigger_conditions: Record<string, any>;
  actions: any[];
  action_sequence?: any[];
  workflow_status: 'active' | 'inactive' | 'paused' | 'error';
  execution_count: number;
  last_execution?: string;
  next_scheduled_execution?: string;
  success_rate: number;
  average_execution_time?: number;
  total_errors: number;
  last_error_message?: string;
  cycle_phase_awareness: boolean;
  hormonal_adaptation: boolean;
  age_related_customization: boolean;
  life_stage_adaptation: boolean;
  retry_policy: Record<string, any>;
  timeout_seconds: number;
  parallel_execution: boolean;
  max_executions_per_day?: number;
  execution_window?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface WorkflowExecution {
  id: string;
  workflow_id: string;
  user_id: string;
  execution_status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  started_at: string;
  completed_at?: string;
  trigger_event?: Record<string, any>;
  cycle_context?: Record<string, any>;
  user_context?: Record<string, any>;
  executed_actions: any[];
  action_results: any[];
  total_actions: number;
  successful_actions: number;
  failed_actions: number;
  error_details?: Record<string, any>;
  execution_log: any[];
  execution_duration_seconds?: number;
  resource_usage?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface AutomationUserSettings {
  id: string;
  user_id: string;
  automation_enabled: boolean;
  notification_preferences: Record<string, any>;
  cycle_tracking_enabled: boolean;
  cycle_length: number;
  period_length: number;
  preferred_workout_types: any[];
  dietary_restrictions: any[];
  supplement_preferences: Record<string, any>;
  quiet_hours_start?: string;
  quiet_hours_end?: string;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export const useAutomationWorkflows = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['automation-workflows', user?.id],
    queryFn: async () => {
      if (!user) return [];

      try {
        const { data, error } = await (supabase as any)
          .from('automation_workflows')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching automation workflows:', error);
          return [];
        }

        return (data || []) as AutomationWorkflow[];
      } catch (error) {
        console.error('Database error:', error);
        return [];
      }
    },
    enabled: !!user?.id,
  });
};

export const useCreateAutomationWorkflow = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (workflowData: {
      workflow_name: string;
      workflow_description?: string;
      workflow_type: AutomationWorkflow['workflow_type'];
      trigger_type: AutomationWorkflow['trigger_type'];
      trigger_conditions: Record<string, any>;
      actions: any[];
      cycle_phase_awareness?: boolean;
      hormonal_adaptation?: boolean;
      age_related_customization?: boolean;
      life_stage_adaptation?: boolean;
    }) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      try {
        const { data, error } = await (supabase as any)
          .from('automation_workflows')
          .insert({
            ...workflowData,
            user_id: user.id,
          })
          .select()
          .single();

        if (error) {
          throw new Error(error.message);
        }

        return data as AutomationWorkflow;
      } catch (error) {
        console.error('Error creating automation workflow:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['automation-workflows'] });
      toast({
        title: "Workflow создан",
        description: `Автоматизация "${data.workflow_name}" успешно настроена`,
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка создания workflow",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateAutomationWorkflow = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<AutomationWorkflow>;
    }) => {
      try {
        const { data, error } = await (supabase as any)
          .from('automation_workflows')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (error) {
          throw new Error(error.message);
        }

        return data as AutomationWorkflow;
      } catch (error) {
        console.error('Error updating automation workflow:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automation-workflows'] });
      toast({
        title: "Workflow обновлен",
        description: "Настройки автоматизации сохранены",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка обновления",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useWorkflowExecutions = (workflowId?: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['workflow-executions', user?.id, workflowId],
    queryFn: async () => {
      if (!user) return [];

      try {
        let query = (supabase as any)
          .from('workflow_executions')
          .select('*')
          .order('started_at', { ascending: false });

        if (workflowId) {
          query = query.eq('workflow_id', workflowId);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching workflow executions:', error);
          return [];
        }

        return (data || []) as WorkflowExecution[];
      } catch (error) {
        console.error('Database error:', error);
        return [];
      }
    },
    enabled: !!user?.id,
  });
};

export const useAutomationUserSettings = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['automation-user-settings', user?.id],
    queryFn: async () => {
      if (!user) return null;

      try {
        const { data, error } = await (supabase as any)
          .from('automation_user_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching automation user settings:', error);
          return null;
        }

        return data as AutomationUserSettings;
      } catch (error) {
        console.error('Database error:', error);
        return null;
      }
    },
    enabled: !!user?.id,
  });
};

export const useUpdateAutomationUserSettings = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (settings: Partial<AutomationUserSettings>) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      try {
        const { data, error } = await (supabase as any)
          .from('automation_user_settings')
          .upsert({
            ...settings,
            user_id: user.id,
          })
          .select()
          .single();

        if (error) {
          throw new Error(error.message);
        }

        return data as AutomationUserSettings;
      } catch (error) {
        console.error('Error updating automation user settings:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automation-user-settings'] });
      toast({
        title: "Настройки сохранены",
        description: "Настройки автоматизации обновлены",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка сохранения",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
