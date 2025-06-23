
import { ApiModule, GatewayRequest } from '../types';
import { supabase } from '@/integrations/supabase/client';

export const medicalModule: ApiModule = {
  name: 'medical',
  version: '1.0.0',
  routes: {
    'GET:partners': async (req: GatewayRequest) => {
      const { data: partners, error } = await supabase
        .from('medical_partners')
        .select('*')
        .eq('integration_status', 'active')
        .order('quality_rating', { ascending: false });

      if (error) {
        throw new Error('Failed to fetch medical partners: ' + error.message);
      }

      return partners;
    },

    'POST:appointments/gynecology': async (req: GatewayRequest) => {
      if (!req.user) {
        throw new Error('Authentication required');
      }

      const appointmentData = {
        user_id: req.user.id,
        ...req.body
      };

      const { data, error } = await supabase
        .from('gynecology_appointments')
        .insert(appointmentData)
        .select()
        .single();

      if (error) {
        throw new Error('Failed to create appointment: ' + error.message);
      }

      return data;
    },

    'GET:appointments/gynecology': async (req: GatewayRequest) => {
      if (!req.user) {
        throw new Error('Authentication required');
      }

      const { data: appointments, error } = await supabase
        .from('gynecology_appointments')
        .select(`
          *,
          medical_partner:partner_id(partner_name, phone, address)
        `)
        .eq('user_id', req.user.id)
        .order('appointment_date', { ascending: true });

      if (error) {
        throw new Error('Failed to fetch appointments: ' + error.message);
      }

      return appointments;
    },

    'POST:lab-tests': async (req: GatewayRequest) => {
      if (!req.user) {
        throw new Error('Authentication required');
      }

      const testData = {
        user_id: req.user.id,
        ...req.body
      };

      const { data, error } = await supabase
        .from('lab_tests')
        .insert(testData)
        .select()
        .single();

      if (error) {
        throw new Error('Failed to create lab test: ' + error.message);
      }

      return data;
    },

    'GET:lab-tests': async (req: GatewayRequest) => {
      if (!req.user) {
        throw new Error('Authentication required');
      }

      const { data: tests, error } = await supabase
        .from('lab_tests')
        .select(`
          *,
          medical_partner:partner_id(partner_name, phone, address)
        `)
        .eq('user_id', req.user.id)
        .order('collection_date', { ascending: true });

      if (error) {
        throw new Error('Failed to fetch lab tests: ' + error.message);
      }

      return tests;
    },

    'GET:reminders': async (req: GatewayRequest) => {
      if (!req.user) {
        throw new Error('Authentication required');
      }

      const { data: reminders, error } = await supabase
        .from('medical_reminders')
        .select('*')
        .eq('user_id', req.user.id)
        .order('trigger_date', { ascending: true });

      if (error) {
        throw new Error('Failed to fetch reminders: ' + error.message);
      }

      return reminders;
    },

    'GET:screening-plans': async (req: GatewayRequest) => {
      if (!req.user) {
        throw new Error('Authentication required');
      }

      const { data: plans, error } = await supabase
        .from('screening_plans')
        .select('*')
        .eq('user_id', req.user.id)
        .order('priority_level', { ascending: false });

      if (error) {
        throw new Error('Failed to fetch screening plans: ' + error.message);
      }

      return plans;
    }
  },

  healthCheck: async () => {
    try {
      // Проверяем подключение к медицинским таблицам
      const { error } = await supabase
        .from('medical_partners')
        .select('count')
        .limit(1);
      
      if (error) {
        return { status: 'unhealthy', details: error.message };
      }

      return { status: 'healthy' };
    } catch (error) {
      return { status: 'unhealthy', details: error.message };
    }
  }
};
