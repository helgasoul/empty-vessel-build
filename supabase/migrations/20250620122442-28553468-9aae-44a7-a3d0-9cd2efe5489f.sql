
-- Создаем таблицу для хранения изображений миссии
CREATE TABLE public.mission_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT 'Наша команда',
  description TEXT,
  image_url TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Добавляем RLS политики
ALTER TABLE public.mission_images ENABLE ROW LEVEL SECURITY;

-- Политика для чтения - все могут видеть активные изображения
CREATE POLICY "Anyone can view active mission images" 
  ON public.mission_images 
  FOR SELECT 
  USING (is_active = true);

-- Политика для вставки - только аутентифицированные пользователи
CREATE POLICY "Authenticated users can insert mission images" 
  ON public.mission_images 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- Политика для обновления - только аутентифицированные пользователи
CREATE POLICY "Authenticated users can update mission images" 
  ON public.mission_images 
  FOR UPDATE 
  TO authenticated
  USING (true);

-- Политика для удаления - только аутентифицированные пользователи
CREATE POLICY "Authenticated users can delete mission images" 
  ON public.mission_images 
  FOR DELETE 
  TO authenticated
  USING (true);

-- Создаем bucket для изображений миссии
INSERT INTO storage.buckets (id, name, public)
VALUES ('mission-images', 'mission-images', true);

-- Политики для storage bucket
CREATE POLICY "Anyone can view mission images in storage"
ON storage.objects FOR SELECT
USING (bucket_id = 'mission-images');

CREATE POLICY "Authenticated users can upload mission images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'mission-images');

CREATE POLICY "Authenticated users can update mission images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'mission-images');

CREATE POLICY "Authenticated users can delete mission images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'mission-images');
