
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export class PatientPermissionsService {
  static async shareDataWithDoctor(userId: string, doctorId: string, permissions: string[]): Promise<void> {
    if (!userId) return;

    const { error } = await supabase
      .from('patient_data_permissions')
      .insert({
        patient_id: userId,
        granted_to_id: doctorId,
        granted_to_role: 'doctor',
        permission_type: 'read',
        data_types: permissions,
        is_active: true
      });

    if (error) {
      throw new Error('Ошибка предоставления доступа врачу');
    }

    toast.success('Доступ к данным предоставлен врачу');
  }
}
