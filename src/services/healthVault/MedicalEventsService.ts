
import { supabase } from '@/integrations/supabase/client';
import { MedicalEvent } from '@/types/healthVault';

export class MedicalEventsService {
  static async createEvent(eventData: Partial<MedicalEvent>): Promise<MedicalEvent> {
    const { data, error } = await supabase
      .from('medical_events')
      .insert({
        ...eventData,
        icd_codes: eventData.icd_codes || [],
        symptoms: eventData.symptoms || [],
        medications: eventData.medications || [],
        results: eventData.results || {},
        attached_files: eventData.attached_files || []
      })
      .select()
      .single();
      
    if (error) {
      throw new Error(`Ошибка создания события: ${error.message}`);
    }
    
    return data;
  }
  
  static async getUserEvents(userId: string): Promise<MedicalEvent[]> {
    const { data, error } = await supabase
      .from('medical_events')
      .select('*')
      .eq('user_id', userId)
      .order('event_date', { ascending: false });
      
    if (error) {
      throw new Error(`Ошибка получения событий: ${error.message}`);
    }
    
    return data || [];
  }
  
  static async getEventById(eventId: string): Promise<MedicalEvent | null> {
    const { data, error } = await supabase
      .from('medical_events')
      .select('*')
      .eq('id', eventId)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Ошибка получения события: ${error.message}`);
    }
    
    return data;
  }
  
  static async updateEvent(eventId: string, updates: Partial<MedicalEvent>): Promise<MedicalEvent> {
    const { data, error } = await supabase
      .from('medical_events')
      .update(updates)
      .eq('id', eventId)
      .select()
      .single();
      
    if (error) {
      throw new Error(`Ошибка обновления события: ${error.message}`);
    }
    
    return data;
  }
  
  static async deleteEvent(eventId: string): Promise<void> {
    const { error } = await supabase
      .from('medical_events')
      .delete()
      .eq('id', eventId);
      
    if (error) {
      throw new Error(`Ошибка удаления события: ${error.message}`);
    }
  }
  
  static async getEventsByType(userId: string, eventType: string): Promise<MedicalEvent[]> {
    const { data, error } = await supabase
      .from('medical_events')
      .select('*')
      .eq('user_id', userId)
      .eq('event_type', eventType)
      .order('event_date', { ascending: false });
      
    if (error) {
      throw new Error(`Ошибка получения событий по типу: ${error.message}`);
    }
    
    return data || [];
  }
  
  static async getUpcomingEvents(userId: string): Promise<MedicalEvent[]> {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('medical_events')
      .select('*')
      .eq('user_id', userId)
      .gte('event_date', today)
      .eq('status', 'scheduled')
      .order('event_date', { ascending: true });
      
    if (error) {
      throw new Error(`Ошибка получения предстоящих событий: ${error.message}`);
    }
    
    return data || [];
  }
}
