
-- Создание storage bucket для изображений основателя (если не существует)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'founder-images',
  'founder-images',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Создание storage bucket для сертификатов основателя (если не существует)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'founder-certificates',
  'founder-certificates',
  true,
  20971520, -- 20MB
  ARRAY['image/jpeg', 'image/png', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Политики для founder-images bucket (создаем только если не существуют)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Allow public read access to founder images'
  ) THEN
    CREATE POLICY "Allow public read access to founder images" ON storage.objects
    FOR SELECT USING (bucket_id = 'founder-images');
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Allow authenticated users to upload founder images'
  ) THEN
    CREATE POLICY "Allow authenticated users to upload founder images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'founder-images' AND auth.role() = 'authenticated');
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Allow authenticated users to update founder images'
  ) THEN
    CREATE POLICY "Allow authenticated users to update founder images" ON storage.objects
    FOR UPDATE USING (bucket_id = 'founder-images' AND auth.role() = 'authenticated');
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Allow authenticated users to delete founder images'
  ) THEN
    CREATE POLICY "Allow authenticated users to delete founder images" ON storage.objects
    FOR DELETE USING (bucket_id = 'founder-images' AND auth.role() = 'authenticated');
  END IF;
END
$$;

-- Политики для founder-certificates bucket (создаем только если не существуют)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Allow public read access to founder certificates'
  ) THEN
    CREATE POLICY "Allow public read access to founder certificates" ON storage.objects
    FOR SELECT USING (bucket_id = 'founder-certificates');
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Allow authenticated users to upload founder certificates'
  ) THEN
    CREATE POLICY "Allow authenticated users to upload founder certificates" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'founder-certificates' AND auth.role() = 'authenticated');
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Allow authenticated users to update founder certificates'
  ) THEN
    CREATE POLICY "Allow authenticated users to update founder certificates" ON storage.objects
    FOR UPDATE USING (bucket_id = 'founder-certificates' AND auth.role() = 'authenticated');
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Allow authenticated users to delete founder certificates'
  ) THEN
    CREATE POLICY "Allow authenticated users to delete founder certificates" ON storage.objects
    FOR DELETE USING (bucket_id = 'founder-certificates' AND auth.role() = 'authenticated');
  END IF;
END
$$;

-- Добавление поля для сертификатов в таблицу founder_info
ALTER TABLE public.founder_info 
ADD COLUMN IF NOT EXISTS certificates jsonb DEFAULT '[]'::jsonb;
