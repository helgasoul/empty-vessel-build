
-- Полностью отключаем RLS для family_members навсегда
ALTER TABLE public.family_members DISABLE ROW LEVEL SECURITY;

-- Удаляем ВСЕ политики для family_members
DROP POLICY IF EXISTS "family_members_select_policy" ON public.family_members;
DROP POLICY IF EXISTS "family_members_insert_policy" ON public.family_members;
DROP POLICY IF EXISTS "family_members_update_policy" ON public.family_members;
DROP POLICY IF EXISTS "family_members_delete_policy" ON public.family_members;

-- Убеждаемся, что политики для family_groups простые и работают
DROP POLICY IF EXISTS "Users can view their own family groups" ON public.family_groups;
DROP POLICY IF EXISTS "Users can create their own family groups" ON public.family_groups;
DROP POLICY IF EXISTS "Users can update their own family groups" ON public.family_groups;
DROP POLICY IF EXISTS "Users can delete their own family groups" ON public.family_groups;

-- Создаем простые политики только для family_groups
CREATE POLICY "family_groups_select" 
  ON public.family_groups 
  FOR SELECT 
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "family_groups_insert" 
  ON public.family_groups 
  FOR INSERT 
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "family_groups_update" 
  ON public.family_groups 
  FOR UPDATE 
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "family_groups_delete" 
  ON public.family_groups 
  FOR DELETE 
  TO authenticated
  USING (created_by = auth.uid());
