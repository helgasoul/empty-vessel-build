
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CommunityPost {
  id: string;
  group_id: string;
  author_id?: string;
  anonymous_name: string;
  title?: string;
  content: string;
  post_type?: string;
  tags?: string[];
  like_count?: number;
  reply_count?: number;
  is_anonymous?: boolean;
  created_at: string;
  updated_at: string;
}

export interface PostReply {
  id: string;
  post_id: string;
  author_id?: string;
  anonymous_name: string;
  content: string;
  like_count?: number;
  is_anonymous?: boolean;
  created_at: string;
  updated_at: string;
}

export const useCommunityPosts = (groupId?: string) => {
  return useQuery({
    queryKey: ['community-posts', groupId],
    queryFn: async () => {
      let query = supabase
        .from('community_posts')
        .select('*');

      if (groupId) {
        query = query.eq('group_id', groupId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data as CommunityPost[];
    },
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postData: Omit<CommunityPost, 'id' | 'created_at' | 'updated_at' | 'like_count' | 'reply_count'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('community_posts')
        .insert({
          ...postData,
          author_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
    },
  });
};

export const usePostReplies = (postId: string) => {
  return useQuery({
    queryKey: ['post-replies', postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('post_replies')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as PostReply[];
    },
    enabled: !!postId,
  });
};

export const useCreateReply = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (replyData: Omit<PostReply, 'id' | 'created_at' | 'updated_at' | 'like_count'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('post_replies')
        .insert({
          ...replyData,
          author_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['post-replies', variables.post_id] });
      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
    },
  });
};
