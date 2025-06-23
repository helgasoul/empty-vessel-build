
-- Создание таблицы медицинских партнеров
CREATE TABLE public.medical_partners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Основная информация о партнере
  partner_name VARCHAR(200) NOT NULL,
  partner_type VARCHAR(100) NOT NULL CHECK (partner_type IN ('gynecology_clinic', 'laboratory', 'diagnostic_center', 'hospital')),
  legal_entity VARCHAR(300),
  license_number VARCHAR(100),
  
  -- Специализация
  specializations JSONB NOT NULL DEFAULT '[]'::jsonb,
  women_health_focus BOOLEAN DEFAULT TRUE,
  age_groups_served JSONB DEFAULT '["18-30", "31-45", "46-65", "65+"]'::jsonb,
  
  -- Контактная информация
  address JSONB NOT NULL DEFAULT '{}'::jsonb,
  phone VARCHAR(20),
  email VARCHAR(100),
  website VARCHAR(200),
  
  -- Интеграция
  api_endpoint VARCHAR(300),
  api_version VARCHAR(20),
  integration_status VARCHAR(50) DEFAULT 'pending' CHECK (integration_status IN ('pending', 'active', 'suspended', 'inactive')),
  last_sync TIMESTAMP WITH TIME ZONE,
  
  -- Качество и рейтинги
  quality_rating DECIMAL(3,2) CHECK (quality_rating >= 0 AND quality_rating <= 5),
  patient_reviews_count INTEGER DEFAULT 0,
  women_health_expertise DECIMAL(3,2) CHECK (women_health_expertise >= 0 AND women_health_expertise <= 5),
  
  -- Услуги и возможности
  available_services JSONB NOT NULL DEFAULT '[]'::jsonb,
  appointment_booking_available BOOLEAN DEFAULT FALSE,
  online_results_available BOOLEAN DEFAULT FALSE,
  telemedicine_available BOOLEAN DEFAULT FALSE,
  
  -- Географические ограничения
  service_areas JSONB DEFAULT '[]'::jsonb,
  coordinates POINT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создание таблицы гинекологических записей
CREATE TABLE public.gynecology_appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  partner_id UUID REFERENCES public.medical_partners(id),
  
  -- Информация о записи
  appointment_type VARCHAR(100) NOT NULL CHECK (appointment_type IN ('consultation', 'screening', 'procedure', 'diagnostics')),
  service_code VARCHAR(100),
  service_name VARCHAR(200),
  
  -- Временные данные
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  estimated_duration INTEGER DEFAULT 30, -- минуты
  timezone VARCHAR(50) DEFAULT 'Europe/Moscow',
  
  -- Врач
  doctor_id VARCHAR(100), -- ID врача в системе клиники
  doctor_name VARCHAR(200),
  doctor_specialization VARCHAR(100),
  
  -- Женско-специфичная информация
  cycle_day INTEGER,
  cycle_phase VARCHAR(50) CHECK (cycle_phase IN ('menstrual', 'follicular', 'ovulation', 'luteal')),
  cycle_considerations JSONB DEFAULT '{}'::jsonb,
  
  -- Подготовка к приему
  preparation_required BOOLEAN DEFAULT FALSE,
  preparation_instructions JSONB DEFAULT '[]'::jsonb,
  preparation_completed BOOLEAN DEFAULT FALSE,
  
  -- Статус записи
  booking_status VARCHAR(50) DEFAULT 'scheduled' CHECK (booking_status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show')),
  booking_confirmation VARCHAR(100),
  external_appointment_id VARCHAR(100),
  
  -- Результаты и последующие действия
  appointment_notes TEXT,
  results_available BOOLEAN DEFAULT FALSE,
  results_summary JSONB DEFAULT '{}'::jsonb,
  follow_up_required BOOLEAN DEFAULT FALSE,
  follow_up_date DATE,
  
  -- Стоимость
  estimated_cost DECIMAL(10,2),
  actual_cost DECIMAL(10,2),
  insurance_covered BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создание таблицы лабораторных тестов
CREATE TABLE public.lab_tests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  partner_id UUID REFERENCES public.medical_partners(id),
  
  -- Информация о тесте
  test_code VARCHAR(100) NOT NULL,
  test_name VARCHAR(200) NOT NULL,
  test_category VARCHAR(100) NOT NULL CHECK (test_category IN ('hormones', 'oncology_markers', 'genetics', 'microbiome', 'general')),
  
  -- Планирование
  collection_date DATE,
  collection_time TIME,
  optimal_cycle_phase VARCHAR(50) CHECK (optimal_cycle_phase IN ('menstrual', 'follicular', 'ovulation', 'luteal')),
  
  -- Подготовка
  preparation_instructions JSONB DEFAULT '[]'::jsonb,
  preparation_completed BOOLEAN DEFAULT FALSE,
  
  -- Результаты
  status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'collected', 'processing', 'completed', 'cancelled')),
  results JSONB DEFAULT '{}'::jsonb,
  reference_ranges JSONB DEFAULT '{}'::jsonb,
  interpretation TEXT,
  
  -- Стоимость и сроки
  cost DECIMAL(10,2),
  processing_duration VARCHAR(50),
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создание таблицы персонализированных планов скрининга
CREATE TABLE public.screening_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  
  -- Основная информация
  plan_name VARCHAR(200) NOT NULL,
  plan_type VARCHAR(100) NOT NULL CHECK (plan_type IN ('comprehensive', 'risk_based', 'age_based', 'symptom_based')),
  
  -- Рекомендуемые услуги
  recommended_services JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_estimated_cost DECIMAL(10,2),
  recommended_frequency VARCHAR(100),
  
  -- Персонализация
  risk_factors JSONB DEFAULT '[]'::jsonb,
  age_considerations JSONB DEFAULT '{}'::jsonb,
  cycle_considerations JSONB DEFAULT '{}'::jsonb,
  
  -- Планирование
  next_appointment_date DATE,
  priority_level VARCHAR(50) DEFAULT 'medium' CHECK (priority_level IN ('low', 'medium', 'high', 'urgent')),
  
  -- Статус выполнения
  completion_status VARCHAR(50) DEFAULT 'pending' CHECK (completion_status IN ('pending', 'in_progress', 'completed', 'overdue')),
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создание таблицы медицинских напоминаний
CREATE TABLE public.medical_reminders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  appointment_id UUID REFERENCES public.gynecology_appointments(id),
  lab_test_id UUID REFERENCES public.lab_tests(id),
  
  -- Информация о напоминании
  reminder_type VARCHAR(100) NOT NULL CHECK (reminder_type IN ('planning', 'preparation', 'day_of', 'proximity', 'follow_up')),
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  
  -- Планирование
  trigger_date DATE NOT NULL,
  trigger_time TIME,
  
  -- Статус
  status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'sent', 'read', 'dismissed')),
  sent_at TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE,
  
  -- Действия
  available_actions JSONB DEFAULT '[]'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS политики для medical_partners (публичное чтение активных партнеров)
ALTER TABLE public.medical_partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active medical partners" 
  ON public.medical_partners 
  FOR SELECT 
  USING (integration_status = 'active');

-- RLS политики для gynecology_appointments
ALTER TABLE public.gynecology_appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own gynecology appointments" 
  ON public.gynecology_appointments 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own gynecology appointments" 
  ON public.gynecology_appointments 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own gynecology appointments" 
  ON public.gynecology_appointments 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own gynecology appointments" 
  ON public.gynecology_appointments 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS политики для lab_tests
ALTER TABLE public.lab_tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own lab tests" 
  ON public.lab_tests 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own lab tests" 
  ON public.lab_tests 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lab tests" 
  ON public.lab_tests 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lab tests" 
  ON public.lab_tests 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS политики для screening_plans
ALTER TABLE public.screening_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own screening plans" 
  ON public.screening_plans 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own screening plans" 
  ON public.screening_plans 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own screening plans" 
  ON public.screening_plans 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own screening plans" 
  ON public.screening_plans 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS политики для medical_reminders
ALTER TABLE public.medical_reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own medical reminders" 
  ON public.medical_reminders 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own medical reminders" 
  ON public.medical_reminders 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own medical reminders" 
  ON public.medical_reminders 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own medical reminders" 
  ON public.medical_reminders 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Индексы для производительности
CREATE INDEX idx_medical_partners_type ON public.medical_partners(partner_type);
CREATE INDEX idx_medical_partners_status ON public.medical_partners(integration_status);
CREATE INDEX idx_gynecology_appointments_user_id ON public.gynecology_appointments(user_id);
CREATE INDEX idx_gynecology_appointments_date ON public.gynecology_appointments(appointment_date);
CREATE INDEX idx_lab_tests_user_id ON public.lab_tests(user_id);
CREATE INDEX idx_lab_tests_category ON public.lab_tests(test_category);
CREATE INDEX idx_screening_plans_user_id ON public.screening_plans(user_id);
CREATE INDEX idx_medical_reminders_user_id ON public.medical_reminders(user_id);
CREATE INDEX idx_medical_reminders_trigger_date ON public.medical_reminders(trigger_date);

-- Триггеры для обновления updated_at
CREATE TRIGGER update_medical_partners_updated_at
  BEFORE UPDATE ON public.medical_partners
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_gynecology_appointments_updated_at
  BEFORE UPDATE ON public.gynecology_appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lab_tests_updated_at
  BEFORE UPDATE ON public.lab_tests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_screening_plans_updated_at
  BEFORE UPDATE ON public.screening_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_medical_reminders_updated_at
  BEFORE UPDATE ON public.medical_reminders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Добавление тестовых данных для медицинских партнеров
INSERT INTO public.medical_partners (
  partner_name, 
  partner_type, 
  specializations, 
  address, 
  phone, 
  email, 
  website,
  quality_rating,
  patient_reviews_count,
  women_health_expertise,
  available_services,
  appointment_booking_available,
  integration_status
) VALUES 
(
  'Клиника Чайка - Женское здоровье',
  'gynecology_clinic',
  '["gynecology", "reproductive_health", "mammography", "fertility"]'::jsonb,
  '{"city": "Москва", "district": "Центральный", "address": "ул. Малая Дмитровка, 25"}'::jsonb,
  '+7 (495) 147-77-77',
  'women@chaika.com',
  'https://chaika.com/women-health',
  4.8,
  450,
  4.9,
  '["consultation", "screening", "ultrasound", "laboratory", "mammography"]'::jsonb,
  true,
  'active'
),
(
  'Клиника Илья Ильинский - Гинекология',
  'gynecology_clinic',
  '["gynecology", "endocrinology", "reproductive_medicine"]'::jsonb,
  '{"city": "Москва", "district": "Северо-Западный", "address": "Красногорск, ул. 1-я Мытищинская, 15"}'::jsonb,
  '+7 (495) 276-00-15',
  'gynecology@ilinskaya.ru',
  'https://ilinskaya.ru/gynecology',
  4.7,
  320,
  4.8,
  '["consultation", "screening", "surgery", "fertility_treatment"]'::jsonb,
  true,
  'active'
),
(
  'Лаборатория ИНВИТРО',
  'laboratory',
  '["clinical_laboratory", "genetics", "hormones", "oncology_markers"]'::jsonb,
  '{"city": "Москва", "district": "Все районы", "address": "Сеть лабораторий"}'::jsonb,
  '+7 (800) 200-363-0',
  'info@invitro.ru',
  'https://www.invitro.ru',
  4.5,
  1200,
  4.6,
  '["blood_tests", "hormone_panel", "genetic_testing", "oncology_screening"]'::jsonb,
  true,
  'active'
);
