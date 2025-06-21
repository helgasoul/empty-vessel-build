
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

export interface DoctorNotification {
  id: string;
  doctor_id: string;
  patient_id: string;
  notification_type: 'new_lab_results' | 'critical_values' | 'significant_changes' | 'consultation_request' | 'profile_updated';
  title: string;
  message: string;
  is_read: boolean;
  is_critical: boolean;
  related_data: Record<string, any>;
  created_at: string;
  read_at?: string;
}

export const useDoctorNotifications = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['doctor-notifications', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('doctor_notifications' as any)
        .select('*')
        .eq('doctor_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data as DoctorNotification[];
    },
    enabled: !!user,
  });
};

export const useUnreadNotificationsCount = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['unread-notifications-count', user?.id],
    queryFn: async () => {
      if (!user) return 0;

      const { count, error } = await supabase
        .from('doctor_notifications' as any)
        .select('*', { count: 'exact', head: true })
        .eq('doctor_id', user.id)
        .eq('is_read', false);

      if (error) {
        throw new Error(error.message);
      }

      return count || 0;
    },
    enabled: !!user,
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const { data, error } = await supabase
        .from('doctor_notifications' as any)
        .update({ 
          is_read: true, 
          read_at: new Date().toISOString() 
        })
        .eq('id', notificationId)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-notifications-count'] });
    },
  });
};

export const useCreateNotification = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (notificationData: {
      doctor_id: string;
      patient_id: string;
      notification_type: DoctorNotification['notification_type'];
      title: string;
      message: string;
      is_critical?: boolean;
      related_data?: Record<string, any>;
    }) => {
      const { data, error } = await supabase
        .from('doctor_notifications' as any)
        .insert(notificationData)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-notifications-count'] });
    },
    onError: (error) => {
      toast({
        title: "Ошибка создания уведомления",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useRealtimeNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('doctor-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'doctor_notifications',
          filter: `doctor_id=eq.${user.id}`
        },
        (payload) => {
          queryClient.invalidateQueries({ 
            queryKey: ['doctor-notifications', user.id] 
          });
          queryClient.invalidateQueries({ 
            queryKey: ['unread-notifications-count', user.id] 
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);
};
