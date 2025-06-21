
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface UserReminder {
  id: string;
  user_id: string;
  reminder_type: 'medication' | 'appointment' | 'health_check' | 'custom';
  title: string;
  description?: string;
  frequency: 'once' | 'daily' | 'weekly' | 'monthly' | 'custom';
  frequency_data: Record<string, any>;
  next_reminder_at: string;
  is_active: boolean;
  notification_methods: string[];
  created_at: string;
  updated_at: string;
}

export const useUserReminders = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-reminders', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_reminders')
        .select('*')
        .order('next_reminder_at', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return (data || []) as UserReminder[];
    },
    enabled: !!user?.id,
  });
};

export const useCreateReminder = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (reminderData: Omit<UserReminder, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('user_reminders')
        .insert({
          ...reminderData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as UserReminder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-reminders'] });
      toast({
        title: "Напоминание создано",
        description: "Новое напоминание успешно добавлено",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка создания напоминания",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateReminder = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<UserReminder> }) => {
      const { data, error } = await supabase
        .from('user_reminders')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as UserReminder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-reminders'] });
      toast({
        title: "Напоминание обновлено",
        description: "Изменения сохранены",
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

export const useDeleteReminder = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (reminderId: string) => {
      const { error } = await supabase
        .from('user_reminders')
        .delete()
        .eq('id', reminderId);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-reminders'] });
      toast({
        title: "Напоминание удалено",
        description: "Напоминание успешно удалено",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка удаления",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
