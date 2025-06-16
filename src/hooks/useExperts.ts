
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Expert {
  id: string;
  name: string;
  title: string;
  specialization: string;
  experience: number;
  avatar_url?: string;
  rating?: number;
  description?: string;
  education?: string[];
  certifications?: string[];
  blog_posts_count?: number;
  consultation_available?: boolean;
  consultation_price?: number;
  created_at?: string;
  updated_at?: string;
}

export const useExperts = () => {
  return useQuery({
    queryKey: ['experts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('experts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data as Expert[];
    },
  });
};

export const useExpert = (id: string) => {
  return useQuery({
    queryKey: ['expert', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('experts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as Expert;
    },
    enabled: !!id,
  });
};

export const useCreateExpert = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (expertData: Omit<Expert, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('experts')
        .insert(expertData)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experts'] });
    },
  });
};

export const useUpdateExpert = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...expertData }: Partial<Expert> & { id: string }) => {
      const { data, error } = await supabase
        .from('experts')
        .update(expertData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['experts'] });
      queryClient.invalidateQueries({ queryKey: ['expert', data.id] });
    },
  });
};

export const useDeleteExpert = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('experts')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experts'] });
    },
  });
};

export const useUploadExpertAvatar = () => {
  return useMutation({
    mutationFn: async ({ file, expertId }: { file: File; expertId: string }) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${expertId}-${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('expert-avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw new Error(error.message);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('expert-avatars')
        .getPublicUrl(fileName);

      return publicUrl;
    },
  });
};
