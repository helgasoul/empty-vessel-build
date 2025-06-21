
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

export interface DoctorPatientMessage {
  id: string;
  patient_id: string;
  doctor_id: string;
  sender_id: string;
  message_text: string;
  message_type: 'text' | 'report' | 'file' | 'calculator_results';
  attachments: any[];
  is_read: boolean;
  read_at?: string;
  created_at: string;
  updated_at: string;
}

export const useDoctorPatientMessages = (chatPartnerId: string, isDoctor: boolean) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['doctor-patient-messages', user?.id, chatPartnerId],
    queryFn: async () => {
      if (!user || !chatPartnerId) return [];

      const query = supabase
        .from('doctor_patient_messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (isDoctor) {
        query.eq('doctor_id', user.id).eq('patient_id', chatPartnerId);
      } else {
        query.eq('patient_id', user.id).eq('doctor_id', chatPartnerId);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return data as DoctorPatientMessage[];
    },
    enabled: !!user && !!chatPartnerId,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (messageData: {
      patient_id: string;
      doctor_id: string;
      message_text: string;
      message_type?: 'text' | 'report' | 'file' | 'calculator_results';
      attachments?: any[];
    }) => {
      const { data, error } = await supabase
        .from('doctor_patient_messages')
        .insert(messageData)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['doctor-patient-messages'] });
    },
    onError: (error) => {
      toast({
        title: "Ошибка отправки сообщения",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useMarkMessageAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: string) => {
      const { data, error } = await supabase
        .from('doctor_patient_messages')
        .update({ 
          is_read: true, 
          read_at: new Date().toISOString() 
        })
        .eq('id', messageId)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor-patient-messages'] });
    },
  });
};

export const useRealtimeMessages = (chatPartnerId: string, isDoctor: boolean) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user || !chatPartnerId) return;

    const channel = supabase
      .channel('doctor-patient-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'doctor_patient_messages',
          filter: isDoctor 
            ? `doctor_id=eq.${user.id},patient_id=eq.${chatPartnerId}`
            : `patient_id=eq.${user.id},doctor_id=eq.${chatPartnerId}`
        },
        (payload) => {
          queryClient.invalidateQueries({ 
            queryKey: ['doctor-patient-messages', user.id, chatPartnerId] 
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, chatPartnerId, isDoctor, queryClient]);
};
