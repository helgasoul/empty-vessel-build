
-- Создаем таблицу для хранения результатов AI анализа семейных рисков
CREATE TABLE public.family_risk_analysis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  family_group_id UUID NOT NULL REFERENCES public.family_groups(id) ON DELETE CASCADE,
  analysis_results JSONB NOT NULL DEFAULT '[]'::jsonb,
  ai_recommendations JSONB NOT NULL DEFAULT '[]'::jsonb,
  confidence_score INTEGER DEFAULT 0,
  analyzed_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Включаем RLS для таблицы анализа рисков
ALTER TABLE public.family_risk_analysis ENABLE ROW LEVEL SECURITY;

-- Политика: члены семьи могут просматривать анализы своих семейных групп
CREATE POLICY "Family members can view risk analysis" 
  ON public.family_risk_analysis 
  FOR SELECT 
  USING (
    family_group_id IN (
      SELECT family_group_id 
      FROM public.family_access_members 
      WHERE user_id = auth.uid() 
      AND is_active = true
    )
    OR family_group_id IN (
      SELECT id 
      FROM public.family_groups 
      WHERE created_by = auth.uid()
    )
  );

-- Политика: создатели семейных групп могут создавать анализы
CREATE POLICY "Family group creators can create risk analysis" 
  ON public.family_risk_analysis 
  FOR INSERT 
  WITH CHECK (
    family_group_id IN (
      SELECT id 
      FROM public.family_groups 
      WHERE created_by = auth.uid()
    )
  );

-- Политика: создатели семейных групп могут обновлять анализы
CREATE POLICY "Family group creators can update risk analysis" 
  ON public.family_risk_analysis 
  FOR UPDATE 
  USING (
    family_group_id IN (
      SELECT id 
      FROM public.family_groups 
      WHERE created_by = auth.uid()
    )
  );

-- Добавляем триггер для автоматического обновления updated_at
CREATE TRIGGER update_family_risk_analysis_updated_at
  BEFORE UPDATE ON public.family_risk_analysis
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Создаем индексы для оптимизации запросов
CREATE INDEX idx_family_risk_analysis_family_group_id ON public.family_risk_analysis(family_group_id);
CREATE INDEX idx_family_risk_analysis_created_at ON public.family_risk_analysis(created_at);
