
-- Обновляем enum для ролей, добавляя новые роли согласно архитектуре
DROP TYPE IF EXISTS public.app_role CASCADE;
CREATE TYPE public.app_role AS ENUM ('patient', 'doctor', 'clinic', 'laboratory', 'admin');

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

-- Создаем таблицу для профилей клиник
CREATE TABLE public.clinic_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    clinic_name TEXT NOT NULL,
    clinic_type TEXT,
    license_number TEXT,
    address TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    description TEXT,
    services_offered TEXT[],
    working_hours JSONB DEFAULT '{"monday": {"start": "09:00", "end": "17:00"}, "tuesday": {"start": "09:00", "end": "17:00"}, "wednesday": {"start": "09:00", "end": "17:00"}, "thursday": {"start": "09:00", "end": "17:00"}, "friday": {"start": "09:00", "end": "17:00"}}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    api_access_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создаем таблицу для профилей лабораторий
CREATE TABLE public.laboratory_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    laboratory_name TEXT NOT NULL,
    license_number TEXT,
    accreditation TEXT[],
    address TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    description TEXT,
    test_types_offered TEXT[],
    working_hours JSONB DEFAULT '{"monday": {"start": "08:00", "end": "18:00"}, "tuesday": {"start": "08:00", "end": "18:00"}, "wednesday": {"start": "08:00", "end": "18:00"}, "thursday": {"start": "08:00", "end": "18:00"}, "friday": {"start": "08:00", "end": "18:00"}}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    api_access_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Включаем RLS для clinic_profiles
ALTER TABLE public.clinic_profiles ENABLE ROW LEVEL SECURITY;

-- Политики для clinic_profiles
CREATE POLICY "Anyone can view active clinic profiles" 
  ON public.clinic_profiles 
  FOR SELECT 
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Clinics can manage their own profile" 
  ON public.clinic_profiles 
  FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all clinic profiles" 
  ON public.clinic_profiles 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Включаем RLS для laboratory_profiles
ALTER TABLE public.laboratory_profiles ENABLE ROW LEVEL SECURITY;

-- Политики для laboratory_profiles
CREATE POLICY "Anyone can view active laboratory profiles" 
  ON public.laboratory_profiles 
  FOR SELECT 
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Laboratories can manage their own profile" 
  ON public.laboratory_profiles 
  FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all laboratory profiles" 
  ON public.laboratory_profiles 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Создаем таблицу для разрешений доступа к данным пациентов
CREATE TABLE public.patient_data_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    granted_to_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    granted_to_role app_role NOT NULL,
    permission_type TEXT NOT NULL CHECK (permission_type IN ('read', 'write', 'full')),
    data_types TEXT[] NOT NULL, -- medical_records, lab_results, consultations, etc.
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    revoked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(patient_id, granted_to_id, permission_type)
);

-- Включаем RLS для patient_data_permissions
ALTER TABLE public.patient_data_permissions ENABLE ROW LEVEL SECURITY;

-- Политики для patient_data_permissions
CREATE POLICY "Patients can manage their own permissions" 
  ON public.patient_data_permissions 
  FOR ALL 
  USING (auth.uid() = patient_id)
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Healthcare providers can view permissions granted to them" 
  ON public.patient_data_permissions 
  FOR SELECT 
  USING (auth.uid() = granted_to_id AND is_active = true AND (expires_at IS NULL OR expires_at > now()));

-- Создаем функцию для проверки разрешений доступа к данным пациента
CREATE OR REPLACE FUNCTION public.has_patient_data_permission(
    _patient_id UUID, 
    _requester_id UUID, 
    _permission_type TEXT, 
    _data_type TEXT
)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.patient_data_permissions
    WHERE patient_id = _patient_id
      AND granted_to_id = _requester_id
      AND permission_type IN (_permission_type, 'full')
      AND _data_type = ANY(data_types)
      AND is_active = true
      AND (expires_at IS NULL OR expires_at > now())
  ) OR _patient_id = _requester_id OR public.has_role(_requester_id, 'admin');
$$;

-- Триггеры для обновления updated_at
CREATE TRIGGER update_clinic_profiles_updated_at
  BEFORE UPDATE ON public.clinic_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_laboratory_profiles_updated_at
  BEFORE UPDATE ON public.laboratory_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_patient_data_permissions_updated_at
  BEFORE UPDATE ON public.patient_data_permissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_roles_updated_at
  BEFORE UPDATE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
