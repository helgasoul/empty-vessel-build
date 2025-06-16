
-- Создаем таблицу для интеграций с платформами видеоконференций
CREATE TABLE IF NOT EXISTS video_conference_integrations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  platform_type text NOT NULL, -- 'zoom', 'google_meet', 'teams', 'webex'
  platform_user_id text,
  access_token text,
  refresh_token text,
  token_expires_at timestamp with time zone,
  integration_status text DEFAULT 'active',
  platform_settings jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Создаем таблицу для календарных интеграций
CREATE TABLE IF NOT EXISTS calendar_integrations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  calendar_type text NOT NULL, -- 'google_calendar', 'outlook', 'apple_calendar'
  calendar_id text,
  access_token text,
  refresh_token text,
  token_expires_at timestamp with time zone,
  integration_status text DEFAULT 'active',
  sync_settings jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Обновляем таблицу телемедицинских сессий для поддержки календарных событий
ALTER TABLE telemedicine_sessions 
ADD COLUMN IF NOT EXISTS calendar_event_id text,
ADD COLUMN IF NOT EXISTS video_conference_id text,
ADD COLUMN IF NOT EXISTS conference_platform text,
ADD COLUMN IF NOT EXISTS calendar_platform text;

-- Включаем RLS для новых таблиц
ALTER TABLE video_conference_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_integrations ENABLE ROW LEVEL SECURITY;

-- Политики для video_conference_integrations
CREATE POLICY "Users can view their own video conference integrations" 
  ON video_conference_integrations 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own video conference integrations" 
  ON video_conference_integrations 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own video conference integrations" 
  ON video_conference_integrations 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own video conference integrations" 
  ON video_conference_integrations 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Политики для calendar_integrations
CREATE POLICY "Users can view their own calendar integrations" 
  ON calendar_integrations 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own calendar integrations" 
  ON calendar_integrations 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own calendar integrations" 
  ON calendar_integrations 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own calendar integrations" 
  ON calendar_integrations 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Добавляем триггеры для обновления updated_at
CREATE OR REPLACE TRIGGER update_video_conference_integrations_updated_at
    BEFORE UPDATE ON video_conference_integrations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_calendar_integrations_updated_at
    BEFORE UPDATE ON calendar_integrations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
