
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PartnerProvider {
  id: string;
  name: string;
  provider_type: 'clinic' | 'laboratory' | 'hospital' | 'diagnostic_center';
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  specializations?: string[];
  working_hours?: Record<string, string>;
  is_active: boolean;
  rating?: number;
  created_at: string;
  updated_at: string;
}

export interface PartnerDoctor {
  id: string;
  provider_id: string;
  full_name: string;
  specialization: string;
  qualification?: string;
  experience_years?: number;
  consultation_fee?: number;
  available_slots?: any[];
  is_available: boolean;
  rating?: number;
  bio?: string;
  photo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface MedicalAppointment {
  id: string;
  user_id: string;
  provider_id: string;
  doctor_id?: string;
  appointment_type: 'consultation' | 'lab_test' | 'diagnostic' | 'procedure' | 'telemedicine';
  appointment_date: string;
  appointment_time: string;
  duration_minutes?: number;
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  reason?: string;
  notes?: string;
  cost?: number;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  reminder_sent: boolean;
  created_at: string;
  updated_at: string;
}

export const useMedicalAppointments = () => {
  const [providers, setProviders] = useState<PartnerProvider[]>([]);
  const [doctors, setDoctors] = useState<PartnerDoctor[]>([]);
  const [appointments, setAppointments] = useState<MedicalAppointment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProviders = async () => {
    try {
      const { data, error } = await supabase
        .from('partner_providers')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedProviders: PartnerProvider[] = (data || []).map(provider => ({
        ...provider,
        provider_type: provider.provider_type as PartnerProvider['provider_type'],
        specializations: provider.specializations || [],
        working_hours: (provider.working_hours as Record<string, string>) || {}
      }));
      
      setProviders(transformedProviders);
    } catch (error) {
      console.error('Ошибка при загрузке провайдеров:', error);
      toast.error('Не удалось загрузить список клиник и лабораторий');
    }
  };

  const fetchDoctors = async (providerId?: string) => {
    try {
      let query = supabase
        .from('partner_doctors')
        .select('*')
        .eq('is_available', true)
        .order('full_name');

      if (providerId) {
        query = query.eq('provider_id', providerId);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedDoctors: PartnerDoctor[] = (data || []).map(doctor => ({
        ...doctor,
        available_slots: Array.isArray(doctor.available_slots) ? doctor.available_slots : []
      }));
      
      setDoctors(transformedDoctors);
    } catch (error) {
      console.error('Ошибка при загрузке врачей:', error);
      toast.error('Не удалось загрузить список врачей');
    }
  };

  const fetchAppointments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('medical_appointments')
        .select('*')
        .eq('user_id', user.id)
        .order('appointment_date', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedAppointments: MedicalAppointment[] = (data || []).map(appointment => ({
        ...appointment,
        appointment_type: appointment.appointment_type as MedicalAppointment['appointment_type'],
        status: appointment.status as MedicalAppointment['status'],
        payment_status: appointment.payment_status as MedicalAppointment['payment_status']
      }));
      
      setAppointments(transformedAppointments);
    } catch (error) {
      console.error('Ошибка при загрузке записей:', error);
      toast.error('Не удалось загрузить ваши записи');
    } finally {
      setLoading(false);
    }
  };

  const createAppointment = async (appointmentData: Partial<MedicalAppointment>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Пользователь не авторизован');

      const { data, error } = await supabase
        .from('medical_appointments')
        .insert({
          user_id: user.id,
          provider_id: appointmentData.provider_id!,
          doctor_id: appointmentData.doctor_id,
          appointment_type: appointmentData.appointment_type!,
          appointment_date: appointmentData.appointment_date!,
          appointment_time: appointmentData.appointment_time!,
          duration_minutes: appointmentData.duration_minutes,
          status: appointmentData.status || 'scheduled',
          reason: appointmentData.reason,
          notes: appointmentData.notes,
          cost: appointmentData.cost,
          payment_status: appointmentData.payment_status || 'pending',
          reminder_sent: false
        })
        .select()
        .single();

      if (error) throw error;

      // Transform the returned data to match our interface
      const transformedAppointment: MedicalAppointment = {
        ...data,
        appointment_type: data.appointment_type as MedicalAppointment['appointment_type'],
        status: data.status as MedicalAppointment['status'],
        payment_status: data.payment_status as MedicalAppointment['payment_status']
      };

      setAppointments(prev => [transformedAppointment, ...prev]);
      toast.success('Запись успешно создана');
      return transformedAppointment;
    } catch (error) {
      console.error('Ошибка при создании записи:', error);
      toast.error('Не удалось создать запись');
      throw error;
    }
  };

  const updateAppointment = async (id: string, updates: Partial<MedicalAppointment>) => {
    try {
      const { data, error } = await supabase
        .from('medical_appointments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Transform the returned data to match our interface
      const transformedAppointment: MedicalAppointment = {
        ...data,
        appointment_type: data.appointment_type as MedicalAppointment['appointment_type'],
        status: data.status as MedicalAppointment['status'],
        payment_status: data.payment_status as MedicalAppointment['payment_status']
      };

      setAppointments(prev => prev.map(appointment => 
        appointment.id === id ? transformedAppointment : appointment
      ));
      toast.success('Запись обновлена');
      return transformedAppointment;
    } catch (error) {
      console.error('Ошибка при обновлении записи:', error);
      toast.error('Не удалось обновить запись');
      throw error;
    }
  };

  const cancelAppointment = async (id: string) => {
    try {
      await updateAppointment(id, { status: 'cancelled' });
      toast.success('Запись отменена');
    } catch (error) {
      console.error('Ошибка при отмене записи:', error);
      toast.error('Не удалось отменить запись');
    }
  };

  useEffect(() => {
    fetchProviders();
    fetchAppointments();
  }, []);

  return {
    providers,
    doctors,
    appointments,
    loading,
    fetchProviders,
    fetchDoctors,
    fetchAppointments,
    createAppointment,
    updateAppointment,
    cancelAppointment
  };
};
