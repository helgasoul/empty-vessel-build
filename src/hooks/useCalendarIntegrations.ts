
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { CalendarIntegration } from '@/types/telemedicine';

export const useCalendarIntegrations = () => {
  const [integrations, setIntegrations] = useState<CalendarIntegration[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchIntegrations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('calendar_integrations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setIntegrations(data || []);
    } catch (error) {
      console.error('Ошибка при загрузке календарных интеграций:', error);
      toast.error('Не удалось загрузить интеграции');
    } finally {
      setLoading(false);
    }
  };

  const createIntegration = async (integrationData: Omit<CalendarIntegration, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Пользователь не авторизован');

      const { data, error } = await supabase
        .from('calendar_integrations')
        .insert({
          user_id: user.id,
          ...integrationData
        })
        .select()
        .single();

      if (error) throw error;

      setIntegrations(prev => [data, ...prev]);
      toast.success('Календарная интеграция создана');
      return data;
    } catch (error) {
      console.error('Ошибка при создании интеграции:', error);
      toast.error('Не удалось создать интеграцию');
      throw error;
    }
  };

  const updateIntegration = async (id: string, updates: Partial<CalendarIntegration>) => {
    try {
      const { data, error } = await supabase
        .from('calendar_integrations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setIntegrations(prev => prev.map(integration => 
        integration.id === id ? data : integration
      ));
      toast.success('Интеграция обновлена');
      return data;
    } catch (error) {
      console.error('Ошибка при обновлении интеграции:', error);
      toast.error('Не удалось обновить интеграцию');
      throw error;
    }
  };

  const deleteIntegration = async (id: string) => {
    try {
      const { error } = await supabase
        .from('calendar_integrations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setIntegrations(prev => prev.filter(integration => integration.id !== id));
      toast.success('Интеграция удалена');
    } catch (error) {
      console.error('Ошибка при удалении интеграции:', error);
      toast.error('Не удалось удалить интеграцию');
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  return {
    integrations,
    loading,
    createIntegration,
    updateIntegration,
    deleteIntegration,
    refetch: fetchIntegrations
  };
};
