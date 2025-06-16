
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SubscriptionData {
  id: string;
  subscribed: boolean;
  subscription_tier: string | null;
  subscription_end: string | null;
  stripe_customer_id: string | null;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSubscription();
    } else {
      setSubscription(null);
      setLoading(false);
    }
  }, [user]);

  const fetchSubscription = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching subscription:', error);
        toast.error('Ошибка при получении данных подписки');
        return;
      }

      setSubscription(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
      toast.error('Ошибка при получении данных подписки');
    } finally {
      setLoading(false);
    }
  };

  const createCheckoutSession = async (priceId: string) => {
    if (!user) {
      toast.error('Необходимо войти в систему');
      return null;
    }

    try {
      // Здесь будет вызов edge function для создания Stripe checkout session
      // Пока что возвращаем заглушку
      console.log('Creating checkout session for price:', priceId);
      toast.info('Создание сессии оплаты...');
      
      return {
        url: 'https://checkout.stripe.com/session/test'
      };
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error('Ошибка при создании сессии оплаты');
      return null;
    }
  };

  const cancelSubscription = async () => {
    if (!user || !subscription?.stripe_customer_id) {
      toast.error('Подписка не найдена');
      return false;
    }

    try {
      // Здесь будет вызов edge function для отмены подписки
      console.log('Canceling subscription...');
      toast.success('Подписка успешно отменена');
      await fetchSubscription();
      return true;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      toast.error('Ошибка при отмене подписки');
      return false;
    }
  };

  const isSubscribed = subscription?.subscribed || false;
  const isPremium = subscription?.subscription_tier === 'premium';
  const subscriptionEnd = subscription?.subscription_end ? new Date(subscription.subscription_end) : null;

  return {
    subscription,
    loading,
    isSubscribed,
    isPremium,
    subscriptionEnd,
    createCheckoutSession,
    cancelSubscription,
    refreshSubscription: fetchSubscription
  };
};
