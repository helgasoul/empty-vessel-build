
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface Achievement {
  id: string;
  name: string;
  description: string | null;
  category: string;
  badge_icon: string | null;
  badge_color: string | null;
  points_reward: number | null;
  requirement_type: string;
  requirement_value: number;
  requirement_data: any;
  is_active: boolean | null;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  progress: number | null;
  is_completed: boolean | null;
  completed_at: string | null;
  achievement: Achievement;
}

export const useAchievements = () => {
  return useQuery({
    queryKey: ['achievements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true });

      if (error) throw error;
      return data as Achievement[];
    },
  });
};

export const useUserAchievements = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-achievements', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user found');

      const { data, error } = await supabase
        .from('user_achievements')
        .select(`
          *,
          achievement:achievements(*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      return data as UserAchievement[];
    },
    enabled: !!user?.id,
  });
};

export const useUserLevel = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-level', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user found');

      const { data, error } = await supabase
        .from('user_levels')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });
};

export const useUpdateAchievementProgress = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ achievementId, progress }: { achievementId: string; progress: number }) => {
      if (!user?.id) throw new Error('No user found');

      const { data, error } = await supabase
        .from('user_achievements')
        .upsert({
          user_id: user.id,
          achievement_id: achievementId,
          progress: progress,
          is_completed: false,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-achievements'] });
    },
  });
};

export const useCompleteAchievement = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ achievementId, pointsEarned }: { achievementId: string; pointsEarned: number }) => {
      if (!user?.id) throw new Error('No user found');

      // Complete achievement
      await supabase
        .from('user_achievements')
        .upsert({
          user_id: user.id,
          achievement_id: achievementId,
          progress: 100,
          is_completed: true,
          completed_at: new Date().toISOString(),
        });

      // Update user level points
      const { data: currentLevel } = await supabase
        .from('user_levels')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (currentLevel) {
        const newTotalPoints = (currentLevel.total_points || 0) + pointsEarned;
        const pointsToNextLevel = Math.max(0, (currentLevel.points_to_next_level || 100) - pointsEarned);
        const newLevel = pointsToNextLevel === 0 ? (currentLevel.current_level || 1) + 1 : currentLevel.current_level;

        await supabase
          .from('user_levels')
          .update({
            total_points: newTotalPoints,
            points_to_next_level: pointsToNextLevel === 0 ? 100 : pointsToNextLevel,
            current_level: newLevel,
          })
          .eq('user_id', user.id);
      }

      return { pointsEarned };
    },
    onSuccess: ({ pointsEarned }) => {
      toast.success(`🎉 Достижение разблокировано! +${pointsEarned} очков`);
      queryClient.invalidateQueries({ queryKey: ['user-achievements'] });
      queryClient.invalidateQueries({ queryKey: ['user-level'] });
    },
  });
};
