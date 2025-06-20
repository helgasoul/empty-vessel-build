
-- Исправляем функции с изменяемым search_path, добавляя SET search_path

-- 1. Функция has_role
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 2. Функция has_patient_data_permission
CREATE OR REPLACE FUNCTION public.has_patient_data_permission(
    _patient_id uuid, 
    _requester_id uuid, 
    _permission_type text, 
    _data_type text
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.patient_data_permissions
    WHERE patient_id = _patient_id
      AND granted_to_id = _requester_id
      AND permission_type IN (_permission_type, 'full')
      AND _data_type = ANY(data_types)
      AND is_active = true
      AND (expires_at IS NULL OR expires_at > now())
  ) OR _patient_id = _requester_id OR public.has_role(_requester_id, 'admin');
$$;

-- 3. Функция generate_ticket_number
CREATE OR REPLACE FUNCTION public.generate_ticket_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    ticket_num TEXT;
BEGIN
    SELECT 'TICKET-' || LPAD((EXTRACT(EPOCH FROM now())::bigint % 1000000)::text, 6, '0') INTO ticket_num;
    RETURN ticket_num;
END;
$$;

-- 4. Функция set_ticket_number
CREATE OR REPLACE FUNCTION public.set_ticket_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NEW.ticket_number IS NULL THEN
        NEW.ticket_number := generate_ticket_number();
    END IF;
    RETURN NEW;
END;
$$;

-- 5. Функция update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- 6. Функция update_group_member_count
CREATE OR REPLACE FUNCTION public.update_group_member_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.is_active = true THEN
    UPDATE public.support_groups 
    SET member_count = member_count + 1 
    WHERE id = NEW.group_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.is_active = false AND NEW.is_active = true THEN
      UPDATE public.support_groups 
      SET member_count = member_count + 1 
      WHERE id = NEW.group_id;
    ELSIF OLD.is_active = true AND NEW.is_active = false THEN
      UPDATE public.support_groups 
      SET member_count = member_count - 1 
      WHERE id = NEW.group_id;
    END IF;
  ELSIF TG_OP = 'DELETE' AND OLD.is_active = true THEN
    UPDATE public.support_groups 
    SET member_count = member_count - 1 
    WHERE id = OLD.group_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- 7. Функция update_post_reply_count
CREATE OR REPLACE FUNCTION public.update_post_reply_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.community_posts 
    SET reply_count = reply_count + 1 
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.community_posts 
    SET reply_count = reply_count - 1 
    WHERE id = OLD.post_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- 8. Функция create_user_level
CREATE OR REPLACE FUNCTION public.create_user_level()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_levels (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$;

-- 9. Функция update_schedule_availability
CREATE OR REPLACE FUNCTION public.update_schedule_availability()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'scheduled' THEN
    UPDATE public.doctor_schedules 
    SET is_available = false 
    WHERE id = NEW.schedule_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status IN ('scheduled', 'confirmed') AND NEW.status IN ('cancelled', 'no_show') THEN
      UPDATE public.doctor_schedules 
      SET is_available = true 
      WHERE id = NEW.schedule_id;
    ELSIF OLD.status IN ('cancelled', 'no_show') AND NEW.status IN ('scheduled', 'confirmed') THEN
      UPDATE public.doctor_schedules 
      SET is_available = false 
      WHERE id = NEW.schedule_id;
    END IF;
  ELSIF TG_OP = 'DELETE' AND OLD.status IN ('scheduled', 'confirmed') THEN
    UPDATE public.doctor_schedules 
    SET is_available = true 
    WHERE id = OLD.schedule_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;
