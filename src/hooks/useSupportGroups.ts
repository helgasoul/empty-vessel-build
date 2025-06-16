
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SupportGroup {
  id: string;
  name: string;
  description?: string;
  category: string;
  tags?: string[];
  member_count?: number;
  is_active?: boolean;
  is_anonymous?: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  anonymous_name: string;
  role?: string;
  joined_at: string;
  is_active?: boolean;
}

export const useSupportGroups = () => {
  return useQuery({
    queryKey: ['support-groups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('support_groups')
        .select('*')
        .eq('is_active', true)
        .order('member_count', { ascending: false });

      if (error) throw error;
      return data as SupportGroup[];
    },
  });
};

export const useCreateSupportGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (groupData: Omit<SupportGroup, 'id' | 'created_at' | 'updated_at' | 'member_count'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('support_groups')
        .insert({
          ...groupData,
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-groups'] });
    },
  });
};

export const useJoinGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ groupId, anonymousName }: { groupId: string; anonymousName: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('group_members')
        .insert({
          group_id: groupId,
          user_id: user.id,
          anonymous_name: anonymousName
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-groups'] });
      queryClient.invalidateQueries({ queryKey: ['group-members'] });
    },
  });
};

export const useGroupMembers = (groupId: string) => {
  return useQuery({
    queryKey: ['group-members', groupId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('group_members')
        .select('*')
        .eq('group_id', groupId)
        .eq('is_active', true)
        .order('joined_at', { ascending: false });

      if (error) throw error;
      return data as GroupMember[];
    },
    enabled: !!groupId,
  });
};
