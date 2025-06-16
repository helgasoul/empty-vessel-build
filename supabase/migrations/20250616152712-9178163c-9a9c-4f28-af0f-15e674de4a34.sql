
-- Создаем таблицу для телемедицинских сессий (расширяем существующую)
ALTER TABLE telemedicine_sessions 
ADD COLUMN IF NOT EXISTS meeting_link text,
ADD COLUMN IF NOT EXISTS session_recording_url text,
ADD COLUMN IF NOT EXISTS payment_amount numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending';

-- Создаем таблицу для аптечных партнеров
CREATE TABLE IF NOT EXISTS pharmacy_partners (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  address text,
  phone text,
  email text,
  website text,
  delivery_available boolean DEFAULT false,
  working_hours jsonb DEFAULT '{}'::jsonb,
  delivery_zones text[],
  is_active boolean DEFAULT true,
  rating numeric DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Создаем таблицу для медицинских процедур
CREATE TABLE IF NOT EXISTS medical_procedures (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  procedure_name text NOT NULL,
  procedure_type text NOT NULL,
  scheduled_date date NOT NULL,
  scheduled_time time,
  duration_minutes integer DEFAULT 30,
  doctor_name text,
  clinic_name text,
  location text,
  preparation_instructions text,
  notes text,
  status text DEFAULT 'scheduled',
  reminder_sent boolean DEFAULT false,
  is_recurring boolean DEFAULT false,
  recurrence_pattern jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Включаем RLS для новых таблиц
ALTER TABLE pharmacy_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_procedures ENABLE ROW LEVEL SECURITY;

-- Политики для pharmacy_partners (публичное чтение)
CREATE POLICY "Anyone can view active pharmacy partners" 
  ON pharmacy_partners 
  FOR SELECT 
  USING (is_active = true);

-- Политики для medical_procedures
CREATE POLICY "Users can view their own procedures" 
  ON medical_procedures 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own procedures" 
  ON medical_procedures 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own procedures" 
  ON medical_procedures 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own procedures" 
  ON medical_procedures 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Добавляем триггеры для обновления updated_at
CREATE OR REPLACE TRIGGER update_pharmacy_partners_updated_at
    BEFORE UPDATE ON pharmacy_partners
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_medical_procedures_updated_at
    BEFORE UPDATE ON medical_procedures
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Добавляем некоторые примеры аптечных партнеров
INSERT INTO pharmacy_partners (name, address, phone, delivery_available, working_hours, delivery_zones) VALUES
('Аптека Ригла', 'ул. Тверская, 15, Москва', '+7 (495) 123-45-67', true, '{"mon-sun": "24/7"}', '{"Центральный АО", "Северный АО"}'),
('36.6 Аптека', 'пр-т Мира, 45, Москва', '+7 (495) 234-56-78', true, '{"mon-fri": "8:00-22:00", "sat-sun": "9:00-21:00"}', '{"Центральный АО", "Восточный АО"}'),
('Планета Здоровья', 'ул. Арбат, 23, Москва', '+7 (495) 345-67-89', false, '{"mon-sun": "9:00-21:00"}', '{}');
