
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface HealthAppIntegration {
  id: string;
  user_id: string;
  app_name: 'flo' | 'maam' | 'clue' | 'period_tracker';
  app_user_id?: string;
  access_token?: string;
  refresh_token?: string;
  token_expires_at?: string;
  integration_status: 'pending' | 'connected' | 'disconnected' | 'error';
  last_sync_at?: string;
  sync_settings?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ExternalHealthData {
  id: string;
  user_id: string;
  integration_id: string;
  data_type: string;
  external_id?: string;
  data_payload: Record<string, any>;
  recorded_date: string;
  synced_at: string;
  created_at: string;
}

export const useHealthAppIntegrations = () => {
  const [integrations, setIntegrations] = useState<HealthAppIntegration[]>([]);
  const [externalData, setExternalData] = useState<ExternalHealthData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchIntegrations = async () => {
    try {
      const { data, error } = await supabase
        .from('health_app_integrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type assertion для корректного преобразования данных из Supabase
      const typedData = (data || []).map(item => ({
        ...item,
        app_name: item.app_name as 'flo' | 'maam' | 'clue' | 'period_tracker',
        integration_status: item.integration_status as 'pending' | 'connected' | 'disconnected' | 'error',
        sync_settings: item.sync_settings as Record<string, any>
      }));
      
      setIntegrations(typedData);
    } catch (error) {
      console.error('Ошибка при загрузке интеграций:', error);
      toast.error('Не удалось загрузить интеграции');
    } finally {
      setLoading(false);
    }
  };

  const fetchExternalData = async (integrationId?: string) => {
    try {
      let query = supabase
        .from('external_health_data')
        .select('*')
        .order('recorded_date', { ascending: false });

      if (integrationId) {
        query = query.eq('integration_id', integrationId);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Type assertion для корректного преобразования данных из Supabase
      const typedData = (data || []).map(item => ({
        ...item,
        data_payload: item.data_payload as Record<string, any>
      }));
      
      setExternalData(typedData);
    } catch (error) {
      console.error('Ошибка при загрузке внешних данных:', error);
      toast.error('Не удалось загрузить данные из внешних приложений');
    }
  };

  const createIntegration = async (appName: 'flo' | 'maam' | 'clue' | 'period_tracker') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Пользователь не авторизован');

      const { data, error } = await supabase
        .from('health_app_integrations')
        .insert({
          user_id: user.id,
          app_name: appName,
          integration_status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      // Type assertion для добавления в state
      const typedData = {
        ...data,
        app_name: data.app_name as 'flo' | 'maam' | 'clue' | 'period_tracker',
        integration_status: data.integration_status as 'pending' | 'connected' | 'disconnected' | 'error',
        sync_settings: data.sync_settings as Record<string, any>
      };

      setIntegrations(prev => [typedData, ...prev]);
      toast.success(`Интеграция с ${appName.toUpperCase()} создана`);
      return typedData;
    } catch (error) {
      console.error('Ошибка при создании интеграции:', error);
      toast.error('Не удалось создать интеграцию');
      throw error;
    }
  };

  const updateIntegration = async (id: string, updates: Partial<HealthAppIntegration>) => {
    try {
      const { data, error } = await supabase
        .from('health_app_integrations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Type assertion для обновления в state
      const typedData = {
        ...data,
        app_name: data.app_name as 'flo' | 'maam' | 'clue' | 'period_tracker',
        integration_status: data.integration_status as 'pending' | 'connected' | 'disconnected' | 'error',
        sync_settings: data.sync_settings as Record<string, any>
      };

      setIntegrations(prev => prev.map(integration => 
        integration.id === id ? typedData : integration
      ));
      toast.success('Интеграция обновлена');
      return typedData;
    } catch (error) {
      console.error('Ошибка при обновлении интеграции:', error);
      toast.error('Не удалось обновить интеграцию');
      throw error;
    }
  };

  const deleteIntegration = async (id: string) => {
    try {
      const { error } = await supabase
        .from('health_app_integrations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setIntegrations(prev => prev.filter(integration => integration.id !== id));
      toast.success('Интеграция удалена');
    } catch (error) {
      console.error('Ошибка при удалении интеграции:', error);
      toast.error('Не удалось удалить интеграцию');
      throw error;
    }
  };

  const syncData = async (integrationId: string) => {
    try {
      // В реальном приложении здесь был бы вызов API внешнего приложения
      // Для демонстрации создадим тестовые данные
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Пользователь не авторизован');

      const testData = {
        user_id: user.id,
        integration_id: integrationId,
        data_type: 'menstrual_cycle',
        data_payload: {
          cycle_start_date: new Date().toISOString().split('T')[0],
          period_length: 5,
          flow_intensity: 'moderate',
          symptoms: ['Боли в животе', 'Усталость']
        },
        recorded_date: new Date().toISOString().split('T')[0]
      };

      const { data, error } = await supabase
        .from('external_health_data')
        .insert(testData)
        .select()
        .single();

      if (error) throw error;

      // Обновляем статус интеграции
      await updateIntegration(integrationId, {
        integration_status: 'connected',
        last_sync_at: new Date().toISOString()
      });

      // Type assertion для добавления в state
      const typedData = {
        ...data,
        data_payload: data.data_payload as Record<string, any>
      };

      setExternalData(prev => [typedData, ...prev]);
      toast.success('Данные синхронизированы');
      return typedData;
    } catch (error) {
      console.error('Ошибка при синхронизации данных:', error);
      toast.error('Не удалось синхронизировать данные');
      
      // Обновляем статус интеграции на ошибку
      await updateIntegration(integrationId, {
        integration_status: 'error'
      });
      
      throw error;
    }
  };

  useEffect(() => {
    fetchIntegrations();
    fetchExternalData();
  }, []);

  return {
    integrations,
    externalData,
    loading,
    createIntegration,
    updateIntegration,
    deleteIntegration,
    syncData,
    refetchIntegrations: fetchIntegrations,
    refetchExternalData: fetchExternalData
  };
};
