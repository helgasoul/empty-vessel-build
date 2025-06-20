
-- Более тщательная очистка существующих политик для family_members
DROP POLICY IF EXISTS "Users can view family members they created" ON public.family_members;
DROP POLICY IF EXISTS "Users can insert family members" ON public.family_members;
DROP POLICY IF EXISTS "Users can update family members they created" ON public.family_members;
DROP POLICY IF EXISTS "Users can delete family members they created" ON public.family_members;

-- Включаем RLS для family_members (если еще не включен)
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;

-- Создаем политики для family_members
CREATE POLICY "Users can view family members they created" 
  ON public.family_members 
  FOR SELECT 
  USING (created_by = auth.uid());

CREATE POLICY "Users can insert family members" 
  ON public.family_members 
  FOR INSERT 
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update family members they created" 
  ON public.family_members 
  FOR UPDATE 
  USING (created_by = auth.uid());

CREATE POLICY "Users can delete family members they created" 
  ON public.family_members 
  FOR DELETE 
  USING (created_by = auth.uid());

-- Включаем RLS для других таблиц (если еще не включен)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_access_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_health_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fertility_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hormonal_health_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_bookings ENABLE ROW LEVEL SECURITY;

-- Убеждаемся, что политики для других таблиц не конфликтуют
-- Политики для profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

CREATE POLICY "Users can view own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Политики для family_groups
DROP POLICY IF EXISTS "Users can view their family groups" ON public.family_groups;
DROP POLICY IF EXISTS "Users can insert their family groups" ON public.family_groups;
DROP POLICY IF EXISTS "Users can update their family groups" ON public.family_groups;
DROP POLICY IF EXISTS "Users can delete their family groups" ON public.family_groups;

CREATE POLICY "Users can view their family groups" 
  ON public.family_groups 
  FOR SELECT 
  USING (created_by = auth.uid());

CREATE POLICY "Users can insert their family groups" 
  ON public.family_groups 
  FOR INSERT 
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their family groups" 
  ON public.family_groups 
  FOR UPDATE 
  USING (created_by = auth.uid());

CREATE POLICY "Users can delete their family groups" 
  ON public.family_groups 
  FOR DELETE 
  USING (created_by = auth.uid());

-- Политики для family_access_tokens
DROP POLICY IF EXISTS "Users can view their access tokens" ON public.family_access_tokens;
DROP POLICY IF EXISTS "Users can insert their access tokens" ON public.family_access_tokens;
DROP POLICY IF EXISTS "Users can update their access tokens" ON public.family_access_tokens;
DROP POLICY IF EXISTS "Users can delete their access tokens" ON public.family_access_tokens;

CREATE POLICY "Users can view their access tokens" 
  ON public.family_access_tokens 
  FOR SELECT 
  USING (created_by = auth.uid());

CREATE POLICY "Users can insert their access tokens" 
  ON public.family_access_tokens 
  FOR INSERT 
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their access tokens" 
  ON public.family_access_tokens 
  FOR UPDATE 
  USING (created_by = auth.uid());

CREATE POLICY "Users can delete their access tokens" 
  ON public.family_access_tokens 
  FOR DELETE 
  USING (created_by = auth.uid());

-- Политики для risk_assessments
DROP POLICY IF EXISTS "Users can view their risk assessments" ON public.risk_assessments;
DROP POLICY IF EXISTS "Users can insert their risk assessments" ON public.risk_assessments;
DROP POLICY IF EXISTS "Users can update their risk assessments" ON public.risk_assessments;
DROP POLICY IF EXISTS "Users can delete their risk assessments" ON public.risk_assessments;

CREATE POLICY "Users can view their risk assessments" 
  ON public.risk_assessments 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their risk assessments" 
  ON public.risk_assessments 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their risk assessments" 
  ON public.risk_assessments 
  FOR UPDATE 
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their risk assessments" 
  ON public.risk_assessments 
  FOR DELETE 
  USING (user_id = auth.uid());
