
-- Добавляем новые поля в таблицу profiles для расширенной анкеты
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS height INTEGER; -- рост в см
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS weight DECIMAL(5,2); -- вес в кг
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS lifestyle TEXT; -- образ жизни
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS medical_history TEXT; -- медицинская история
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS current_health_issues TEXT; -- текущие проблемы со здоровьем
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS health_goals TEXT; -- цели в области здоровья
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS date_of_birth DATE; -- дата рождения
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS activity_level TEXT CHECK (activity_level IN ('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active')); -- уровень активности
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS smoking_status TEXT CHECK (smoking_status IN ('never', 'former', 'current')); -- статус курения
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS alcohol_consumption TEXT CHECK (alcohol_consumption IN ('never', 'rarely', 'occasionally', 'regularly')); -- употребление алкоголя

-- Обновляем функцию обновления времени
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Создаем триггер для автоматического обновления updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON public.profiles 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
