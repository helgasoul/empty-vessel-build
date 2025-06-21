
-- Создание таблицы для заказов сервисов здоровья
CREATE TABLE public.health_service_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  service_type TEXT NOT NULL CHECK (service_type IN ('nutrition', 'fitness', 'pharmacy')),
  service_provider TEXT NOT NULL,
  order_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  cycle_phase_at_order TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'delivered', 'cancelled')),
  total_amount NUMERIC(10,2),
  estimated_delivery TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создание таблицы для интеграций сервисов здоровья
CREATE TABLE public.health_service_integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  service_type TEXT NOT NULL CHECK (service_type IN ('nutrition', 'fitness', 'pharmacy')),
  provider_name TEXT NOT NULL,
  integration_status TEXT NOT NULL DEFAULT 'active' CHECK (integration_status IN ('active', 'inactive', 'error')),
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS политики для health_service_orders
ALTER TABLE public.health_service_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own health service orders" 
  ON public.health_service_orders 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own health service orders" 
  ON public.health_service_orders 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health service orders" 
  ON public.health_service_orders 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own health service orders" 
  ON public.health_service_orders 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS политики для health_service_integrations
ALTER TABLE public.health_service_integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own health service integrations" 
  ON public.health_service_integrations 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own health service integrations" 
  ON public.health_service_integrations 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health service integrations" 
  ON public.health_service_integrations 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own health service integrations" 
  ON public.health_service_integrations 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Индексы для производительности
CREATE INDEX idx_health_service_orders_user_id ON public.health_service_orders(user_id);
CREATE INDEX idx_health_service_orders_service_type ON public.health_service_orders(service_type);
CREATE INDEX idx_health_service_integrations_user_id ON public.health_service_integrations(user_id);
CREATE INDEX idx_health_service_integrations_service_type ON public.health_service_integrations(service_type);

-- Триггеры для обновления updated_at
CREATE TRIGGER update_health_service_orders_updated_at
  BEFORE UPDATE ON public.health_service_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_health_service_integrations_updated_at
  BEFORE UPDATE ON public.health_service_integrations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
