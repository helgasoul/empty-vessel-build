
-- Создаем bucket для изображений основателя
INSERT INTO storage.buckets (id, name, public)
VALUES ('founder-images', 'founder-images', true);

-- Создаем политики для bucket founder-images
CREATE POLICY "Allow public read access on founder images"
ON storage.objects FOR SELECT
USING (bucket_id = 'founder-images');

CREATE POLICY "Allow authenticated users to upload founder images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'founder-images' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update founder images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'founder-images' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete founder images"
ON storage.objects FOR DELETE
USING (bucket_id = 'founder-images' AND auth.role() = 'authenticated');

-- Создаем таблицу для информации об основателе
CREATE TABLE public.founder_info (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Др. Анна Петрова',
  title TEXT NOT NULL DEFAULT 'MD, PhD • Основатель и CEO PREVENT',
  description TEXT,
  education TEXT[],
  achievements TEXT[],
  quote TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Добавляем триггер для обновления updated_at
CREATE TRIGGER update_founder_info_updated_at
  BEFORE UPDATE ON public.founder_info
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Вставляем начальные данные
INSERT INTO public.founder_info (
  name,
  title, 
  description,
  education,
  achievements,
  quote,
  image_url
) VALUES (
  'Др. Анна Петрова',
  'MD, PhD • Основатель и CEO PREVENT',
  'Доктор медицинских наук с 15-летним опытом работы в области превентивной медицины и женского здоровья. Автор более 50 научных публикаций по персонализированной медицине. Анна создала PREVENT после собственного опыта с системой здравоохранения, когда поняла, что женщинам нужен более персонализированный подход к профилактике заболеваний.',
  ARRAY[
    'РНИМУ им. Н.И. Пирогова, лечебный факультет',
    'PhD, Превентивная медицина, Гарвардская школа общественного здравоохранения', 
    'MBA, Здравоохранение и биотехнологии, Стэнфорд'
  ],
  ARRAY[
    'Лауреат премии "Инновации в медицине" 2023',
    'Член экспертного совета ВОЗ по женскому здоровью',
    'Спикер на международных конференциях по превентивной медицине'
  ],
  'Моя миссия — дать каждой женщине возможность контролировать свое здоровье с помощью науки и персонализированных данных. Превентивная медицина — это будущее.',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
);

-- Включаем RLS и создаем политики
ALTER TABLE public.founder_info ENABLE ROW LEVEL SECURITY;

-- Политики для чтения (все могут читать)
CREATE POLICY "Allow public read access to founder info"
ON public.founder_info FOR SELECT
USING (true);

-- Политики для записи (только аутентифицированные пользователи)
CREATE POLICY "Allow authenticated users to update founder info"
ON public.founder_info FOR UPDATE
USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert founder info"
ON public.founder_info FOR INSERT
WITH CHECK (auth.role() = 'authenticated');
