
-- Создаем таблицу для одноразовых паролей для доступа врачей
CREATE TABLE public.doctor_access_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  token_code TEXT NOT NULL UNIQUE,
  doctor_email TEXT,
  doctor_name TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_used BOOLEAN NOT NULL DEFAULT false,
  access_permissions JSONB NOT NULL DEFAULT '{"medical_records": true, "family_history": false, "health_data": false}'::jsonb,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Включаем RLS для безопасности
ALTER TABLE public.doctor_access_tokens ENABLE ROW LEVEL SECURITY;

-- Политика для пользователей - могут видеть только свои токены
CREATE POLICY "Users can view their own access tokens" 
  ON public.doctor_access_tokens 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Политика для создания токенов
CREATE POLICY "Users can create their own access tokens" 
  ON public.doctor_access_tokens 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Политика для обновления токенов
CREATE POLICY "Users can update their own access tokens" 
  ON public.doctor_access_tokens 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Политика для удаления токенов
CREATE POLICY "Users can delete their own access tokens" 
  ON public.doctor_access_tokens 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Создаем таблицу для логирования доступа врачей
CREATE TABLE public.doctor_access_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  token_id UUID REFERENCES public.doctor_access_tokens(id) ON DELETE CASCADE NOT NULL,
  accessed_data_type TEXT NOT NULL,
  accessed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT
);

-- Включаем RLS для логов
ALTER TABLE public.doctor_access_logs ENABLE ROW LEVEL SECURITY;

-- Политика для просмотра логов доступа (только владелец токена)
CREATE POLICY "Users can view access logs for their tokens" 
  ON public.doctor_access_logs 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.doctor_access_tokens 
      WHERE id = token_id AND user_id = auth.uid()
    )
  );

-- Триггер для обновления updated_at
CREATE TRIGGER update_doctor_access_tokens_updated_at
  BEFORE UPDATE ON public.doctor_access_tokens
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
