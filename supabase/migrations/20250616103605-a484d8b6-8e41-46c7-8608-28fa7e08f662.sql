
-- Создаем таблицу для хранения оценок рисков
CREATE TABLE public.risk_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  assessment_type TEXT NOT NULL, -- 'qrisk3', 'framingham', etc.
  risk_percentage NUMERIC(5,2) NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high')),
  assessment_data JSONB NOT NULL, -- Входные данные для расчета
  results_data JSONB NOT NULL, -- Детальные результаты
  recommendations TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создаем таблицу для хранения рекомендаций
CREATE TABLE public.health_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  risk_assessment_id UUID REFERENCES public.risk_assessments(id) ON DELETE CASCADE,
  category TEXT NOT NULL, -- 'lifestyle', 'medical', 'nutrition', 'exercise'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority INTEGER NOT NULL DEFAULT 1, -- 1-5 (5 самый высокий)
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Добавляем RLS политики для risk_assessments
ALTER TABLE public.risk_assessments ENABLE ROW LEVEL SECURITY;

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

-- Добавляем RLS политики для health_recommendations
ALTER TABLE public.health_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view recommendations for their assessments" 
  ON public.health_recommendations 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.risk_assessments 
      WHERE risk_assessments.id = health_recommendations.risk_assessment_id 
      AND risk_assessments.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update recommendations for their assessments" 
  ON public.health_recommendations 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.risk_assessments 
      WHERE risk_assessments.id = health_recommendations.risk_assessment_id 
      AND risk_assessments.user_id = auth.uid()
    )
  );

-- Создаем триггер для автоматического обновления updated_at
CREATE TRIGGER update_risk_assessments_updated_at
  BEFORE UPDATE ON public.risk_assessments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Создаем индексы для производительности
CREATE INDEX idx_risk_assessments_user_id ON public.risk_assessments(user_id);
CREATE INDEX idx_risk_assessments_type ON public.risk_assessments(assessment_type);
CREATE INDEX idx_health_recommendations_assessment_id ON public.health_recommendations(risk_assessment_id);
