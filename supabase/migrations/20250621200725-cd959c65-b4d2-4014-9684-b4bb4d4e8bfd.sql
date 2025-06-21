
-- Создание таблицы для персонализированных напоминаний
CREATE TABLE public.user_reminders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  reminder_type TEXT NOT NULL, -- 'medication', 'appointment', 'health_check', 'custom'
  title TEXT NOT NULL,
  description TEXT,
  frequency TEXT NOT NULL, -- 'once', 'daily', 'weekly', 'monthly', 'custom'
  frequency_data JSONB DEFAULT '{}'::jsonb, -- для custom частоты
  next_reminder_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  notification_methods JSONB DEFAULT '["push"]'::jsonb, -- push, email, sms
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создание таблицы для истории уведомлений
CREATE TABLE public.notification_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  notification_type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  delivery_status TEXT DEFAULT 'sent', -- 'sent', 'delivered', 'failed', 'read'
  delivery_method TEXT NOT NULL, -- 'push', 'email', 'sms'
  related_reminder_id UUID REFERENCES public.user_reminders(id),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Создание таблицы для экспорта данных
CREATE TABLE public.data_exports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  export_type TEXT NOT NULL, -- 'full', 'health_data', 'cycles', 'family_history'
  export_format TEXT NOT NULL, -- 'pdf', 'csv', 'json'
  date_range_start DATE,
  date_range_end DATE,
  file_path TEXT,
  file_size BIGINT,
  export_status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  download_expires_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Создание таблицы для ИИ чат сессий
CREATE TABLE public.ai_chat_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  session_name TEXT,
  session_type TEXT DEFAULT 'general', -- 'general', 'medical', 'nutrition', 'fitness'
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_activity_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  context_data JSONB DEFAULT '{}'::jsonb, -- контекст для ИИ
  summary TEXT
);

-- Создание таблицы для сообщений ИИ чата
CREATE TABLE public.ai_chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.ai_chat_sessions(id) NOT NULL,
  message_type TEXT NOT NULL, -- 'user', 'assistant', 'system'
  content TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb,
  tokens_used INTEGER,
  model_version TEXT
);

-- Создание таблицы для внешних API интеграций
CREATE TABLE public.external_api_integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  integration_type TEXT NOT NULL, -- 'calendar', 'fitness_tracker', 'lab_results'
  provider_name TEXT NOT NULL, -- 'google_calendar', 'apple_health', 'garmin'
  integration_status TEXT DEFAULT 'active', -- 'active', 'inactive', 'error'
  access_token_encrypted TEXT,
  refresh_token_encrypted TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  sync_frequency TEXT DEFAULT 'daily', -- 'hourly', 'daily', 'weekly'
  sync_settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS политики для user_reminders
ALTER TABLE public.user_reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own reminders" 
  ON public.user_reminders 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reminders" 
  ON public.user_reminders 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reminders" 
  ON public.user_reminders 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reminders" 
  ON public.user_reminders 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS политики для notification_history
ALTER TABLE public.notification_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notification history" 
  ON public.notification_history 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications" 
  ON public.notification_history 
  FOR INSERT 
  WITH CHECK (true);

-- RLS политики для data_exports
ALTER TABLE public.data_exports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own exports" 
  ON public.data_exports 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own exports" 
  ON public.data_exports 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own exports" 
  ON public.data_exports 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS политики для ai_chat_sessions
ALTER TABLE public.ai_chat_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own chat sessions" 
  ON public.ai_chat_sessions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own chat sessions" 
  ON public.ai_chat_sessions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chat sessions" 
  ON public.ai_chat_sessions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS политики для ai_chat_messages
ALTER TABLE public.ai_chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages from their sessions" 
  ON public.ai_chat_messages 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.ai_chat_sessions 
      WHERE id = ai_chat_messages.session_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages in their sessions" 
  ON public.ai_chat_messages 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.ai_chat_sessions 
      WHERE id = ai_chat_messages.session_id 
      AND user_id = auth.uid()
    )
  );

-- RLS политики для external_api_integrations
ALTER TABLE public.external_api_integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own integrations" 
  ON public.external_api_integrations 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own integrations" 
  ON public.external_api_integrations 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own integrations" 
  ON public.external_api_integrations 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own integrations" 
  ON public.external_api_integrations 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Индексы для производительности
CREATE INDEX idx_user_reminders_user_id ON public.user_reminders(user_id);
CREATE INDEX idx_user_reminders_next_reminder ON public.user_reminders(next_reminder_at);
CREATE INDEX idx_notification_history_user_id ON public.notification_history(user_id);
CREATE INDEX idx_data_exports_user_id ON public.data_exports(user_id);
CREATE INDEX idx_ai_chat_sessions_user_id ON public.ai_chat_sessions(user_id);
CREATE INDEX idx_ai_chat_messages_session_id ON public.ai_chat_messages(session_id);
CREATE INDEX idx_external_api_integrations_user_id ON public.external_api_integrations(user_id);

-- Триггеры для обновления updated_at
CREATE TRIGGER update_user_reminders_updated_at
  BEFORE UPDATE ON public.user_reminders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_external_api_integrations_updated_at
  BEFORE UPDATE ON public.external_api_integrations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
