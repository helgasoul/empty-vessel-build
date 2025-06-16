
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { VideoConferenceIntegration, RawVideoConferenceIntegration } from '@/types/telemedicine';

// Функция для преобразования данных из Supabase в типизированные данные
const transformVideoConferenceIntegration = (raw: RawVideoConferenceIntegration): VideoConferenceIntegration => ({
  ...raw,
  platform_type: raw.platform_type as VideoConferenceIntegration['platform_type'],
  integration_status: raw.integration_status as VideoConferenceIntegration['integration_status'],
  platform_settings: raw.platform_settings || {}
});

export const useVideoConferenceIntegrations = () => {
  const [integrations, setIntegrations] = useState<VideoConferenceIntegration[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchIntegrations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('video_conference_integrations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const transformedData = (data || []).map(transformVideoConferenceIntegration);
      setIntegrations(transformedData);
    } catch (error) {
      console.error('Ошибка при загрузке интеграций видеоконференций:', error);
      toast.error('Не удалось загрузить интеграции');
    } finally {
      setLoading(false);
    }
  };

  const createIntegration = async (integrationData: Omit<VideoConferenceIntegration, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Пользователь не авторизован');

      const { data, error } = await supabase
        .from('video_conference_integrations')
        .insert({
          user_id: user.id,
          ...integrationData
        })
        .select()
        .single();

      if (error) throw error;

      const transformedData = transformVideoConferenceIntegration(data);
      setIntegrations(prev => [transformedData, ...prev]);
      toast.success('Интеграция видеоконференций создана');
      return transformedData;
    } catch (error) {
      console.error('Ошибка при создании интеграции:', error);
      toast.error('Не удалось создать интеграцию');
      throw error;
    }
  };

  const updateIntegration = async (id: string, updates: Partial<VideoConferenceIntegration>) => {
    try {
      const { data, error } = await supabase
        .from('video_conference_integrations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const transformedData = transformVideoConferenceIntegration(data);
      setIntegrations(prev => prev.map(integration => 
        integration.id === id ? transformedData : integration
      ));
      toast.success('Интеграция обновлена');
      return transformedData;
    } catch (error) {
      console.error('Ошибка при обновлении интеграции:', error);
      toast.error('Не удалось обновить интеграцию');
      throw error;
    }
  };

  const deleteIntegration = async (id: string) => {
    try {
      const { error } = await supabase
        .from('video_conference_integrations')
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
