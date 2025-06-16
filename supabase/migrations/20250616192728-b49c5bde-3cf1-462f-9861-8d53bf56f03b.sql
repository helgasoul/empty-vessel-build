
-- Create a table for privacy policy content
CREATE TABLE public.privacy_policy (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT 'Политика конфиденциальности',
  content TEXT NOT NULL,
  version TEXT NOT NULL DEFAULT '1.0',
  is_active BOOLEAN NOT NULL DEFAULT true,
  effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE public.privacy_policy ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (anyone can read the active policy)
CREATE POLICY "Anyone can view active privacy policy" 
  ON public.privacy_policy 
  FOR SELECT 
  USING (is_active = true);

-- Create policy for admin insert/update (you'll need to assign admin role later)
CREATE POLICY "Authenticated users can manage privacy policy" 
  ON public.privacy_policy 
  FOR ALL 
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert initial privacy policy
INSERT INTO public.privacy_policy (title, content, version, is_active) 
VALUES (
  'Политика конфиденциальности PREVENT',
  'Настоящая Политика конфиденциальности описывает, как платформа PREVENT собирает, использует и защищает ваши персональные данные.

1. СБОР ДАННЫХ
Мы собираем только необходимые данные для предоставления наших услуг по превентивной медицине.

2. ИСПОЛЬЗОВАНИЕ ДАННЫХ
Ваши данные используются исключительно для:
- Предоставления персонализированных рекомендаций по здоровью
- Анализа рисков заболеваний
- Связи с медицинскими партнерами

3. ЗАЩИТА ДАННЫХ
Мы применяем современные методы шифрования и защиты данных в соответствии с требованиями GDPR и российского законодательства.

4. ВАШИ ПРАВА
Вы имеете право на доступ, исправление и удаление ваших персональных данных.

Для вопросов по политике конфиденциальности обращайтесь: privacy@prevent.ru',
  '1.0',
  true
);
