
import { ApiModule, GatewayRequest, GatewayResponse } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { GatewayMiddleware } from '../middleware';

export const authModule: ApiModule = {
  name: 'auth',
  version: '1.0.0',
  routes: {
    'POST:login': async (req: GatewayRequest): Promise<any> => {
      const { email, password } = req.body;
      
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw new Error('Authentication failed: ' + error.message);
      }

      return {
        user: data.user,
        session: data.session
      };
    },

    'POST:register': async (req: GatewayRequest): Promise<any> => {
      const { email, password, firstName, lastName } = req.body;
      
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName
          }
        }
      });

      if (error) {
        throw new Error('Registration failed: ' + error.message);
      }

      return {
        user: data.user,
        session: data.session
      };
    },

    'POST:logout': async (req: GatewayRequest): Promise<any> => {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw new Error('Logout failed: ' + error.message);
      }

      return { success: true };
    },

    'POST:reset-password': async (req: GatewayRequest): Promise<any> => {
      const { email } = req.body;
      
      if (!email) {
        throw new Error('Email is required');
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) {
        throw new Error('Password reset failed: ' + error.message);
      }

      return { message: 'Password reset email sent' };
    },

    'GET:me': async (req: GatewayRequest): Promise<any> => {
      if (!req.user) {
        throw new Error('User not authenticated');
      }

      // Получаем полный профиль пользователя
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', req.user.id)
        .single();

      if (error) {
        throw new Error('Failed to fetch user profile');
      }

      return {
        id: req.user.id,
        email: req.user.email,
        ...profile
      };
    }
  },

  healthCheck: async () => {
    try {
      // Проверяем подключение к Supabase
      const { error } = await supabase.from('profiles').select('count').limit(1);
      
      if (error) {
        return { status: 'unhealthy', details: error.message };
      }

      return { status: 'healthy' };
    } catch (error: any) {
      return { status: 'unhealthy', details: error.message };
    }
  }
};
