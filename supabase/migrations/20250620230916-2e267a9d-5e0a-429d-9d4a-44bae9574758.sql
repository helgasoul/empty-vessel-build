
-- Включаем RLS для family_members
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;

-- Удаляем все существующие политики, чтобы избежать конфликтов
DROP POLICY IF EXISTS "family_members_select_policy" ON public.family_members;
DROP POLICY IF EXISTS "family_members_insert_policy" ON public.family_members;
DROP POLICY IF EXISTS "family_members_update_policy" ON public.family_members;
DROP POLICY IF EXISTS "family_members_delete_policy" ON public.family_members;

-- Создаем новые простые политики без рекурсии
CREATE POLICY "Users can view family members they created" 
  ON public.family_members 
  FOR SELECT 
  USING (created_by = auth.uid());

CREATE POLICY "Users can insert family members" 
  ON public.family_members 
  FOR INSERT 
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update family members they created" 
  ON public.family_members 
  FOR UPDATE 
  USING (created_by = auth.uid());

CREATE POLICY "Users can delete family members they created" 
  ON public.family_members 
  FOR DELETE 
  USING (created_by = auth.uid());
