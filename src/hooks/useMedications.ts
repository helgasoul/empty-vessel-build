
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface TreatmentPlan {
  id: string;
  user_id: string;
  plan_name: string;
  doctor_name?: string;
  consultation_id?: string;
  start_date: string;
  end_date?: string;
  is_active: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Medication {
  id: string;
  treatment_plan_id: string;
  medication_name: string;
  dosage: string;
  frequency: string;
  times_per_day: number;
  specific_times?: string[];
  instructions?: string;
  side_effects?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MedicationReminder {
  id: string;
  user_id: string;
  medication_id: string;
  reminder_time: string;
  days_of_week: number[];
  is_active: boolean;
  last_taken_at?: string;
  created_at: string;
  updated_at: string;
}

export const useMedications = () => {
  const [treatmentPlans, setTreatmentPlans] = useState<TreatmentPlan[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [reminders, setReminders] = useState<MedicationReminder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTreatmentPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('treatment_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTreatmentPlans(data || []);
    } catch (error) {
      console.error('Ошибка при загрузке планов лечения:', error);
      toast.error('Не удалось загрузить планы лечения');
    }
  };

  const fetchMedications = async () => {
    try {
      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMedications(data || []);
    } catch (error) {
      console.error('Ошибка при загрузке лекарств:', error);
      toast.error('Не удалось загрузить лекарства');
    }
  };

  const fetchReminders = async () => {
    try {
      const { data, error } = await supabase
        .from('medication_reminders')
        .select('*')
        .order('reminder_time', { ascending: true });

      if (error) throw error;
      setReminders(data || []);
    } catch (error) {
      console.error('Ошибка при загрузке напоминаний:', error);
      toast.error('Не удалось загрузить напоминания');
    }
  };

  const addTreatmentPlan = async (planData: Omit<TreatmentPlan, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Пользователь не авторизован');

      const { data, error } = await supabase
        .from('treatment_plans')
        .insert({
          user_id: user.id,
          ...planData
        })
        .select()
        .single();

      if (error) throw error;

      setTreatmentPlans(prev => [data, ...prev]);
      toast.success('План лечения добавлен');
      return data;
    } catch (error) {
      console.error('Ошибка при добавлении плана лечения:', error);
      toast.error('Не удалось добавить план лечения');
      throw error;
    }
  };

  const addMedication = async (medicationData: Omit<Medication, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('medications')
        .insert(medicationData)
        .select()
        .single();

      if (error) throw error;

      setMedications(prev => [data, ...prev]);
      toast.success('Лекарство добавлено');
      return data;
    } catch (error) {
      console.error('Ошибка при добавлении лекарства:', error);
      toast.error('Не удалось добавить лекарство');
      throw error;
    }
  };

  const addReminder = async (reminderData: Omit<MedicationReminder, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Пользователь не авторизован');

      const { data, error } = await supabase
        .from('medication_reminders')
        .insert({
          user_id: user.id,
          ...reminderData
        })
        .select()
        .single();

      if (error) throw error;

      setReminders(prev => [...prev, data]);
      toast.success('Напоминание добавлено');
      return data;
    } catch (error) {
      console.error('Ошибка при добавлении напоминания:', error);
      toast.error('Не удалось добавить напоминание');
      throw error;
    }
  };

  const logMedicationTaken = async (medicationId: string, wasOnTime: boolean = true, notes?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Пользователь не авторизован');

      const { error } = await supabase
        .from('medication_logs')
        .insert({
          user_id: user.id,
          medication_id: medicationId,
          was_on_time: wasOnTime,
          notes
        });

      if (error) throw error;

      // Обновляем время последнего приема в напоминании
      await supabase
        .from('medication_reminders')
        .update({ last_taken_at: new Date().toISOString() })
        .eq('medication_id', medicationId);

      toast.success('Прием лекарства зафиксирован');
    } catch (error) {
      console.error('Ошибка при регистрации приема лекарства:', error);
      toast.error('Не удалось зафиксировать прием лекарства');
      throw error;
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchTreatmentPlans(),
      fetchMedications(),
      fetchReminders()
    ]).finally(() => setLoading(false));
  }, []);

  return {
    treatmentPlans,
    medications,
    reminders,
    loading,
    addTreatmentPlan,
    addMedication,
    addReminder,
    logMedicationTaken,
    refetch: () => {
      fetchTreatmentPlans();
      fetchMedications();
      fetchReminders();
    }
  };
};
