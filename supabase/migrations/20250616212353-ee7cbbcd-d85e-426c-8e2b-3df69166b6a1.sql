
-- Создаем таблицу для токенов доступа между членами семьи
CREATE TABLE public.family_access_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_by UUID REFERENCES auth.users NOT NULL,
  family_group_id UUID REFERENCES public.family_groups(id) ON DELETE CASCADE NOT NULL,
  invited_email TEXT NOT NULL,
  invited_name TEXT,
  token_code TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_used BOOLEAN NOT NULL DEFAULT false,
  used_at TIMESTAMP WITH TIME ZONE,
  used_by UUID REFERENCES auth.users,
  access_permissions JSONB NOT NULL DEFAULT '{"medical_history": true, "documents": false, "personal_info": false}'::jsonb,
  invitation_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создаем таблицу для членов семьи с доступом (после принятия приглашения)
CREATE TABLE public.family_access_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  family_group_id UUID REFERENCES public.family_groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  invited_by UUID REFERENCES auth.users NOT NULL,
  access_permissions JSONB NOT NULL DEFAULT '{"medical_history": true, "documents": false, "personal_info": false}'::jsonb,
  access_level TEXT NOT NULL DEFAULT 'viewer', -- viewer, editor, admin
  is_active BOOLEAN NOT NULL DEFAULT true,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(family_group_id, user_id)
);

-- Создаем таблицу для логирования доступа к семейным данным
CREATE TABLE public.family_access_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  family_group_id UUID REFERENCES public.family_groups(id) ON DELETE CASCADE NOT NULL,
  accessed_by UUID REFERENCES auth.users NOT NULL,
  accessed_data_type TEXT NOT NULL,
  accessed_member_id UUID REFERENCES public.family_members(id),
  accessed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT
);

-- Включаем RLS для всех таблиц
ALTER TABLE public.family_access_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_access_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_access_logs ENABLE ROW LEVEL SECURITY;

-- Политики для family_access_tokens
CREATE POLICY "Users can view tokens for their family groups" 
  ON public.family_access_tokens 
  FOR SELECT 
  USING (
    created_by = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.family_groups 
      WHERE id = family_group_id AND created_by = auth.uid()
    )
  );

CREATE POLICY "Family group owners can create access tokens" 
  ON public.family_access_tokens 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.family_groups 
      WHERE id = family_group_id AND created_by = auth.uid()
    )
  );

CREATE POLICY "Family group owners can update their tokens" 
  ON public.family_access_tokens 
  FOR UPDATE 
  USING (
    created_by = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.family_groups 
      WHERE id = family_group_id AND created_by = auth.uid()
    )
  );

CREATE POLICY "Family group owners can delete their tokens" 
  ON public.family_access_tokens 
  FOR DELETE 
  USING (
    created_by = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.family_groups 
      WHERE id = family_group_id AND created_by = auth.uid()
    )
  );

-- Политики для family_access_members
CREATE POLICY "Users can view family access members for their groups" 
  ON public.family_access_members 
  FOR SELECT 
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.family_groups 
      WHERE id = family_group_id AND created_by = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.family_access_members fam 
      WHERE fam.family_group_id = family_access_members.family_group_id 
      AND fam.user_id = auth.uid() AND fam.is_active = true
    )
  );

CREATE POLICY "Family group owners can manage access members" 
  ON public.family_access_members 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.family_groups 
      WHERE id = family_group_id AND created_by = auth.uid()
    )
  );

-- Политики для family_access_logs
CREATE POLICY "Users can view access logs for their family groups" 
  ON public.family_access_logs 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.family_groups 
      WHERE id = family_group_id AND created_by = auth.uid()
    )
  );

CREATE POLICY "Family members can create access logs" 
  ON public.family_access_logs 
  FOR INSERT 
  WITH CHECK (accessed_by = auth.uid());

-- Триггеры для обновления updated_at
CREATE TRIGGER update_family_access_tokens_updated_at
  BEFORE UPDATE ON public.family_access_tokens
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_family_access_members_updated_at
  BEFORE UPDATE ON public.family_access_members
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
