
-- Обновляем enum для ролей, добавляя clinic и laboratory
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'clinic';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'laboratory';

-- Создаем таблицу для аудита действий пользователей
CREATE TABLE public.user_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    action_type TEXT NOT NULL,
    action_description TEXT NOT NULL,
    ip_address INET,
    user_agent TEXT,
    session_id TEXT,
    resource_type TEXT,
    resource_id UUID,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Включаем RLS для логов активности
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;

-- Политика: только администраторы могут просматривать все логи
CREATE POLICY "Admins can view all activity logs" 
  ON public.user_activity_logs 
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));

-- Политика: система может записывать логи для всех пользователей
CREATE POLICY "System can insert activity logs" 
  ON public.user_activity_logs 
  FOR INSERT 
  WITH CHECK (true);

-- Создаем таблицу для управления безопасностью
CREATE TABLE public.security_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_name TEXT NOT NULL UNIQUE,
    setting_value JSONB NOT NULL,
    description TEXT,
    updated_by UUID REFERENCES auth.users(id) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Включаем RLS для настроек безопасности
ALTER TABLE public.security_settings ENABLE ROW LEVEL SECURITY;

-- Политика: только администраторы могут управлять настройками безопасности
CREATE POLICY "Admins can manage security settings" 
  ON public.security_settings 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Создаем таблицу для управления организациями
CREATE TABLE public.organization_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL,
    organization_type TEXT NOT NULL CHECK (organization_type IN ('clinic', 'laboratory')),
    verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected', 'suspended')),
    verified_by UUID REFERENCES auth.users(id),
    verification_date TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    documents_submitted JSONB DEFAULT '[]',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Включаем RLS для верификации организаций
ALTER TABLE public.organization_verifications ENABLE ROW LEVEL SECURITY;

-- Политика: администраторы могут управлять верификациями
CREATE POLICY "Admins can manage organization verifications" 
  ON public.organization_verifications 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Создаем таблицу для системных настроек
CREATE TABLE public.system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL,
    setting_key TEXT NOT NULL,
    setting_value JSONB NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    updated_by UUID REFERENCES auth.users(id) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(category, setting_key)
);

-- Включаем RLS для системных настроек
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Политика: администраторы могут управлять всеми настройками
CREATE POLICY "Admins can manage all system settings" 
  ON public.system_settings 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Политика: пользователи могут просматривать публичные настройки
CREATE POLICY "Users can view public system settings" 
  ON public.system_settings 
  FOR SELECT 
  USING (is_public = true);

-- Создаем таблицу для тикетов поддержки
CREATE TABLE public.support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number TEXT NOT NULL UNIQUE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'pending', 'resolved', 'closed')),
    category TEXT NOT NULL,
    assigned_to UUID REFERENCES auth.users(id),
    assigned_at TIMESTAMP WITH TIME ZONE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolution_notes TEXT,
    attachments JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Включаем RLS для тикетов поддержки
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Политика: пользователи могут просматривать свои тикеты
CREATE POLICY "Users can view their own tickets" 
  ON public.support_tickets 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Политика: пользователи могут создавать тикеты
CREATE POLICY "Users can create tickets" 
  ON public.support_tickets 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Политика: администраторы могут управлять всеми тикетами
CREATE POLICY "Admins can manage all tickets" 
  ON public.support_tickets 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Создаем функцию для генерации номера тикета
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    ticket_num TEXT;
BEGIN
    SELECT 'TICKET-' || LPAD((EXTRACT(EPOCH FROM now())::bigint % 1000000)::text, 6, '0') INTO ticket_num;
    RETURN ticket_num;
END;
$$;

-- Триггер для автоматической генерации номера тикета
CREATE OR REPLACE FUNCTION set_ticket_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.ticket_number IS NULL THEN
        NEW.ticket_number := generate_ticket_number();
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER set_ticket_number_trigger
    BEFORE INSERT ON public.support_tickets
    FOR EACH ROW
    EXECUTE FUNCTION set_ticket_number();

-- Триггеры для обновления updated_at
CREATE TRIGGER update_user_activity_logs_updated_at
  BEFORE UPDATE ON public.user_activity_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_security_settings_updated_at
  BEFORE UPDATE ON public.security_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_organization_verifications_updated_at
  BEFORE UPDATE ON public.organization_verifications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at
  BEFORE UPDATE ON public.system_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at
  BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Вставляем начальные настройки безопасности
INSERT INTO public.security_settings (setting_name, setting_value, description, updated_by) VALUES
('password_policy', '{"min_length": 8, "require_uppercase": true, "require_lowercase": true, "require_numbers": true, "require_special_chars": true}', 'Политика паролей', (SELECT id FROM auth.users LIMIT 1)),
('session_timeout', '{"timeout_minutes": 480, "idle_timeout_minutes": 60}', 'Настройки тайм-аута сессий', (SELECT id FROM auth.users LIMIT 1)),
('mfa_policy', '{"required_for_admins": true, "required_for_doctors": false, "grace_period_days": 7}', 'Политика многофакторной аутентификации', (SELECT id FROM auth.users LIMIT 1))
ON CONFLICT (setting_name) DO NOTHING;

-- Вставляем начальные системные настройки
INSERT INTO public.system_settings (category, setting_key, setting_value, description, is_public, updated_by) VALUES
('platform', 'supported_languages', '["ru", "en"]', 'Поддерживаемые языки платформы', true, (SELECT id FROM auth.users LIMIT 1)),
('platform', 'default_language', '"ru"', 'Язык по умолчанию', true, (SELECT id FROM auth.users LIMIT 1)),
('notifications', 'email_templates', '{"welcome": "Добро пожаловать на платформу PREVENT", "password_reset": "Сброс пароля"}', 'Шаблоны email уведомлений', false, (SELECT id FROM auth.users LIMIT 1)),
('platform', 'maintenance_mode', 'false', 'Режим технического обслуживания', true, (SELECT id FROM auth.users LIMIT 1))
ON CONFLICT (category, setting_key) DO NOTHING;
