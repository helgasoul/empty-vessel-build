
-- Создаем таблицу для файлов исследований
CREATE TABLE public.research_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  research_type TEXT NOT NULL CHECK (research_type IN ('genetic', 'blood_test', 'imaging', 'clinical_study', 'other')),
  research_date DATE NOT NULL,
  lab_name TEXT,
  doctor_name TEXT,
  tags TEXT[] DEFAULT '{}',
  is_shared BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Включаем RLS
ALTER TABLE public.research_files ENABLE ROW LEVEL SECURITY;

-- Создаем политики безопасности
CREATE POLICY "Users can view their own research files" 
  ON public.research_files 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own research files" 
  ON public.research_files 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own research files" 
  ON public.research_files 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own research files" 
  ON public.research_files 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Создаем триггер для обновления updated_at
CREATE TRIGGER update_research_files_updated_at
  BEFORE UPDATE ON public.research_files
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Создаем storage bucket для файлов исследований
INSERT INTO storage.buckets (id, name, public) 
VALUES ('research-files', 'research-files', false);

-- Создаем политики для storage bucket
CREATE POLICY "Users can upload their own research files" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'research-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own research files" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'research-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own research files" 
  ON storage.objects 
  FOR DELETE 
  USING (bucket_id = 'research-files' AND auth.uid()::text = (storage.foldername(name))[1]);
