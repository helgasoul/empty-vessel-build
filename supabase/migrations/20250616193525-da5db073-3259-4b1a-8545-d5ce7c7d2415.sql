
-- Создание enum для ролей пользователей
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Создание таблицы для ролей пользователей
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Включение RLS для таблицы ролей
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Создание функции для проверки роли пользователя (security definer для избежания рекурсии)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Политики для таблицы user_roles
CREATE POLICY "Users can view their own roles" 
  ON public.user_roles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" 
  ON public.user_roles 
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all roles" 
  ON public.user_roles 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Обновление политик для таблицы experts чтобы администраторы могли управлять экспертами
DROP POLICY IF EXISTS "Allow authenticated users to insert experts" ON public.experts;
DROP POLICY IF EXISTS "Allow authenticated users to update experts" ON public.experts;
DROP POLICY IF EXISTS "Allow authenticated users to delete experts" ON public.experts;

CREATE POLICY "Admins can manage experts" 
  ON public.experts 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Создание тестового администратора (замените на реальный user_id)
-- Это нужно будет выполнить отдельно после регистрации администратора
-- INSERT INTO public.user_roles (user_id, role) 
-- VALUES ('your-admin-user-id-here', 'admin');

-- Триггер для обновления updated_at
CREATE TRIGGER update_user_roles_updated_at
  BEFORE UPDATE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
