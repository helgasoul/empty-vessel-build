
-- Включаем RLS для всех основных таблиц и создаем базовые политики

-- Таблица profiles (если RLS еще не включен)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Политики для profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Таблица risk_assessments
ALTER TABLE public.risk_assessments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own risk assessments" ON public.risk_assessments;
DROP POLICY IF EXISTS "Users can create own risk assessments" ON public.risk_assessments;
DROP POLICY IF EXISTS "Users can update own risk assessments" ON public.risk_assessments;

CREATE POLICY "Users can view own risk assessments" 
  ON public.risk_assessments FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own risk assessments" 
  ON public.risk_assessments FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own risk assessments" 
  ON public.risk_assessments FOR UPDATE 
  USING (auth.uid() = user_id);

-- Таблица user_devices
ALTER TABLE public.user_devices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own devices" ON public.user_devices;
DROP POLICY IF EXISTS "Users can create own devices" ON public.user_devices;
DROP POLICY IF EXISTS "Users can update own devices" ON public.user_devices;
DROP POLICY IF EXISTS "Users can delete own devices" ON public.user_devices;

CREATE POLICY "Users can view own devices" 
  ON public.user_devices FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own devices" 
  ON public.user_devices FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own devices" 
  ON public.user_devices FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own devices" 
  ON public.user_devices FOR DELETE 
  USING (auth.uid() = user_id);

-- Таблица medical_records
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own medical records" ON public.medical_records;
DROP POLICY IF EXISTS "Users can create own medical records" ON public.medical_records;
DROP POLICY IF EXISTS "Users can update own medical records" ON public.medical_records;
DROP POLICY IF EXISTS "Users can delete own medical records" ON public.medical_records;

CREATE POLICY "Users can view own medical records" 
  ON public.medical_records FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own medical records" 
  ON public.medical_records FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own medical records" 
  ON public.medical_records FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own medical records" 
  ON public.medical_records FOR DELETE 
  USING (auth.uid() = user_id);

-- Таблица health_device_data
ALTER TABLE public.health_device_data ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own device data" ON public.health_device_data;
DROP POLICY IF EXISTS "Users can create own device data" ON public.health_device_data;

CREATE POLICY "Users can view own device data" 
  ON public.health_device_data FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own device data" 
  ON public.health_device_data FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Таблица daily_health_summary
ALTER TABLE public.daily_health_summary ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own health summary" ON public.daily_health_summary;
DROP POLICY IF EXISTS "Users can create own health summary" ON public.daily_health_summary;
DROP POLICY IF EXISTS "Users can update own health summary" ON public.daily_health_summary;

CREATE POLICY "Users can view own health summary" 
  ON public.daily_health_summary FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own health summary" 
  ON public.daily_health_summary FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own health summary" 
  ON public.daily_health_summary FOR UPDATE 
  USING (auth.uid() = user_id);

-- Таблица menstrual_cycles
ALTER TABLE public.menstrual_cycles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own menstrual cycles" ON public.menstrual_cycles;
DROP POLICY IF EXISTS "Users can create own menstrual cycles" ON public.menstrual_cycles;
DROP POLICY IF EXISTS "Users can update own menstrual cycles" ON public.menstrual_cycles;
DROP POLICY IF EXISTS "Users can delete own menstrual cycles" ON public.menstrual_cycles;

CREATE POLICY "Users can view own menstrual cycles" 
  ON public.menstrual_cycles FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own menstrual cycles" 
  ON public.menstrual_cycles FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own menstrual cycles" 
  ON public.menstrual_cycles FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own menstrual cycles" 
  ON public.menstrual_cycles FOR DELETE 
  USING (auth.uid() = user_id);

-- Таблица symptom_mood_logs
ALTER TABLE public.symptom_mood_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own symptom logs" ON public.symptom_mood_logs;
DROP POLICY IF EXISTS "Users can create own symptom logs" ON public.symptom_mood_logs;
DROP POLICY IF EXISTS "Users can update own symptom logs" ON public.symptom_mood_logs;
DROP POLICY IF EXISTS "Users can delete own symptom logs" ON public.symptom_mood_logs;

CREATE POLICY "Users can view own symptom logs" 
  ON public.symptom_mood_logs FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own symptom logs" 
  ON public.symptom_mood_logs FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own symptom logs" 
  ON public.symptom_mood_logs FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own symptom logs" 
  ON public.symptom_mood_logs FOR DELETE 
  USING (auth.uid() = user_id);
