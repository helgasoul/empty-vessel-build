
-- Создаем таблицу для определения достижений
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  badge_icon TEXT,
  badge_color TEXT DEFAULT '#4A90E2',
  points_reward INTEGER DEFAULT 0,
  requirement_type TEXT NOT NULL, -- 'count', 'streak', 'milestone', 'completion'
  requirement_value INTEGER NOT NULL,
  requirement_data JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создаем таблицу для отслеживания прогресса пользователей по достижениям
CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id),
  progress INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Создаем таблицу для системы уровней пользователей
CREATE TABLE public.user_levels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  current_level INTEGER DEFAULT 1,
  total_points INTEGER DEFAULT 0,
  points_to_next_level INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создаем таблицу для отслеживания здоровых привычек
CREATE TABLE public.health_habits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  habit_name TEXT NOT NULL,
  habit_type TEXT NOT NULL, -- 'daily', 'weekly', 'custom'
  target_frequency INTEGER NOT NULL, -- количество раз в период
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  total_completions INTEGER DEFAULT 0,
  points_per_completion INTEGER DEFAULT 10,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создаем таблицу для отслеживания выполнения привычек
CREATE TABLE public.habit_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  habit_id UUID NOT NULL REFERENCES public.health_habits(id),
  completed_date DATE NOT NULL,
  points_earned INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(habit_id, completed_date)
);

-- Создаем таблицу для мотивационных уведомлений
CREATE TABLE public.motivational_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  message_type TEXT NOT NULL, -- 'achievement', 'streak', 'reminder', 'encouragement'
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  scheduled_for TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Включаем Row Level Security для всех таблиц
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.motivational_messages ENABLE ROW LEVEL SECURITY;

-- Создаем политики безопасности для achievements (публичное чтение)
CREATE POLICY "Anyone can view achievements" 
  ON public.achievements 
  FOR SELECT 
  USING (true);

-- Создаем политики для user_achievements
CREATE POLICY "Users can view their own achievements" 
  ON public.user_achievements 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own achievements" 
  ON public.user_achievements 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements" 
  ON public.user_achievements 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Создаем политики для user_levels
CREATE POLICY "Users can view their own level" 
  ON public.user_levels 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own level" 
  ON public.user_levels 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own level" 
  ON public.user_levels 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Создаем политики для health_habits
CREATE POLICY "Users can manage their own habits" 
  ON public.health_habits 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Создаем политики для habit_completions
CREATE POLICY "Users can manage their own habit completions" 
  ON public.habit_completions 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Создаем политики для motivational_messages
CREATE POLICY "Users can view their own messages" 
  ON public.motivational_messages 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own messages" 
  ON public.motivational_messages 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Добавляем триггеры для автоматического обновления updated_at
CREATE TRIGGER update_achievements_updated_at
  BEFORE UPDATE ON public.achievements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_achievements_updated_at
  BEFORE UPDATE ON public.user_achievements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_levels_updated_at
  BEFORE UPDATE ON public.user_levels
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_health_habits_updated_at
  BEFORE UPDATE ON public.health_habits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Функция для автоматического создания уровня пользователя при регистрации
CREATE OR REPLACE FUNCTION public.create_user_level()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_levels (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$;

-- Триггер для создания уровня при создании профиля
CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.create_user_level();

-- Вставляем базовые достижения
INSERT INTO public.achievements (name, description, category, badge_icon, badge_color, points_reward, requirement_type, requirement_value, requirement_data) VALUES
('Первые шаги', 'Завершите первую оценку рисков', 'assessment', 'trophy', '#4CAF50', 50, 'count', 1, '{"action": "risk_assessment"}'),
('Регулярность', 'Пройдите 5 оценок рисков', 'assessment', 'award', '#2196F3', 150, 'count', 5, '{"action": "risk_assessment"}'),
('Эксперт здоровья', 'Пройдите 10 оценок рисков', 'assessment', 'badge', '#FF9800', 300, 'count', 10, '{"action": "risk_assessment"}'),
('Следящий за циклом', 'Отметьте 30 дней менструального цикла', 'womens_health', 'trophy', '#E91E63', 200, 'count', 30, '{"action": "menstrual_tracking"}'),
('Планирующая мама', 'Создайте план беременности', 'womens_health', 'badge', '#9C27B0', 100, 'count', 1, '{"action": "pregnancy_planning"}'),
('Активный образ жизни', 'Пройдите 10000 шагов в день 7 дней подряд', 'fitness', 'award', '#4CAF50', 250, 'streak', 7, '{"action": "daily_steps", "target": 10000}'),
('Постоянство', 'Ведите дневник здоровья 30 дней подряд', 'tracking', 'trophy', '#607D8B', 400, 'streak', 30, '{"action": "daily_logging"}'),
('Исследователь', 'Подключите 3 устройства для мониторинга здоровья', 'devices', 'badge', '#00BCD4', 150, 'count', 3, '{"action": "device_connection"}'),
('Сообщество', 'Присоединитесь к группе поддержки', 'community', 'trophy', '#FF5722', 75, 'count', 1, '{"action": "join_group"}'),
('Помощник', 'Оставьте 10 комментариев в сообществе', 'community', 'award', '#795548', 200, 'count', 10, '{"action": "community_replies"}');
