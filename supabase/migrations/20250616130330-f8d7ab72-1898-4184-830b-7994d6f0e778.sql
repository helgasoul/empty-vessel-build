
-- Создание таблицы для сообществ/групп поддержки
CREATE TABLE public.support_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'health_condition', 'interest', 'age_group', 'lifestyle'
  tags TEXT[] DEFAULT '{}',
  member_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_anonymous BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Создание таблицы для участников групп
CREATE TABLE public.group_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES public.support_groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  anonymous_name TEXT NOT NULL, -- Анонимное имя в группе
  role TEXT DEFAULT 'member', -- 'member', 'moderator', 'admin'
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  UNIQUE(group_id, user_id)
);

-- Создание таблицы для постов в сообществе
CREATE TABLE public.community_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES public.support_groups(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  anonymous_name TEXT NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  post_type TEXT DEFAULT 'discussion', -- 'discussion', 'experience', 'question', 'support'
  tags TEXT[] DEFAULT '{}',
  like_count INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,
  is_anonymous BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создание таблицы для ответов на посты
CREATE TABLE public.post_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  anonymous_name TEXT NOT NULL,
  content TEXT NOT NULL,
  like_count INTEGER DEFAULT 0,
  is_anonymous BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создание таблицы для лайков
CREATE TABLE public.post_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
  reply_id UUID REFERENCES public.post_replies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT post_or_reply_check CHECK ((post_id IS NOT NULL) != (reply_id IS NOT NULL))
);

-- Создание таблицы для приватных сообщений (опционально для поддержки)
CREATE TABLE public.support_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  group_id UUID REFERENCES public.support_groups(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Включение Row Level Security
ALTER TABLE public.support_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

-- Политики для support_groups (все могут просматривать активные группы)
CREATE POLICY "Everyone can view active support groups" 
  ON public.support_groups 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Authenticated users can create support groups" 
  ON public.support_groups 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Политики для group_members
CREATE POLICY "Users can view group members of their groups" 
  ON public.group_members 
  FOR SELECT 
  TO authenticated
  USING (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.group_members gm2 
      WHERE gm2.group_id = group_members.group_id 
      AND gm2.user_id = auth.uid() 
      AND gm2.is_active = true
    )
  );

CREATE POLICY "Users can join groups" 
  ON public.group_members 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave groups" 
  ON public.group_members 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id);

-- Политики для community_posts
CREATE POLICY "Group members can view posts" 
  ON public.community_posts 
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.group_members gm 
      WHERE gm.group_id = community_posts.group_id 
      AND gm.user_id = auth.uid() 
      AND gm.is_active = true
    )
  );

CREATE POLICY "Group members can create posts" 
  ON public.community_posts 
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    auth.uid() = author_id AND
    EXISTS (
      SELECT 1 FROM public.group_members gm 
      WHERE gm.group_id = community_posts.group_id 
      AND gm.user_id = auth.uid() 
      AND gm.is_active = true
    )
  );

-- Политики для post_replies
CREATE POLICY "Group members can view replies" 
  ON public.post_replies 
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.community_posts cp
      JOIN public.group_members gm ON cp.group_id = gm.group_id
      WHERE cp.id = post_replies.post_id 
      AND gm.user_id = auth.uid() 
      AND gm.is_active = true
    )
  );

CREATE POLICY "Group members can create replies" 
  ON public.post_replies 
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    auth.uid() = author_id AND
    EXISTS (
      SELECT 1 FROM public.community_posts cp
      JOIN public.group_members gm ON cp.group_id = gm.group_id
      WHERE cp.id = post_replies.post_id 
      AND gm.user_id = auth.uid() 
      AND gm.is_active = true
    )
  );

-- Политики для post_likes
CREATE POLICY "Users can view and manage their likes" 
  ON public.post_likes 
  FOR ALL 
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Политики для support_messages
CREATE POLICY "Users can view their messages" 
  ON public.support_messages 
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send messages" 
  ON public.support_messages 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

-- Создание функции для обновления счетчиков
CREATE OR REPLACE FUNCTION update_group_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.is_active = true THEN
    UPDATE public.support_groups 
    SET member_count = member_count + 1 
    WHERE id = NEW.group_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.is_active = false AND NEW.is_active = true THEN
      UPDATE public.support_groups 
      SET member_count = member_count + 1 
      WHERE id = NEW.group_id;
    ELSIF OLD.is_active = true AND NEW.is_active = false THEN
      UPDATE public.support_groups 
      SET member_count = member_count - 1 
      WHERE id = NEW.group_id;
    END IF;
  ELSIF TG_OP = 'DELETE' AND OLD.is_active = true THEN
    UPDATE public.support_groups 
    SET member_count = member_count - 1 
    WHERE id = OLD.group_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Создание триггера для обновления счетчика участников
CREATE TRIGGER update_group_member_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.group_members
  FOR EACH ROW EXECUTE FUNCTION update_group_member_count();

-- Создание функции для обновления счетчика ответов
CREATE OR REPLACE FUNCTION update_post_reply_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.community_posts 
    SET reply_count = reply_count + 1 
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.community_posts 
    SET reply_count = reply_count - 1 
    WHERE id = OLD.post_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Создание триггера для обновления счетчика ответов
CREATE TRIGGER update_post_reply_count_trigger
  AFTER INSERT OR DELETE ON public.post_replies
  FOR EACH ROW EXECUTE FUNCTION update_post_reply_count();

-- Создание индексов для производительности
CREATE INDEX idx_support_groups_category ON public.support_groups(category);
CREATE INDEX idx_support_groups_active ON public.support_groups(is_active) WHERE is_active = true;
CREATE INDEX idx_group_members_user_group ON public.group_members(user_id, group_id);
CREATE INDEX idx_community_posts_group_created ON public.community_posts(group_id, created_at DESC);
CREATE INDEX idx_post_replies_post_created ON public.post_replies(post_id, created_at DESC);
CREATE INDEX idx_post_likes_user ON public.post_likes(user_id);
CREATE INDEX idx_support_messages_recipient ON public.support_messages(recipient_id, created_at DESC);
