
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface MissionImage {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  is_active: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export const useMissionImages = () => {
  return useQuery({
    queryKey: ['mission-images'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mission_images')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return data as MissionImage[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateMissionImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (imageData: Omit<MissionImage, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('mission_images')
        .insert(imageData)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mission-images'] });
    },
  });
};

export const useUpdateMissionImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<MissionImage> & { id: string }) => {
      const { data, error } = await supabase
        .from('mission_images')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mission-images'] });
    },
  });
};

export const useDeleteMissionImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('mission_images')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mission-images'] });
    },
  });
};

export const useUploadMissionImage = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `mission-${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('mission-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        throw new Error(error.message);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('mission-images')
        .getPublicUrl(fileName);

      return publicUrl;
    },
  });
};
