
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface HealthHabit {
  id: string;
  user_id: string;
  habit_name: string;
  habit_type: string;
  target_frequency: number;
  current_streak: number | null;
  best_streak: number | null;
  total_completions: number | null;
  points_per_completion: number | null;
  is_active: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface HabitCompletion {
  id: string;
  user_id: string;
  habit_id: string;
  completed_date: string;
  points_earned: number | null;
  notes: string | null;
  created_at: string;
}

export const useHealthHabits = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['health-habits', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user found');

      const { data, error } = await supabase
        .from('health_habits')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as HealthHabit[];
    },
    enabled: !!user?.id,
  });
};

export const useCreateHealthHabit = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (habit: Omit<HealthHabit, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'current_streak' | 'best_streak' | 'total_completions'>) => {
      if (!user?.id) throw new Error('No user found');

      const { data, error } = await supabase
        .from('health_habits')
        .insert({
          ...habit,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Привычка создана!');
      queryClient.invalidateQueries({ queryKey: ['health-habits'] });
    },
  });
};

export const useCompleteHabit = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ habitId, notes }: { habitId: string; notes?: string }) => {
      if (!user?.id) throw new Error('No user found');

      const today = new Date().toISOString().split('T')[0];
      
      // Get habit details
      const { data: habit } = await supabase
        .from('health_habits')
        .select('*')
        .eq('id', habitId)
        .single();

      if (!habit) throw new Error('Habit not found');

      // Check if already completed today
      const { data: existingCompletion } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('habit_id', habitId)
        .eq('completed_date', today)
        .single();

      if (existingCompletion) {
        throw new Error('Привычка уже выполнена сегодня');
      }

      // Add completion
      const { data: completion, error } = await supabase
        .from('habit_completions')
        .insert({
          user_id: user.id,
          habit_id: habitId,
          completed_date: today,
          points_earned: habit.points_per_completion || 10,
          notes: notes || null,
        })
        .select()
        .single();

      if (error) throw error;

      // Update habit statistics
      const newTotalCompletions = (habit.total_completions || 0) + 1;
      const newCurrentStreak = (habit.current_streak || 0) + 1;
      const newBestStreak = Math.max(newCurrentStreak, habit.best_streak || 0);

      await supabase
        .from('health_habits')
        .update({
          total_completions: newTotalCompletions,
          current_streak: newCurrentStreak,
          best_streak: newBestStreak,
        })
        .eq('id', habitId);

      // Update user level points
      const { data: currentLevel } = await supabase
        .from('user_levels')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (currentLevel) {
        const pointsEarned = habit.points_per_completion || 10;
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

      return { completion, pointsEarned: habit.points_per_completion || 10 };
    },
    onSuccess: ({ pointsEarned }) => {
      toast.success(`🎯 Привычка выполнена! +${pointsEarned} очков`);
      queryClient.invalidateQueries({ queryKey: ['health-habits'] });
      queryClient.invalidateQueries({ queryKey: ['user-level'] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
