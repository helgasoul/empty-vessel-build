
-- Создание таблицы для экспертов
CREATE TABLE public.experts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  specialization TEXT NOT NULL,
  experience INTEGER NOT NULL DEFAULT 0,
  avatar_url TEXT,
  rating NUMERIC DEFAULT 0,
  description TEXT,
  education TEXT[] DEFAULT '{}',
  certifications TEXT[] DEFAULT '{}',
  blog_posts_count INTEGER DEFAULT 0,
  consultation_available BOOLEAN DEFAULT true,
  consultation_price NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создание storage bucket для аватаров экспертов
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'expert-avatars',
  'expert-avatars',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- Политики для storage bucket
CREATE POLICY "Allow public read access to expert avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'expert-avatars');

CREATE POLICY "Allow authenticated users to upload expert avatars" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'expert-avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update expert avatars" ON storage.objects
FOR UPDATE USING (bucket_id = 'expert-avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete expert avatars" ON storage.objects
FOR DELETE USING (bucket_id = 'expert-avatars' AND auth.role() = 'authenticated');

-- RLS для таблицы экспертов
ALTER TABLE public.experts ENABLE ROW LEVEL SECURITY;

-- Политики для чтения экспертов (доступно всем)
CREATE POLICY "Allow public read access to experts" ON public.experts
FOR SELECT USING (true);

-- Политики для изменения экспертов (только аутентифицированным пользователям)
CREATE POLICY "Allow authenticated users to insert experts" ON public.experts
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update experts" ON public.experts
FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete experts" ON public.experts
FOR DELETE USING (auth.role() = 'authenticated');

-- Триггер для обновления updated_at
CREATE TRIGGER update_experts_updated_at
  BEFORE UPDATE ON public.experts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Вставка тестовых данных
INSERT INTO public.experts (name, title, specialization, experience, description, education, certifications, consultation_price) VALUES
('Др. Анна Петрова', 'Врач-гинеколог высшей категории', 'Гинекология', 15, 'Специализируется на превентивной гинекологии, планировании беременности и лечении гормональных нарушений. Автор более 50 научных публикаций.', 
ARRAY['РНИМУ им. Н.И. Пирогова, лечебный факультет', 'Ординатура по акушерству и гинекологии', 'Повышение квалификации по репродуктологии'],
ARRAY['Сертификат специалиста по гинекологии', 'Международный сертификат по УЗИ диагностике'], 3500),

('Др. Мария Соколова', 'Врач-маммолог, онколог', 'Маммология', 12, 'Ведущий специалист по диагностике и лечению заболеваний молочной железы. Специализируется на раннем выявлении онкологических заболеваний.',
ARRAY['МГМУ им. И.М. Сеченова', 'Ординатура по онкологии', 'Специализация по маммологии'],
ARRAY['Сертификат онколога-маммолога', 'Европейский сертификат по маммографии'], 4000),

('Др. Елена Козлова', 'Клинический психолог, психотерапевт', 'Психология', 10, 'Специализируется на женской психологии, работе с тревожными расстройствами и поддержке в период планирования беременности.',
ARRAY['МГУ им. М.В. Ломоносова, факультет психологии', 'Магистратура по клинической психологии', 'Обучение гештальт-терапии'],
ARRAY['Сертификат клинического психолога', 'Диплом по когнитивно-поведенческой терапии'], 2800),

('Др. Ольга Волкова', 'Врач-невролог, специалист по головным болям', 'Неврология', 14, 'Эксперт по диагностике и лечению мигрени, головных болей напряжения и других неврологических расстройств у женщин.',
ARRAY['СПбГМУ им. И.П. Павлова', 'Ординатура по неврологии', 'Стажировка в Европейском центре головной боли'],
ARRAY['Сертификат невролога', 'Специализация по цефалгиям'], 3200);
