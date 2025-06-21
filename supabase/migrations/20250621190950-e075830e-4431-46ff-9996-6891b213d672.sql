
-- Создаем таблицу для сессий ИИ-анализа
CREATE TABLE public.ai_analysis_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Метаданные сессии
    session_type VARCHAR(100) NOT NULL, -- full_analysis, targeted_analysis, pattern_detection
    analysis_date TIMESTAMP DEFAULT NOW(),
    ai_model_version VARCHAR(50) NOT NULL,
    processing_duration_ms INTEGER,
    
    -- Входные данные
    input_data_sources JSONB NOT NULL, -- список использованных источников данных
    analysis_scope JSONB NOT NULL, -- области анализа
    data_timeframe JSONB NOT NULL, -- временные рамки анализа
    
    -- Результаты анализа
    key_findings JSONB NOT NULL, -- основные выводы
    patterns_detected JSONB DEFAULT '[]', -- выявленные паттерны
    correlations_found JSONB DEFAULT '[]', -- найденные корреляции
    anomalies_detected JSONB DEFAULT '[]', -- обнаруженные аномалии
    trends_identified JSONB DEFAULT '[]', -- выявленные тренды
    
    -- Метрики качества
    confidence_score DECIMAL(4,3), -- 0-1
    data_completeness DECIMAL(4,3), -- 0-1
    model_uncertainty DECIMAL(4,3), -- 0-1
    
    -- Статус обработки
    processing_status VARCHAR(50) DEFAULT 'completed', -- pending, processing, completed, failed
    error_details TEXT,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Создаем таблицу для паттернов здоровья
CREATE TABLE public.health_patterns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    analysis_session_id UUID REFERENCES public.ai_analysis_sessions(id),
    
    -- Классификация паттерна
    pattern_type VARCHAR(100) NOT NULL, -- sleep_pattern, activity_pattern, biomarker_pattern
    pattern_category VARCHAR(100), -- circadian, seasonal, stress_related, hormonal
    
    -- Описание паттерна
    pattern_name VARCHAR(200) NOT NULL,
    pattern_description TEXT NOT NULL,
    pattern_strength DECIMAL(4,3), -- сила паттерна 0-1
    
    -- Временные характеристики
    time_period VARCHAR(100), -- daily, weekly, monthly, seasonal
    start_date DATE,
    end_date DATE,
    frequency_description VARCHAR(200),
    
    -- Связанные данные
    primary_metrics JSONB NOT NULL, -- основные метрики, участвующие в паттерне
    secondary_metrics JSONB DEFAULT '[]', -- дополнительные метрики
    trigger_factors JSONB DEFAULT '[]', -- факторы, запускающие паттерн
    
    -- Статистические показатели
    statistical_significance DECIMAL(6,4), -- p-value
    effect_size DECIMAL(6,3), -- размер эффекта
    confidence_interval JSONB, -- доверительный интервал
    
    -- Клиническая значимость
    health_impact VARCHAR(50), -- positive, negative, neutral, mixed
    clinical_relevance VARCHAR(50), -- high, moderate, low
    actionability VARCHAR(50), -- actionable, monitoring_only, informational
    
    -- Прогнозирование
    predictive_value DECIMAL(4,3), -- насколько хорошо паттерн предсказывает изменения
    future_trend VARCHAR(100), -- improving, worsening, stable, uncertain
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Создаем таблицу для корреляций здоровья
CREATE TABLE public.health_correlations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    analysis_session_id UUID REFERENCES public.ai_analysis_sessions(id),
    
    -- Корреляция между метриками
    metric_1_name VARCHAR(200) NOT NULL,
    metric_1_type VARCHAR(100) NOT NULL, -- wearable, lab, survey, environmental
    metric_2_name VARCHAR(200) NOT NULL,
    metric_2_type VARCHAR(100) NOT NULL,
    
    -- Статистические характеристики
    correlation_coefficient DECIMAL(6,4) NOT NULL, -- -1 to 1
    correlation_type VARCHAR(50), -- linear, non_linear, monotonic
    statistical_significance DECIMAL(6,4), -- p-value
    sample_size INTEGER,
    
    -- Временные характеристики
    time_lag_days INTEGER DEFAULT 0, -- задержка корреляции в днях
    correlation_period VARCHAR(100), -- период, за который рассчитана корреляция
    temporal_stability VARCHAR(50), -- stable, increasing, decreasing, variable
    
    -- Направленность и сила связи
    relationship_direction VARCHAR(50), -- positive, negative, bidirectional
    relationship_strength VARCHAR(50), -- weak, moderate, strong, very_strong
    causality_likelihood VARCHAR(50), -- unlikely, possible, probable, likely
    
    -- Практическая значимость
    clinical_meaningfulness VARCHAR(50), -- high, moderate, low, unclear
    actionable_insights TEXT,
    health_implications TEXT,
    
    -- Контекстуальные факторы
    confounding_factors JSONB DEFAULT '[]',
    moderating_variables JSONB DEFAULT '[]',
    contextual_notes TEXT,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Создаем таблицу для аномалий здоровья
CREATE TABLE public.health_anomalies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    analysis_session_id UUID REFERENCES public.ai_analysis_sessions(id),
    
    -- Основная информация об аномалии
    metric_name VARCHAR(200) NOT NULL,
    metric_type VARCHAR(100) NOT NULL,
    anomaly_type VARCHAR(100), -- outlier, trend_change, pattern_break, missing_data
    
    -- Значения
    detected_value DECIMAL(15,6),
    expected_value DECIMAL(15,6),
    anomaly_score DECIMAL(6,4), -- насколько сильно отклонение
    threshold_used DECIMAL(15,6),
    
    -- Временные характеристики
    detection_date DATE NOT NULL,
    anomaly_duration_days INTEGER,
    time_since_last_normal INTEGER, -- дни с последнего нормального значения
    
    -- Классификация серьезности
    severity_level VARCHAR(50), -- low, moderate, high, critical
    urgency VARCHAR(50), -- immediate, within_week, within_month, routine
    confidence_level DECIMAL(4,3), -- уверенность в обнаружении аномалии
    
    -- Контекст и причины
    potential_causes JSONB DEFAULT '[]',
    concurrent_events JSONB DEFAULT '[]', -- одновременные события
    related_symptoms JSONB DEFAULT '[]',
    external_factors JSONB DEFAULT '[]',
    
    -- Рекомендации по действиям
    recommended_action VARCHAR(50), -- monitor, consult_doctor, emergency, lifestyle_change
    follow_up_required BOOLEAN DEFAULT FALSE,
    follow_up_timeline VARCHAR(100),
    
    -- Статус обработки
    user_acknowledged BOOLEAN DEFAULT FALSE,
    user_action_taken VARCHAR(200),
    resolution_status VARCHAR(50) DEFAULT 'open', -- open, monitoring, resolved, false_positive
    healthcare_provider_notified BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Включаем RLS для всех новых таблиц
ALTER TABLE public.ai_analysis_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_correlations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_anomalies ENABLE ROW LEVEL SECURITY;

-- Политики доступа для ai_analysis_sessions
CREATE POLICY "Users can view their own analysis sessions" 
  ON public.ai_analysis_sessions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own analysis sessions" 
  ON public.ai_analysis_sessions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analysis sessions" 
  ON public.ai_analysis_sessions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Политики доступа для health_patterns
CREATE POLICY "Users can view their own health patterns" 
  ON public.health_patterns 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own health patterns" 
  ON public.health_patterns 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health patterns" 
  ON public.health_patterns 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Политики доступа для health_correlations
CREATE POLICY "Users can view their own health correlations" 
  ON public.health_correlations 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own health correlations" 
  ON public.health_correlations 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health correlations" 
  ON public.health_correlations 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Политики доступа для health_anomalies
CREATE POLICY "Users can view their own health anomalies" 
  ON public.health_anomalies 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own health anomalies" 
  ON public.health_anomalies 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health anomalies" 
  ON public.health_anomalies 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Добавляем триггеры для автоматического обновления updated_at
CREATE TRIGGER update_ai_analysis_sessions_updated_at
  BEFORE UPDATE ON public.ai_analysis_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_health_patterns_updated_at
  BEFORE UPDATE ON public.health_patterns
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_health_correlations_updated_at
  BEFORE UPDATE ON public.health_correlations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_health_anomalies_updated_at
  BEFORE UPDATE ON public.health_anomalies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Создаем индексы для оптимизации запросов
CREATE INDEX idx_ai_analysis_sessions_user_id ON public.ai_analysis_sessions(user_id);
CREATE INDEX idx_ai_analysis_sessions_analysis_date ON public.ai_analysis_sessions(analysis_date);
CREATE INDEX idx_health_patterns_user_id ON public.health_patterns(user_id);
CREATE INDEX idx_health_patterns_session_id ON public.health_patterns(analysis_session_id);
CREATE INDEX idx_health_correlations_user_id ON public.health_correlations(user_id);
CREATE INDEX idx_health_correlations_session_id ON public.health_correlations(analysis_session_id);
CREATE INDEX idx_health_anomalies_user_id ON public.health_anomalies(user_id);
CREATE INDEX idx_health_anomalies_session_id ON public.health_anomalies(analysis_session_id);
CREATE INDEX idx_health_anomalies_severity ON public.health_anomalies(severity_level);
