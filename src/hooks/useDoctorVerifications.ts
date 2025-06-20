
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface DoctorVerification {
  id: string;
  user_id: string;
  diploma_file_path: string;
  diploma_file_name: string;
  file_size: number;
  upload_date: string;
  verification_status: 'pending' | 'approved' | 'rejected';
  verified_by?: string;
  verification_date?: string;
  rejection_reason?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const useDoctorVerifications = () => {
  return useQuery({
    queryKey: ['doctor-verifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('doctor_verifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data as DoctorVerification[];
    },
  });
};

export const useMyDoctorVerification = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['my-doctor-verification', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('doctor_verifications')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        throw new Error(error.message);
      }

      return data as DoctorVerification | null;
    },
    enabled: !!user,
  });
};

export const useCreateDoctorVerification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      diplomaFile 
    }: { 
      diplomaFile: File;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Пользователь не авторизован');

      // Загружаем файл в storage
      const fileExt = diplomaFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('diplomas')
        .upload(fileName, diplomaFile);

      if (uploadError) {
        throw new Error('Ошибка загрузки файла: ' + uploadError.message);
      }

      // Создаем запись о верификации
      const { data, error } = await supabase
        .from('doctor_verifications')
        .insert({
          user_id: user.id,
          diploma_file_path: fileName,
          diploma_file_name: diplomaFile.name,
          file_size: diplomaFile.size,
        })
        .select()
        .single();

      if (error) {
        // Удаляем файл если создание записи не удалось
        await supabase.storage
          .from('diplomas')
          .remove([fileName]);
        
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-doctor-verification'] });
      queryClient.invalidateQueries({ queryKey: ['doctor-verifications'] });
    },
  });
};

export const useUpdateVerificationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      verificationId, 
      status, 
      rejectionReason, 
      notes 
    }: { 
      verificationId: string;
      status: 'approved' | 'rejected';
      rejectionReason?: string;
      notes?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Пользователь не авторизован');

      const updateData: any = {
        verification_status: status,
        verified_by: user.id,
        verification_date: new Date().toISOString(),
      };

      if (rejectionReason) {
        updateData.rejection_reason = rejectionReason;
      }

      if (notes) {
        updateData.notes = notes;
      }

      const { data, error } = await supabase
        .from('doctor_verifications')
        .update(updateData)
        .eq('id', verificationId)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor-verifications'] });
      queryClient.invalidateQueries({ queryKey: ['my-doctor-verification'] });
    },
  });
};
