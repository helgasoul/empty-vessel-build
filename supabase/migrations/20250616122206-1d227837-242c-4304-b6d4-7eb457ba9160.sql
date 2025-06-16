
-- Создаем таблицу для трекера менструального цикла
CREATE TABLE public.menstrual_cycles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  cycle_start_date DATE NOT NULL,
  cycle_end_date DATE,
  cycle_length INTEGER,
  period_length INTEGER,
  flow_intensity TEXT CHECK (flow_intensity IN ('light', 'moderate', 'heavy')),
  symptoms TEXT[],
  notes TEXT,
  predicted_next_cycle DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создаем таблицу для мониторинга симптомов и настроения
CREATE TABLE public.symptom_mood_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  log_date DATE NOT NULL,
  symptoms TEXT[],
  mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 10),
  mood_tags TEXT[],
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
  sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 10),
  stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 10),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создаем таблицу для схем лечения
CREATE TABLE public.treatment_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  plan_name TEXT NOT NULL,
  doctor_name TEXT,
  consultation_id UUID,
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создаем таблицу для лекарств
CREATE TABLE public.medications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  treatment_plan_id UUID NOT NULL REFERENCES public.treatment_plans(id) ON DELETE CASCADE,
  medication_name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  times_per_day INTEGER NOT NULL DEFAULT 1,
  specific_times TIME[],
  instructions TEXT,
  side_effects TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создаем таблицу для напоминаний о приеме лекарств
CREATE TABLE public.medication_reminders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  medication_id UUID NOT NULL REFERENCES public.medications(id) ON DELETE CASCADE,
  reminder_time TIME NOT NULL,
  days_of_week INTEGER[] NOT NULL DEFAULT '{1,2,3,4,5,6,7}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_taken_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создаем таблицу для отслеживания приема лекарств
CREATE TABLE public.medication_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  medication_id UUID NOT NULL REFERENCES public.medications(id) ON DELETE CASCADE,
  taken_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  was_on_time BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  side_effects_experienced TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Включаем RLS для всех таблиц
ALTER TABLE public.menstrual_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symptom_mood_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medication_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medication_logs ENABLE ROW LEVEL SECURITY;

-- Создаем политики RLS для таблицы menstrual_cycles
CREATE POLICY "Users can view their own menstrual cycles" 
  ON public.menstrual_cycles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own menstrual cycles" 
  ON public.menstrual_cycles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own menstrual cycles" 
  ON public.menstrual_cycles 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own menstrual cycles" 
  ON public.menstrual_cycles 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Создаем политики RLS для таблицы symptom_mood_logs
CREATE POLICY "Users can view their own symptom mood logs" 
  ON public.symptom_mood_logs 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own symptom mood logs" 
  ON public.symptom_mood_logs 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own symptom mood logs" 
  ON public.symptom_mood_logs 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own symptom mood logs" 
  ON public.symptom_mood_logs 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Создаем политики RLS для таблицы treatment_plans
CREATE POLICY "Users can view their own treatment plans" 
  ON public.treatment_plans 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own treatment plans" 
  ON public.treatment_plans 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own treatment plans" 
  ON public.treatment_plans 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own treatment plans" 
  ON public.treatment_plans 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Создаем политики RLS для таблицы medications
CREATE POLICY "Users can view medications from their treatment plans" 
  ON public.medications 
  FOR SELECT 
  USING (treatment_plan_id IN (
    SELECT id FROM public.treatment_plans WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can create medications for their treatment plans" 
  ON public.medications 
  FOR INSERT 
  WITH CHECK (treatment_plan_id IN (
    SELECT id FROM public.treatment_plans WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update medications from their treatment plans" 
  ON public.medications 
  FOR UPDATE 
  USING (treatment_plan_id IN (
    SELECT id FROM public.treatment_plans WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can delete medications from their treatment plans" 
  ON public.medications 
  FOR DELETE 
  USING (treatment_plan_id IN (
    SELECT id FROM public.treatment_plans WHERE user_id = auth.uid()
  ));

-- Создаем политики RLS для таблицы medication_reminders
CREATE POLICY "Users can view their own medication reminders" 
  ON public.medication_reminders 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own medication reminders" 
  ON public.medication_reminders 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own medication reminders" 
  ON public.medication_reminders 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own medication reminders" 
  ON public.medication_reminders 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Создаем политики RLS для таблицы medication_logs
CREATE POLICY "Users can view their own medication logs" 
  ON public.medication_logs 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own medication logs" 
  ON public.medication_logs 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own medication logs" 
  ON public.medication_logs 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own medication logs" 
  ON public.medication_logs 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Создаем индексы для улучшения производительности
CREATE INDEX idx_menstrual_cycles_user_id_date ON public.menstrual_cycles(user_id, cycle_start_date);
CREATE INDEX idx_symptom_mood_logs_user_id_date ON public.symptom_mood_logs(user_id, log_date);
CREATE INDEX idx_treatment_plans_user_id ON public.treatment_plans(user_id);
CREATE INDEX idx_medications_treatment_plan_id ON public.medications(treatment_plan_id);
CREATE INDEX idx_medication_reminders_user_id ON public.medication_reminders(user_id);
CREATE INDEX idx_medication_logs_user_id_date ON public.medication_logs(user_id, taken_at);

-- Создаем триггеры для автоматического обновления updated_at
CREATE TRIGGER update_menstrual_cycles_updated_at
  BEFORE UPDATE ON public.menstrual_cycles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_symptom_mood_logs_updated_at
  BEFORE UPDATE ON public.symptom_mood_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_treatment_plans_updated_at
  BEFORE UPDATE ON public.treatment_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_medications_updated_at
  BEFORE UPDATE ON public.medications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_medication_reminders_updated_at
  BEFORE UPDATE ON public.medication_reminders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
