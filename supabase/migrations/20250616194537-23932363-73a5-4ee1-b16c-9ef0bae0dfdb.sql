
-- Обновляем enum для ролей, добавляя роль врача и пациента
DROP TYPE IF EXISTS public.app_role CASCADE;
CREATE TYPE public.app_role AS ENUM ('admin', 'doctor', 'patient');

-- Пересоздаем таблицу user_roles с новыми ролями
DROP TABLE IF EXISTS public.user_roles CASCADE;
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Включаем RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Создаем функцию проверки роли
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Политики для таблицы user_roles
CREATE POLICY "Users can view their own roles" 
  ON public.user_roles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" 
  ON public.user_roles 
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all roles" 
  ON public.user_roles 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Создаем таблицу профилей врачей
CREATE TABLE public.doctor_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    specialization TEXT NOT NULL,
    qualification TEXT,
    experience_years INTEGER,
    bio TEXT,
    photo_url TEXT,
    consultation_fee NUMERIC DEFAULT 0,
    is_available BOOLEAN DEFAULT true,
    working_hours JSONB DEFAULT '{"monday": {"start": "09:00", "end": "17:00"}, "tuesday": {"start": "09:00", "end": "17:00"}, "wednesday": {"start": "09:00", "end": "17:00"}, "thursday": {"start": "09:00", "end": "17:00"}, "friday": {"start": "09:00", "end": "17:00"}}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Включаем RLS для doctor_profiles
ALTER TABLE public.doctor_profiles ENABLE ROW LEVEL SECURITY;

-- Политики для doctor_profiles
CREATE POLICY "Anyone can view doctor profiles" 
  ON public.doctor_profiles 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Doctors can manage their own profile" 
  ON public.doctor_profiles 
  FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all doctor profiles" 
  ON public.doctor_profiles 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Создаем таблицу расписания врачей
CREATE TABLE public.doctor_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID REFERENCES public.doctor_profiles(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT true,
    consultation_type TEXT DEFAULT 'consultation',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(doctor_id, date, start_time)
);

-- Включаем RLS для doctor_schedules
ALTER TABLE public.doctor_schedules ENABLE ROW LEVEL SECURITY;

-- Политики для doctor_schedules
CREATE POLICY "Anyone can view available schedules" 
  ON public.doctor_schedules 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Doctors can manage their own schedule" 
  ON public.doctor_schedules 
  FOR ALL 
  USING (
    doctor_id IN (
      SELECT id FROM public.doctor_profiles WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    doctor_id IN (
      SELECT id FROM public.doctor_profiles WHERE user_id = auth.uid()
    )
  );

-- Создаем таблицу записей на консультации
CREATE TABLE public.consultation_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    doctor_id UUID REFERENCES public.doctor_profiles(id) ON DELETE CASCADE NOT NULL,
    schedule_id UUID REFERENCES public.doctor_schedules(id) ON DELETE CASCADE NOT NULL,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    consultation_type TEXT DEFAULT 'consultation',
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show')),
    reason TEXT,
    notes TEXT,
    meeting_link TEXT,
    payment_amount NUMERIC DEFAULT 0,
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Включаем RLS для consultation_bookings
ALTER TABLE public.consultation_bookings ENABLE ROW LEVEL SECURITY;

-- Политики для consultation_bookings
CREATE POLICY "Patients can view their own bookings" 
  ON public.consultation_bookings 
  FOR SELECT 
  USING (auth.uid() = patient_id);

CREATE POLICY "Patients can create bookings" 
  ON public.consultation_bookings 
  FOR INSERT 
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients can update their own bookings" 
  ON public.consultation_bookings 
  FOR UPDATE 
  USING (auth.uid() = patient_id)
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Doctors can view their bookings" 
  ON public.consultation_bookings 
  FOR SELECT 
  USING (
    doctor_id IN (
      SELECT id FROM public.doctor_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can update their bookings" 
  ON public.consultation_bookings 
  FOR UPDATE 
  USING (
    doctor_id IN (
      SELECT id FROM public.doctor_profiles WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    doctor_id IN (
      SELECT id FROM public.doctor_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all bookings" 
  ON public.consultation_bookings 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Триггеры для обновления updated_at
CREATE TRIGGER update_doctor_profiles_updated_at
  BEFORE UPDATE ON public.doctor_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_doctor_schedules_updated_at
  BEFORE UPDATE ON public.doctor_schedules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_consultation_bookings_updated_at
  BEFORE UPDATE ON public.consultation_bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_roles_updated_at
  BEFORE UPDATE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Функция для автоматического обновления расписания при бронировании
CREATE OR REPLACE FUNCTION public.update_schedule_availability()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'scheduled' THEN
    UPDATE public.doctor_schedules 
    SET is_available = false 
    WHERE id = NEW.schedule_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status IN ('scheduled', 'confirmed') AND NEW.status IN ('cancelled', 'no_show') THEN
      UPDATE public.doctor_schedules 
      SET is_available = true 
      WHERE id = NEW.schedule_id;
    ELSIF OLD.status IN ('cancelled', 'no_show') AND NEW.status IN ('scheduled', 'confirmed') THEN
      UPDATE public.doctor_schedules 
      SET is_available = false 
      WHERE id = NEW.schedule_id;
    END IF;
  ELSIF TG_OP = 'DELETE' AND OLD.status IN ('scheduled', 'confirmed') THEN
    UPDATE public.doctor_schedules 
    SET is_available = true 
    WHERE id = OLD.schedule_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Создаем триггер для обновления доступности расписания
CREATE TRIGGER update_schedule_availability_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.consultation_bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_schedule_availability();
