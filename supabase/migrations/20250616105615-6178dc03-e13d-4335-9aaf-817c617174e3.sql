
-- Добавляем новые поля в таблицу profiles для расширенной медицинской анкеты
-- Разбиваем на отдельные команды для избежания блокировок

-- Семейная история и медицинские данные
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS family_history TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS current_medications TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS chronic_conditions TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS allergies TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS previous_surgeries TEXT;

-- История здоровья
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS vaccination_history TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS mental_health_history TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS reproductive_health TEXT;

-- Экстренные контакты
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS emergency_contact_relation TEXT;

-- Медицинская информация
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preferred_doctor TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS insurance_info TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_checkup_date DATE;

-- Образ жизни
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS dietary_restrictions TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS sleep_patterns TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS stress_levels TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS exercise_frequency TEXT;

-- Добавляем ограничения для enum-подобных полей
ALTER TABLE public.profiles ADD CONSTRAINT stress_levels_check 
    CHECK (stress_levels IS NULL OR stress_levels IN ('low', 'moderate', 'high', 'very_high'));

ALTER TABLE public.profiles ADD CONSTRAINT exercise_frequency_check 
    CHECK (exercise_frequency IS NULL OR exercise_frequency IN ('never', 'rarely', 'weekly', 'daily'));
