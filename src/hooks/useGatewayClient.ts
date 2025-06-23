
import React, { useState, useCallback } from 'react';
import { gatewayClient } from '@/lib/gateway/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useGatewayClient = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Устанавливаем токен аутентификации при изменении пользователя
  React.useEffect(() => {
    if (user) {
      // В реальном приложении здесь будет получение JWT токена
      // Пока используем Supabase session
      gatewayClient.setAuthToken(user.id);
    }
  }, [user]);

  const executeRequest = useCallback(async (requestFn: () => Promise<any>) => {
    setLoading(true);
    try {
      const result = await requestFn();
      return result;
    } catch (error: any) {
      console.error('Gateway request failed:', error);
      toast({
        title: 'Ошибка запроса',
        description: error.message || 'Произошла ошибка при выполнении запроса',
        variant: 'destructive'
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    loading,
    client: gatewayClient,
    executeRequest
  };
};
