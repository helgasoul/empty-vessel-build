
-- Создаем таблицу для специфических данных CRC-PRO оценки
CREATE TABLE IF NOT EXISTS public.crc_pro_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  assessment_id UUID REFERENCES public.risk_assessments(id) ON DELETE CASCADE,
  
  -- Базовая информация
  age INTEGER NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  height_cm INTEGER,
  weight_kg NUMERIC(5,2),
  
  -- Семейная история
  family_history_crc BOOLEAN DEFAULT FALSE,
  family_history_polyps BOOLEAN DEFAULT FALSE,
  family_history_ibd BOOLEAN DEFAULT FALSE,
  number_affected_relatives INTEGER DEFAULT 0,
  
  -- Личная медицинская история
  personal_history_polyps BOOLEAN DEFAULT FALSE,
  personal_history_ibd BOOLEAN DEFAULT FALSE,
  diabetes_type2 BOOLEAN DEFAULT FALSE,
  previous_colonoscopy BOOLEAN DEFAULT FALSE,
  last_colonoscopy_date DATE,
  
  -- Образ жизни
  smoking_status TEXT CHECK (smoking_status IN ('never', 'former', 'current')),
  alcohol_consumption TEXT CHECK (alcohol_consumption IN ('none', 'light', 'moderate', 'heavy')),
  physical_activity TEXT CHECK (physical_activity IN ('low', 'moderate', 'high')),
  
  -- Диетические факторы
  red_meat_consumption TEXT CHECK (red_meat_consumption IN ('low', 'moderate', 'high')),
  processed_meat_consumption TEXT CHECK (processed_meat_consumption IN ('low', 'moderate', 'high')),
  fiber_intake TEXT CHECK (fiber_intake IN ('low', 'moderate', 'high')),
  vegetable_intake TEXT CHECK (vegetable_intake IN ('low', 'moderate', 'high')),
  
  -- Дополнительные факторы
  nsaid_use BOOLEAN DEFAULT FALSE,
  calcium_supplements BOOLEAN DEFAULT FALSE,
  multivitamin_use BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Включаем RLS для таблицы CRC-PRO оценок
ALTER TABLE public.crc_pro_assessments ENABLE ROW LEVEL SECURITY;

-- Создаем политики RLS для CRC-PRO оценок
CREATE POLICY "Users can view their own CRC-PRO assessments" 
  ON public.crc_pro_assessments 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own CRC-PRO assessments" 
  ON public.crc_pro_assessments 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own CRC-PRO assessments" 
  ON public.crc_pro_assessments 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own CRC-PRO assessments" 
  ON public.crc_pro_assessments 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Создаем триггер для обновления updated_at
CREATE TRIGGER update_crc_pro_assessments_updated_at
  BEFORE UPDATE ON public.crc_pro_assessments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
