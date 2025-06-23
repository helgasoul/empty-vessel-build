
-- Создание таблицы для автоматизированных workflow
CREATE TABLE public.automation_workflows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  
  -- Основная информация
  workflow_name VARCHAR(200) NOT NULL,
  workflow_description TEXT,
  workflow_type VARCHAR(100) NOT NULL CHECK (workflow_type IN ('cycle_support', 'screening_automation', 'pregnancy_support', 'menopause_support', 'contraception_management')),
  
  -- Триггеры
  trigger_type VARCHAR(100) NOT NULL CHECK (trigger_type IN ('cycle_phase_change', 'schedule', 'user_goal_set', 'health_data_change', 'pregnancy_confirmed', 'menopause_transition_detected')),
  trigger_conditions JSONB NOT NULL DEFAULT '{}',
  
  -- Действия
  actions JSONB NOT NULL DEFAULT '[]',
  action_sequence JSONB DEFAULT '[]',
  
  -- Статус и выполнение
  workflow_status VARCHAR(50) DEFAULT 'active' CHECK (workflow_status IN ('active', 'inactive', 'paused', 'error')),
  execution_count INTEGER DEFAULT 0,
  last_execution TIMESTAMP WITH TIME ZONE,
  next_scheduled_execution TIMESTAMP WITH TIME ZONE,
  
  -- Результаты
  success_rate DECIMAL(5,4) DEFAULT 0,
  average_execution_time INTEGER,
  total_errors INTEGER DEFAULT 0,
  last_error_message TEXT,
  
  -- Женско-специфичные настройки
  cycle_phase_awareness BOOLEAN DEFAULT FALSE,
  hormonal_adaptation BOOLEAN DEFAULT FALSE,
  age_related_customization BOOLEAN DEFAULT FALSE,
  life_stage_adaptation BOOLEAN DEFAULT FALSE,
  
  -- Настройки
  retry_policy JSONB DEFAULT '{}',
  timeout_seconds INTEGER DEFAULT 300,
  parallel_execution BOOLEAN DEFAULT FALSE,
  
  -- Ограничения и лимиты
  max_executions_per_day INTEGER,
  execution_window JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создание таблицы для выполнений workflow
CREATE TABLE public.workflow_executions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workflow_id UUID REFERENCES public.automation_workflows(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users NOT NULL,
  
  -- Информация о выполнении
  execution_status VARCHAR(50) DEFAULT 'pending' CHECK (execution_status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Контекст выполнения
  trigger_event JSONB,
  cycle_context JSONB,
  user_context JSONB,
  
  -- Выполненные действия
  executed_actions JSONB DEFAULT '[]',
  action_results JSONB DEFAULT '[]',
  
  -- Результаты
  total_actions INTEGER DEFAULT 0,
  successful_actions INTEGER DEFAULT 0,
  failed_actions INTEGER DEFAULT 0,
  
  -- Ошибки и логи
  error_details JSONB,
  execution_log JSONB DEFAULT '[]',
  
  -- Метрики
  execution_duration_seconds INTEGER,
  resource_usage JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создание таблицы для пользовательских настроек автоматизации
CREATE TABLE public.automation_user_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  
  -- Общие настройки
  automation_enabled BOOLEAN DEFAULT TRUE,
  notification_preferences JSONB DEFAULT '{"email": true, "push": true, "sms": false}',
  
  -- Настройки цикла
  cycle_tracking_enabled BOOLEAN DEFAULT TRUE,
  cycle_length INTEGER DEFAULT 28,
  period_length INTEGER DEFAULT 5,
  
  -- Предпочтения по автоматизации
  preferred_workout_types JSONB DEFAULT '[]',
  dietary_restrictions JSONB DEFAULT '[]',
  supplement_preferences JSONB DEFAULT '{}',
  
  -- Настройки уведомлений
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  timezone VARCHAR(50) DEFAULT 'Europe/Moscow',
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS политики для automation_workflows
ALTER TABLE public.automation_workflows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own automation workflows" 
  ON public.automation_workflows 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own automation workflows" 
  ON public.automation_workflows 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own automation workflows" 
  ON public.automation_workflows 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own automation workflows" 
  ON public.automation_workflows 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS политики для workflow_executions
ALTER TABLE public.workflow_executions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own workflow executions" 
  ON public.workflow_executions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own workflow executions" 
  ON public.workflow_executions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workflow executions" 
  ON public.workflow_executions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS политики для automation_user_settings
ALTER TABLE public.automation_user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own automation settings" 
  ON public.automation_user_settings 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own automation settings" 
  ON public.automation_user_settings 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own automation settings" 
  ON public.automation_user_settings 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Индексы для производительности
CREATE INDEX idx_automation_workflows_user_id ON public.automation_workflows(user_id);
CREATE INDEX idx_automation_workflows_type ON public.automation_workflows(workflow_type);
CREATE INDEX idx_automation_workflows_status ON public.automation_workflows(workflow_status);
CREATE INDEX idx_workflow_executions_user_id ON public.workflow_executions(user_id);
CREATE INDEX idx_workflow_executions_workflow_id ON public.workflow_executions(workflow_id);
CREATE INDEX idx_workflow_executions_status ON public.workflow_executions(execution_status);

-- Триггеры для обновления updated_at
CREATE TRIGGER update_automation_workflows_updated_at
  BEFORE UPDATE ON public.automation_workflows
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workflow_executions_updated_at
  BEFORE UPDATE ON public.workflow_executions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_automation_user_settings_updated_at
  BEFORE UPDATE ON public.automation_user_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
