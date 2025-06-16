
-- Добавляем новые поля в таблицу menstrual_cycles для улучшенного трекинга
ALTER TABLE public.menstrual_cycles 
ADD COLUMN IF NOT EXISTS basal_temperature DECIMAL(4,2),
ADD COLUMN IF NOT EXISTS cervical_mucus TEXT,
ADD COLUMN IF NOT EXISTS ovulation_test_result BOOLEAN,
ADD COLUMN IF NOT EXISTS ovulation_date DATE,
ADD COLUMN IF NOT EXISTS mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 5),
ADD COLUMN IF NOT EXISTS pain_level INTEGER CHECK (pain_level >= 0 AND pain_level <= 10),
ADD COLUMN IF NOT EXISTS breast_tenderness BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS bloating BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS cycle_type TEXT DEFAULT 'regular' CHECK (cycle_type IN ('regular', 'irregular', 'anovulatory'));

-- Создаем таблицу для планирования беременности
CREATE TABLE IF NOT EXISTS public.pregnancy_planning (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users,
  planning_start_date DATE NOT NULL,
  target_conception_date DATE,
  prenatal_vitamins BOOLEAN DEFAULT false,
  folic_acid_intake BOOLEAN DEFAULT false,
  lifestyle_changes TEXT[],
  medical_checkups TEXT[],
  partner_health_check BOOLEAN DEFAULT false,
  fertility_tracking BOOLEAN DEFAULT true,
  ovulation_prediction BOOLEAN DEFAULT true,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создаем таблицу для мониторинга гормонального здоровья
CREATE TABLE IF NOT EXISTS public.hormonal_health_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users,
  tracking_date DATE NOT NULL,
  hormone_type TEXT NOT NULL CHECK (hormone_type IN ('estrogen', 'progesterone', 'lh', 'fsh', 'testosterone', 'cortisol', 'thyroid')),
  level_value DECIMAL(10,3),
  level_unit TEXT,
  test_type TEXT CHECK (test_type IN ('blood', 'saliva', 'urine', 'home_test')),
  lab_name TEXT,
  reference_range_min DECIMAL(10,3),
  reference_range_max DECIMAL(10,3),
  is_within_range BOOLEAN,
  symptoms TEXT[],
  prescribed_by TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создаем таблицу для фертильности и овуляции
CREATE TABLE IF NOT EXISTS public.fertility_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users,
  tracking_date DATE NOT NULL,
  basal_body_temperature DECIMAL(4,2),
  cervical_mucus_type TEXT CHECK (cervical_mucus_type IN ('dry', 'sticky', 'creamy', 'egg_white', 'watery')),
  cervical_position TEXT CHECK (cervical_position IN ('low', 'medium', 'high')),
  cervical_firmness TEXT CHECK (cervical_firmness IN ('firm', 'medium', 'soft')),
  cervical_opening TEXT CHECK (cervical_opening IN ('closed', 'slightly_open', 'open')),
  ovulation_test_result TEXT CHECK (ovulation_test_result IN ('negative', 'positive', 'peak')),
  fertility_symptoms TEXT[],
  intercourse_timing BOOLEAN DEFAULT false,
  sperm_friendly_lubricant BOOLEAN,
  stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 10),
  sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 10),
  exercise_intensity TEXT CHECK (exercise_intensity IN ('none', 'light', 'moderate', 'intense')),
  predicted_ovulation_date DATE,
  fertile_window_start DATE,
  fertile_window_end DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Добавляем RLS политики для новых таблиц
ALTER TABLE public.pregnancy_planning ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hormonal_health_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fertility_tracking ENABLE ROW LEVEL SECURITY;

-- Политики для pregnancy_planning
CREATE POLICY "Users can view their own pregnancy planning" 
  ON public.pregnancy_planning 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own pregnancy planning" 
  ON public.pregnancy_planning 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pregnancy planning" 
  ON public.pregnancy_planning 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pregnancy planning" 
  ON public.pregnancy_planning 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Политики для hormonal_health_tracking
CREATE POLICY "Users can view their own hormonal health data" 
  ON public.hormonal_health_tracking 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own hormonal health data" 
  ON public.hormonal_health_tracking 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own hormonal health data" 
  ON public.hormonal_health_tracking 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own hormonal health data" 
  ON public.hormonal_health_tracking 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Политики для fertility_tracking
CREATE POLICY "Users can view their own fertility data" 
  ON public.fertility_tracking 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own fertility data" 
  ON public.fertility_tracking 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own fertility data" 
  ON public.fertility_tracking 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own fertility data" 
  ON public.fertility_tracking 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Создаем триггеры для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_pregnancy_planning_updated_at 
  BEFORE UPDATE ON public.pregnancy_planning 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hormonal_health_tracking_updated_at 
  BEFORE UPDATE ON public.hormonal_health_tracking 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fertility_tracking_updated_at 
  BEFORE UPDATE ON public.fertility_tracking 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Индексы для улучшения производительности
CREATE INDEX IF NOT EXISTS idx_pregnancy_planning_user_date 
  ON public.pregnancy_planning(user_id, planning_start_date);

CREATE INDEX IF NOT EXISTS idx_hormonal_health_user_date 
  ON public.hormonal_health_tracking(user_id, tracking_date);

CREATE INDEX IF NOT EXISTS idx_fertility_tracking_user_date 
  ON public.fertility_tracking(user_id, tracking_date);

CREATE INDEX IF NOT EXISTS idx_menstrual_cycles_ovulation 
  ON public.menstrual_cycles(user_id, ovulation_date) WHERE ovulation_date IS NOT NULL;
