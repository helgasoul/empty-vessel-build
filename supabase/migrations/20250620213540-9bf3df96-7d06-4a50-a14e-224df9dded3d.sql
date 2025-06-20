
-- Создаем bucket для семейных документов
INSERT INTO storage.buckets (id, name, public)
VALUES ('family-documents', 'family-documents', true);

-- Создаем политики для bucket family-documents
CREATE POLICY "Authenticated users can upload family documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'family-documents' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can view family documents they have access to"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'family-documents' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own family documents"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'family-documents' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can delete their own family documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'family-documents' 
  AND auth.role() = 'authenticated'
);

-- Создаем таблицу для отслеживания загруженных файлов членов семьи
CREATE TABLE IF NOT EXISTS public.family_member_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  family_member_id UUID REFERENCES public.family_members(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  document_type TEXT NOT NULL, -- 'medical', 'photo', 'certificate', 'other'
  title TEXT,
  description TEXT,
  uploaded_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Включаем RLS для новой таблицы
ALTER TABLE public.family_member_documents ENABLE ROW LEVEL SECURITY;

-- Политики доступа для family_member_documents
CREATE POLICY "Family group members can view member documents" 
  ON public.family_member_documents 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.family_members fm 
      JOIN public.family_groups fg ON fm.family_group_id = fg.id
      WHERE fm.id = family_member_id 
      AND (fg.created_by = auth.uid() OR EXISTS (
        SELECT 1 FROM public.family_access_members fam 
        WHERE fam.family_group_id = fg.id 
        AND fam.user_id = auth.uid() 
        AND fam.is_active = true
      ))
    )
  );

CREATE POLICY "Family group owners can manage member documents" 
  ON public.family_member_documents 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.family_members fm 
      JOIN public.family_groups fg ON fm.family_group_id = fg.id
      WHERE fm.id = family_member_id 
      AND fg.created_by = auth.uid()
    )
  );

-- Триггер для обновления updated_at
CREATE TRIGGER update_family_member_documents_updated_at
  BEFORE UPDATE ON public.family_member_documents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
