
-- Обновляем существующую таблицу family_groups для поддержки семейных деревьев
ALTER TABLE public.family_groups 
ADD COLUMN IF NOT EXISTS tree_name TEXT,
ADD COLUMN IF NOT EXISTS visibility_settings JSONB DEFAULT '{"default_visibility": "family_only", "medical_sharing": false}'::jsonb;

-- Обновляем family_members для расширенной медицинской информации
ALTER TABLE public.family_members 
ADD COLUMN IF NOT EXISTS birth_year INTEGER,
ADD COLUMN IF NOT EXISTS medical_notes TEXT,
ADD COLUMN IF NOT EXISTS visibility_scope TEXT DEFAULT 'family_only',
ADD COLUMN IF NOT EXISTS shared_data_types TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS consent_status BOOLEAN DEFAULT true;

-- Создаем таблицу для медицинских событий семьи
CREATE TABLE IF NOT EXISTS public.family_medical_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  family_member_id UUID REFERENCES public.family_members(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL, -- diagnosis, surgery, chronic_condition, screening, etc
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE,
  age_at_event INTEGER,
  severity TEXT, -- mild, moderate, severe
  treatment TEXT,
  outcome TEXT, -- recovered, ongoing, etc
  verified_by_doctor BOOLEAN DEFAULT false,
  doctor_name TEXT,
  clinic_name TEXT,
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создаем таблицу для семейных планов здоровья
CREATE TABLE IF NOT EXISTS public.family_shared_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  family_group_id UUID REFERENCES public.family_groups(id) ON DELETE CASCADE NOT NULL,
  owner_user_id UUID REFERENCES auth.users(id) NOT NULL,
  plan_name TEXT NOT NULL,
  description TEXT,
  related_family_member_ids UUID[] DEFAULT '{}',
  linked_goals JSONB DEFAULT '[]'::jsonb,
  target_conditions TEXT[] DEFAULT '{}', -- что профилактируем
  shared_recommendations JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создаем таблицу для наследственных рисков
CREATE TABLE IF NOT EXISTS public.family_hereditary_risks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  family_group_id UUID REFERENCES public.family_groups(id) ON DELETE CASCADE NOT NULL,
  condition_name TEXT NOT NULL,
  affected_members UUID[] DEFAULT '{}', -- массив member_id
  risk_level TEXT DEFAULT 'unknown', -- low, moderate, high, very_high
  inheritance_pattern TEXT, -- autosomal_dominant, autosomal_recessive, x_linked, etc
  age_of_onset_range TEXT, -- "20-30", "after 50", etc
  prevention_recommendations JSONB DEFAULT '[]'::jsonb,
  screening_recommendations JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создаем таблицу для семейных воспоминаний и заметок
CREATE TABLE IF NOT EXISTS public.family_memories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  family_member_id UUID REFERENCES public.family_members(id) ON DELETE CASCADE NOT NULL,
  memory_type TEXT DEFAULT 'note', -- note, memory, medical_story
  title TEXT,
  content TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id) NOT NULL,
  is_medical_relevant BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создаем таблицу для логирования доступа к семейным данным
CREATE TABLE IF NOT EXISTS public.family_data_access_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  family_group_id UUID REFERENCES public.family_groups(id) ON DELETE CASCADE NOT NULL,
  accessed_by UUID REFERENCES auth.users(id) NOT NULL,
  accessed_member_id UUID REFERENCES public.family_members(id),
  access_type TEXT NOT NULL, -- view, edit, share, export
  data_type TEXT, -- medical_history, documents, personal_info
  ip_address TEXT,
  user_agent TEXT,
  accessed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Включаем RLS для новых таблиц
ALTER TABLE public.family_medical_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_shared_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_hereditary_risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_data_access_logs ENABLE ROW LEVEL SECURITY;

-- Создаем политики RLS для family_medical_events
CREATE POLICY "Users can view medical events in their family groups" 
  ON public.family_medical_events 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.family_members fm
      JOIN public.family_groups fg ON fm.family_group_id = fg.id
      WHERE fm.id = family_medical_events.family_member_id 
      AND fg.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can create medical events for their family members" 
  ON public.family_medical_events 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = created_by AND
    EXISTS (
      SELECT 1 FROM public.family_members fm
      JOIN public.family_groups fg ON fm.family_group_id = fg.id
      WHERE fm.id = family_medical_events.family_member_id 
      AND fg.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update medical events they created" 
  ON public.family_medical_events 
  FOR UPDATE 
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete medical events they created" 
  ON public.family_medical_events 
  FOR DELETE 
  USING (auth.uid() = created_by);

-- Создаем политики RLS для family_shared_plans
CREATE POLICY "Users can view their family shared plans" 
  ON public.family_shared_plans 
  FOR SELECT 
  USING (
    auth.uid() = owner_user_id OR
    EXISTS (
      SELECT 1 FROM public.family_groups fg
      WHERE fg.id = family_shared_plans.family_group_id 
      AND fg.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can create shared plans for their families" 
  ON public.family_shared_plans 
  FOR INSERT 
  WITH CHECK (auth.uid() = owner_user_id);

CREATE POLICY "Users can update their shared plans" 
  ON public.family_shared_plans 
  FOR UPDATE 
  USING (auth.uid() = owner_user_id);

CREATE POLICY "Users can delete their shared plans" 
  ON public.family_shared_plans 
  FOR DELETE 
  USING (auth.uid() = owner_user_id);

-- Создаем политики RLS для family_hereditary_risks
CREATE POLICY "Users can view hereditary risks for their families" 
  ON public.family_hereditary_risks 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.family_groups fg
      WHERE fg.id = family_hereditary_risks.family_group_id 
      AND fg.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can create hereditary risks for their families" 
  ON public.family_hereditary_risks 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = created_by AND
    EXISTS (
      SELECT 1 FROM public.family_groups fg
      WHERE fg.id = family_hereditary_risks.family_group_id 
      AND fg.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update hereditary risks they created" 
  ON public.family_hereditary_risks 
  FOR UPDATE 
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete hereditary risks they created" 
  ON public.family_hereditary_risks 
  FOR DELETE 
  USING (auth.uid() = created_by);

-- Создаем политики RLS для family_memories
CREATE POLICY "Users can view memories for their family members" 
  ON public.family_memories 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.family_members fm
      JOIN public.family_groups fg ON fm.family_group_id = fg.id
      WHERE fm.id = family_memories.family_member_id 
      AND fg.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can create memories for their family members" 
  ON public.family_memories 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = author_id AND
    EXISTS (
      SELECT 1 FROM public.family_members fm
      JOIN public.family_groups fg ON fm.family_group_id = fg.id
      WHERE fm.id = family_memories.family_member_id 
      AND fg.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update memories they created" 
  ON public.family_memories 
  FOR UPDATE 
  USING (auth.uid() = author_id);

CREATE POLICY "Users can delete memories they created" 
  ON public.family_memories 
  FOR DELETE 
  USING (auth.uid() = author_id);

-- Создаем политики RLS для family_data_access_logs
CREATE POLICY "Users can view access logs for their families" 
  ON public.family_data_access_logs 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.family_groups fg
      WHERE fg.id = family_data_access_logs.family_group_id 
      AND fg.created_by = auth.uid()
    )
  );

CREATE POLICY "System can log all access" 
  ON public.family_data_access_logs 
  FOR INSERT 
  WITH CHECK (true);

-- Создаем триггеры для обновления updated_at
CREATE TRIGGER update_family_medical_events_updated_at
  BEFORE UPDATE ON public.family_medical_events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_family_shared_plans_updated_at
  BEFORE UPDATE ON public.family_shared_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_family_hereditary_risks_updated_at
  BEFORE UPDATE ON public.family_hereditary_risks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_family_memories_updated_at
  BEFORE UPDATE ON public.family_memories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Создаем индексы для производительности
CREATE INDEX IF NOT EXISTS idx_family_medical_events_member_id ON public.family_medical_events(family_member_id);
CREATE INDEX IF NOT EXISTS idx_family_medical_events_event_type ON public.family_medical_events(event_type);
CREATE INDEX IF NOT EXISTS idx_family_shared_plans_owner ON public.family_shared_plans(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_family_hereditary_risks_group ON public.family_hereditary_risks(family_group_id);
CREATE INDEX IF NOT EXISTS idx_family_memories_member ON public.family_memories(family_member_id);
CREATE INDEX IF NOT EXISTS idx_family_data_access_logs_group ON public.family_data_access_logs(family_group_id);
