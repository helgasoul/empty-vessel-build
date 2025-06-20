
-- Полностью отключаем RLS для family_members чтобы устранить рекурсию
ALTER TABLE public.family_members DISABLE ROW LEVEL SECURITY;

-- Удаляем ВСЕ существующие политики для family_members
DROP POLICY IF EXISTS "Users can view family members they created" ON public.family_members;
DROP POLICY IF EXISTS "Users can create family members" ON public.family_members;
DROP POLICY IF EXISTS "Users can update family members they created" ON public.family_members;
DROP POLICY IF EXISTS "Users can delete family members they created" ON public.family_members;
DROP POLICY IF EXISTS "Users can view family members in their groups" ON public.family_members;
DROP POLICY IF EXISTS "Users can create family members in their groups" ON public.family_members;
DROP POLICY IF EXISTS "Users can update family members in their groups" ON public.family_members;
DROP POLICY IF EXISTS "Users can delete family members in their groups" ON public.family_members;

-- Удаляем все связанные функции
DROP FUNCTION IF EXISTS public.can_access_family_group(UUID);

-- Проверяем и пересоздаем простые политики для family_groups
DROP POLICY IF EXISTS "Users can view their own family groups" ON public.family_groups;
DROP POLICY IF EXISTS "Users can create their own family groups" ON public.family_groups;
DROP POLICY IF EXISTS "Users can update their own family groups" ON public.family_groups;
DROP POLICY IF EXISTS "Users can delete their own family groups" ON public.family_groups;

CREATE POLICY "Users can view their own family groups" 
  ON public.family_groups 
  FOR SELECT 
  USING (created_by = auth.uid());

CREATE POLICY "Users can create their own family groups" 
  ON public.family_groups 
  FOR INSERT 
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own family groups" 
  ON public.family_groups 
  FOR UPDATE 
  USING (created_by = auth.uid());

CREATE POLICY "Users can delete their own family groups" 
  ON public.family_groups 
  FOR DELETE 
  USING (created_by = auth.uid());

-- Теперь включаем RLS обратно для family_members и создаем новые простые политики
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;

-- Создаем новые максимально простые политики для family_members
CREATE POLICY "family_members_select_policy" 
  ON public.family_members 
  FOR SELECT 
  USING (created_by = auth.uid());

CREATE POLICY "family_members_insert_policy" 
  ON public.family_members 
  FOR INSERT 
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "family_members_update_policy" 
  ON public.family_members 
  FOR UPDATE 
  USING (created_by = auth.uid());

CREATE POLICY "family_members_delete_policy" 
  ON public.family_members 
  FOR DELETE 
  USING (created_by = auth.uid());
