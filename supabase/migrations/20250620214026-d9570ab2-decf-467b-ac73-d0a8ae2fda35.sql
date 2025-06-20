
-- Удаляем существующие политики для family_members, которые могут вызывать рекурсию
DROP POLICY IF EXISTS "Family group members can view members" ON public.family_members;
DROP POLICY IF EXISTS "Family group owners can manage members" ON public.family_members;
DROP POLICY IF EXISTS "Family group members can view member documents" ON public.family_member_documents;
DROP POLICY IF EXISTS "Family group owners can manage member documents" ON public.family_member_documents;
DROP POLICY IF EXISTS "Family group members can view health records" ON public.family_member_health_records;
DROP POLICY IF EXISTS "Family group owners can manage health records" ON public.family_member_health_records;
DROP POLICY IF EXISTS "Family group members can view health metrics" ON public.family_member_health_metrics;
DROP POLICY IF EXISTS "Family group owners can manage health metrics" ON public.family_member_health_metrics;

-- Создаем более простые политики без рекурсии для family_members
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

-- Политики для family_groups
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

-- Политики для family_member_documents
CREATE POLICY "Users can view documents for members they created" 
  ON public.family_member_documents 
  FOR SELECT 
  USING (uploaded_by = auth.uid());

CREATE POLICY "Users can upload documents for family members" 
  ON public.family_member_documents 
  FOR INSERT 
  WITH CHECK (uploaded_by = auth.uid());

CREATE POLICY "Users can update documents they uploaded" 
  ON public.family_member_documents 
  FOR UPDATE 
  USING (uploaded_by = auth.uid());

CREATE POLICY "Users can delete documents they uploaded" 
  ON public.family_member_documents 
  FOR DELETE 
  USING (uploaded_by = auth.uid());

-- Политики для family_member_health_records  
CREATE POLICY "Users can view health records they created" 
  ON public.family_member_health_records 
  FOR SELECT 
  USING (created_by = auth.uid());

CREATE POLICY "Users can create health records for family members" 
  ON public.family_member_health_records 
  FOR INSERT 
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update health records they created" 
  ON public.family_member_health_records 
  FOR UPDATE 
  USING (created_by = auth.uid());

CREATE POLICY "Users can delete health records they created" 
  ON public.family_member_health_records 
  FOR DELETE 
  USING (created_by = auth.uid());

-- Политики для family_member_health_metrics
CREATE POLICY "Users can view health metrics they created" 
  ON public.family_member_health_metrics 
  FOR SELECT 
  USING (created_by = auth.uid());

CREATE POLICY "Users can create health metrics for family members" 
  ON public.family_member_health_metrics 
  FOR INSERT 
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update health metrics they created" 
  ON public.family_member_health_metrics 
  FOR UPDATE 
  USING (created_by = auth.uid());

CREATE POLICY "Users can delete health metrics they created" 
  ON public.family_member_health_metrics 
  FOR DELETE 
  USING (created_by = auth.uid());
