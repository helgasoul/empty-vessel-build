
-- Удаляем ВСЕ существующие политики для family_members
DROP POLICY IF EXISTS "Users can view family members they created" ON public.family_members;
DROP POLICY IF EXISTS "Users can create family members" ON public.family_members;
DROP POLICY IF EXISTS "Users can update family members they created" ON public.family_members;
DROP POLICY IF EXISTS "Users can delete family members they created" ON public.family_members;
DROP POLICY IF EXISTS "Users can view family members in their groups" ON public.family_members;
DROP POLICY IF EXISTS "Users can create family members in their groups" ON public.family_members;
DROP POLICY IF EXISTS "Users can update family members in their groups" ON public.family_members;
DROP POLICY IF EXISTS "Users can delete family members in their groups" ON public.family_members;

-- Удаляем функцию если она существует
DROP FUNCTION IF EXISTS public.can_access_family_group(UUID);

-- Создаем функцию для безопасной проверки доступа к семейной группе
CREATE OR REPLACE FUNCTION public.can_access_family_group(group_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.family_groups 
    WHERE id = group_id AND created_by = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Создаем новые простые политики для family_members
CREATE POLICY "Users can view family members in their groups" 
  ON public.family_members 
  FOR SELECT 
  USING (public.can_access_family_group(family_group_id));

CREATE POLICY "Users can create family members in their groups" 
  ON public.family_members 
  FOR INSERT 
  WITH CHECK (public.can_access_family_group(family_group_id) AND created_by = auth.uid());

CREATE POLICY "Users can update family members in their groups" 
  ON public.family_members 
  FOR UPDATE 
  USING (public.can_access_family_group(family_group_id) AND created_by = auth.uid());

CREATE POLICY "Users can delete family members in their groups" 
  ON public.family_members 
  FOR DELETE 
  USING (public.can_access_family_group(family_group_id) AND created_by = auth.uid());
