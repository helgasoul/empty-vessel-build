
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface AIChatSession {
  id: string;
  user_id: string;
  session_name?: string;
  session_type: 'general' | 'medical' | 'nutrition' | 'fitness';
  started_at: string;
  last_activity_at: string;
  is_active: boolean;
  context_data: Record<string, any>;
  summary?: string;
}

export interface AIChatMessage {
  id: string;
  session_id: string;
  message_type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata: Record<string, any>;
  tokens_used?: number;
  model_version?: string;
}

export const useAIChatSessions = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['ai-chat-sessions', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('ai_chat_sessions')
        .select('*')
        .order('last_activity_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return (data || []) as AIChatSession[];
    },
    enabled: !!user?.id,
  });
};

export const useAIChatMessages = (sessionId?: string) => {
  return useQuery({
    queryKey: ['ai-chat-messages', sessionId],
    queryFn: async () => {
      if (!sessionId) return [];

      const { data, error } = await supabase
        .from('ai_chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('timestamp', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return (data || []) as AIChatMessage[];
    },
    enabled: !!sessionId,
  });
};

export const useCreateChatSession = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (sessionData: {
      session_name?: string;
      session_type: AIChatSession['session_type'];
      context_data?: Record<string, any>;
    }) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('ai_chat_sessions')
        .insert({
          ...sessionData,
          user_id: user.id,
          context_data: sessionData.context_data || {},
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as AIChatSession;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-chat-sessions'] });
    },
    onError: (error) => {
      toast({
        title: "Ошибка создания сессии",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (messageData: {
      session_id: string;
      message_type: AIChatMessage['message_type'];
      content: string;
      metadata?: Record<string, any>;
    }) => {
      const { data, error } = await supabase
        .from('ai_chat_messages')
        .insert({
          ...messageData,
          metadata: messageData.metadata || {},
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      // Обновляем last_activity_at в сессии
      await supabase
        .from('ai_chat_sessions')
        .update({ last_activity_at: new Date().toISOString() })
        .eq('id', messageData.session_id);

      return data as AIChatMessage;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['ai-chat-messages', data.session_id] });
      queryClient.invalidateQueries({ queryKey: ['ai-chat-sessions'] });
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
