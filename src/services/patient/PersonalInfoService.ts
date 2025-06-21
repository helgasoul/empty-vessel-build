
import { supabase } from '@/integrations/supabase/client';

export class PersonalInfoService {
  static async loadPersonalInfo(patientId: string) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', patientId)
      .single();

    return {
      name: profile?.full_name || 'Пациент',
      dateOfBirth: profile?.date_of_birth ? new Date(profile.date_of_birth) : new Date(),
      email: profile?.email || '',
      phone: undefined, // This field doesn't exist in the profiles table
      address: undefined, // This field doesn't exist in the profiles table
      emergencyContact: profile?.emergency_contact_name ? {
        name: profile.emergency_contact_name,
        relationship: 'Unknown',
        phone: profile.emergency_contact_phone || ''
      } : undefined,
      insurance: undefined // This field structure doesn't match the actual schema
    };
  }
}
