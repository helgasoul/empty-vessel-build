
-- Создаем таблицу для медицинских файлов
CREATE TABLE IF NOT EXISTS public.medical_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    -- Метаданные файла
    filename VARCHAR(500) NOT NULL,
    original_filename VARCHAR(500) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(200),
    file_hash VARCHAR(128) UNIQUE,
    
    -- Медицинские метаданные
    document_type VARCHAR(100),
    organ_system VARCHAR(100),
    medical_category VARCHAR(100),
    examination_date DATE,
    doctor_name VARCHAR(200),
    clinic_name VARCHAR(300),
    
    -- Хранение и безопасность
    storage_path VARCHAR(1000) NOT NULL,
    encryption_key_id VARCHAR(100),
    is_encrypted BOOLEAN DEFAULT TRUE,
    
    -- Обработка и анализ
    ocr_completed BOOLEAN DEFAULT FALSE,
    ai_analysis_completed BOOLEAN DEFAULT FALSE,
    processing_status VARCHAR(50) DEFAULT 'pending',
    
    -- Организация
    tags JSONB DEFAULT '[]',
    custom_tags JSONB DEFAULT '[]',
    description TEXT,
    notes TEXT,
    
    -- Связи
    related_event_id UUID,
    parent_file_id UUID REFERENCES public.medical_files(id),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создаем таблицу для медицинских событий
CREATE TABLE IF NOT EXISTS public.medical_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    -- Основная информация
    event_type VARCHAR(100) NOT NULL,
    event_subtype VARCHAR(100),
    title VARCHAR(300) NOT NULL,
    description TEXT,
    
    -- Временные данные
    event_date DATE NOT NULL,
    event_time TIME,
    duration_minutes INTEGER,
    
    -- Локация и участники
    clinic_name VARCHAR(300),
    doctor_name VARCHAR(200),
    doctor_specialty VARCHAR(150),
    location VARCHAR(500),
    
    -- Медицинские данные
    organ_system VARCHAR(100),
    icd_codes JSONB DEFAULT '[]',
    symptoms JSONB DEFAULT '[]',
    diagnosis TEXT,
    treatment TEXT,
    medications JSONB DEFAULT '[]',
    
    -- Результаты и выводы
    results JSONB DEFAULT '{}',
    recommendations TEXT,
    follow_up_required BOOLEAN DEFAULT FALSE,
    follow_up_date DATE,
    
    -- Статус и приоритет
    status VARCHAR(50) DEFAULT 'completed',
    priority VARCHAR(20) DEFAULT 'normal',
    
    -- Связи с файлами
    attached_files JSONB DEFAULT '[]',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Расширяем таблицу user_devices для более детального хранения данных
ALTER TABLE public.user_devices 
ADD COLUMN IF NOT EXISTS last_sync_data JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS sync_frequency_minutes INTEGER DEFAULT 60,
ADD COLUMN IF NOT EXISTS data_types JSONB DEFAULT '[]';

-- Создаем таблицу для лабораторных результатов  
CREATE TABLE IF NOT EXISTS public.lab_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    -- Связь с файлом и событием
    source_file_id UUID REFERENCES public.medical_files(id),
    medical_event_id UUID REFERENCES public.medical_events(id),
    
    -- Информация о анализе
    test_date DATE NOT NULL,
    lab_name VARCHAR(300),
    test_category VARCHAR(100),
    test_panel VARCHAR(200),
    
    -- Конкретные результаты
    test_name VARCHAR(300) NOT NULL,
    test_code VARCHAR(50),
    result_value VARCHAR(200),
    result_numeric DECIMAL(15,6),
    unit VARCHAR(50),
    reference_range VARCHAR(200),
    
    -- Интерпретация
    status VARCHAR(50),
    flag VARCHAR(20),
    interpretation TEXT,
    
    -- Дополнительная информация
    methodology VARCHAR(200),
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создаем таблицу для связей между данными
CREATE TABLE IF NOT EXISTS public.data_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    -- Связываемые объекты
    primary_type VARCHAR(50) NOT NULL,
    primary_id UUID NOT NULL,
    secondary_type VARCHAR(50) NOT NULL,
    secondary_id UUID NOT NULL,
    
    -- Тип связи
    relationship_type VARCHAR(100) NOT NULL,
    relationship_strength DECIMAL(3,2) DEFAULT 1.0,
    
    -- Метаданные связи
    description TEXT,
    auto_detected BOOLEAN DEFAULT FALSE,
    confidence_score DECIMAL(3,2),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by VARCHAR(50) DEFAULT 'system'
);

-- Включаем RLS для всех новых таблиц
ALTER TABLE public.medical_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_relationships ENABLE ROW LEVEL SECURITY;

-- Создаем политики RLS для medical_files
CREATE POLICY "Users can view their own medical files" 
  ON public.medical_files 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own medical files" 
  ON public.medical_files 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own medical files" 
  ON public.medical_files 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own medical files" 
  ON public.medical_files 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Создаем политики RLS для medical_events
CREATE POLICY "Users can view their own medical events" 
  ON public.medical_events 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own medical events" 
  ON public.medical_events 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own medical events" 
  ON public.medical_events 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own medical events" 
  ON public.medical_events 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Создаем политики RLS для lab_results
CREATE POLICY "Users can view their own lab results" 
  ON public.lab_results 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own lab results" 
  ON public.lab_results 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lab results" 
  ON public.lab_results 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lab results" 
  ON public.lab_results 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Создаем политики RLS для data_relationships
CREATE POLICY "Users can view their own data relationships" 
  ON public.data_relationships 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own data relationships" 
  ON public.data_relationships 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own data relationships" 
  ON public.data_relationships 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own data relationships" 
  ON public.data_relationships 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Создаем индексы для улучшения производительности
CREATE INDEX IF NOT EXISTS idx_medical_files_user_id ON public.medical_files(user_id);
CREATE INDEX IF NOT EXISTS idx_medical_files_document_type ON public.medical_files(document_type);
CREATE INDEX IF NOT EXISTS idx_medical_files_examination_date ON public.medical_files(examination_date);
CREATE INDEX IF NOT EXISTS idx_medical_files_processing_status ON public.medical_files(processing_status);

CREATE INDEX IF NOT EXISTS idx_medical_events_user_id ON public.medical_events(user_id);
CREATE INDEX IF NOT EXISTS idx_medical_events_event_date ON public.medical_events(event_date);
CREATE INDEX IF NOT EXISTS idx_medical_events_event_type ON public.medical_events(event_type);

CREATE INDEX IF NOT EXISTS idx_lab_results_user_test ON public.lab_results(user_id, test_name, test_date);
CREATE INDEX IF NOT EXISTS idx_lab_results_category ON public.lab_results(test_category);

CREATE INDEX IF NOT EXISTS idx_data_relationships_primary ON public.data_relationships(primary_type, primary_id);
CREATE INDEX IF NOT EXISTS idx_data_relationships_secondary ON public.data_relationships(secondary_type, secondary_id);

-- Создаем триггеры для обновления updated_at
CREATE TRIGGER update_medical_files_updated_at
  BEFORE UPDATE ON public.medical_files
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_medical_events_updated_at
  BEFORE UPDATE ON public.medical_events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lab_results_updated_at
  BEFORE UPDATE ON public.lab_results
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
