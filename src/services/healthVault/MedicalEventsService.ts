
import { supabase } from '@/integrations/supabase/client';
import { MedicalEvent } from '@/types/healthVault';

export class MedicalEventsService {
  static async createEvent(eventData: Partial<MedicalEvent>): Promise<MedicalEvent> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Ensure required fields are present and convert arrays to JSON
    const dataToInsert = {
      ...eventData,
      user_id: user.id,
      event_date: eventData.event_date || new Date().toISOString().split('T')[0],
      title: eventData.title || 'Medical Event',
      event_type: eventData.event_type || 'general',
      status: eventData.status || 'active',
      priority: eventData.priority || 'medium',
      follow_up_required: eventData.follow_up_required || false,
      icd_codes: JSON.stringify(eventData.icd_codes || []),
      symptoms: JSON.stringify(eventData.symptoms || []),
      medications: JSON.stringify(eventData.medications || []),
      results: eventData.results || {},
      attached_files: JSON.stringify(eventData.attached_files || [])
    };

    const { data, error } = await supabase
      .from('medical_events')
      .insert(dataToInsert)
      .select()
      .single();
      
    if (error) {
      throw new Error(`Ошибка создания события: ${error.message}`);
    }
    
    // Convert JSON strings back to arrays for the response
    return {
      ...data,
      icd_codes: Array.isArray(data.icd_codes) ? data.icd_codes : JSON.parse(data.icd_codes || '[]'),
      symptoms: Array.isArray(data.symptoms) ? data.symptoms : JSON.parse(data.symptoms || '[]'),
      medications: Array.isArray(data.medications) ? data.medications : JSON.parse(data.medications || '[]'),
      attached_files: Array.isArray(data.attached_files) ? data.attached_files : JSON.parse(data.attached_files || '[]')
    };
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
    
    // Convert JSON strings back to arrays
    return (data || []).map(event => ({
      ...event,
      icd_codes: Array.isArray(event.icd_codes) ? event.icd_codes : JSON.parse(event.icd_codes || '[]'),
      symptoms: Array.isArray(event.symptoms) ? event.symptoms : JSON.parse(event.symptoms || '[]'),
      medications: Array.isArray(event.medications) ? event.medications : JSON.parse(event.medications || '[]'),
      attached_files: Array.isArray(event.attached_files) ? event.attached_files : JSON.parse(event.attached_files || '[]')
    }));
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
    
    // Convert JSON strings back to arrays
    return {
      ...data,
      icd_codes: Array.isArray(data.icd_codes) ? data.icd_codes : JSON.parse(data.icd_codes || '[]'),
      symptoms: Array.isArray(data.symptoms) ? data.symptoms : JSON.parse(data.symptoms || '[]'),
      medications: Array.isArray(data.medications) ? data.medications : JSON.parse(data.medications || '[]'),
      attached_files: Array.isArray(data.attached_files) ? data.attached_files : JSON.parse(data.attached_files || '[]')
    };
  }
  
  static async updateEvent(eventId: string, updates: Partial<MedicalEvent>): Promise<MedicalEvent> {
    // Convert arrays to JSON strings if they exist in updates
    const updatesWithJson = {
      ...updates,
      ...(updates.icd_codes && { icd_codes: JSON.stringify(updates.icd_codes) }),
      ...(updates.symptoms && { symptoms: JSON.stringify(updates.symptoms) }),
      ...(updates.medications && { medications: JSON.stringify(updates.medications) }),
      ...(updates.attached_files && { attached_files: JSON.stringify(updates.attached_files) })
    };

    const { data, error } = await supabase
      .from('medical_events')
      .update(updatesWithJson)
      .eq('id', eventId)
      .select()
      .single();
      
    if (error) {
      throw new Error(`Ошибка обновления события: ${error.message}`);
    }
    
    // Convert JSON strings back to arrays
    return {
      ...data,
      icd_codes: Array.isArray(data.icd_codes) ? data.icd_codes : JSON.parse(data.icd_codes || '[]'),
      symptoms: Array.isArray(data.symptoms) ? data.symptoms : JSON.parse(data.symptoms || '[]'),
      medications: Array.isArray(data.medications) ? data.medications : JSON.parse(data.medications || '[]'),
      attached_files: Array.isArray(data.attached_files) ? data.attached_files : JSON.parse(data.attached_files || '[]')
    };
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
    
    // Convert JSON strings back to arrays
    return (data || []).map(event => ({
      ...event,
      icd_codes: Array.isArray(event.icd_codes) ? event.icd_codes : JSON.parse(event.icd_codes || '[]'),
      symptoms: Array.isArray(event.symptoms) ? event.symptoms : JSON.parse(event.symptoms || '[]'),
      medications: Array.isArray(event.medications) ? event.medications : JSON.parse(event.medications || '[]'),
      attached_files: Array.isArray(event.attached_files) ? event.attached_files : JSON.parse(event.attached_files || '[]')
    }));
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
    
    // Convert JSON strings back to arrays
    return (data || []).map(event => ({
      ...event,
      icd_codes: Array.isArray(event.icd_codes) ? event.icd_codes : JSON.parse(event.icd_codes || '[]'),
      symptoms: Array.isArray(event.symptoms) ? event.symptoms : JSON.parse(event.symptoms || '[]'),
      medications: Array.isArray(event.medications) ? event.medications : JSON.parse(event.medications || '[]'),
      attached_files: Array.isArray(event.attached_files) ? event.attached_files : JSON.parse(event.attached_files || '[]')
    }));
  }
}
