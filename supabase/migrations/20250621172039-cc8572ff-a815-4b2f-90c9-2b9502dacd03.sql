
-- Добавляем колонку user_id в таблицу risk_assessments, если она отсутствует
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'risk_assessments' 
        AND column_name = 'user_id'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.risk_assessments 
        ADD COLUMN user_id UUID REFERENCES auth.users NOT NULL;
    END IF;
END $$;

-- Создаем индекс для производительности
CREATE INDEX IF NOT EXISTS idx_risk_assessments_user_id_new ON public.risk_assessments(user_id);

-- Обновляем RLS политики для использования user_id
DROP POLICY IF EXISTS "Users can view their own risk assessments" ON public.risk_assessments;
DROP POLICY IF EXISTS "Users can create their own risk assessments" ON public.risk_assessments;
DROP POLICY IF EXISTS "Users can update their own risk assessments" ON public.risk_assessments;

CREATE POLICY "Users can view their own risk assessments" 
  ON public.risk_assessments 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own risk assessments" 
  ON public.risk_assessments 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own risk assessments" 
  ON public.risk_assessments 
  FOR UPDATE 
  USING (auth.uid() = user_id);
