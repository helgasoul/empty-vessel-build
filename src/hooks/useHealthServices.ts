
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface HealthServiceOrder {
  id: string;
  user_id: string;
  service_type: 'nutrition' | 'fitness' | 'pharmacy';
  service_provider: string;
  order_data: Record<string, any>;
  cycle_phase_at_order?: string;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  total_amount?: number;
  estimated_delivery?: string;
  created_at: string;
  updated_at: string;
}

export interface HealthServiceIntegration {
  id: string;
  user_id: string;
  service_type: 'nutrition' | 'fitness' | 'pharmacy';
  provider_name: string;
  integration_status: 'active' | 'inactive' | 'error';
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export const useHealthServiceOrders = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['health-service-orders', user?.id],
    queryFn: async () => {
      if (!user) return [];

      try {
        const { data, error } = await (supabase as any)
          .from('health_service_orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching health service orders:', error);
          return [];
        }

        return (data || []) as HealthServiceOrder[];
      } catch (error) {
        console.error('Database error:', error);
        return [];
      }
    },
    enabled: !!user?.id,
  });
};

export const useCreateHealthServiceOrder = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (orderData: {
      service_type: HealthServiceOrder['service_type'];
      service_provider: string;
      order_data: Record<string, any>;
      cycle_phase_at_order?: string;
      total_amount?: number;
      estimated_delivery?: string;
    }) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      try {
        const { data, error } = await (supabase as any)
          .from('health_service_orders')
          .insert({
            ...orderData,
            user_id: user.id,
          })
          .select()
          .single();

        if (error) {
          throw new Error(error.message);
        }

        return data as HealthServiceOrder;
      } catch (error) {
        console.error('Error creating health service order:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['health-service-orders'] });
      toast({
        title: "Заказ создан",
        description: `Заказ в ${data.service_provider} успешно оформлен`,
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка заказа",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useHealthServiceIntegrations = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['health-service-integrations', user?.id],
    queryFn: async () => {
      if (!user) return [];

      try {
        const { data, error } = await (supabase as any)
          .from('health_service_integrations')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching health service integrations:', error);
          return [];
        }

        return (data || []) as HealthServiceIntegration[];
      } catch (error) {
        console.error('Database error:', error);
        return [];
      }
    },
    enabled: !!user?.id,
  });
};

export const useCreateHealthServiceIntegration = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (integrationData: {
      service_type: HealthServiceIntegration['service_type'];
      provider_name: string;
      settings: Record<string, any>;
    }) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      try {
        const { data, error } = await (supabase as any)
          .from('health_service_integrations')
          .insert({
            ...integrationData,
            user_id: user.id,
          })
          .select()
          .single();

        if (error) {
          throw new Error(error.message);
        }

        return data as HealthServiceIntegration;
      } catch (error) {
        console.error('Error creating health service integration:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['health-service-integrations'] });
      toast({
        title: "Интеграция создана",
        description: `Подключение к ${data.provider_name} настроено`,
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка интеграции",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Утилитарные функции для работы с циклом
export const getCycleBasedRecommendations = (cyclePhase: string, serviceType: string) => {
  const recommendations = {
    nutrition: {
      menstrual: ['железо', 'магний', 'теплые напитки', 'противовоспалительные продукты'],
      follicular: ['белок', 'витамины группы B', 'цитрусовые', 'зеленые овощи'],
      ovulation: ['антиоксиданты', 'омега-3', 'цельные злаки', 'орехи'],
      luteal: ['сложные углеводы', 'кальций', 'магний', 'травяные чаи']
    },
    fitness: {
      menstrual: ['йога', 'растяжка', 'медитация', 'легкая ходьба'],
      follicular: ['кардио', 'танцы', 'плавание', 'пилатес'],
      ovulation: ['силовые тренировки', 'HIIT', 'интенсивные тренировки'],
      luteal: ['барре', 'умеренная силовая', 'йога', 'стретчинг']
    },
    pharmacy: {
      menstrual: ['железо', 'магний', 'спазмолитики', 'витамин C'],
      follicular: ['витамины группы B', 'фолиевая кислота', 'пробиотики'],
      ovulation: ['коэнзим Q10', 'витамин E', 'омега-3'],
      luteal: ['магний', 'витамин B6', 'масло примулы вечерней']
    }
  };

  return recommendations[serviceType as keyof typeof recommendations]?.[cyclePhase as keyof typeof recommendations.nutrition] || [];
};
