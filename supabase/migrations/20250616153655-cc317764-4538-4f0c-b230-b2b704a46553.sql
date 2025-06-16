
-- Обновляем таблицу medical_records для лучшей поддержки файлов
ALTER TABLE medical_records 
ADD COLUMN IF NOT EXISTS file_attachments jsonb DEFAULT '[]'::jsonb;

-- Создаем storage bucket для медицинских файлов если его еще нет
INSERT INTO storage.buckets (id, name, public) 
VALUES ('medical-records', 'medical-records', false)
ON CONFLICT (id) DO NOTHING;

-- Создаем политики для storage bucket медицинских записей
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can upload their own medical files'
  ) THEN
    CREATE POLICY "Users can upload their own medical files" 
      ON storage.objects 
      FOR INSERT 
      WITH CHECK (bucket_id = 'medical-records' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can view their own medical files'
  ) THEN
    CREATE POLICY "Users can view their own medical files" 
      ON storage.objects 
      FOR SELECT 
      USING (bucket_id = 'medical-records' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can delete their own medical files'
  ) THEN
    CREATE POLICY "Users can delete their own medical files" 
      ON storage.objects 
      FOR DELETE 
      USING (bucket_id = 'medical-records' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;
END $$;

-- Включаем RLS для medical_records если еще не включено
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;

-- Добавляем RLS политики для medical_records
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'medical_records' 
    AND policyname = 'Users can view their own medical records'
  ) THEN
    CREATE POLICY "Users can view their own medical records" 
      ON medical_records 
      FOR SELECT 
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'medical_records' 
    AND policyname = 'Users can create their own medical records'
  ) THEN
    CREATE POLICY "Users can create their own medical records" 
      ON medical_records 
      FOR INSERT 
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'medical_records' 
    AND policyname = 'Users can update their own medical records'
  ) THEN
    CREATE POLICY "Users can update their own medical records" 
      ON medical_records 
      FOR UPDATE 
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'medical_records' 
    AND policyname = 'Users can delete their own medical records'
  ) THEN
    CREATE POLICY "Users can delete their own medical records" 
      ON medical_records 
      FOR DELETE 
      USING (auth.uid() = user_id);
  END IF;
END $$;
