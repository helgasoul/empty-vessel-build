
-- Создаем таблицу для семейных групп
CREATE TABLE public.family_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_by UUID REFERENCES auth.users NOT NULL,
  family_name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создаем таблицу для членов семьи
CREATE TABLE public.family_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  family_group_id UUID REFERENCES public.family_groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users NULL, -- NULL если член семьи не зарегистрирован
  name TEXT NOT NULL,
  relationship TEXT NOT NULL, -- мать, отец, сестра, брат, дедушка, бабушка и т.д.
  gender TEXT,
  date_of_birth DATE,
  is_alive BOOLEAN DEFAULT true,
  notes TEXT,
  created_by UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создаем таблицу для семейной медицинской истории
CREATE TABLE public.family_medical_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  family_member_id UUID REFERENCES public.family_members(id) ON DELETE CASCADE NOT NULL,
  condition_name TEXT NOT NULL,
  condition_type TEXT NOT NULL, -- chronic, genetic, infectious, etc.
  diagnosis_date DATE,
  age_at_diagnosis INTEGER,
  severity TEXT, -- mild, moderate, severe
  treatment TEXT,
  outcome TEXT, -- recovered, ongoing, fatal
  notes TEXT,
  verified_by_doctor BOOLEAN DEFAULT false,
  doctor_name TEXT,
  created_by UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создаем таблицы для семейных файлов и документов
CREATE TABLE public.family_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  family_group_id UUID REFERENCES public.family_groups(id) ON DELETE CASCADE NOT NULL,
  family_member_id UUID REFERENCES public.family_members(id) ON DELETE CASCADE NULL,
  document_type TEXT NOT NULL, -- medical_record, test_result, genetic_test, photo, etc.
  title TEXT NOT NULL,
  description TEXT,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  document_date DATE,
  tags TEXT[] DEFAULT '{}',
  is_shared BOOLEAN DEFAULT false,
  uploaded_by UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Добавляем RLS политики
ALTER TABLE public.family_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_medical_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_documents ENABLE ROW LEVEL SECURITY;

-- Политики для family_groups
CREATE POLICY "Users can view family groups they created or are members of" 
  ON public.family_groups 
  FOR SELECT 
  USING (
    created_by = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.family_members 
      WHERE family_group_id = family_groups.id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create family groups" 
  ON public.family_groups 
  FOR INSERT 
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Only creators can update family groups" 
  ON public.family_groups 
  FOR UPDATE 
  USING (created_by = auth.uid());

CREATE POLICY "Only creators can delete family groups" 
  ON public.family_groups 
  FOR DELETE 
  USING (created_by = auth.uid());

-- Политики для family_members
CREATE POLICY "Users can view family members from their groups" 
  ON public.family_members 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.family_groups 
      WHERE id = family_members.family_group_id 
      AND (
        created_by = auth.uid() OR 
        EXISTS (
          SELECT 1 FROM public.family_members fm2 
          WHERE fm2.family_group_id = family_groups.id 
          AND fm2.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can create family members in their groups" 
  ON public.family_members 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.family_groups 
      WHERE id = family_members.family_group_id 
      AND created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update family members in their groups" 
  ON public.family_members 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.family_groups 
      WHERE id = family_members.family_group_id 
      AND created_by = auth.uid()
    )
  );

CREATE POLICY "Users can delete family members from their groups" 
  ON public.family_members 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.family_groups 
      WHERE id = family_members.family_group_id 
      AND created_by = auth.uid()
    )
  );

-- Политики для family_medical_history
CREATE POLICY "Users can view medical history from their family groups" 
  ON public.family_medical_history 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.family_members fm
      JOIN public.family_groups fg ON fm.family_group_id = fg.id
      WHERE fm.id = family_medical_history.family_member_id 
      AND (
        fg.created_by = auth.uid() OR 
        EXISTS (
          SELECT 1 FROM public.family_members fm2 
          WHERE fm2.family_group_id = fg.id 
          AND fm2.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can create medical history for their family members" 
  ON public.family_medical_history 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.family_members fm
      JOIN public.family_groups fg ON fm.family_group_id = fg.id
      WHERE fm.id = family_medical_history.family_member_id 
      AND fg.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update medical history in their family groups" 
  ON public.family_medical_history 
  FOR UPDATE 
  USING (created_by = auth.uid());

CREATE POLICY "Users can delete medical history they created" 
  ON public.family_medical_history 
  FOR DELETE 
  USING (created_by = auth.uid());

-- Политики для family_documents
CREATE POLICY "Users can view documents from their family groups" 
  ON public.family_documents 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.family_groups 
      WHERE id = family_documents.family_group_id 
      AND (
        created_by = auth.uid() OR 
        EXISTS (
          SELECT 1 FROM public.family_members fm 
          WHERE fm.family_group_id = family_groups.id 
          AND fm.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can upload documents to their family groups" 
  ON public.family_documents 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.family_groups 
      WHERE id = family_documents.family_group_id 
      AND created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update documents they uploaded" 
  ON public.family_documents 
  FOR UPDATE 
  USING (uploaded_by = auth.uid());

CREATE POLICY "Users can delete documents they uploaded" 
  ON public.family_documents 
  FOR DELETE 
  USING (uploaded_by = auth.uid());

-- Добавляем триггеры для обновления updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_family_groups_updated_at BEFORE UPDATE ON public.family_groups FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_family_members_updated_at BEFORE UPDATE ON public.family_members FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_family_medical_history_updated_at BEFORE UPDATE ON public.family_medical_history FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_family_documents_updated_at BEFORE UPDATE ON public.family_documents FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
