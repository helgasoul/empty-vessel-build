
-- Создаем таблицу для интеграций с внешними приложениями здоровья
CREATE TABLE public.health_app_integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  app_name TEXT NOT NULL CHECK (app_name IN ('flo', 'maam', 'clue', 'period_tracker')),
  app_user_id TEXT,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  integration_status TEXT NOT NULL DEFAULT 'pending' CHECK (integration_status IN ('pending', 'connected', 'disconnected', 'error')),
  last_sync_at TIMESTAMP WITH TIME ZONE,
  sync_settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, app_name)
);

-- Создаем таблицу для синхронизированных данных из внешних приложений
CREATE TABLE public.external_health_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  integration_id UUID REFERENCES public.health_app_integrations(id) ON DELETE CASCADE NOT NULL,
  data_type TEXT NOT NULL, -- 'menstrual_cycle', 'symptoms', 'mood', 'predictions'
  external_id TEXT, -- ID записи во внешнем приложении
  data_payload JSONB NOT NULL,
  recorded_date DATE NOT NULL,
  synced_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Включаем RLS для таблиц интеграций
ALTER TABLE public.health_app_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.external_health_data ENABLE ROW LEVEL SECURITY;

-- Политики для health_app_integrations
CREATE POLICY "Users can view their own integrations" 
  ON public.health_app_integrations 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own integrations" 
  ON public.health_app_integrations 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own integrations" 
  ON public.health_app_integrations 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own integrations" 
  ON public.health_app_integrations 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Политики для external_health_data
CREATE POLICY "Users can view their own external health data" 
  ON public.external_health_data 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own external health data" 
  ON public.external_health_data 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own external health data" 
  ON public.external_health_data 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own external health data" 
  ON public.external_health_data 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Создаем индексы для улучшения производительности
CREATE INDEX idx_health_app_integrations_user_id ON public.health_app_integrations(user_id);
CREATE INDEX idx_health_app_integrations_app_name ON public.health_app_integrations(app_name);
CREATE INDEX idx_external_health_data_user_id ON public.external_health_data(user_id);
CREATE INDEX idx_external_health_data_integration_id ON public.external_health_data(integration_id);
CREATE INDEX idx_external_health_data_recorded_date ON public.external_health_data(recorded_date);
