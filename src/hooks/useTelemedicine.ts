
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface TelemedicineSession {
  id: string;
  user_id: string;
  appointment_id: string;
  doctor_id: string;
  session_status: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  started_at?: string;
  ended_at?: string;
  duration_minutes?: number;
  session_notes?: string;
  room_id?: string;
  session_token?: string;
  follow_up_required: boolean;
  prescription_issued: boolean;
  meeting_link?: string;
  session_recording_url?: string;
  payment_amount?: number;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  created_at: string;
  updated_at: string;
}

export const useTelemedicine = () => {
  const [sessions, setSessions] = useState<TelemedicineSession[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('telemedicine_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const transformedSessions: TelemedicineSession[] = (data || []).map(session => ({
        ...session,
        session_status: session.session_status as TelemedicineSession['session_status'],
        payment_status: session.payment_status as TelemedicineSession['payment_status']
      }));
      
      setSessions(transformedSessions);
    } catch (error) {
      console.error('Ошибка при загрузке телемедицинских сессий:', error);
      toast.error('Не удалось загрузить сессии');
    } finally {
      setLoading(false);
    }
  };

  const createSession = async (sessionData: Omit<TelemedicineSession, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Пользователь не авторизован');

      const { data, error } = await supabase
        .from('telemedicine_sessions')
        .insert({
          user_id: user.id,
          ...sessionData
        })
        .select()
        .single();

      if (error) throw error;

      const transformedSession: TelemedicineSession = {
        ...data,
        session_status: data.session_status as TelemedicineSession['session_status'],
        payment_status: data.payment_status as TelemedicineSession['payment_status']
      };

      setSessions(prev => [transformedSession, ...prev]);
      toast.success('Телемедицинская сессия создана');
      return transformedSession;
    } catch (error) {
      console.error('Ошибка при создании сессии:', error);
      toast.error('Не удалось создать сессию');
      throw error;
    }
  };

  const updateSession = async (id: string, updates: Partial<TelemedicineSession>) => {
    try {
      const { data, error } = await supabase
        .from('telemedicine_sessions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const transformedSession: TelemedicineSession = {
        ...data,
        session_status: data.session_status as TelemedicineSession['session_status'],
        payment_status: data.payment_status as TelemedicineSession['payment_status']
      };

      setSessions(prev => prev.map(session => 
        session.id === id ? transformedSession : session
      ));
      toast.success('Сессия обновлена');
      return transformedSession;
    } catch (error) {
      console.error('Ошибка при обновлении сессии:', error);
      toast.error('Не удалось обновить сессию');
      throw error;
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return {
    sessions,
    loading,
    createSession,
    updateSession,
    refetch: fetchSessions
  };
};
