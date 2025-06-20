
-- Расширяем таблицу family_members для дополнительной информации
ALTER TABLE public.family_members 
ADD COLUMN IF NOT EXISTS place_of_birth TEXT,
ADD COLUMN IF NOT EXISTS occupation TEXT,
ADD COLUMN IF NOT EXISTS education_level TEXT,
ADD COLUMN IF NOT EXISTS marital_status TEXT,
ADD COLUMN IF NOT EXISTS blood_type TEXT,
ADD COLUMN IF NOT EXISTS height_cm INTEGER,
ADD COLUMN IF NOT EXISTS weight_kg NUMERIC(5,2),
ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT,
ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT,
ADD COLUMN IF NOT EXISTS lifestyle_factors JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS chronic_conditions JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS allergies JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS medications JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS vaccinations JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS genetic_predispositions JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS family_history_notes TEXT,
ADD COLUMN IF NOT EXISTS last_medical_checkup DATE,
ADD COLUMN IF NOT EXISTS preferred_doctor TEXT,
ADD COLUMN IF NOT EXISTS insurance_info TEXT;

-- Создаем таблицу для детальных медицинских записей членов семьи
CREATE TABLE IF NOT EXISTS public.family_member_health_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  family_member_id UUID REFERENCES public.family_members(id) ON DELETE CASCADE NOT NULL,
  record_type TEXT NOT NULL, -- 'diagnosis', 'procedure', 'test_result', 'prescription', 'vaccination'
  title TEXT NOT NULL,
  description TEXT,
  date_recorded DATE,
  doctor_name TEXT,
  clinic_name TEXT,
  results JSONB DEFAULT '{}',
  severity TEXT, -- 'mild', 'moderate', 'severe', 'critical'
  status TEXT DEFAULT 'active', -- 'active', 'resolved', 'chronic', 'monitoring'
  attachments JSONB DEFAULT '[]',
  notes TEXT,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создаем таблицу для отслеживания показателей здоровья членов семьи
CREATE TABLE IF NOT EXISTS public.family_member_health_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  family_member_id UUID REFERENCES public.family_members(id) ON DELETE CASCADE NOT NULL,
  metric_type TEXT NOT NULL, -- 'blood_pressure', 'cholesterol', 'glucose', 'bmi', 'heart_rate', etc.
  value_numeric NUMERIC,
  value_text TEXT,
  unit TEXT,
  reference_range_min NUMERIC,
  reference_range_max NUMERIC,
  is_within_normal_range BOOLEAN,
  measurement_date DATE NOT NULL,
  measured_by TEXT,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Включаем RLS для новых таблиц
ALTER TABLE public.family_member_health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_member_health_metrics ENABLE ROW LEVEL SECURITY;

-- Политики доступа для health_records
CREATE POLICY "Family group members can view health records" 
  ON public.family_member_health_records 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.family_members fm 
      JOIN public.family_groups fg ON fm.family_group_id = fg.id
      WHERE fm.id = family_member_id 
      AND (fg.created_by = auth.uid() OR EXISTS (
        SELECT 1 FROM public.family_access_members fam 
        WHERE fam.family_group_id = fg.id 
        AND fam.user_id = auth.uid() 
        AND fam.is_active = true
      ))
    )
  );

CREATE POLICY "Family group owners can manage health records" 
  ON public.family_member_health_records 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.family_members fm 
      JOIN public.family_groups fg ON fm.family_group_id = fg.id
      WHERE fm.id = family_member_id 
      AND fg.created_by = auth.uid()
    )
  );

-- Политики доступа для health_metrics
CREATE POLICY "Family group members can view health metrics" 
  ON public.family_member_health_metrics 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.family_members fm 
      JOIN public.family_groups fg ON fm.family_group_id = fg.id
      WHERE fm.id = family_member_id 
      AND (fg.created_by = auth.uid() OR EXISTS (
        SELECT 1 FROM public.family_access_members fam 
        WHERE fam.family_group_id = fg.id 
        AND fam.user_id = auth.uid() 
        AND fam.is_active = true
      ))
    )
  );

CREATE POLICY "Family group owners can manage health metrics" 
  ON public.family_member_health_metrics 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.family_members fm 
      JOIN public.family_groups fg ON fm.family_group_id = fg.id
      WHERE fm.id = family_member_id 
      AND fg.created_by = auth.uid()
    )
  );

-- Триггеры для обновления updated_at
CREATE TRIGGER update_family_member_health_records_updated_at
  BEFORE UPDATE ON public.family_member_health_records
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_family_member_health_metrics_updated_at
  BEFORE UPDATE ON public.family_member_health_metrics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
