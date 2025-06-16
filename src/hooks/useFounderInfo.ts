
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface FounderInfo {
  id: string;
  name: string;
  title: string;
  description?: string;
  education?: string[];
  achievements?: string[];
  quote?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

export const useFounderInfo = () => {
  return useQuery({
    queryKey: ['founder-info'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('founder_info')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) {
        throw new Error(error.message);
      }

      return data as FounderInfo | null;
    },
  });
};

export const useUpdateFounderInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (founderData: Omit<FounderInfo, 'id' | 'created_at' | 'updated_at'>) => {
      // Сначала проверяем, есть ли уже запись
      const { data: existing } = await supabase
        .from('founder_info')
        .select('id')
        .limit(1)
        .maybeSingle();

      if (existing) {
        // Обновляем существующую запись
        const { data, error } = await supabase
          .from('founder_info')
          .update(founderData)
          .eq('id', existing.id)
          .select()
          .single();

        if (error) {
          throw new Error(error.message);
        }

        return data;
      } else {
        // Создаем новую запись
        const { data, error } = await supabase
          .from('founder_info')
          .insert(founderData)
          .select()
          .single();

        if (error) {
          throw new Error(error.message);
        }

        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['founder-info'] });
    },
  });
};

export const useUploadFounderImage = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `founder-${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('founder-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        throw new Error(error.message);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('founder-images')
        .getPublicUrl(fileName);

      return publicUrl;
    },
  });
};
