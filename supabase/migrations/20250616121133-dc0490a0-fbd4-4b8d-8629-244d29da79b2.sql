
-- Создаем таблицу для хранения подключенных устройств пользователей
CREATE TABLE IF NOT EXISTS public.user_devices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device_type TEXT NOT NULL CHECK (device_type IN ('apple_health', 'google_fit', 'apple_watch', 'oura_ring', 'whoop', 'libra')),
  device_name TEXT NOT NULL,
  is_connected BOOLEAN DEFAULT FALSE,
  connection_status TEXT DEFAULT 'disconnected' CHECK (connection_status IN ('connected', 'disconnected', 'pending', 'error')),
  last_sync_at TIMESTAMP WITH TIME ZONE,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  device_settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создаем таблицу для хранения данных о здоровье с устройств
CREATE TABLE IF NOT EXISTS public.health_device_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device_id UUID NOT NULL REFERENCES public.user_devices(id) ON DELETE CASCADE,
  data_type TEXT NOT NULL, -- например: 'steps', 'heart_rate', 'sleep', 'glucose', 'activity'
  data_value NUMERIC,
  data_unit TEXT, -- например: 'steps', 'bpm', 'hours', 'mg/dL'
  data_details JSONB DEFAULT '{}', -- дополнительные метаданные
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
  synced_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создаем таблицу для агрегированных данных (дневная статистика)
CREATE TABLE IF NOT EXISTS public.daily_health_summary (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  summary_date DATE NOT NULL,
  total_steps INTEGER DEFAULT 0,
  avg_heart_rate NUMERIC,
  max_heart_rate NUMERIC,
  min_heart_rate NUMERIC,
  sleep_hours NUMERIC,
  sleep_quality TEXT,
  calories_burned NUMERIC,
  distance_km NUMERIC,
  active_minutes INTEGER DEFAULT 0,
  glucose_avg NUMERIC,
  glucose_readings_count INTEGER DEFAULT 0,
  additional_metrics JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, summary_date)
);

-- Включаем RLS для всех таблиц
ALTER TABLE public.user_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_device_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_health_summary ENABLE ROW LEVEL SECURITY;

-- Создаем политики RLS для user_devices
CREATE POLICY "Users can view their own devices" 
  ON public.user_devices 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own device connections" 
  ON public.user_devices 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own devices" 
  ON public.user_devices 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own devices" 
  ON public.user_devices 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Создаем политики RLS для health_device_data
CREATE POLICY "Users can view their own health data" 
  ON public.health_device_data 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health data" 
  ON public.health_device_data 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health data" 
  ON public.health_device_data 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Создаем политики RLS для daily_health_summary
CREATE POLICY "Users can view their own health summaries" 
  ON public.daily_health_summary 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health summaries" 
  ON public.daily_health_summary 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health summaries" 
  ON public.daily_health_summary 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Создаем триггеры для обновления updated_at
CREATE TRIGGER update_user_devices_updated_at
  BEFORE UPDATE ON public.user_devices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_daily_health_summary_updated_at
  BEFORE UPDATE ON public.daily_health_summary
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Создаем индексы для оптимизации запросов
CREATE INDEX idx_user_devices_user_id ON public.user_devices(user_id);
CREATE INDEX idx_user_devices_device_type ON public.user_devices(device_type);
CREATE INDEX idx_health_device_data_user_id ON public.health_device_data(user_id);
CREATE INDEX idx_health_device_data_device_id ON public.health_device_data(device_id);
CREATE INDEX idx_health_device_data_recorded_at ON public.health_device_data(recorded_at);
CREATE INDEX idx_health_device_data_data_type ON public.health_device_data(data_type);
CREATE INDEX idx_daily_health_summary_user_id ON public.daily_health_summary(user_id);
CREATE INDEX idx_daily_health_summary_date ON public.daily_health_summary(summary_date);
