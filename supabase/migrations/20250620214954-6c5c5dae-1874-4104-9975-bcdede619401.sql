
-- Полностью удаляем все политики и функции, которые вызывают рекурсию
DROP POLICY IF EXISTS "Users can view family members in their groups" ON public.family_members;
DROP POLICY IF EXISTS "Users can create family members in their groups" ON public.family_members;
DROP POLICY IF EXISTS "Users can update family members in their groups" ON public.family_members;
DROP POLICY IF EXISTS "Users can delete family members in their groups" ON public.family_members;

DROP POLICY IF EXISTS "Users can view family members they created" ON public.family_members;
DROP POLICY IF EXISTS "Users can create family members" ON public.family_members;
DROP POLICY IF EXISTS "Users can update family members they created" ON public.family_members;
DROP POLICY IF EXISTS "Users can delete family members they created" ON public.family_members;

-- Удаляем проблемную функцию
DROP FUNCTION IF EXISTS public.can_access_family_group(UUID);

-- Создаем максимально простые политики без функций и подзапросов
-- Эти политики позволяют пользователям работать только с семейными группами, которые они создали
CREATE POLICY "Users can view family members they created" 
  ON public.family_members 
  FOR SELECT 
  USING (created_by = auth.uid());

CREATE POLICY "Users can create family members" 
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

-- Дополнительно проверим и исправим политики для family_groups, если нужно
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
