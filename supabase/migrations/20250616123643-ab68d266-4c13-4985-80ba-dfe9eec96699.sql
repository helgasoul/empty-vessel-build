
-- Создаем таблицу для медицинских записей (цифровая медкарта)
CREATE TABLE public.medical_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  record_type TEXT NOT NULL CHECK (record_type IN ('diagnosis', 'prescription', 'lab_result', 'imaging', 'vaccination', 'allergy', 'surgery', 'consultation')),
  title TEXT NOT NULL,
  description TEXT,
  doctor_name TEXT,
  clinic_name TEXT,
  record_date DATE NOT NULL,
  attachments JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создаем таблицу для партнерских клиник и лабораторий
CREATE TABLE public.partner_providers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  provider_type TEXT NOT NULL CHECK (provider_type IN ('clinic', 'laboratory', 'hospital', 'diagnostic_center')),
  address TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  specializations TEXT[],
  working_hours JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  rating NUMERIC(3,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создаем таблицу для врачей партнерских клиник
CREATE TABLE public.partner_doctors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID REFERENCES public.partner_providers(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT NOT NULL,
  specialization TEXT NOT NULL,
  qualification TEXT,
  experience_years INTEGER,
  consultation_fee NUMERIC(10,2),
  available_slots JSONB DEFAULT '[]'::jsonb,
  is_available BOOLEAN NOT NULL DEFAULT true,
  rating NUMERIC(3,2) DEFAULT 0,
  bio TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создаем таблицу для записей на приемы
CREATE TABLE public.medical_appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  provider_id UUID REFERENCES public.partner_providers(id) NOT NULL,
  doctor_id UUID REFERENCES public.partner_doctors(id),
  appointment_type TEXT NOT NULL CHECK (appointment_type IN ('consultation', 'lab_test', 'diagnostic', 'procedure', 'telemedicine')),
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
  reason TEXT,
  notes TEXT,
  cost NUMERIC(10,2),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  reminder_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создаем таблицу для телемедицинских сессий
CREATE TABLE public.telemedicine_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID REFERENCES public.medical_appointments(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  doctor_id UUID REFERENCES public.partner_doctors(id) NOT NULL,
  session_token TEXT,
  room_id TEXT,
  session_status TEXT NOT NULL DEFAULT 'pending' CHECK (session_status IN ('pending', 'active', 'ended', 'cancelled')),
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  session_notes TEXT,
  prescription_issued BOOLEAN DEFAULT false,
  follow_up_required BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Включаем RLS для всех таблиц
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telemedicine_sessions ENABLE ROW LEVEL SECURITY;

-- Политики для medical_records
CREATE POLICY "Users can view their own medical records" 
  ON public.medical_records 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own medical records" 
  ON public.medical_records 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own medical records" 
  ON public.medical_records 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own medical records" 
  ON public.medical_records 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Политики для partner_providers (публичное чтение)
CREATE POLICY "Anyone can view active providers" 
  ON public.partner_providers 
  FOR SELECT 
  USING (is_active = true);

-- Политики для partner_doctors (публичное чтение)
CREATE POLICY "Anyone can view available doctors" 
  ON public.partner_doctors 
  FOR SELECT 
  USING (is_available = true);

-- Политики для medical_appointments
CREATE POLICY "Users can view their own appointments" 
  ON public.medical_appointments 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own appointments" 
  ON public.medical_appointments 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own appointments" 
  ON public.medical_appointments 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own appointments" 
  ON public.medical_appointments 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Политики для telemedicine_sessions
CREATE POLICY "Users can view their own telemedicine sessions" 
  ON public.telemedicine_sessions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own telemedicine sessions" 
  ON public.telemedicine_sessions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own telemedicine sessions" 
  ON public.telemedicine_sessions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Создаем индексы для улучшения производительности
CREATE INDEX idx_medical_records_user_id ON public.medical_records(user_id);
CREATE INDEX idx_medical_records_record_date ON public.medical_records(record_date);
CREATE INDEX idx_partner_providers_type ON public.partner_providers(provider_type);
CREATE INDEX idx_partner_doctors_provider_id ON public.partner_doctors(provider_id);
CREATE INDEX idx_medical_appointments_user_id ON public.medical_appointments(user_id);
CREATE INDEX idx_medical_appointments_date ON public.medical_appointments(appointment_date);
CREATE INDEX idx_telemedicine_sessions_appointment_id ON public.telemedicine_sessions(appointment_id);

-- Добавляем тестовые данные партнерских провайдеров
INSERT INTO public.partner_providers (name, provider_type, address, phone, email, specializations, working_hours) VALUES
('Клиника "Здоровье+"', 'clinic', 'ул. Пушкина, 10, Москва', '+7 (495) 123-45-67', 'info@health-plus.ru', 
 ARRAY['кардиология', 'терапия', 'гинекология'], 
 '{"monday": "09:00-18:00", "tuesday": "09:00-18:00", "wednesday": "09:00-18:00", "thursday": "09:00-18:00", "friday": "09:00-18:00", "saturday": "10:00-16:00"}'::jsonb),
('Лаборатория "МедТест"', 'laboratory', 'пр. Мира, 25, Москва', '+7 (495) 987-65-43', 'lab@medtest.ru', 
 ARRAY['анализы крови', 'генетические тесты', 'гормональные исследования'], 
 '{"monday": "08:00-20:00", "tuesday": "08:00-20:00", "wednesday": "08:00-20:00", "thursday": "08:00-20:00", "friday": "08:00-20:00", "saturday": "09:00-17:00"}'::jsonb),
('Диагностический центр "Точность"', 'diagnostic_center', 'ул. Тверская, 15, Москва', '+7 (495) 555-12-34', 'info@tochnost.ru', 
 ARRAY['УЗИ', 'МРТ', 'КТ', 'рентген'], 
 '{"monday": "08:00-19:00", "tuesday": "08:00-19:00", "wednesday": "08:00-19:00", "thursday": "08:00-19:00", "friday": "08:00-19:00", "saturday": "09:00-15:00"}'::jsonb);

-- Добавляем тестовых врачей
INSERT INTO public.partner_doctors (provider_id, full_name, specialization, qualification, experience_years, consultation_fee, bio) 
SELECT 
  p.id,
  doctor_name,
  specialization,
  qualification,
  experience_years,
  consultation_fee,
  bio
FROM public.partner_providers p,
(VALUES 
  ('Иванова Анна Петровна', 'кардиолог', 'врач высшей категории, к.м.н.', 15, 3000.00, 'Специализируется на лечении сердечно-сосудистых заболеваний'),
  ('Петров Михаил Сергеевич', 'терапевт', 'врач первой категории', 10, 2500.00, 'Врач общей практики с опытом ведения пациентов с хроническими заболеваниями'),
  ('Сидорова Елена Александровна', 'гинеколог', 'врач высшей категории', 12, 3500.00, 'Специалист по женскому здоровью и репродуктивной медицине')
) AS doctors(doctor_name, specialization, qualification, experience_years, consultation_fee, bio)
WHERE p.provider_type = 'clinic'
LIMIT 3;
